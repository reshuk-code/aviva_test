import Image from "next/image";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

export function Art({ name, className = "", alt = "", style }: { name: string; className?: string; alt?: string; style?: CSSProperties }) {
  return <span className={`art ${className}`} style={style}><Image src={`/images/${name}.webp`} alt={alt} fill sizes="(max-width: 700px) 90vw, 45vw" className="object-contain" /></span>;
}
export function Arrow({ className = "" }: { className?: string }) {
  return <svg className={`arrow ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}<Arrow /></p>;
}
export function Logo({ monochrome = false, onClick }: { monochrome?: boolean; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <a href="#home" className={`logo ${monochrome ? "logo-white" : ""}`} aria-label="Aviva home" onClick={onClick}>{monochrome ? <><Art name="image-211" /><span>AVIVA</span></> : <Image src="/images/aviva-logo.svg" alt="Aviva Web Technology" width={152} height={85} unoptimized preload />}</a>;
}
export function Fingerprint({ className = "" }: { className?: string }) {
  return <svg className={`fingerprint ${className}`} viewBox="0 0 500 500" fill="none" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <path key={i} transform={`translate(250 250) scale(${1 - i * .038}) translate(-250 -250)`} d="M249 13C303 2 332 45 372 50S445 39 464 91S438 165 467 202S500 253 475 294S450 339 444 390S377 411 348 450S272 484 233 466S173 492 136 459S122 399 72 385S26 326 39 286S5 217 31 178S88 161 100 110S167 76 192 42S218 19 249 13Z" stroke="currentColor" strokeWidth="1.25" />)}</svg>;
}
export function SocialLinks({ labels = false }: { labels?: boolean }) {
  return <div className={`social-links ${labels ? "social-labels" : ""}`}><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="currentColor" /><path d="M11 17V10h2l.4-2.4H11V6.5c0-.6.3-1 1.1-1h1.4V3.3c-.4 0-1.2-.1-1.8-.1-1.8 0-3 1.1-3 3V7.6H7V10h1.7v7" fill="#151312" /></svg>{labels && <span>facebook</span>}</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="14.5" cy="5.5" r="1" fill="currentColor" /></svg>{labels && <span>Instagram</span>}</a>{!labels && <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 3 12 14h-3L2 3h3Zm12 0L4 17" stroke="currentColor" /></svg></a>}<a href="https://www.whatsapp.com/" target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 15.7 3 18l3.5-1A8 8 0 1 0 4 15.7Z" stroke="currentColor" strokeWidth="1.3" /><path d="m7 6-1 1c0 4 3 6 6 6l1-1-2-2-1 1-2-2 1-1-2-2Z" stroke="currentColor" /></svg>{labels && <span>whatsapp</span>}</a></div>;
}
