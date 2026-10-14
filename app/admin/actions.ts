"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, requireAdmin, signIn, signOut } from "../lib/auth";
import { contentTag, defaultSettings, toMedia, type Faq, type Media, type Seo, type Settings } from "../lib/content";
import { db } from "../lib/db";
import { cleanHtml } from "../lib/html";
import { pageDefinition, type Field } from "../lib/page-fields";
import { deleteObject, storageKey } from "../lib/storage";

export type Result = { ok: true; id?: number; slug?: string } | { error: string };

/** The public site shows the change on its next request, and the admin re-renders with fresh data. */
function published() {
  revalidateTag(contentTag, { expire: 0 });
  revalidatePath("/admin", "layout");
}

const text = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0, max) : "";
const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "untitled";
/** Built-in site images, or files in our Neon storage bucket. */
const isImage = (value: string) => (/^\/images\/[\w./-]+$/.test(value) && !value.includes("..")) || storageKey(value) !== null;
const image = (value: unknown) => { const url = text(value, 300); return isImage(url) ? url : ""; };
const textList = (value: unknown, max = 30) => (Array.isArray(value) ? value : []).map((item) => text(item, 120)).filter(Boolean).slice(0, max).join("\n");
const seoValues = (input: Partial<Seo>) => ({ seoTitle: text(input.seoTitle, 120), seoDescription: text(input.seoDescription, 320), ogImage: image(input.ogImage), noindex: Boolean(input.noindex) });

type SlugTable = "projects" | "posts" | "services";
const prefixes: Record<SlugTable, string> = { projects: "/portfolio/", posts: "/blog/", services: "/services/" };

