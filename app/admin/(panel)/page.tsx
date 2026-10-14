import Link from "next/link";
import { requireAdmin } from "../../lib/auth";
import { toInquiry, toPost } from "../../lib/content";
import { db } from "../../lib/db";
import { shortDate } from "../_components/format";
import { Icon, type IconName } from "../_components/ui";
import c from "../cms.module.css";
import s from "../studio.module.css";

export default async function Dashboard() {
  const admin = await requireAdmin();
  const sql = db();
  const [[counts], inquiries, posts, [health]] = await Promise.all([
    sql`select (select count(*) from projects)::int as projects, (select count(*) from services)::int as services, (select count(*) from posts)::int as posts,
      (select count(*) from posts where not published)::int as drafts, (select count(*) from inquiries where not read)::int as unread, (select count(*) from inquiries)::int as inquiries, (select count(*) from media)::int as media`,
    sql`select * from inquiries order by created_at desc limit 5`,
    sql`select * from posts order by updated_at desc limit 5`,
    sql`select
      (select count(*) from posts where seo_description = '' and excerpt = '')::int + (select count(*) from projects where seo_description = '' and description = '')::int + (select count(*) from services where seo_description = '' and summary = '')::int as "noDescription",
      (select count(*) from media where alt = '')::int as "noAlt",
      (select value from settings where key = 'siteUrl') as "siteUrl"`,
  ]);
  const name = (admin.name || admin.email.split("@")[0]).split(" ")[0];
  const stats: { label: string; value: number; detail: string; href: string; icon: IconName; color: string }[] = [
    { label: "Projects", value: counts.projects, detail: "In the portfolio", href: "/admin/projects", icon: "folder", color: "peach" },
    { label: "Blog posts", value: counts.posts, detail: `${counts.drafts} drafts`, href: "/admin/posts", icon: "article", color: "lavender" },
    { label: "New inquiries", value: counts.unread, detail: `${counts.inquiries} received in total`, href: "/admin/inquiries", icon: "mail", color: "green" },
    { label: "Services", value: counts.services, detail: `${counts.media} images in the library`, href: "/admin/services", icon: "layers", color: "blue" },
  ];
  const checks = [
    { ok: Boolean(health.siteUrl), text: health.siteUrl ? "Website address is set for canonical links and the sitemap." : "Add your live website address in Settings so search engines get correct links.", href: "/admin/settings" },
    { ok: health.noDescription === 0, text: health.noDescription === 0 ? "Every post, project and service has a description." : `${health.noDescription} items have no description for search results.`, href: "/admin/posts" },
    { ok: health.noAlt === 0, text: health.noAlt === 0 ? "Every image in the library has alt text." : `${health.noAlt} library images have no alt text.`, href: "/admin/media" },
  ];
  const actions: { label: string; href: string; icon: IconName }[] = [
    { label: "Write a blog post", href: "/admin/posts/new", icon: "article" },
    { label: "Add a project", href: "/admin/projects/new", icon: "folder" },
    { label: "Add a service", href: "/admin/services/new", icon: "layers" },
    { label: "Edit the home page", href: "/admin/pages/home", icon: "file" },
    { label: "Upload images", href: "/admin/media", icon: "upload" },
  ];
  return <>
    <div className={s.pageHeading}><div><h1>Welcome back, {name}</h1></div><Link className={s.primaryButton} href="/admin/posts/new"><Icon name="plus" />New post</Link></div>
    <section className={s.stats} aria-label="Content at a glance">{stats.map((stat) => <Link key={stat.label} href={stat.href} className={s.statCard}><div className={s.statTop}><span>{stat.label}</span><span className={`${s.statIcon} ${s[stat.color]}`}><Icon name={stat.icon} /></span></div><strong>{String(stat.value).padStart(2, "0")}</strong><div className={s.statBottom}><span><span className={s.statDot} />{stat.detail}</span><Icon name="arrow" /></div></Link>)}</section>
    <div className={c.dashGrid}>
      <section className={s.card}><div className={s.cardHeading}><div><h2>Recent inquiries</h2></div><Link className={s.textButton} href="/admin/inquiries">View all<Icon name="arrow" /></Link></div>
        <ul className={c.rows}>{inquiries.map(toInquiry).map((item) => <li key={item.id} className={c.row}><Link href={`/admin/inquiries/${item.id}`} className={c.rowMain}><span className={c.rowText}><strong>{item.name}{!item.read && <i className={c.dot} aria-label="Unread" />}</strong><small>{item.subject || item.services || item.kind}</small></span></Link><span className={c.rowDate}>{shortDate(item.createdAt)}</span></li>)}</ul>
        {inquiries.length === 0 && <p className={`${s.cardHint} ${c.padded}`}>Quote requests and messages from the website appear here.</p>}
      </section>
      <section className={s.card}><div className={s.cardHeading}><div><h2>Recently edited posts</h2></div><Link className={s.textButton} href="/admin/posts">All posts<Icon name="arrow" /></Link></div>
        <ul className={c.rows}>{posts.map(toPost).map((item) => <li key={item.id} className={c.row}><Link href={`/admin/posts/${item.id}`} className={c.rowMain}><span className={c.rowText}><strong>{item.title}</strong><small>{item.published ? "Published" : "Draft"} · {item.category}</small></span></Link><span className={c.rowDate}>{shortDate(item.updatedAt)}</span></li>)}</ul>
      </section>
      <section className={s.card}><div className={s.cardHeading}><div><h2>Quick actions</h2></div></div>
        <ul className={c.quickList}>{actions.map((action) => <li key={action.href}><Link href={action.href}><Icon name={action.icon} />{action.label}<Icon name="chevron" /></Link></li>)}</ul>
      </section>
      <section className={s.card}><div className={s.cardHeading}><div><h2>SEO health</h2></div></div>
        <ul className={c.checks}>{checks.map((check) => <li key={check.text} className={check.ok ? c.good : c.warn}><span aria-hidden="true">{check.ok ? "✓" : "!"}</span><Link href={check.href}>{check.text}</Link></li>)}</ul>
      </section>
    </div>
  </>;
}
