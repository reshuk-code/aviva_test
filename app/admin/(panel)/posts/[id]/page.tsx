import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toPost } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { PostForm } from "../../../_components/forms";
import { parseId, seoContext } from "../../../_lib";

export default async function PostEditorPage({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (id === null) notFound();
  const [[row], categories] = await Promise.all([id === "new" ? Promise.resolve([]) : db()`select * from posts where id = ${id}`, db()`select distinct category from posts where category <> '' order by category`]);
  if (id !== "new" && !row) notFound();
  return <PostForm key={`${id}-${row?.updated_at ?? ""}`} item={row ? toPost(row) : null} categories={categories.map((item) => item.category as string)} context={await seoContext()} />;
}
