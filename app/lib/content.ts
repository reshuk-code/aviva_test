import { unstable_cache } from "next/cache";
import { db } from "./db";
import { pageDefinition, type ImageValue } from "./page-fields";

export type Seo = { seoTitle: string; seoDescription: string; ogImage: string; noindex: boolean };
export type Project = Seo & { id: number; slug: string; title: string; category: string; description: string; body: string; image: string; imageAlt: string; client: string; year: string; website: string; techStack: string[]; featured: boolean; published: boolean; position: number; updatedAt: string };
export type Post = Seo & { id: number; slug: string; title: string; category: string; excerpt: string; body: string; image: string; imageAlt: string; published: boolean; publishedAt: string; updatedAt: string; date: string };
export type TeamMember = { id: number; name: string; role: string; bio: string; image: string; imageAlt: string; published: boolean; position: number; updatedAt: string };
export type Inquiry = { id: number; kind: string; name: string; email: string; phone: string; subject: string; services: string; budget: string; timeline: string; message: string; read: boolean; createdAt: string };
export type Faq = { question: string; answer: string };
export type Service = Seo & { id: number; slug: string; title: string; summary: string; introHeading: string; intro: string; bodyHeading: string; body: string; highlights: string[]; techStack: string[]; image: string; imageAlt: string; gallery: string[]; faqs: Faq[]; published: boolean; position: number; updatedAt: string };
export type Media = { id: number; url: string; alt: string; width: number; height: number; bytes: number; createdAt: string };
export type Settings = {
  siteName: string; siteUrl: string; titleSuffix: string; defaultDescription: string; defaultImage: string;
  address: string; phone: string; mobiles: string; whatsapp: string; email: string;
  facebook: string; instagram: string; linkedin: string;
};
export type PageContent = { key: string; content: Record<string, unknown>; seo: Seo; updatedAt: string };

/** Tag for everything the public site reads; admin changes expire it. */
export const contentTag = "content";

const ordinal = (day: number) => day + (day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th");
/** "2026-07-16" → "July - 16th 2026", the date style used across the design. */
export function displayDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  return `${date.toLocaleString("en", { month: "long", timeZone: "UTC" })} - ${ordinal(date.getUTCDate())} ${date.getUTCFullYear()}`;
}

