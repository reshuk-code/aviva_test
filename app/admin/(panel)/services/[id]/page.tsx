import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toService } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { ServiceForm } from "../../../_components/forms";
import { parseId, seoContext } from "../../../_lib";

export default async function ServiceEditorPage({ params }: PageProps<"/admin/services/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (id === null) notFound();
  const [row] = id === "new" ? [] : await db()`select * from services where id = ${id}`;
  if (id !== "new" && !row) notFound();
  return <ServiceForm key={`${id}-${row?.updated_at ?? ""}`} item={row ? toService(row) : null} context={await seoContext()} />;
}
