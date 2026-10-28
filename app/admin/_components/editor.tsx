"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { Seo } from "../../lib/content";
import type { Result } from "../actions";
import c from "../cms.module.css";
import s from "../studio.module.css";
import { ImageField } from "./media";
import { Icon, shortDate, useToast } from "./ui";

export type SeoContext = { siteUrl: string; titleSuffix: string };

export const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export function Panel({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return <details className={c.panel} open={defaultOpen}><summary>{title}<Icon name="down" /></summary><div className={c.panelBody}>{children}</div></details>;
}

export function Field({ label, hint, count, max, children }: { label: string; hint?: ReactNode; count?: number; max?: number; children: ReactNode }) {
  return <label className={c.field}>
    <span>{label}{count !== undefined && max && <em className={count > max ? c.over : ""}>{count} / {max}</em>}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>;
}

/** Permalink under the title: follows the title for new items until edited by hand. */
export function SlugField({ prefix, value, onChange, context, auto, onReset }: { prefix: string; value: string; onChange: (value: string) => void; context: SeoContext; auto?: boolean; onReset?: () => void }) {
  return <div className={c.permalink}>
    <span>Permalink:</span>
    <span className={c.permalinkBase}>{context.siteUrl.replace(/^https?:\/\//, "")}{prefix}</span>
    <input value={value} onChange={(event) => onChange(event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} onBlur={(event) => onChange(slugify(event.target.value))} aria-label="Slug" spellCheck={false} />
    {auto ? <small className={c.slugNote}>Follows the name</small> : onReset && <button type="button" className={c.slugReset} onClick={onReset}>Generate from name</button>}
  </div>;
}

type SeoSource = { value: Seo; fallbackTitle: string; fullTitle?: string; fallbackDescription: string; context: SeoContext };

/** The title and description search engines will actually get, after falling back to the page’s own title and summary. */
const resolveSeo = ({ value, fallbackTitle, fullTitle, fallbackDescription, context }: SeoSource) => {
  const automatic = fullTitle || `${fallbackTitle}${context.titleSuffix}`;
  return { automatic, title: value.seoTitle || automatic, description: value.seoDescription || fallbackDescription };
};

/** SEO box with live Google preview, like Yoast. Empty fields fall back to the page’s own title and summary. */
export function SeoPanel({ onChange, path, ...source }: SeoSource & { onChange: (value: Seo) => void; path: string }) {
  const { value, fallbackDescription, context } = source;
  const { automatic, title, description } = resolveSeo(source);
  return <Panel title="SEO">
    <div className={c.serp} aria-label="Search result preview">
      <small>{context.siteUrl.replace(/^https?:\/\//, "")}{path}</small>
      <strong>{title.length > 62 ? `${title.slice(0, 60)}…` : title}</strong>
      <p>{description ? (description.length > 160 ? `${description.slice(0, 157)}…` : description) : "Add a meta description to control what search results show."}</p>
    </div>
    <Field label="SEO title" count={(value.seoTitle || title).length} max={60} hint="Leave empty to use the title.">
      <input value={value.seoTitle} maxLength={120} placeholder={automatic} onChange={(event) => onChange({ ...value, seoTitle: event.target.value })} />
    </Field>
    <Field label="Meta description" count={description.length} max={160} hint="Shown under the title in Google. Aim for 120–160 characters.">
      <textarea rows={3} value={value.seoDescription} maxLength={320} placeholder={fallbackDescription} onChange={(event) => onChange({ ...value, seoDescription: event.target.value })} />
    </Field>
    <ImageField label="Social share image" value={{ src: value.ogImage, alt: "" }} onChange={(image) => onChange({ ...value, ogImage: image.src })} />
    <label className={c.check}><input type="checkbox" checked={value.noindex} onChange={(event) => onChange({ ...value, noindex: event.target.checked })} /><span>Hide from search engines<small>Adds “noindex”. The page still works for anyone with the link.</small></span></label>
  </Panel>;
}

type Check = { status: "good" | "ok" | "bad"; text: string };
const points = { good: 1, ok: 0.5, bad: 0 };

/** Live SEO score for the sidebar. Only checks what the editor has: pass `slug`, `image` or `content` to include those checks. */
export function SeoScore({ slug, image, imageAlt, content, ...source }: SeoSource & { slug?: string; image?: string; imageAlt?: string; content?: string }) {
  const { value } = source;
  const { title, description } = resolveSeo(source);
  const checks: Check[] = [];
  const add = (status: Check["status"], text: string) => checks.push({ status, text });

  if (value.noindex) add("bad", "Hidden from search engines (noindex).");
  if (title.length >= 30 && title.length <= 60) add("good", "SEO title length is good.");
  else if (title.length > 60) add(title.length <= 70 ? "ok" : "bad", "SEO title is too long. Google cuts it off after about 60 characters.");
  else add(title.length >= 15 ? "ok" : "bad", "SEO title is short. Aim for 30–60 characters.");
  if (!description) add("bad", "No meta description. Add one so you control the search snippet.");
  else if (description.length >= 120 && description.length <= 160) add("good", "Meta description length is good.");
  else if (description.length > 160) add("ok", "Meta description is long and will be cut off.");
  else add(description.length >= 50 ? "ok" : "bad", "Meta description is short. Aim for 120–160 characters.");
  if (slug !== undefined) {
    if (!slug) add("bad", "The page has no permalink yet.");
    else add(slug.length <= 50 && slug.split("-").length <= 6 ? "good" : "ok", slug.length <= 50 && slug.split("-").length <= 6 ? "Permalink is short and readable." : "Permalink is long. Shorter links are easier to share.");
  }
  if (image !== undefined) add(image && imageAlt?.trim() ? "good" : "ok", image && imageAlt?.trim() ? "Featured image has alt text." : "Add alt text to the featured image.");
  add(value.ogImage || image ? "good" : "ok", value.ogImage || image ? "Has an image for social shares." : "No share image set, so the site default is used.");
  if (content !== undefined) {
    const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    add(words >= 300 ? "good" : words >= 100 ? "ok" : "bad", words >= 300 ? `Content length is good (${words} words).` : `Only ${words} words of content. Aim for at least 300.`);
  }

  const score = Math.round(checks.reduce((sum, check) => sum + points[check.status], 0) / checks.length * 100);
  const grade = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";
  const order = { bad: 0, ok: 1, good: 2 };
  return <Panel title="SEO score">
    <div className={c.seoScore} data-grade={grade}>
      <div className={c.seoRing} style={{ "--score": score } as React.CSSProperties} role="img" aria-label={`SEO score ${score} out of 100`}><strong>{score}</strong></div>
      <div><strong>{grade === "good" ? "Good" : grade === "ok" ? "Needs work" : "Poor"}</strong><small>Updates as you type.</small></div>
    </div>
    <ul className={c.seoChecks}>{[...checks].sort((a, b) => order[a.status] - order[b.status]).map((check) => <li key={check.text} data-status={check.status}>{check.text}</li>)}</ul>
  </Panel>;
}

type Props = {
  title: string; backHref: string; backLabel: string; viewHref?: string; isNew: boolean; updatedAt?: string;
  published?: boolean; onPublishedChange?: (published: boolean) => void; publishExtra?: ReactNode;
  dirty: boolean; save: () => Promise<Result>; remove?: () => Promise<Result>; editPath?: (id: number) => string;
  noun: string; main: ReactNode; side?: ReactNode;
};

/** Two-column editor page shared by every content type: content on the left, Publish and settings panels on the right. */
export function EditorScreen({ title, backHref, backLabel, viewHref, isNew, updatedAt, published, onPublishedChange, publishExtra, dirty, save, remove, editPath, noun, main, side }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  // Ctrl/Cmd + S saves.
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); form.current?.requestSubmit(); } };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    start(async () => {
      const result = await save().catch(() => ({ error: "Something went wrong. Please try again." }));
      if ("error" in result) { setError(result.error); return; }
      setError("");
      toast(`${noun} ${isNew ? "created" : "updated"}.`);
      if (isNew && result.id && editPath) router.replace(editPath(result.id));
      else router.refresh();
    });
  };
  const destroy = () => start(async () => {
    if (!remove) return;
    const result = await remove();
    if ("error" in result) { setError(result.error); return; }
    toast(`${noun} deleted.`);
    router.push(backHref);
  });

  return <form ref={form} className={c.editor} onSubmit={submit} noValidate>
    <div className={c.editorHead}>
      <Link href={backHref} className={c.back}><Icon name="back" />{backLabel}</Link>
      <div className={c.editorTitle}><h1>{title}</h1>{viewHref && !isNew && <a href={viewHref} target="_blank" rel="noreferrer" className={s.textButton}>View on site<Icon name="external" /></a>}</div>
    </div>
    {error && <p className={c.errorBanner} role="alert">{error}</p>}
    <div className={c.editorGrid}>
      <div className={c.editorMain}>{main}</div>
      <aside className={c.editorSide}>
        <div className={c.publishBox}>
          <h2>Publish</h2>
          {onPublishedChange && <div className={c.statusSwitch} role="radiogroup" aria-label="Status">
            <button type="button" role="radio" aria-checked={!published} className={!published ? c.on : ""} onClick={() => onPublishedChange(false)}>Draft</button>
            <button type="button" role="radio" aria-checked={Boolean(published)} className={published ? c.on : ""} onClick={() => onPublishedChange(true)}>Published</button>
          </div>}
          {publishExtra}
          {updatedAt && <p className={c.meta}>Last saved {shortDate(updatedAt)}{dirty && " · unsaved changes"}</p>}
          {!updatedAt && dirty && <p className={c.meta}>Unsaved changes</p>}
          <button type="submit" className={`${s.primaryButton} ${c.saveButton}`} disabled={pending}><Icon name="check" />{pending ? "Saving…" : isNew ? (published === false ? "Save draft" : "Publish") : "Update"}</button>
          <small className={c.meta}>Tip: press Ctrl + S to save.</small>
          {remove && !isNew && (confirming
            ? <div className={c.confirmDelete}><span>Delete this {noun.toLowerCase()} for good?</span><button type="button" className={s.dangerButton} disabled={pending} onClick={destroy}><Icon name="trash" />Delete</button><button type="button" className={s.textButton} onClick={() => setConfirming(false)}>Keep</button></div>
            : <button type="button" className={s.deleteLink} onClick={() => setConfirming(true)}>Delete {noun.toLowerCase()}</button>)}
        </div>
        {side}
      </aside>
    </div>
  </form>;
}

/** Tracks a form object and whether it differs from what was loaded. */
export function useDraft<T>(initial: T) {
  // Editors are keyed by their saved time, so after a save they remount with the fresh server data as the new baseline.
  const [value, setValue] = useState(initial);
  const [saved] = useState(() => JSON.stringify(initial));
  const current = JSON.stringify(value);
  const update = <K extends keyof T>(key: K, next: T[K]) => setValue((draft) => ({ ...draft, [key]: next }));
  return { value, setValue, update, dirty: current !== saved };
}

export type Tab = { id: string; label: string; content: ReactNode; badge?: number };

/** Tabs for the main editing area. Every panel stays mounted, so switching tabs never loses typing or editor state. */
export function Tabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const keyboard = (event: React.KeyboardEvent, index: number) => {
    const next = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : null;
    if (next === null) return;
    const tab = tabs[(next + tabs.length) % tabs.length];
    setActive(tab.id);
    document.getElementById(`tab-${tab.id}`)?.focus();
  };
  return <div className={c.tabs}>
    <div role="tablist" aria-label={label} className={c.tabList}>{tabs.map((tab, index) => <button key={tab.id} id={`tab-${tab.id}`} type="button" role="tab" aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} onClick={() => setActive(tab.id)} onKeyDown={(event) => keyboard(event, index)}>
      {tab.label}{tab.badge !== undefined && <span>{tab.badge}</span>}
    </button>)}</div>
    {tabs.map((tab) => <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id} className={c.tabPanel}>{tab.content}</div>)}
  </div>;
}