/** A slug not used by another row: "my-post", then "my-post-2", "my-post-3"… */
async function uniqueSlug(table: SlugTable, wanted: string, id?: number) {
  const base = slugify(wanted);
  const pattern = base + "-%";
  const rows = table === "projects" ? await db()`select slug from projects where (slug = ${base} or slug like ${pattern}) and id <> ${id ?? 0}`
    : table === "posts" ? await db()`select slug from posts where (slug = ${base} or slug like ${pattern}) and id <> ${id ?? 0}`
    : await db()`select slug from services where (slug = ${base} or slug like ${pattern}) and id <> ${id ?? 0}`;
  const taken = new Set(rows.map((row) => row.slug as string));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/** When a slug changes, the old address redirects to the new one (and older redirects follow along). */
async function rememberSlug(table: SlugTable, previous: string | undefined, slug: string) {
  const to = prefixes[table] + slug;
  await db()`delete from redirects where from_path = ${to}`;
  if (!previous || previous === slug) return;
  const from = prefixes[table] + previous;
  await db()`update redirects set to_path = ${to} where to_path = ${from}`;
  await db()`insert into redirects (from_path, to_path) values (${from}, ${to}) on conflict (from_path) do update set to_path = excluded.to_path`;
}

async function currentSlug(table: SlugTable, id?: number) {
  if (!id) return undefined;
  const [row] = table === "projects" ? await db()`select slug from projects where id = ${id}` : table === "posts" ? await db()`select slug from posts where id = ${id}` : await db()`select slug from services where id = ${id}`;
  return row?.slug as string | undefined;
}

// --- Sign-in -------------------------------------------------------------

const attempts = new Map<string, { count: number; until: number }>();

export async function login(_state: string, form: FormData) {
  // Ten wrong passwords from one address locks it out for fifteen minutes.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const record = attempts.get(ip);
  if (record && record.count >= 10 && record.until > Date.now()) return "Too many attempts. Please wait 15 minutes and try again.";

  const password = form.get("password");
  const ok = await signIn(text(form.get("email")), typeof password === "string" ? password : "");
  if (!ok) {
    const fresh = !record || record.until < Date.now();
    attempts.set(ip, { count: fresh ? 1 : record.count + 1, until: Date.now() + 15 * 60_000 });
    return "That email and password don’t match.";
  }
  attempts.delete(ip);
  const next = text(form.get("next"), 200);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin/login");
}

// --- Projects ------------------------------------------------------------

export type ProjectInput = Partial<Seo> & { id?: number; title: string; slug: string; category: string; description: string; body: string; image: string; imageAlt: string; client: string; year: string; website: string; techStack: string[]; featured: boolean; published: boolean };

export async function saveProject(input: ProjectInput): Promise<Result> {
  await requireAdmin();
  const title = text(input.title, 120), cover = image(input.image);
  if (!title) return { error: "Give the project a title." };
  if (!cover) return { error: "Choose a featured image." };
  const previous = await currentSlug("projects", input.id);
  const slug = await uniqueSlug("projects", text(input.slug, 80) || title, input.id);
  const v = { ...seoValues(input), category: text(input.category, 80), description: text(input.description, 600), body: cleanHtml(text(input.body, 100000)), alt: text(input.imageAlt, 200), client: text(input.client, 80), year: text(input.year, 10), website: /^https?:\/\//.test(text(input.website, 300)) ? text(input.website, 300) : "", tech: textList(input.techStack), featured: Boolean(input.featured), published: Boolean(input.published) };
  let id = input.id;
  if (id) {
    await db()`update projects set slug = ${slug}, title = ${title}, category = ${v.category}, description = ${v.description}, body = ${v.body}, image = ${cover}, image_alt = ${v.alt},
      client = ${v.client}, year = ${v.year}, website = ${v.website}, tech_stack = ${v.tech}, featured = ${v.featured}, published = ${v.published}, seo_title = ${v.seoTitle}, seo_description = ${v.seoDescription}, og_image = ${v.ogImage}, noindex = ${v.noindex}, updated_at = now() where id = ${id}`;
  } else {
    // New projects go to the top of the list.
    [{ id }] = await db()`insert into projects (slug, title, category, description, body, image, image_alt, client, year, website, tech_stack, featured, published, seo_title, seo_description, og_image, noindex, position)
      values (${slug}, ${title}, ${v.category}, ${v.description}, ${v.body}, ${cover}, ${v.alt}, ${v.client}, ${v.year}, ${v.website}, ${v.tech}, ${v.featured}, ${v.published}, ${v.seoTitle}, ${v.seoDescription}, ${v.ogImage}, ${v.noindex},
      (select coalesce(min(position), 0) - 1 from projects)) returning id` as { id: number }[];
  }
  await rememberSlug("projects", previous, slug);
  published();
  return { ok: true, id, slug };
}

export async function deleteProject(id: number): Promise<Result> {
  await requireAdmin();
  await db()`delete from projects where id = ${id}`;
  published();
  return { ok: true };
}

/** Swaps an item with its neighbour, then renumbers the whole list. */
export async function move(table: "projects" | "services" | "team_members", id: number, direction: -1 | 1): Promise<Result> {
  await requireAdmin();
  const rows = table === "projects" ? await db()`select id from projects order by position, id` : table === "services" ? await db()`select id from services order by position, id` : await db()`select id from team_members order by position, id`;
  const order = rows.map((row) => row.id as number);
  const from = order.indexOf(id), to = from + direction;
  if (from < 0 || to < 0 || to >= order.length) return { ok: true };
  [order[from], order[to]] = [order[to], order[from]];
  const last = order.length - 1;
  if (table === "projects") await db()`update projects set position = o.position from (select unnest(${order}::int[]) as id, generate_series(0, ${last}) as position) as o where projects.id = o.id`;
  else if (table === "services") await db()`update services set position = o.position from (select unnest(${order}::int[]) as id, generate_series(0, ${last}) as position) as o where services.id = o.id`;
  else await db()`update team_members set position = o.position from (select unnest(${order}::int[]) as id, generate_series(0, ${last}) as position) as o where team_members.id = o.id`;
  published();
  return { ok: true };
}

// --- Services ------------------------------------------------------------

export type ServiceInput = Partial<Seo> & { id?: number; title: string; slug: string; summary: string; introHeading: string; intro: string; bodyHeading: string; body: string; highlights: string[]; techStack: string[]; image: string; imageAlt: string; gallery: string[]; faqs: Faq[]; published: boolean };

const cleanFaqs = (faqs: Faq[]) => (Array.isArray(faqs) ? faqs : []).map((faq) => ({ question: text(faq?.question, 200), answer: cleanHtml(text(faq?.answer, 6000)) })).filter((faq) => faq.question).slice(0, 30);

export async function saveService(input: ServiceInput): Promise<Result> {
  await requireAdmin();
  const title = text(input.title, 120), banner = image(input.image);
  if (!title) return { error: "Give the service a title." };
  if (!banner) return { error: "Choose a banner image." };
  const previous = await currentSlug("services", input.id);
  const slug = await uniqueSlug("services", text(input.slug, 80) || title, input.id);
  const gallery = (Array.isArray(input.gallery) ? input.gallery : []).map(image).filter(Boolean).slice(0, 2).join("\n");
  const highlights = (Array.isArray(input.highlights) ? input.highlights : []).map((item) => text(item, 300)).filter(Boolean).slice(0, 12).join("\n");
  const v = { ...seoValues(input), summary: text(input.summary, 300), introHeading: text(input.introHeading, 160), intro: cleanHtml(text(input.intro, 50000)), bodyHeading: text(input.bodyHeading, 160), body: cleanHtml(text(input.body, 50000)), alt: text(input.imageAlt, 200), faqs: JSON.stringify(cleanFaqs(input.faqs)), published: Boolean(input.published) };
  let id = input.id;
  if (id) {
    await db()`update services set slug = ${slug}, title = ${title}, summary = ${v.summary}, intro_heading = ${v.introHeading}, intro = ${v.intro}, body_heading = ${v.bodyHeading}, body = ${v.body},
      highlights = ${highlights}, tech_stack = ${textList(input.techStack)}, image = ${banner}, image_alt = ${v.alt}, gallery = ${gallery}, faqs = ${v.faqs}::jsonb, published = ${v.published},
      seo_title = ${v.seoTitle}, seo_description = ${v.seoDescription}, og_image = ${v.ogImage}, noindex = ${v.noindex}, updated_at = now() where id = ${id}`;
  } else {
    [{ id }] = await db()`insert into services (slug, title, summary, intro_heading, intro, body_heading, body, highlights, tech_stack, image, image_alt, gallery, faqs, published, seo_title, seo_description, og_image, noindex, position)
      values (${slug}, ${title}, ${v.summary}, ${v.introHeading}, ${v.intro}, ${v.bodyHeading}, ${v.body}, ${highlights}, ${textList(input.techStack)}, ${banner}, ${v.alt}, ${gallery}, ${v.faqs}::jsonb, ${v.published},
      ${v.seoTitle}, ${v.seoDescription}, ${v.ogImage}, ${v.noindex}, (select coalesce(max(position), 0) + 1 from services)) returning id` as { id: number }[];
  }
  await rememberSlug("services", previous, slug);
  published();
  return { ok: true, id, slug };
}

export async function deleteService(id: number): Promise<Result> {
  await requireAdmin();
  await db()`delete from services where id = ${id}`;
  published();
  return { ok: true };
}

// --- Blog posts ----------------------------------------------------------

export type PostInput = Partial<Seo> & { id?: number; title: string; slug: string; category: string; excerpt: string; body: string; image: string; imageAlt: string; publishedAt: string; published: boolean };

export async function savePost(input: PostInput): Promise<Result> {
  await requireAdmin();
  const title = text(input.title, 160), cover = image(input.image);
  const body = cleanHtml(text(input.body, 200000));
  if (!title) return { error: "Give the post a title." };
  if (!cover) return { error: "Choose a featured image." };
  if (!body) return { error: "Write the post before saving." };
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt) ? input.publishedAt : new Date().toISOString().slice(0, 10);
  const previous = await currentSlug("posts", input.id);
  const slug = await uniqueSlug("posts", text(input.slug, 80) || title, input.id);
  const v = { ...seoValues(input), category: text(input.category, 60), excerpt: text(input.excerpt, 500), alt: text(input.imageAlt, 200), published: Boolean(input.published) };
  let id = input.id;
  if (id) {
    await db()`update posts set slug = ${slug}, title = ${title}, category = ${v.category}, excerpt = ${v.excerpt}, body = ${body}, image = ${cover}, image_alt = ${v.alt},
      published = ${v.published}, published_at = ${date}, seo_title = ${v.seoTitle}, seo_description = ${v.seoDescription}, og_image = ${v.ogImage}, noindex = ${v.noindex}, updated_at = now() where id = ${id}`;
  } else {
    [{ id }] = await db()`insert into posts (slug, title, category, excerpt, body, image, image_alt, published, published_at, seo_title, seo_description, og_image, noindex)
      values (${slug}, ${title}, ${v.category}, ${v.excerpt}, ${body}, ${cover}, ${v.alt}, ${v.published}, ${date}, ${v.seoTitle}, ${v.seoDescription}, ${v.ogImage}, ${v.noindex}) returning id` as { id: number }[];
  }
  await rememberSlug("posts", previous, slug);
  published();
  return { ok: true, id, slug };
}

export async function deletePost(id: number): Promise<Result> {
  await requireAdmin();
  await db()`delete from posts where id = ${id}`;
  published();
  return { ok: true };
}

// --- Team ----------------------------------------------------------------

export type MemberInput = { id?: number; name: string; role: string; bio: string; image: string; imageAlt: string; published: boolean };

export async function saveMember(input: MemberInput): Promise<Result> {
  await requireAdmin();
  const name = text(input.name, 100), photo = image(input.image);
  if (!name) return { error: "Add the team member’s name." };
  if (!photo) return { error: "Choose a photo." };
  const v = { role: text(input.role, 80), bio: cleanHtml(text(input.bio, 20000)), alt: text(input.imageAlt, 200), published: Boolean(input.published) };
  let id = input.id;
  if (id) {
    await db()`update team_members set name = ${name}, role = ${v.role}, bio = ${v.bio}, image = ${photo}, image_alt = ${v.alt}, published = ${v.published}, updated_at = now() where id = ${id}`;
  } else {
    [{ id }] = await db()`insert into team_members (name, role, bio, image, image_alt, published, position)
      values (${name}, ${v.role}, ${v.bio}, ${photo}, ${v.alt}, ${v.published}, (select coalesce(max(position), 0) + 1 from team_members)) returning id` as { id: number }[];
  }
  published();
  return { ok: true, id };
}

export async function deleteMember(id: number): Promise<Result> {
  await requireAdmin();
  await db()`delete from team_members where id = ${id}`;
  published();
  return { ok: true };
}

// --- Pages ---------------------------------------------------------------

/** Keeps only the fields the page defines, cleaned to their type. */
function cleanValue(field: Field, value: unknown): unknown {
  if (field.type === "image") { const item = (value ?? {}) as Record<string, unknown>; return { src: image(item.src), alt: text(item.alt, 200) }; }
  if (field.type === "list") return (Array.isArray(value) ? value : []).slice(0, 40).map((item) => Object.fromEntries((field.item ?? []).map((sub) => [sub.key, cleanValue(sub, (item as Record<string, unknown>)?.[sub.key])])));
  if (field.type === "richtext") return cleanHtml(text(value, 100000));
  return text(value, field.type === "text" ? 300 : 5000);
}

export async function savePage(key: string, content: Record<string, unknown>, seo: Partial<Seo>): Promise<Result> {
  await requireAdmin();
  const definition = pageDefinition(key);
  if (!definition) return { error: "That page doesn’t exist." };
  const values = Object.fromEntries(definition.sections.flatMap((section) => section.fields).map((field) => [field.key, cleanValue(field, content[field.key])]));
  const v = seoValues(seo);
  await db()`insert into pages (key, content, seo_title, seo_description, og_image, noindex, updated_at) values (${key}, ${JSON.stringify(values)}::jsonb, ${v.seoTitle}, ${v.seoDescription}, ${v.ogImage}, ${v.noindex}, now())
    on conflict (key) do update set content = excluded.content, seo_title = excluded.seo_title, seo_description = excluded.seo_description, og_image = excluded.og_image, noindex = excluded.noindex, updated_at = now()`;
  published();
  return { ok: true };
}

// --- Media ---------------------------------------------------------------

export async function listMedia(): Promise<Media[]> {
  await requireAdmin();
  return (await db()`select * from media order by created_at desc, id desc`).map(toMedia);
}

export async function updateMedia(id: number, alt: string): Promise<Result> {
  await requireAdmin();
  await db()`update media set alt = ${text(alt, 200)} where id = ${id}`;
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Removes an image from the library. Uploaded files are deleted from Neon storage; the site's built-in images are only unlisted. */
export async function deleteMedia(id: number): Promise<Result> {
  await requireAdmin();
  const [row] = await db()`delete from media where id = ${id} returning url`;
  const key = typeof row?.url === "string" ? storageKey(row.url) : null;
  if (key) await deleteObject(key).catch((error) => console.error("Could not delete from Neon storage", error));
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// --- Inquiries -----------------------------------------------------------

export async function markInquiry(id: number, read: boolean): Promise<Result> {
  await requireAdmin();
  await db()`update inquiries set read = ${read} where id = ${id}`;
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteInquiry(id: number): Promise<Result> {
  await requireAdmin();
  await db()`delete from inquiries where id = ${id}`;
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// --- Settings ------------------------------------------------------------

export async function saveSettings(input: Settings): Promise<Result> {
  await requireAdmin();
  const email = text(input.email, 120);
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "That email address doesn’t look right." };
  const url = text(input.siteUrl, 200).replace(/\/+$/, "");
  if (url && !/^https?:\/\/[^\s/]+/.test(url)) return { error: "The website address should start with https://" };
  const social = (value: unknown) => { const link = text(value, 300); return /^https?:\/\//.test(link) ? link : ""; };
  const values: Settings = {
    ...defaultSettings,
    siteName: text(input.siteName, 120), siteUrl: url, titleSuffix: typeof input.titleSuffix === "string" ? input.titleSuffix.slice(0, 60) : "",
    defaultDescription: text(input.defaultDescription, 320), defaultImage: image(input.defaultImage),
    address: text(input.address, 200), phone: text(input.phone, 40), mobiles: text(input.mobiles, 120), whatsapp: text(input.whatsapp, 40), email,
    facebook: social(input.facebook), instagram: social(input.instagram), linkedin: social(input.linkedin),
  };
  for (const [key, value] of Object.entries(values)) {
    await db()`insert into settings (key, value) values (${key}, ${value}) on conflict (key) do update set value = excluded.value`;
  }
  published();
  return { ok: true };
}

export async function changePassword(current: string, next: string): Promise<Result> {
  const admin = await requireAdmin();
  if (next.length < 10) return { error: "Use at least 10 characters for the new password." };
  const [row] = await db()`select email from admins where id = ${admin.id}`;
  if (!await signIn(row.email, current)) return { error: "Your current password isn’t right." };
  await db()`update admins set password_hash = ${await hashPassword(next)} where id = ${admin.id}`;
  return { ok: true };
}
