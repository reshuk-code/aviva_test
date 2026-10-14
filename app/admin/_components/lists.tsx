"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Inquiry } from "../../lib/content";
import { deleteInquiry, markInquiry, move } from "../actions";
import c from "../cms.module.css";
import s from "../studio.module.css";
import { Icon, initials, shortDate, Status, dateTime, useToast } from "./ui";

export type ListRow = { id: number; title: string; subtitle: string; image: string; published: boolean; statusLabel?: string; date: string; viewHref?: string };

/** WordPress-style list: status tabs, search, row links to the editor, and optional ordering. */
export function ContentList({ rows, base, noun, plural, reorder, dateLabel = "Last updated", round }: { rows: ListRow[]; base: string; noun: string; plural: string; reorder?: "projects" | "services" | "team_members"; dateLabel?: string; round?: boolean }) {
  const [filter, setFilter] = useState<"All" | "Published" | "Draft">("All");
  const [query, setQuery] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const filtering = filter !== "All" || query.trim() !== "";
  const shown = rows.filter((row) => (filter === "All" || (filter === "Published") === row.published) && `${row.title} ${row.subtitle}`.toLowerCase().includes(query.trim().toLowerCase()));
  const count = (status: typeof filter) => rows.filter((row) => status === "All" || (status === "Published") === row.published).length;
  return <>
    <div className={s.pageHeading}><div><h1>{plural}</h1></div><Link className={s.primaryButton} href={`${base}/new`}><Icon name="plus" />Add new</Link></div>
    <section className={s.card}>
      <div className={s.listToolbar}>
        <div className={s.tabs} aria-label="Status filter">{(["All", "Published", "Draft"] as const).map((status) => <button key={status} aria-pressed={filter === status} className={filter === status ? s.tabActive : ""} onClick={() => setFilter(status)}>{status}<span>{count(status)}</span></button>)}</div>
        <label className={c.searchField}><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${plural.toLowerCase()}`} aria-label={`Search ${plural.toLowerCase()}`} /></label>
      </div>
      {shown.length ? <ul className={c.rows}>{shown.map((row, index) => <li key={row.id} className={c.row}>
        <Link href={`${base}/${row.id}`} className={c.rowMain}>
          <span className={`${c.rowThumb} ${round ? c.imageRound : ""}`}>{row.image && <Image src={row.image} alt="" fill sizes="56px" className="object-cover" />}</span>
          <span className={c.rowText}><strong>{row.title || "(no title)"}</strong><small>{row.subtitle}</small></span>
        </Link>
        <Status published={row.published} label={row.statusLabel} />
        <span className={c.rowDate}><small>{dateLabel}</small>{shortDate(row.date)}</span>
        <span className={c.rowActions}>
          {reorder && !filtering && <><button aria-label={`Move ${row.title} up`} disabled={pending || index === 0} onClick={() => start(async () => { await move(reorder, row.id, -1); router.refresh(); })}><Icon name="up" /></button><button aria-label={`Move ${row.title} down`} disabled={pending || index === shown.length - 1} onClick={() => start(async () => { await move(reorder, row.id, 1); router.refresh(); })}><Icon name="down" /></button></>}
          {row.viewHref && row.published && <a href={row.viewHref} target="_blank" rel="noreferrer" aria-label={`View ${row.title} on the site`}><Icon name="external" /></a>}
          <Link href={`${base}/${row.id}`} aria-label={`Edit ${row.title}`}><Icon name="edit" /></Link>
        </span>
      </li>)}</ul> : <div className={s.empty}><Icon name="search" /><h3>{rows.length ? "No matches" : `No ${plural.toLowerCase()} yet`}</h3><p>{rows.length ? "Try another search or filter." : `Add your first ${noun.toLowerCase()}.`}</p></div>}
      <div className={s.listFooter}>{reorder && !filtering ? "Use the arrows to set the order on the website. " : ""}Showing {shown.length} of {rows.length}</div>
    </section>
  </>;
}

const summary = (item: Inquiry) => item.subject || item.services || item.kind;

export function InquiryList({ items }: { items: Inquiry[] }) {
  const [filter, setFilter] = useState<"All" | "Unread">("All");
  const [query, setQuery] = useState("");
  const unread = items.filter((item) => !item.read).length;
  const shown = items.filter((item) => (filter === "All" || !item.read) && `${item.name} ${item.email} ${item.phone} ${summary(item)} ${item.message}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className={s.pageHeading}><div><h1>Inquiries</h1></div></div>
    <section className={s.card}>
      <div className={s.listToolbar}>
        <div className={s.tabs}>{(["All", "Unread"] as const).map((status) => <button key={status} className={filter === status ? s.tabActive : ""} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status}<span>{status === "All" ? items.length : unread}</span></button>)}</div>
        <label className={c.searchField}><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inquiries" aria-label="Search inquiries" /></label>
      </div>
      <div className={s.inquiryList}>{shown.map((item) => <Link className={`${s.inquiryRow} ${!item.read ? s.unreadRow : ""}`} key={item.id} href={`/admin/inquiries/${item.id}`}><span className={s.senderAvatar}>{initials(item.name)}</span><span className={s.inquirySender}><strong>{item.name}{!item.read && <i />}</strong><small>{item.email || item.phone}</small></span><span className={s.inquirySubject}><strong>{summary(item)}</strong><small>{item.message}</small></span><span className={s.inquiryMeta}><span>{item.kind}</span><small>{shortDate(item.createdAt)}</small></span><Icon name="chevron" /></Link>)}
        {shown.length === 0 && <div className={s.empty}><Icon name="mail" /><h3>You’re all caught up</h3><p>{items.length ? "No inquiries match this view." : "Quote requests and messages from the website will appear here."}</p></div>}</div>
    </section>
  </>;
}

export function InquiryView({ item }: { item: Inquiry }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const details = [["Type", item.kind], ["Service", item.services], ["Budget", item.budget], ["Timeline", item.timeline], ["Email", item.email], ["Phone", item.phone]].filter(([, value]) => value);
  return <>
    <div className={c.editorHead}><Link href="/admin/inquiries" className={c.back}><Icon name="back" />All inquiries</Link><div className={c.editorTitle}><h1>{summary(item)}</h1></div></div>
    <section className={`${s.card} ${s.message} ${c.inquiry}`}>
      <div className={s.messageSender}><span className={s.senderAvatar}>{initials(item.name)}</span><div><strong>{item.name}</strong><p>{dateTime(item.createdAt)}</p></div></div>
      <dl className={s.messageFacts}>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p className={s.messageBody}>{item.message || "No message was added."}</p>
      <div className={s.modalActions}>
        {confirming ? <button className={s.dangerButton} disabled={pending} onClick={() => start(async () => { await deleteInquiry(item.id); toast("Inquiry deleted."); router.push("/admin/inquiries"); })}><Icon name="trash" />Yes, delete</button>
          : <button className={s.deleteLink} onClick={() => setConfirming(true)}>Delete</button>}
        <button className={s.secondaryButton} disabled={pending} onClick={() => start(async () => { await markInquiry(item.id, false); toast("Marked as unread."); router.push("/admin/inquiries"); })}>Mark as unread</button>
        {item.email ? <a className={s.primaryButton} href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${summary(item)}`)}`}><Icon name="mail" />Reply by email</a>
          : item.phone && <a className={s.primaryButton} href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}>Call {item.name.split(" ")[0]}</a>}
      </div>
    </section>
  </>;
}
