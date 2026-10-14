import type { Metadata } from "next";
import { ContactForm } from "../components/contact-form";
import { Arrow } from "../components/design";
import { PageShell } from "../components/page-shell";
import { field, getPage, getSettings } from "../lib/content";
import { pageMetadata } from "../lib/seo";
import home from "../home.module.css";
import p from "../pages.module.css";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("contact");

const dial = (number: string) => number.replace(/[^\d+]/g, "");
const list = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export default async function ContactPage() {
  const [settings, { content }] = await Promise.all([getSettings(), getPage("contact")]);
  const banner = field.image(content, "bannerImage");
  const mobiles = list(settings.mobiles);
  return <PageShell title={field.text(content, "bannerTitle")} crumb="Contact" image={banner.src} imageAlt={banner.alt}>
    <div className={`${p.container} ${p.contact}`}>
      <section className={p.contactInfo} aria-labelledby="contact-heading">
        <p className={home.label}>{field.text(content, "label")}<Arrow /></p>
        <h2 id="contact-heading">{field.text(content, "heading1")}<span>{field.text(content, "heading2")}</span></h2>
        <address>
          {settings.address && <p>{settings.address}</p>}
          {settings.email && <p>Email: <a href={`mailto:${settings.email}`}>{settings.email}</a></p>}
          {settings.phone && <p>Phone: <a href={`tel:${dial(settings.phone)}`}>{settings.phone}</a></p>}
          {mobiles.length > 0 && <p>Mobile: {mobiles.map((number, index) => <span key={number}>{index > 0 && ", "}<a href={`tel:${dial(number)}`}>{number}</a></span>)}</p>}
          {settings.whatsapp && <p>WhatsApp: <a href={`https://wa.me/${dial(settings.whatsapp).replace("+", "")}`} target="_blank" rel="noreferrer">{settings.whatsapp}</a></p>}
        </address>
      </section>
      <ContactForm />
    </div>
    <section className={p.findUs} aria-labelledby="find-heading">
      <p id="find-heading" className={home.label}>{field.text(content, "mapLabel")}<Arrow /></p>
      <iframe title="Aviva on the map" src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address || "Thamel, Kathmandu, Nepal")}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </section>
  </PageShell>;
}
