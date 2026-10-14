import { requireAdmin } from "../../../lib/auth";
import { toInquiry } from "../../../lib/content";
import { db } from "../../../lib/db";
import { InquiryList } from "../../_components/lists";

export default async function InquiriesPage() {
  await requireAdmin();
  const inquiries = (await db()`select * from inquiries order by created_at desc limit 1000`).map(toInquiry);
  return <InquiryList items={inquiries} />;
}
