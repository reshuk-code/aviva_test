import type { Metadata } from "next";
import Image from "next/image";
import { Arrow } from "../components/design";
import { Reveal, ScrollEffects } from "../components/interactive";
import { PageShell } from "../components/page-shell";
import { ServicesCard } from "../components/services-card";
import { field, getPage, getServices, paragraphs } from "../lib/content";
import { pageMetadata } from "../lib/seo";
import home from "../home.module.css";
import p from "../pages.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("services-overview");

/** "Web Design Company\nThat You Can Trust" → two lines. */
const lines = (text: string) => text.split("\n").flatMap((line, index) => index ? [<br key={index} />, line] : [line]);

export default async function ServicesPage() {
  const [{ content }, services] = await Promise.all([getPage("services-overview"), getServices()]);
  const t = (key: string) => field.text(content, key);
  const banner = field.image(content, "bannerImage"), intro = field.image(content, "introImage"), film = field.image(content, "filmImage"), hex = field.image(content, "whyImage");
  const reasons = field.list<{ title: string; text: string }>(content, "reasons").filter((reason) => reason.title);
  return <PageShell title={t("bannerTitle")} crumb="Services" image={banner.src} imageAlt={banner.alt}>
    <ScrollEffects />
    <div className={p.container}>
      <section className={p.servicesIntro} aria-labelledby="services-intro-heading">
        <div className={p.introVisual}>
          {intro.src && <Image src={intro.src} alt={intro.alt} width={636} height={600} sizes="(max-width: 900px) 80vw, 34vw" className={p.introPhoto} />}
          <div className={p.introCard}>
            <span className={p.introArrow} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6m0 0H9m9 0v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            <p><strong>{t("cardBold")}</strong> {t("cardText")}</p>
          </div>
        </div>
        <div className={p.introCopy}>
          <p className={home.label}>{t("introLabel")}<Arrow /></p>
          <h2 id="services-intro-heading">{lines(t("introHeading"))}</h2>
          {paragraphs(t("introText")).map((text) => <p key={text}>{text}</p>)}
        </div>
        <span className={p.introContour} aria-hidden="true" />
      </section>
    </div>

    <div className={p.servicesBand}>
      {film.src && <div className={p.bandPhoto}><Image src={film.src} alt={film.alt} fill sizes="100vw" className="object-cover" /></div>}
      <Reveal><ServicesCard id="all-services" heading1={t("servicesHeading1")} heading2={t("servicesHeading2")} services={services} className={p.bandCard} /></Reveal>
    </div>
    <div className={p.container}>
      <section className={p.servicesWhy} aria-labelledby="services-why-heading">
        <div>
          <p className={home.label}>{t("whyLabel")}<Arrow /></p>
          <h2 id="services-why-heading">{lines(t("whyHeading"))}</h2>
          {reasons.length > 0 && <ul className={p.reasons}>{reasons.map((reason) => <li key={reason.title}><h3>{reason.title}</h3><p>{reason.text}</p></li>)}</ul>}
        </div>
        {hex.src && <Image src={hex.src} alt={hex.alt} width={525} height={554} sizes="(max-width: 900px) 80vw, 26vw" className={p.servicesHex} />}
      </section>
    </div>
  </PageShell>;
}
