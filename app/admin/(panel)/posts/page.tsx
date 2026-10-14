import { requireAdmin } from "../../../lib/auth";
import { toPost } from "../../../lib/content";
import { db } from "../../../lib/db";
import { ContentList } from "../../_components/lists";

export default async function PostsPage() {
  await requireAdmin();
  const posts = (await db()`select * from posts order by published_at desc, id desc`).map(toPost);
  const today = new Date().toISOString().slice(0, 10);
  return <ContentList base="/admin/posts" noun="Post" plural="Blog posts" dateLabel="Publish date"
    rows={posts.map((item) => ({ id: item.id, title: item.title, subtitle: item.category, image: item.image, published: item.published, statusLabel: item.published && item.publishedAt > today ? "Scheduled" : undefined, date: `${item.publishedAt}T12:00:00Z`, viewHref: `/blog/${item.slug}` }))} />;
}
