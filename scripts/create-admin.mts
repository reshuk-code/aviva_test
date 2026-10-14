// Creates an admin account, or resets the password of an existing one.
// Usage: npm run admin:create -- you@example.com "Your Name"
// You'll be asked for the password, so it never lands in shell history.
import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;
const [email, ...nameParts] = process.argv.slice(2);
if (!email?.includes("@")) {
  console.error('Usage: npm run admin:create -- you@example.com "Your Name"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Add it to .env.local.");

// ADMIN_PASSWORD lets a deploy script set it without a prompt.
let password = process.env.ADMIN_PASSWORD ?? "";
if (!password) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  password = await prompt.question("Password (at least 10 characters): ");
  prompt.close();
}
if (password.length < 10) {
  console.error("The password needs at least 10 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = `${salt.toString("base64url")}:${(await scrypt(password, salt, 64)).toString("base64url")}`;
const sql = neon(process.env.DATABASE_URL);
await sql`insert into admins (email, name, password_hash) values (${email.toLowerCase()}, ${nameParts.join(" ")}, ${hash})
  on conflict (email) do update set password_hash = excluded.password_hash, name = coalesce(nullif(excluded.name, ''), admins.name)`;
console.log(`Admin ${email.toLowerCase()} is ready. Sign in at /admin.`);
