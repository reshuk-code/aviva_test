import Link from "next/link";
import s from "../home.module.css";
import { Arrow, Logo, SocialLinks } from "./design";
import { RollingLink } from "./interactive";
import { getSettings } from "../lib/content";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "SEO", href: "/services/seo-services" },
  { label: "UI / UX Design", href: "/services/web-design-development" },
  { label: "WordPress", href: "/services/wordpress-development" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Popular Services", href: "#services" },
  { label: "Web Design", href: "/services/web-design-development" },
  { label: "Branding", href: "/services/branding-identity" },
];

export async function SiteFooter({ home = true }: { home?: boolean }) {
  // Phone and WhatsApp come from Settings in the admin.
  const settings = await getSettings().catch(() => null);
  const phone = settings?.phone || "+014548333", whatsapp = settings?.whatsapp || "+9779851001237";
  const dial = (value: string) => value.replace(/[^\d+]/g, "");
  // Section anchors only exist on the home page; elsewhere they lead back to it.
  const link = (href: string) => !home && href.startsWith("#") ? `/${href === "#home" ? "" : href}` : href;
  return <footer id="contact" className={s.footer}><div className={s.footerInner}><div className={s.footerTop}><Logo href={link("#home")} /><a href={`tel:${dial(phone)}`}><span className={s.footerContactIcon}>☏</span><span>Phone<small>{phone}</small></span></a><a href={`https://wa.me/${dial(whatsapp).replace("+", "")}`} target="_blank" rel="noreferrer"><svg className={s.footerWhatsapp} viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Z"/><path fill="#fff" d="M8.1 6.6c-.3 0-.6.1-.8.4-.4.4-1 1-1 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.2.1 1.7.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2l-.9 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.2-1.4-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.8Z"/></svg><span>WhatsApp<small>{whatsapp}</small></span></a><SocialLinks labels /></div><div className={s.footerMain}><div className={s.invitation}><h2>LET’S WORK<span>TOGETHER</span></h2><a href="/contact" className={s.footerEmail} data-quote>GET A QUOTE<Arrow /></a></div><div className={s.footerLinks}><h3>Quick Links</h3><div>{quickLinks.map((item) => <Link key={item.label} href={link(item.href)}>{item.label}</Link>)}</div></div><div className={s.footerOther}><h3>Other</h3><Link href="/contact">Vacancy</Link><Link href={link("#process")}>How IT Works</Link></div><RollingLink href="/contact" slotClassName={s.footerCtaSlot} className={`${s.footerCta} ambient-motion`}>Message<br />Us<Arrow /></RollingLink></div><div className={s.copyright}>© 2026 <span>AVIVA.</span> All Rights Reserved</div></div></footer>;
}
