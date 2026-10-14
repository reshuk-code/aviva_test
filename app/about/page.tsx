import type { Metadata } from "next";
import Image from "next/image";
import { CountUp } from "../components/count-up";
import { Arrow } from "../components/design";
import { ScrollEffects } from "../components/interactive";
import { PageShell } from "../components/page-shell";
import { field, getPage } from "../lib/content";
import { pageMetadata } from "../lib/seo";
import home from "../home.module.css";
import p from "../pages.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("about");

/** "Web Design Company\nThat You Can Trust" → two lines. */
const lines = (text: string) => text.split("\n").flatMap((line, index) => index ? [<br key={index} />, line] : [line]);
/** "17+" → 17 with a "+" suffix, for the counting animation. */
const number = (value: string) => ({ value: parseInt(value, 10) || 0, suffix: value.replace(/^[\d,.\s]+/, "") });

export default async function AboutPage() {
  const { content } = await getPage("about");
  const banner = field.image(content, "bannerImage"), hex = field.image(content, "introImage");
  const stats = field.list<{ value: string; label: string }>(content, "stats"), reasons = field.list<{ title: string; text: string }>(content, "reasons");
  return <PageShell title={field.text(content, "bannerTitle")} crumb="About" image={banner.src} imageAlt={banner.alt} shaded={false}>
    <ScrollEffects />
    <div className={p.container}>
      <section className={p.aboutIntro} aria-labelledby="about-heading">
        <div>
          <p className={home.label}>{field.text(content, "introLabel")}<Arrow /></p>
          <h2 id="about-heading">{field.text(content, "introHeading")}</h2>
          <blockquote className={p.aboutQuote}>{field.text(content, "introQuote")}</blockquote>
          <dl className={p.aboutStats}>
            {stats.map((stat) => <div key={stat.label}><CountUp as="dt" {...number(stat.value)} /><dd>{stat.label}</dd></div>)}
          </dl>
        </div>
        {hex.src && <Image src={hex.src} alt={hex.alt} width={525} height={554} sizes="(max-width: 900px) 80vw, 30vw" className={p.aboutHex} />}
      </section>

      <section className={p.whyAbout} aria-labelledby="why-about-heading">
        <span className={p.whyPrint} aria-hidden="true" />
        <div className={p.yearsBadge} aria-hidden="true"><span><strong>{field.text(content, "yearsBadge")}</strong><small>Years</small></span></div>
        <div>
          <p className={home.label}>{field.text(content, "whyLabel")}<Arrow /></p>
          <h2 id="why-about-heading">{lines(field.text(content, "whyHeading"))}</h2>
          <ul className={p.reasons}>{reasons.map((reason) => <li key={reason.title}><h3>{reason.title}</h3><p>{reason.text}</p></li>)}</ul>
        </div>
      </section>
    </div>

    <section className={`${home.marquee} ${p.aboutMarquee} marquee`} aria-label="Design, web design, and copywriting"><div className={`${home.marqueeTrack} marquee-track`} aria-hidden="true"><span>DESIGN&nbsp; WEB DESIGN&nbsp; </span><span>DESIGN&nbsp; WEB DESIGN&nbsp; </span></div><div className={`${home.marqueeOutline} marquee-outline`} aria-hidden="true"><span>COPYWRITING&nbsp; COPYWRITING&nbsp; </span></div></section>
  </PageShell>;
}
