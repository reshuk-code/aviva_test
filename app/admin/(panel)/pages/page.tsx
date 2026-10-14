import Link from "next/link";
import { requireAdmin } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { pageDefinitions } from "../../../lib/page-fields";
import { shortDate } from "../../_components/format";
import { Icon } from "../../_components/ui";
import c from "../../cms.module.css";
import s from "../../studio.module.css";

export default async function PagesPage() {
  await requireAdmin();
  const saved = new Map((await db()`select key, updated_at from pages`).map((row) => [row.key as string, (row.updated_at as Date).toISOString()]));
  return <>
    <div className={s.pageHeading}><div><h1>Pages</h1></div></div>
    <p className={c.hint}>Edit the text, images and SEO of the site’s fixed pages. Services, projects and posts have their own sections.</p>
    <section className={s.card}>
      <ul className={c.rows}>{pageDefinitions.map((page) => <li key={page.key} className={c.row}>
        <Link href={`/admin/pages/${page.key}`} className={c.rowMain}>
          <span className={`${c.rowThumb} ${c.rowIcon}`}><Icon name="file" /></span>
          <span className={c.rowText}><strong>{page.title}</strong><small>{page.description}</small></span>
        </Link>
        <span className={c.rowDate}><small>Last edited</small>{saved.has(page.key) ? shortDate(saved.get(page.key)!) : "Original design"}</span>
        <span className={c.rowActions}><a href={page.path} target="_blank" rel="noreferrer" aria-label={`View ${page.title}`}><Icon name="external" /></a><Link href={`/admin/pages/${page.key}`} aria-label={`Edit ${page.title}`}><Icon name="edit" /></Link></span>
      </li>)}</ul>
    </section>
  </>;
}
