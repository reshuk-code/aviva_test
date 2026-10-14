import { requireAdmin } from "../../../lib/auth";
import { toProject } from "../../../lib/content";
import { db } from "../../../lib/db";
import { ContentList } from "../../_components/lists";

export default async function ProjectsPage() {
  await requireAdmin();
  const projects = (await db()`select * from projects order by position, id`).map(toProject);
  return <ContentList base="/admin/projects" noun="Project" plural="Projects" reorder="projects"
    rows={projects.map((item) => ({ id: item.id, title: item.title, subtitle: [item.category, item.featured && "Featured on home"].filter(Boolean).join(" · "), image: item.image, published: item.published, date: item.updatedAt, viewHref: `/portfolio/${item.slug}` }))} />;
}
