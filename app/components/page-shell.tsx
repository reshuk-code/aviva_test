import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import home from "../home.module.css";
import p from "../pages.module.css";
import { HeaderWave } from "./header-wave";
import { Header } from "./interactive";
import { QuoteWizard } from "./quote-wizard";
import { SiteFooter } from "./site-footer";

/** Inner pages share the home page chrome, a photo banner with breadcrumbs, and the footer. */
/** `shaded={false}` skips the dark overlay for banner photos that already have one. */
export function PageShell({ title, crumb, image, imageAlt = "", meta, shaded = true, children }: { title: string; crumb: string; image: string; imageAlt?: string; meta?: string; shaded?: boolean; children: ReactNode }) {
  return <main id="home" className={`${home.page} ${p.inner} site-shell`}>
    <HeaderWave />
    <a href="#content" className="skip-link">Skip to content</a>
    <Header variant="inner" />
    <QuoteWizard />
    <section className={`${p.banner} ${shaded ? "" : p.unshaded}`} aria-labelledby="page-title">
      <Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 90vw" preload className={p.bannerImage} />
      <div className={p.bannerCopy}>
        <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <span aria-current="page">{crumb}</span></nav>
        <h1 id="page-title">{title}</h1>
        {meta && <p>{meta}</p>}
      </div>
    </section>
    <div id="content" className={p.content}>{children}</div>
    <SiteFooter home={false} />
  </main>;
}
