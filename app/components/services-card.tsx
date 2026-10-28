import Link from "next/link";
import s from "../home.module.css";
import { ContourParticles } from "./contour-particles";
import { Arrow } from "./design";

type ServiceLink = { slug: string; title: string; summary: string };

/** The dark "Unique Ideas / For Your Business." card listing services, shared by the home and services pages. */
export function ServicesCard({ heading1, heading2, services, id = "services", className = "" }: { heading1: string; heading2: string; services: ServiceLink[]; id?: string; className?: string }) {
  return <section id={id} className={`${s.services} ${s.container} ${className}`} aria-labelledby={`${id}-heading`}><ContourParticles className={s.serviceRing} shape="ring" /><ContourParticles className={s.servicesPrint} shape="terrain" /><h2 id={`${id}-heading`}>{heading1}<br /><span><a href="/contact" data-quote className={s.goldCircle} aria-label="Discuss an idea"><Arrow /></a>{heading2}</span></h2><div className={s.servicesGrid}>{services.map((service, index) => <Link href={`/services/${service.slug}`} className={s.service} key={service.slug}><h3>{service.title}</h3><p>{service.summary}</p><div className={s.serviceBottom}><span className={s.serviceArrow}><Arrow /></span><span className={s.serviceNumber}>{String(index + 1).padStart(2, "0")}</span></div></Link>)}</div></section>;
}
