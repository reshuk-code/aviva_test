import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "../../components/contact-form";
import { PageShell } from "../../components/page-shell";
import { Prose } from "../../components/prose";
import { getPost, getPosts } from "../../lib/content";
import { buildMetadata, missing } from "../../lib/seo";
import p from "../../pages.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? buildMetadata({ title: post.title, description: post.excerpt, image: post.image, path: `/blog/${slug}`, seo: post }) : {};
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const [{ slug }, posts] = await Promise.all([params, getPosts()]);
  const post = posts.find((item) => item.slug === slug);
  if (!post) return missing(`/blog/${slug}`);
  const recent = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const categories = [...new Set(posts.map((item) => item.category).filter(Boolean))];

  return <PageShell title={post.title} crumb="Blog Details" image={post.image} imageAlt={post.imageAlt} meta={post.date}>
    <div className={`${p.container} ${p.details}`}>
      <div className={p.mainColumn}>
        <article className={p.article}>
          {post.excerpt && <p className={p.lead}>{post.excerpt}</p>}
          <Prose html={post.body} />
        </article>
        <ContactForm />
      </div>

      <aside className={p.sidebar} aria-label="Blog navigation">
        <form action="/blog" className={p.search} role="search">
          <label htmlFor="blog-search" className="sr-only">Search posts</label>
          <input id="blog-search" name="q" type="search" placeholder="Search here ..." />
          <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
        </form>
        <section aria-labelledby="category-heading">
          <h2 id="category-heading" className={p.sideHeading}>Category</h2>
          <ul className={p.categories}>{categories.map((category) => <li key={category}><Link href={`/blog?category=${encodeURIComponent(category)}`}>{category} <span>({posts.filter((item) => item.category === category).length})</span></Link></li>)}</ul>
        </section>
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className={p.sideHeading}>Recent News</h2>
          <ul className={p.recent}>{recent.map((item) => <li key={item.slug}><Link href={`/blog/${item.slug}`}><span className={p.recentImage}><Image src={item.image} alt="" fill sizes="130px" className="object-cover" /></span><span><strong>{item.title}</strong><small>{item.date}</small></span></Link></li>)}</ul>
        </section>
      </aside>
    </div>
  </PageShell>;
}
