import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../../components/design";
import { ProjectCard } from "../../components/interactive";
import { PageShell } from "../../components/page-shell";
import { Prose, TechList } from "../../components/prose";
import { field, getPage, getProject, getProjects } from "../../lib/content";
import { buildMetadata, missing } from "../../lib/seo";
import home from "../../home.module.css";
import p from "../../pages.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = await getProject(slug);
  return work ? buildMetadata({ title: work.title, description: work.description, image: work.image, path: `/portfolio/${slug}`, seo: work }) : {};
}

export default async function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  const [works, { slug }, page] = await Promise.all([getProjects(), params, getPage("portfolio")]);
  const index = works.findIndex((item) => item.slug === slug);
  if (index < 0) return missing(`/portfolio/${slug}`);
  const banner = field.image(page.content, "detailBanner");
  const work = works[index];
  const previous = works[(index - 1 + works.length) % works.length];
  const next = works[(index + 1) % works.length];
  const more = [1, 2, 3].filter((offset) => offset < works.length).map((offset) => works[(index + offset) % works.length]);

  return <PageShell title={work.title} crumb="Portfolio Details" image={banner.src} imageAlt={banner.alt} meta={work.category}>
    <div className={p.container}>
      <article className={p.project}>
        <div className={p.projectImage}><Image src={work.image} alt={work.imageAlt || work.description || work.title} fill sizes="(max-width: 1024px) 100vw, 55vw" preload className="object-cover" /></div>
        <div className={p.projectInfo}>
          <p className={home.label}>Project overview<Arrow /></p>
          <h2>{work.title}</h2>
          <p className={p.projectLead}>{work.description}</p>
          <Prose html={work.body} />
          <dl className={p.facts}>
            <div><dt>Category</dt><dd>{work.category}</dd></div>
            <div><dt>{work.client ? "Client" : "Studio"}</dt><dd>{work.client || "Aviva Web Technology"}</dd></div>
            {work.year && <div><dt>Year</dt><dd>{work.year}</dd></div>}
            {work.website && <div><dt>Website</dt><dd><a href={work.website} target="_blank" rel="noreferrer">{work.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></dd></div>}
          </dl>
          <TechList items={work.techStack} title="Built with" />
          <a href="/contact" data-quote className={p.cta}>{field.text(page.content, "ctaText")}<Arrow /></a>
        </div>
      </article>

      <nav className={p.pager} aria-label="More projects">
        <Link href={`/portfolio/${previous.slug}`} rel="prev"><span>Previous project</span>{previous.category}</Link>
        <Link href="/portfolio" className={p.pagerAll}>All projects</Link>
        <Link href={`/portfolio/${next.slug}`} rel="next"><span>Next project</span>{next.category}</Link>
      </nav>

      <section className={p.more} aria-labelledby="more-heading">
        <h2 id="more-heading">More projects</h2>
        <ul className={`${p.grid} ${p.works}`}>{more.map((item) => <li key={item.slug}><ProjectCard project={item} /></li>)}</ul>
      </section>
    </div>
  </PageShell>;
}
