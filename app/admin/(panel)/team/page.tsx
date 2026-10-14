import { requireAdmin } from "../../../lib/auth";
import { toMember } from "../../../lib/content";
import { db } from "../../../lib/db";
import { ContentList } from "../../_components/lists";

export default async function TeamPage() {
  await requireAdmin();
  const team = (await db()`select * from team_members order by position, id`).map(toMember);
  return <ContentList base="/admin/team" noun="Team member" plural="Team" reorder="team_members" round
    rows={team.map((item) => ({ id: item.id, title: item.name, subtitle: item.role, image: item.image, published: item.published, date: item.updatedAt }))} />;
}
