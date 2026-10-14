import Image from "next/image";
import { paragraphs } from "../lib/content";
import { techIcon } from "../lib/tech";
import p from "../pages.module.css";

/** Rich text written in the admin editor. It is sanitised when saved (see lib/html.ts), so it can be rendered as HTML. */
export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return html ? <div className={`${p.prose} ${className}`} dangerouslySetInnerHTML={{ __html: html }} /> : null;
}

/** Text that may be rich (newer content) or plain paragraphs (older content). */
export function RichOrPlain({ text, className }: { text: string; className?: string }) {
  return /^\s*</.test(text) ? <Prose html={text} className={className} /> : <>{paragraphs(text).map((part) => <p key={part}>{part}</p>)}</>;
}

/** Technology pills, with the logo when one is available. */
export function TechList({ items, title }: { items?: string[]; title: string }) {
  if (!items?.length) return null;
  return <section className={p.tech} aria-label={title}>
    <h3>{title}</h3>
    <ul>{items.map((name) => { const icon = techIcon(name); return <li key={name}>{icon && <Image src={`/images/skills/${icon}.svg`} alt="" width={18} height={18} unoptimized />}{name}</li>; })}</ul>
  </section>;
}
