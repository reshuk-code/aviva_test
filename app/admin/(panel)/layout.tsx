import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "../../lib/auth";
import { db } from "../../lib/db";
import { Shell } from "../_components/shell";

export const metadata: Metadata = { title: "Admin Studio | Aviva", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const [{ unread }] = await db()`select count(*)::int as unread from inquiries where not read`;
  return <Shell admin={admin} unread={unread}>{children}</Shell>;
}
