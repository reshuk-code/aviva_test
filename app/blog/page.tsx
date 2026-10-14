import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../components/design";
import { PageShell } from "../components/page-shell";
import { field, getPage, getPosts } from "../lib/content";
import { pageMetadata } from "../lib/seo";
import p from "../pages.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("blog");

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const [params, posts, page] = await Promise.all([searchParams, getPosts(), getPage("blog")]);
  const banner = field.image(page.content, "bannerImage");
  const query = first(params.q).toLowerCase();
  const category = first(params.category);
  const results = posts.filter((post) => (!category || post.category === category) && (!query || `${post.title} ${post.excerpt}`.toLowerCase().includes(query)));
  const filter = category || (query && `“${first(params.q)}”`);

  return <PageShell title={field.text(page.content, "bannerTitle")} crumb="Blog" image={banner.src} imageAlt={banner.alt}>
    <section className={p.container} aria-label="Blog posts">
      {filter && <p className={p.filterNote}>{results.length} {results.length === 1 ? "post" : "posts"} for {filter} · <Link href="/blog">Show all posts</Link></p>}
      {results.length ? <ul className={p.grid}>{results.map((post) => <li key={post.slug}>
        <Link href={`/blog/${post.slug}`} className={p.postCard}>
          <p>{post.date}</p>
          <h2>{post.title}</h2>
          <div className={p.postImage}><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 420px" className="object-cover" /><span className={p.postArrow} aria-hidden="true"><Arrow /></span></div>
        </Link>
      </li>)}</ul> : <p className={p.empty}>No posts match that search yet. <Link href="/blog">Browse all posts</Link></p>}
    </section>
  </PageShell>;
}
