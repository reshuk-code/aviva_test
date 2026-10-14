import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/seo";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${await siteUrl()}/sitemap.xml` };
}
