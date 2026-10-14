import { randomBytes } from "node:crypto";
import sharp from "sharp";
import { currentAdmin } from "../../lib/auth";
import { db } from "../../lib/db";
import { putObject } from "../../lib/storage";

const maxBytes = 15 * 1024 * 1024;

/** Admin image upload: converted to WebP (at most 2400px wide, camera metadata removed) and stored in Neon Object Storage. */
export async function POST(request: Request) {
  if (!await currentAdmin()) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "That file isn’t an image." }, { status: 415 });
  if (file.size > maxBytes) return Response.json({ error: "Images can be up to 15 MB." }, { status: 413 });

  let output: Buffer, width: number, height: number;
  try {
    ({ data: output, info: { width, height } } = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 80_000_000 })
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true }));
  } catch {
    return Response.json({ error: "That image couldn’t be read. Try a JPG, PNG or WebP." }, { status: 422 });
  }

  let url: string;
  try {
    url = await putObject(`uploads/${randomBytes(12).toString("hex")}.webp`, output, "image/webp");
  } catch (error) {
    console.error("Upload to Neon storage failed", error);
    return Response.json({ error: "The image couldn’t be stored. Please try again." }, { status: 502 });
  }
  // Suggested alt text from the file name, e.g. "team-photo_2.jpg" → "team photo 2". Editable in the media library.
  const alt = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim().slice(0, 120);
  const [row] = await db()`insert into media (url, alt, width, height, bytes) values (${url}, ${alt}, ${width}, ${height}, ${output.length}) returning id`;
  return Response.json({ id: row.id, url, alt, width, height });
}
