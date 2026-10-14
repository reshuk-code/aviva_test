import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./components/design";
import { HeaderWave } from "./components/header-wave";
import { Header } from "./components/interactive";
import { QuoteWizard } from "./components/quote-wizard";
import { SiteFooter } from "./components/site-footer";
import { field, getPage } from "./lib/content";
import home from "./home.module.css";
import p from "./pages.module.css";

export const metadata: Metadata = { title: "Page not found — Aviva", robots: { index: false } };

const socials = [
  { label: "facebook", href: "https://www.facebook.com/", icon: <path d="M13.5 21v-7.5H16l.4-3H13.5V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4A20 20 0 0 0 14.3 4.3c-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" fill="currentColor" /> },
  { label: "pinterest", href: "https://www.pinterest.com/", icon: <path d="M12.2 3C7.3 3 4.8 6.5 4.8 9.4c0 1.8.7 3.3 2.1 3.9.2.1.4 0 .5-.3l.2-.8c.1-.3 0-.4-.2-.6-.4-.5-.7-1.2-.7-2.1 0-2.7 2-5.2 5.3-5.2 2.9 0 4.5 1.8 4.5 4.1 0 3.1-1.4 5.7-3.4 5.7-1.1 0-2-.9-1.7-2.1.3-1.4 1-2.9 1-3.9 0-.9-.5-1.6-1.5-1.6-1.2 0-2.1 1.2-2.1 2.8 0 1 .3 1.7.3 1.7l-1.4 5.9c-.4 1.7-.1 3.9 0 4.1h.2c.1-.2 1.4-1.7 1.8-3.3l.7-2.7c.4.7 1.4 1.3 2.5 1.3 3.3 0 5.6-3 5.6-7.1C19.2 5.9 16.6 3 12.2 3Z" fill="currentColor" /> },
  { label: "linkedin", href: "https://www.linkedin.com/", icon: <path d="M6.9 8.8H3.8V20h3.1V8.8ZM5.3 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-5-4.2-5-1.5 0-2.4.8-2.8 1.5V8.8h-3V20h3.1v-5.8c0-1.5.6-2.5 1.9-2.5 1.3 0 1.9 1 1.9 2.5V20h3.1v-6.4Z" fill="currentColor" /> },
];

export default async function NotFound() {
  const page = await getPage("not-found").catch(() => null);
  const content = page?.content ?? {};
  const art = field.image(content, "illustration");
  return <main id="home" className={`${home.page} ${p.inner} site-shell`}>
    <HeaderWave />
    <a href="#content" className="skip-link">Skip to content</a>
    <Header variant="inner" />
    <QuoteWizard />
    <div id="content" className={p.notFoundWrap}>
      <section className={p.notFound} aria-labelledby="not-found-title">
        <div className={p.notFoundCopy}>
          <p className={p.notFoundBig} aria-hidden="true">{field.text(content, "big") || "OOPS!"}</p>
          <h1 id="not-found-title">{field.text(content, "heading") || "This Page Can’t Be Found"}</h1>
          <p className={p.notFoundText}>{field.text(content, "text")}</p>
          <Link href="/" className={p.notFoundHome}>{field.text(content, "button") || "Go To Home"}<Arrow /></Link>
          <ul className={p.notFoundSocial}>{socials.map((item) => <li key={item.label}><a href={item.href} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg>{item.label}</a></li>)}</ul>
        </div>
        {art.src && <Image src={art.src} alt={art.alt} width={613} height={436} sizes="(max-width: 900px) 90vw, 560px" preload className={p.notFoundArt} />}
      </section>
    </div>
    <SiteFooter home={false} />
  </main>;
}
