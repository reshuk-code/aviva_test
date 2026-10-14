import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toProject } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { ProjectForm } from "../../../_components/forms";
import { parseId, seoContext } from "../../../_lib";

export default async function ProjectEditorPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (id === null) notFound();
  const [row] = id === "new" ? [] : await db()`select * from projects where id = ${id}`;
  if (id !== "new" && !row) notFound();
  return <ProjectForm key={`${id}-${row?.updated_at ?? ""}`} item={row ? toProject(row) : null} context={await seoContext()} />;
}
