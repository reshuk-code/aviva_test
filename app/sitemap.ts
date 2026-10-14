import type { MetadataRoute } from "next";
import { getPage, getPosts, getProjects, getServices } from "./lib/content";
import { pageDefinitions } from "./lib/page-fields";
import { siteUrl } from "./lib/seo";

export const dynamic = "force-dynamic";

/** Every public page that isn't hidden from search engines, updated as content changes in the admin. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [base, posts, projects, services] = await Promise.all([siteUrl(), getPosts(), getProjects(), getServices()]);
  const fixed = await Promise.all(pageDefinitions.filter((page) => !["services", "not-found"].includes(page.key)).map(async (page) => ({ page, saved: await getPage(page.key) })));
  return [
    ...fixed.filter(({ saved }) => !saved.seo.noindex).map(({ page, saved }) => ({ url: `${base}${page.path === "/" ? "" : page.path}`, lastModified: saved.updatedAt || undefined, priority: page.path === "/" ? 1 : 0.8 })),
    ...services.filter((item) => !item.noindex).map((item) => ({ url: `${base}/services/${item.slug}`, lastModified: item.updatedAt, priority: 0.9 })),
    ...projects.filter((item) => !item.noindex).map((item) => ({ url: `${base}/portfolio/${item.slug}`, lastModified: item.updatedAt, priority: 0.6 })),
    ...posts.filter((item) => !item.noindex).map((item) => ({ url: `${base}/blog/${item.slug}`, lastModified: item.updatedAt, priority: 0.7 })),
  ];
}
