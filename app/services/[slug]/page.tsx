import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "../../components/design";
import { PageShell } from "../../components/page-shell";
import { Prose, RichOrPlain, TechList } from "../../components/prose";
import { field, getPage, getServices, getSettings, type Faq } from "../../lib/content";
import { buildMetadata, missing } from "../../lib/seo";
import home from "../../home.module.css";
import p from "../../pages.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  return service ? buildMetadata({ title: service.title, description: service.summary, image: service.image, path: `/services/${slug}`, seo: service }) : {};
}

function Check() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#efbf59" /><path d="m6 10.2 2.7 2.6L14 7.6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Native disclosure widgets: keyboard and screen-reader friendly with no script. */
function Questions({ faqs, className, numbered }: { faqs: Faq[]; className: string; numbered?: boolean }) {
  return <div className={className}>{faqs.map((faq, index) => <details key={faq.question} open={index === 0}>
    <summary>{numbered && `${index + 1}. `}{faq.question}<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></summary>
    <RichOrPlain text={faq.answer} />
  </details>)}</div>;
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const [{ slug }, services, settings, page] = await Promise.all([params, getServices(), getSettings(), getPage("services")]);
  const service = services.find((item) => item.slug === slug);
  if (!service) return missing(`/services/${slug}`);
  const content = page.content;
  const phone = field.text(content, "supportPhone") || settings.phone;
  const supportImage = field.image(content, "supportImage");
  const bolt = field.image(content, "boltImage");
  const whyFaqs = field.list<Faq>(content, "whyFaqs").filter((faq) => faq.question);

  return <PageShell title={service.title} crumb="Services Details" image={service.image} imageAlt={service.imageAlt}>
    <div className={`${p.container} ${p.details} ${p.service}`}>
      <article className={p.serviceMain}>
        {service.introHeading && <h2>{service.introHeading}</h2>}
        <Prose html={service.intro} />
        {service.bodyHeading && <h2>{service.bodyHeading}</h2>}
        <Prose html={service.body} />
        {service.highlights.length > 0 && <ul className={p.highlights}>{service.highlights.map((item) => <li key={item}><Check />{item}</li>)}</ul>}
        <TechList items={service.techStack} title="Technologies we use" />
        {service.gallery.length > 0 && <div className={p.serviceGallery}>{service.gallery.map((src) => <span key={src}><Image src={src} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 420px" className="object-cover" /></span>)}</div>}
        {service.faqs.length > 0 && <section aria-labelledby="service-faq">
          <h2 id="service-faq" className={p.serviceFaqHeading}>{field.text(content, "faqHeading").replace("{service}", service.title)}</h2>
          <Questions faqs={service.faqs} className={p.serviceFaqs} numbered />
        </section>}
      </article>

      <aside className={p.serviceAside} aria-label="Services">
        <nav aria-label="All services"><ul className={p.serviceList}>{services.map((item) => <li key={item.slug}>
          <Link href={`/services/${item.slug}`} aria-current={item.slug === service.slug ? "page" : undefined}>{item.title}<span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></Link>
        </li>)}</ul></nav>
        <div className={p.supportCard}>
          {supportImage.src && <Image src={supportImage.src} alt={supportImage.alt} fill sizes="(max-width: 1024px) 50vw, 420px" className="object-cover" />}
          <div>
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 22v-4a12 12 0 0 1 24 0v4" stroke="currentColor" strokeWidth="2.2" /><rect x="5" y="20" width="7" height="11" rx="3" stroke="currentColor" strokeWidth="2.2" /><rect x="28" y="20" width="7" height="11" rx="3" stroke="currentColor" strokeWidth="2.2" /><path d="M31 31c0 4-4 5-9 5" stroke="currentColor" strokeWidth="2.2" /><circle cx="20" cy="36" r="2.4" stroke="currentColor" strokeWidth="2.2" /></svg>
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          </div>
        </div>
        <span className={p.serviceContour} aria-hidden="true" />
      </aside>
    </div>

    {whyFaqs.length > 0 && <div className={p.container}>
      <section className={p.whyFaq} aria-labelledby="why-faq-heading">
        <div>
          <p className={home.label}>{field.text(content, "whyLabel")}<Arrow /></p>
          <h2 id="why-faq-heading">{field.text(content, "whyHeading")}</h2>
          <Questions faqs={whyFaqs} className={p.darkFaqs} />
        </div>
        {bolt.src && <Image src={bolt.src} alt={bolt.alt} width={347} height={616} sizes="(max-width: 900px) 40vw, 300px" className={p.bolt} />}
      </section>
    </div>}
  </PageShell>;
}
