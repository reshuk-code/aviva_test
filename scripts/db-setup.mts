// Creates the CMS tables and, on an empty database, fills them with the site's starting content.
// Usage: npm run db:setup   (reads DATABASE_URL from .env.local)
import { neon } from "@neondatabase/serverless";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import sharp from "sharp";
import path from "node:path";
import { posts, works } from "./seed-content.mts";
import { services } from "./seed-services.mts";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Add it to .env.local.");
const sql = neon(process.env.DATABASE_URL);
const root = path.resolve(import.meta.dirname, "..");

const schema = readFileSync(path.join(root, "db/schema.sql"), "utf8").replace(/--.*$/gm, "");
for (const statement of schema.split(/;\s*$/m).map((part) => part.trim()).filter(Boolean)) await sql.query(statement);
console.log("Schema is up to date.");

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
// "July - 16th 2026" → "2026-07-16"
const toDate = (label: string) => {
  const [, month, day, year] = label.toLowerCase().match(/([a-z]+)\D+(\d+)\D+(\d{4})/) ?? [];
  return `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const [{ count }] = await sql`select count(*)::int as count from projects`;
if (count === 0) {
  for (const [index, work] of works.entries()) {
    await sql`insert into projects (slug, title, category, description, image, year, featured, published, position)
      values (${work.slug}, ${work.title}, ${work.category}, ${work.description}, ${`/images/${work.image}.webp`}, '2026', ${index < 4}, true, ${index})`;
  }
  for (const post of posts) {
    await sql`insert into posts (slug, title, category, excerpt, body, image, published, published_at)
      values (${post.slug}, ${post.title}, ${post.category}, ${post.excerpt}, ${post.body.join("\n\n")}, ${`/images/${post.image}.webp`}, true, ${toDate(post.date)})`;
  }
  const team = [
    ["Alex Morgan", "CEO", "ellipse-331", "Leading the studio with a focus on creative strategy and thoughtful digital experiences."],
    ["Maya Johnson", "General Manager", "ellipse-6", "Bringing people, projects, and ideas together."],
    ["Daniel Lewis", "Vice President", "ellipse-332", "Building lasting client relationships and helping the studio grow."],
    ["Ethan Parker", "Design Director", "ellipse-333", "Turning ambitious ideas into distinctive visual experiences."],
  ];
  for (const [index, [name, role, image, bio]] of team.entries()) {
    await sql`insert into team_members (name, role, bio, image, published, position) values (${name}, ${role}, ${bio}, ${`/images/${image}.webp`}, true, ${index})`;
  }
  const settings = { address: "Thamel, Kathmandu, Nepal", phone: "014548333", mobiles: "9851001237, 9813897747", whatsapp: "+9779851001237", email: "avivanepal@example.com" };
  for (const [key, value] of Object.entries(settings)) await sql`insert into settings (key, value) values (${key}, ${value}) on conflict (key) do nothing`;
  console.log(`Seeded ${works.length} projects, ${posts.length} posts and ${team.length} team members.`);
}

const [{ serviceCount }] = await sql`select count(*)::int as "serviceCount" from services`;
if (serviceCount === 0) {
  const gallery = "/images/pages/service-1.webp\n/images/pages/service-2.webp";
  for (const [index, service] of services.entries()) {
    await sql`insert into services (slug, title, summary, intro_heading, intro, body_heading, body, highlights, image, gallery, faqs, published, position)
      values (${service.slug}, ${service.title}, ${service.summary}, ${service.introHeading}, ${service.intro}, ${service.bodyHeading}, ${service.body}, ${service.highlights.join("\n")},
      ${`/images/${service.image}`}, ${gallery}, ${JSON.stringify(service.faqs)}, true, ${index})`;
  }
  console.log(`Seeded ${services.length} services.`);
}

// Bring over requests saved by the earlier file-based version of the contact form.
const legacy = path.join(root, "data/inquiries.jsonl");
const [{ inquiries }] = await sql`select count(*)::int as inquiries from inquiries`;
if (inquiries === 0 && existsSync(legacy)) {
  const entries = readFileSync(legacy, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line));
  for (const entry of entries) {
    await sql`insert into inquiries (kind, name, email, phone, subject, services, budget, timeline, message, created_at)
      values (${entry.kind ?? "Contact message"}, ${entry.name}, ${entry.email ?? ""}, ${entry.phone ?? ""}, ${entry.subject ?? ""}, ${entry.services ?? ""}, ${entry.budget ?? ""}, ${entry.timeline ?? ""}, ${entry.message ?? ""}, ${entry.receivedAt})`;
  }
  console.log(`Imported ${entries.length} saved inquiries.`);
}

// Rich text: earlier versions stored plain paragraphs separated by blank lines. Convert them to HTML once.
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toHtml = (text: string) => text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).map((part) => `<p>${escape(part)}</p>`).join("");
const plain = (value: string) => value.trim() !== "" && !value.trim().startsWith("<");
for (const row of await sql`select id, body from posts`) {
  if (!plain(row.body)) continue;
  // The design shows an illustration after the second paragraph; it is now part of the post and can be changed or removed.
  const parts = toHtml(row.body).split("</p>").filter(Boolean).map((part) => `${part}</p>`);
  parts.splice(2, 0, `<figure><img src="/images/pages/post-globe.webp" alt="A glowing globe connected by a network of light"></figure>`);
  await sql`update posts set body = ${parts.join("")} where id = ${row.id}`;
}
for (const row of await sql`select id, body from projects`) if (plain(row.body)) await sql`update projects set body = ${toHtml(row.body)} where id = ${row.id}`;
for (const row of await sql`select id, intro, body from services`) {
  if (plain(row.intro) || plain(row.body)) await sql`update services set intro = ${plain(row.intro) ? toHtml(row.intro) : row.intro}, body = ${plain(row.body) ? toHtml(row.body) : row.body} where id = ${row.id}`;
}

// Media library: register the site's own images so they can be reused from the admin.
const imageDir = path.join(root, "public/images");
const files = [...readdirSync(imageDir).map((name) => name), ...readdirSync(path.join(imageDir, "pages")).map((name) => `pages/${name}`)]
  .filter((name) => /\.(webp|jpe?g|png)$/i.test(name) && statSync(path.join(imageDir, name)).size > 15_000);
let added = 0;
for (const name of files) {
  const file = path.join(imageDir, name);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  const [row] = await sql`insert into media (url, width, height, bytes) values (${`/images/${name}`}, ${width}, ${height}, ${statSync(file).size}) on conflict (url) do nothing returning id`;
  if (row) added++;
}
if (added) console.log(`Added ${added} images to the media library.`);
