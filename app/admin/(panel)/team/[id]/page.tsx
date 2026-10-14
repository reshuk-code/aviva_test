import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toMember } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { MemberForm } from "../../../_components/forms";
import { parseId } from "../../../_lib";

export default async function MemberEditorPage({ params }: PageProps<"/admin/team/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (id === null) notFound();
  const [row] = id === "new" ? [] : await db()`select * from team_members where id = ${id}`;
  if (id !== "new" && !row) notFound();
  return <MemberForm key={`${id}-${row?.updated_at ?? ""}`} item={row ? toMember(row) : null} />;
}
