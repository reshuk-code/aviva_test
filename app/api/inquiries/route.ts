import { db } from "../../lib/db";

// Quote and contact requests from the site. They appear in /admin under Inquiries.
const fields = ["kind", "name", "email", "phone", "subject", "services", "budget", "timeline", "message"] as const;
const limit = 4000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  // A hidden field real visitors never fill in.
  if (body.company) return Response.json({ ok: true });

  const entry: Record<(typeof fields)[number], string> = Object.fromEntries(fields.map((field) => {
    const value = Array.isArray(body[field]) ? (body[field] as unknown[]).join(", ") : body[field];
    return [field, typeof value === "string" ? value.trim().slice(0, limit) : ""];
  })) as Record<(typeof fields)[number], string>;
  if (!entry.name) return Response.json({ error: "Please tell us your name." }, { status: 422 });
  if (!entry.email && !entry.phone) return Response.json({ error: "Add a phone number or an email so we can reply." }, { status: 422 });
  if (entry.email && !/^\S+@\S+\.\S+$/.test(entry.email)) return Response.json({ error: "That email address doesn’t look right." }, { status: 422 });

  try {
    await db()`insert into inquiries (kind, name, email, phone, subject, services, budget, timeline, message)
      values (${entry.kind || "Contact message"}, ${entry.name}, ${entry.email}, ${entry.phone}, ${entry.subject}, ${entry.services}, ${entry.budget}, ${entry.timeline}, ${entry.message})`;
  } catch (error) {
    console.error("Could not save inquiry", error);
    return Response.json({ error: "We couldn’t send that just now. Please try again or call us." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
