import { requireAdmin } from "../../../lib/auth";
import { toService } from "../../../lib/content";
import { db } from "../../../lib/db";
import { ContentList } from "../../_components/lists";

export default async function ServicesPage() {
  await requireAdmin();
  const services = (await db()`select * from services order by position, id`).map(toService);
  return <ContentList base="/admin/services" noun="Service" plural="Services" reorder="services"
    rows={services.map((item, index) => ({ id: item.id, title: item.title, subtitle: index < 4 ? `Home page card ${index + 1} · ${item.summary}` : item.summary, image: item.image, published: item.published, date: item.updatedAt, viewHref: `/services/${item.slug}` }))} />;
}
