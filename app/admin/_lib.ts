import { db } from "../lib/db";
import { toSettings } from "../lib/content";

/** Site address and title suffix for permalink and search previews in the editors (read fresh, not from the public cache). */
export async function seoContext() {
  const settings = toSettings(await db()`select key, value from settings`);
  return { siteUrl: (settings.siteUrl || process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, ""), titleSuffix: settings.titleSuffix };
}

/** "new" or a numeric id from the URL; anything else is a 404. */
export function parseId(value: string) {
  if (value === "new") return "new" as const;
  return /^\d+$/.test(value) ? Number(value) : null;
}
