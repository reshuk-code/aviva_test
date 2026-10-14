// Moves the media library's built-in images (public/images) to Neon Object Storage and points all content at the new URLs.
// Usage: npm run media:migrate            (dry run: shows what would change)
//        npm run media:migrate -- --apply (uploads and updates the database)
// Safe to run again: images already in storage are skipped. The local files are left in place.
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from "@neondatabase/serverless";
import { readFileSync, statSync } from "node:fs";
import sharp from "sharp";
import path from "node:path";
import { pageDefinitions } from "../app/lib/page-fields.ts";

const apply = process.argv.includes("--apply");
const env = process.env;
for (const key of ["DATABASE_URL", "STORAGE_ENDPOINT", "STORAGE_REGION", "STORAGE_BUCKET", "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY"]) {
  if (!env[key]) throw new Error(`${key} is not set. Add it to .env.local.`);
}
const sql = neon(env.DATABASE_URL!);
const s3 = new S3Client({ endpoint: env.STORAGE_ENDPOINT, region: env.STORAGE_REGION, credentials: { accessKeyId: env.STORAGE_ACCESS_KEY_ID!, secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY! }, forcePathStyle: true, requestChecksumCalculation: "WHEN_REQUIRED" });
const base = `${env.STORAGE_ENDPOINT!.replace(/\/+$/, "")}/${env.STORAGE_BUCKET}`;
const root = path.resolve(import.meta.dirname, "..");
const types: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };

// 0. Register local images that content uses but the library doesn't list yet (small files such as team photos).
const used = await sql`select image as url from projects union select image from posts union select image from services union select image from team_members`;
for (const { url } of used) {
  if (typeof url !== "string" || !url.startsWith("/images/")) continue;
  const file = path.join(root, "public", url);
  const { width = 0, height = 0 } = await sharp(file).metadata();
  if (apply) await sql`insert into media (url, width, height, bytes) values (${url}, ${width}, ${height}, ${statSync(file).size}) on conflict (url) do nothing`;
  else console.log(`would add ${url} to the library`);
}

// 1. Upload each library image and remember old URL → new URL.
const rows = await sql`select id, url from media where url like '/images/%' order by id`;
const moved = new Map<string, string>();
for (const row of rows) {
  const local = row.url as string;
  const key = `site/${local.slice("/images/".length)}`;
  const target = `${base}/${key}`;
  moved.set(local, target);
  if (!apply) continue;
  const file = readFileSync(path.join(root, "public", local));
  await s3.send(new PutObjectCommand({ Bucket: env.STORAGE_BUCKET, Key: key, Body: file, ContentType: types[path.extname(local).toLowerCase()] ?? "application/octet-stream", CacheControl: "public, max-age=31536000, immutable" }));
  await sql`update media set url = ${target} where id = ${row.id}`;
  console.log(`uploaded ${local}`);
}
console.log(`${rows.length} library images ${apply ? "moved to" : "would move to"} ${base}/site/`);
if (!moved.size) process.exit(0);

// Replace whole URLs only (a path followed by a quote, newline or end), so "/images/a.webp" never matches inside "/images/a.webp2".
const swap = (text: string) => text.replace(/\/images\/[\w./-]+/g, (url) => moved.get(url) ?? url);
let changes = 0;
async function update(label: string, before: string, after: string, write: () => Promise<unknown>) {
  if (before === after) return;
  changes++;
  console.log(`  ${label}`);
  if (apply) await write();
}

// 2. Content tables.
for (const row of await sql`select id, title, image, og_image, body from projects`) {
  const next = { image: swap(row.image), og: swap(row.og_image), body: swap(row.body) };
  await update(`project: ${row.title}`, `${row.image}${row.og_image}${row.body}`, `${next.image}${next.og}${next.body}`, () => sql`update projects set image = ${next.image}, og_image = ${next.og}, body = ${next.body} where id = ${row.id}`);
}
for (const row of await sql`select id, title, image, og_image, body from posts`) {
  const next = { image: swap(row.image), og: swap(row.og_image), body: swap(row.body) };
  await update(`post: ${row.title}`, `${row.image}${row.og_image}${row.body}`, `${next.image}${next.og}${next.body}`, () => sql`update posts set image = ${next.image}, og_image = ${next.og}, body = ${next.body} where id = ${row.id}`);
}
for (const row of await sql`select id, title, image, og_image, gallery, intro, body from services`) {
  const next = { image: swap(row.image), og: swap(row.og_image), gallery: swap(row.gallery), intro: swap(row.intro), body: swap(row.body) };
  await update(`service: ${row.title}`, Object.values({ a: row.image, b: row.og_image, c: row.gallery, d: row.intro, e: row.body }).join(""), Object.values(next).join(""),
    () => sql`update services set image = ${next.image}, og_image = ${next.og}, gallery = ${next.gallery}, intro = ${next.intro}, body = ${next.body} where id = ${row.id}`);
}
for (const row of await sql`select id, name, image from team_members`) {
  await update(`team: ${row.name}`, row.image, swap(row.image), () => sql`update team_members set image = ${swap(row.image)} where id = ${row.id}`);
}
for (const row of await sql`select key, value from settings`) {
  await update(`setting: ${row.key}`, row.value, swap(row.value), () => sql`update settings set value = ${swap(row.value)} where key = ${row.key}`);
}

// 3. Fixed pages: save each page's content (defaults included) with the new URLs, so pages never edited also use storage.
const saved = new Map((await sql`select key, content from pages`).map((row) => [row.key as string, row.content as Record<string, unknown>]));
for (const page of pageDefinitions) {
  const current = JSON.stringify({ ...page.defaults, ...saved.get(page.key) });
  const next = swap(current);
  await update(`page: ${page.title}`, current, next,
    () => sql`insert into pages (key, content) values (${page.key}, ${next}::jsonb) on conflict (key) do update set content = excluded.content, updated_at = now()`);
}

// Anything still pointing at a local image that isn't in the library (very small files are not registered).
const left = await sql`select 'projects' as t, image as v from projects where image like '/images/%' union all select 'posts', image from posts where image like '/images/%'
  union all select 'services', image from services where image like '/images/%' or gallery like '%/images/%' union all select 'team', image from team_members where image like '/images/%'`;
if (apply && left.length) console.log("Still local:", left);

console.log(`${changes} records ${apply ? "updated" : "would be updated"}.${apply ? "" : " Run with --apply to do it."}`);
