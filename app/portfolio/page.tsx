import type { Metadata } from "next";
import { ProjectCard } from "../components/interactive";
import { PageShell } from "../components/page-shell";
import { field, getPage, getProjects } from "../lib/content";
import { pageMetadata } from "../lib/seo";
import p from "../pages.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("portfolio");

export default async function PortfolioPage() {
  const [works, page] = await Promise.all([getProjects(), getPage("portfolio")]);
  const banner = field.image(page.content, "bannerImage");
  return <PageShell title={field.text(page.content, "bannerTitle")} crumb="Portfolio" image={banner.src} imageAlt={banner.alt}>
    <section className={p.container} aria-label="Selected work">
      <ul className={`${p.grid} ${p.works}`}>{works.map((work) => <li key={work.id}><ProjectCard project={work} /></li>)}</ul>
    </section>
  </PageShell>;
}