/** Chips for short lists such as a tech stack, with suggestions to pick from. */
export function TagField({ label, hint, value, onChange, suggestions }: { label: string; hint?: string; value: string[]; onChange: (value: string[]) => void; suggestions: string[] }) {
  const [draft, setDraft] = useState("");
  const has = (name: string) => value.some((item) => item.toLowerCase() === name.toLowerCase());
  const add = (name: string) => { const clean = name.trim(); if (clean && !has(clean)) onChange([...value, clean]); setDraft(""); };
  const listId = `tags-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return <div className={c.field}>
    <span>{label}</span>
    <div className={c.tagBox}>
      {value.map((item) => <span key={item} className={c.tag}>{item}<button type="button" aria-label={`Remove ${item}`} onClick={() => onChange(value.filter((current) => current !== item))}><Icon name="close" /></button></span>)}
      <input list={listId} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={value.length ? "Add another…" : "Type and press Enter"} aria-label={`Add to ${label.toLowerCase()}`}
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(draft); } if (event.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1)); }}
        onBlur={() => draft && add(draft)} />
      <datalist id={listId}>{suggestions.filter((name) => !has(name)).map((name) => <option key={name} value={name} />)}</datalist>
    </div>
    {hint && <small>{hint}</small>}
    <div className={c.suggestions}>{suggestions.filter((name) => !has(name)).slice(0, 14).map((name) => <button key={name} type="button" onClick={() => add(name)}><Icon name="plus" />{name}</button>)}</div>
  </div>;
}