type Row = Record<string, unknown>;
const iso = (value: unknown) => value instanceof Date ? value.toISOString() : String(value);
// Postgres "date" columns arrive as local midnight; read the local parts so the day doesn't shift with the server's timezone.
const pad = (n: number) => String(n).padStart(2, "0");
const day = (value: unknown) => value instanceof Date ? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` : String(value).slice(0, 10);
const str = (value: unknown) => typeof value === "string" ? value : "";
const lines = (value: unknown) => str(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const seo = (row: Row): Seo => ({ seoTitle: str(row.seo_title), seoDescription: str(row.seo_description), ogImage: str(row.og_image), noindex: Boolean(row.noindex) });
function faqList(value: unknown): Faq[] {
  try {
    const list = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(list) ? list.filter((item) => item?.question).map((item) => ({ question: String(item.question), answer: String(item.answer ?? "") })) : [];
  } catch { return []; }
}

export const toProject = (row: Row): Project => ({ ...seo(row), id: row.id as number, slug: str(row.slug), title: str(row.title), category: str(row.category), description: str(row.description), body: str(row.body), image: str(row.image), imageAlt: str(row.image_alt), client: str(row.client), year: str(row.year), website: str(row.website), techStack: lines(row.tech_stack), featured: Boolean(row.featured), published: Boolean(row.published), position: row.position as number, updatedAt: iso(row.updated_at) });
export const toPost = (row: Row): Post => ({ ...seo(row), id: row.id as number, slug: str(row.slug), title: str(row.title), category: str(row.category), excerpt: str(row.excerpt), body: str(row.body), image: str(row.image), imageAlt: str(row.image_alt), published: Boolean(row.published), publishedAt: day(row.published_at), updatedAt: iso(row.updated_at), date: displayDate(day(row.published_at)) });
export const toMember = (row: Row): TeamMember => ({ id: row.id as number, name: str(row.name), role: str(row.role), bio: str(row.bio), image: str(row.image), imageAlt: str(row.image_alt), published: Boolean(row.published), position: row.position as number, updatedAt: iso(row.updated_at) });
export const toInquiry = (row: Row): Inquiry => ({ id: row.id as number, kind: str(row.kind), name: str(row.name), email: str(row.email), phone: str(row.phone), subject: str(row.subject), services: str(row.services), budget: str(row.budget), timeline: str(row.timeline), message: str(row.message), read: Boolean(row.read), createdAt: iso(row.created_at) });
export const toService = (row: Row): Service => ({ ...seo(row), id: row.id as number, slug: str(row.slug), title: str(row.title), summary: str(row.summary), introHeading: str(row.intro_heading), intro: str(row.intro), bodyHeading: str(row.body_heading), body: str(row.body), highlights: lines(row.highlights), techStack: lines(row.tech_stack), image: str(row.image), imageAlt: str(row.image_alt), gallery: lines(row.gallery), faqs: faqList(row.faqs), published: Boolean(row.published), position: row.position as number, updatedAt: iso(row.updated_at) });
export const toMedia = (row: Row): Media => ({ id: row.id as number, url: str(row.url), alt: str(row.alt), width: Number(row.width), height: Number(row.height), bytes: Number(row.bytes), createdAt: iso(row.created_at) });

export const defaultSettings: Settings = {
  siteName: "Aviva Web Technology", siteUrl: "", titleSuffix: " — Aviva", defaultDescription: "Aviva is a professional web design and development company in Kathmandu, Nepal.", defaultImage: "/images/aviva-office.webp",
  address: "", phone: "", mobiles: "", whatsapp: "", email: "", facebook: "", instagram: "", linkedin: "",
};
export function toSettings(rows: Row[]): Settings {
  const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return Object.fromEntries(Object.entries(defaultSettings).map(([key, fallback]) => [key, typeof values[key] === "string" ? values[key] : fallback])) as Settings;
}

/** Saved page content merged over the defaults, so new fields always have something to show. */
export function toPage(key: string, row: Row | undefined): PageContent {
  const definition = pageDefinition(key);
  const saved = (row?.content && typeof row.content === "object" ? row.content : {}) as Record<string, unknown>;
  return { key, content: { ...definition?.defaults, ...saved }, seo: row ? seo(row) : { seoTitle: "", seoDescription: "", ogImage: "", noindex: false }, updatedAt: row ? iso(row.updated_at) : "" };
}

/** Plain paragraphs (blank-line separated), used for short multi-line fields such as FAQ answers. */
export const paragraphs = (text: string) => text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);

// Bump when the shape of cached data changes, so entries written by older code are ignored.
const cacheVersion = "6";

// Public reads are cached across requests (Neon may be asleep, so this keeps pages fast) until an admin edit expires the tag.
const cached = <T, A extends unknown[]>(name: string, load: (...args: A) => Promise<T>) => unstable_cache(load, [cacheVersion, name], { tags: [contentTag], revalidate: 3600 });

export const getProjects = cached("projects", async () => (await db()`select * from projects where published order by position, id`).map(toProject));
export const getPosts = cached("posts", async () => (await db()`select * from posts where published and published_at <= current_date order by published_at desc, id desc`).map(toPost));
export const getTeam = cached("team", async () => (await db()`select * from team_members where published order by position, id`).map(toMember));
export const getServices = cached("services", async () => (await db()`select * from services where published order by position, id`).map(toService));
export const getSettings = cached("settings", async () => toSettings(await db()`select key, value from settings`));
export const getPage = cached("page", async (key: string) => toPage(key, (await db()`select * from pages where key = ${key}`)[0]));
export const getRedirect = cached("redirect", async (from: string) => ((await db()`select to_path from redirects where from_path = ${from}`)[0]?.to_path as string | undefined) ?? null);

export async function getService(slug: string) { return (await getServices()).find((service) => service.slug === slug); }
export async function getProject(slug: string) { return (await getProjects()).find((project) => project.slug === slug); }
export async function getPost(slug: string) { return (await getPosts()).find((post) => post.slug === slug); }

/** Home page: projects marked featured (or the first four), the three newest posts and the first four services. */
export async function getFeatured() {
  const [projects, posts, services] = await Promise.all([getProjects(), getPosts(), getServices()]);
  const featured = projects.filter((project) => project.featured);
  return { projects: (featured.length ? featured : projects).slice(0, 4), posts: posts.slice(0, 3), services: services.slice(0, 4) };
}

/** Typed readers for page content values. */
export const field = {
  text: (content: Record<string, unknown>, key: string) => str(content[key]),
  image: (content: Record<string, unknown>, key: string): ImageValue => { const value = content[key] as Partial<ImageValue> | undefined; return { src: str(value?.src), alt: str(value?.alt) }; },
  list: <T extends Record<string, string>>(content: Record<string, unknown>, key: string) => (Array.isArray(content[key]) ? content[key] : []) as T[],
};
