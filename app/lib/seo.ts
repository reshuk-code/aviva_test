import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { field, getPage, getRedirect, getSettings, type Seo } from "./content";
import { pageDefinition } from "./page-fields";

/** The site's public address, used for canonical links, the sitemap and share images. */
export async function siteUrl() {
  const settings = await getSettings().catch(() => null);
  return (settings?.siteUrl || process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

/**
 * Page metadata in one place. Custom SEO fields win; otherwise the page's own title, summary and image are used,
 * so every page has a sensible title, description, canonical URL and share card without extra work.
 */
export async function buildMetadata({ title, fullTitle, description, image, path, seo }: { title: string; fullTitle?: string; description?: string; image?: string; path: string; seo?: Partial<Seo> }): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);
  const pageTitle = seo?.seoTitle || fullTitle || `${title}${settings?.titleSuffix ?? " — Aviva"}`;
  const summary = seo?.seoDescription || description || settings?.defaultDescription || "";
  const share = seo?.ogImage || image || settings?.defaultImage || "";
  return {
    title: { absolute: pageTitle },
    description: summary,
    alternates: { canonical: path },
    robots: seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: { title: pageTitle, description: summary, url: path, siteName: settings?.siteName, type: "website", images: share ? [{ url: share }] : undefined },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: share ? [share] : undefined },
  };
}

/** A missing page: follow the redirect left by a renamed slug, otherwise show the 404 page. */
export async function missing(path: string): Promise<never> {
  const target = await getRedirect(path).catch(() => null);
  if (target) permanentRedirect(target);
  notFound();
}

/** Metadata for a fixed page, from its SEO fields in the admin with the built-in defaults as fallback. */
export async function pageMetadata(key: string): Promise<Metadata> {
  const [page, definition] = [await getPage(key).catch(() => null), pageDefinition(key)];
  const banner = page ? field.image(page.content, "bannerImage").src : "";
  return buildMetadata({ title: definition?.title ?? "", fullTitle: definition?.seo.title, description: definition?.seo.description, image: banner || undefined, path: definition?.path ?? "/", seo: page?.seo });
}
