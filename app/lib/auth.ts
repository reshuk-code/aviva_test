import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;
const cookieName = "aviva_admin";
const lifetime = 60 * 60 * 24 * 7; // one week, in seconds

export type Admin = { id: number; email: string; name: string };

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `${salt.toString("base64url")}:${(await scrypt(password, salt, 64)).toString("base64url")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await scrypt(password, Buffer.from(salt, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  return value;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

/** Session cookie: "<admin id>.<expiry>.<signature>". Nothing secret is stored in it, and it can't be forged without AUTH_SECRET. */
function readToken(token: string | undefined) {
  const [id, expires, signature] = token?.split(".") ?? [];
  if (!id || !expires || !signature) return null;
  const expected = Buffer.from(sign(`${id}.${expires}`));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  if (Number(expires) * 1000 < Date.now()) return null;
  return Number(id);
}

export async function signIn(email: string, password: string) {
  const [row] = await db()`select id, password_hash from admins where email = ${email.trim().toLowerCase()}`;
  // Hash anyway when the email is unknown, so response time doesn't reveal which emails exist.
  const valid = row ? await passwordMatches(password, row.password_hash) : (await hashPassword(password), false);
  if (!valid) return false;
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  const payload = `${row.id}.${expires}`;
  (await cookies()).set(cookieName, `${payload}.${sign(payload)}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: lifetime });
  return true;
}

export async function signOut() {
  (await cookies()).delete(cookieName);
}

/** The signed-in admin, or null. The account is re-read so a deleted admin loses access immediately. */
export async function currentAdmin(): Promise<Admin | null> {
  const id = readToken((await cookies()).get(cookieName)?.value);
  if (!id) return null;
  const [row] = await db()`select id, email, name from admins where id = ${id}`;
  return (row as Admin | undefined) ?? null;
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
