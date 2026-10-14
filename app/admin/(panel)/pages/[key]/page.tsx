import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/auth";
import { toPage } from "../../../../lib/content";
import { db } from "../../../../lib/db";
import { pageDefinition } from "../../../../lib/page-fields";
import { PageEditor } from "../../../_components/page-editor";
import { seoContext } from "../../../_lib";

export default async function PageEditorPage({ params }: PageProps<"/admin/pages/[key]">) {
  await requireAdmin();
  const { key } = await params;
  if (!pageDefinition(key)) notFound();
  const page = toPage(key, (await db()`select * from pages where key = ${key}`)[0]);
  return <PageEditor key={page.updatedAt} pageKey={key} content={page.content} seo={page.seo} updatedAt={page.updatedAt} context={await seoContext()} />;
}
