import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toInquiry } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { InquiryView } from "../../../_components/lists";

export default async function InquiryPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  // Opening a message marks it as read, like an inbox.
  const [row] = await db()`update inquiries set read = true where id = ${Number(id)} returning *`;
  if (!row) notFound();
  return <InquiryView item={toInquiry(row)} />;
}
