import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

/** Neon over HTTP: no connection pool to manage, which suits short server requests. */
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Add it to .env.local (see DEPLOYMENT.md).");
  client ??= neon(process.env.DATABASE_URL);
  return client;
}
