"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Media } from "../../lib/content";
import { deleteMedia, listMedia, updateMedia } from "../actions";
import c from "../cms.module.css";
import s from "../studio.module.css";
import { Icon, Modal, shortDate, useToast } from "./ui";

const size = (bytes: number) => bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
const fileName = (url: string) => url.split("/").pop() ?? url;

async function uploadFile(file: File): Promise<Media> {
  const data = new FormData();
  data.append("file", file);
  const response = await fetch("/api/uploads", { method: "POST", body: data });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Upload failed. Please try again.");
  return { id: result.id, url: result.url, alt: result.alt, width: result.width, height: result.height, bytes: file.size, createdAt: new Date().toISOString() };
}

function UploadButton({ onUploaded, label = "Upload images" }: { onUploaded: (items: Media[]) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState("");
  const upload = async (files: FileList) => {
    const done: Media[] = [];
    for (const [index, file] of [...files].entries()) {
      setState(`Uploading ${index + 1} of ${files.length}…`);
      try { done.push(await uploadFile(file)); } catch (error) { setState(error instanceof Error ? error.message : "Upload failed."); return onUploaded(done); }
    }
    setState("");
    onUploaded(done);
  };
  return <span className={c.uploadButton}>
    <button type="button" className={s.primaryButton} onClick={() => input.current?.click()} disabled={state.startsWith("Uploading")}><Icon name="upload" />{state.startsWith("Uploading") ? state : label}</button>
    {state && !state.startsWith("Uploading") && <small role="alert">{state}</small>}
    <input ref={input} type="file" accept="image/*" multiple hidden onChange={(event) => { if (event.target.files?.length) upload(event.target.files); event.target.value = ""; }} />
  </span>;
}

/** Details panel: preview, alt text (saved to the library), file facts, delete. */
function MediaDetails({ item, onChange, onDelete, children }: { item: Media; onChange: (item: Media) => void; onDelete: (id: number) => void; children?: React.ReactNode }) {
  const [alt, setAlt] = useState(item.alt);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  return <div className={c.mediaDetails}>
    <span className={c.mediaPreview}><Image src={item.url} alt="" fill sizes="320px" className="object-contain" /></span>
    <dl className={c.mediaFacts}><div><dt>File</dt><dd>{fileName(item.url)}</dd></div>{item.width > 0 && <div><dt>Size</dt><dd>{item.width} × {item.height} · {size(item.bytes)}</dd></div>}<div><dt>Added</dt><dd>{shortDate(item.createdAt)}</dd></div></dl>
    <label className={c.field}><span>Alt text</span><textarea rows={2} value={alt} maxLength={200} onChange={(event) => setAlt(event.target.value)} placeholder="Describe the image for screen readers and search engines" /></label>
    <div className={c.inlineActions}>
      <button type="button" className={s.secondaryButton} disabled={pending || alt === item.alt} onClick={() => start(async () => { await updateMedia(item.id, alt); onChange({ ...item, alt }); toast("Alt text saved."); })}>Save alt text</button>
      <a className={s.textButton} href={item.url} target="_blank" rel="noreferrer">Open<Icon name="external" /></a>
    </div>
    {children}
    {confirming ? <button type="button" className={s.dangerButton} disabled={pending} onClick={() => start(async () => { await deleteMedia(item.id); onDelete(item.id); toast("Image removed from the library."); })}><Icon name="trash" />Yes, delete</button>
      : <button type="button" className={s.deleteLink} onClick={() => setConfirming(true)}>Delete from library</button>}
  </div>;
}

function MediaGrid({ items, selected, select }: { items: Media[]; selected?: number; select: (item: Media) => void }) {
  return <ul className={c.mediaGrid}>{items.map((item) => <li key={item.id}><button type="button" className={item.id === selected ? c.mediaSelected : ""} aria-pressed={item.id === selected} onClick={() => select(item)} title={fileName(item.url)}><Image src={item.url} alt={item.alt} fill sizes="160px" className="object-cover" /></button></li>)}</ul>;
}

const matches = (item: Media, query: string) => `${item.url} ${item.alt}`.toLowerCase().includes(query.trim().toLowerCase());

/** Media page: the whole library with upload, search and alt text editing. */
export function MediaManager({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | undefined>(initial[0]?.id);
  const selected = items.find((item) => item.id === selectedId);
  const shown = items.filter((item) => matches(item, query));
  return <section className={`${s.card} ${c.mediaLibrary}`}>
    <div className={c.mediaToolbar}><label className={c.searchField}><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or alt text" aria-label="Search images" /></label><UploadButton onUploaded={(added) => { if (added.length) { setItems((list) => [...added, ...list]); setSelectedId(added[0].id); } }} /></div>
    <div className={c.mediaBody}>
      {shown.length ? <MediaGrid items={shown} selected={selectedId} select={(item) => setSelectedId(item.id)} /> : <div className={s.empty}><Icon name="image" /><h3>No images found</h3><p>Upload an image or try another search.</p></div>}
      {selected && <MediaDetails key={selected.id} item={selected} onChange={(item) => setItems((list) => list.map((current) => current.id === item.id ? item : current))} onDelete={(id) => { setItems((list) => list.filter((current) => current.id !== id)); setSelectedId(undefined); }} />}
    </div>
  </section>;
}

/** Library in a dialog, for choosing an image while editing. */
export function MediaPicker({ close, choose, title = "Choose an image" }: { close: () => void; choose: (item: Media) => void; title?: string }) {
  const [items, setItems] = useState<Media[] | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
  useEffect(() => { listMedia().then(setItems).catch(() => setItems([])); }, []);
  const selected = items?.find((item) => item.id === selectedId);
  const shown = (items ?? []).filter((item) => matches(item, query));
  return <Modal title={title} wide close={close}>
    <div className={c.pickerBody}>
      <div className={c.mediaToolbar}><label className={c.searchField}><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search images" aria-label="Search images" /></label><UploadButton label="Upload" onUploaded={(added) => { if (added.length) { setItems((list) => [...added, ...(list ?? [])]); setSelectedId(added[0].id); } }} /></div>
      <div className={c.mediaBody}>
        {items === null ? <p className={s.cardHint}>Loading library…</p> : <MediaGrid items={shown} selected={selectedId} select={(item) => setSelectedId(item.id)} />}
        {selected ? <MediaDetails key={selected.id} item={selected} onChange={(item) => setItems((list) => (list ?? []).map((current) => current.id === item.id ? item : current))} onDelete={(id) => { setItems((list) => (list ?? []).filter((current) => current.id !== id)); setSelectedId(undefined); }}>
          <button type="button" className={s.primaryButton} onClick={() => { choose(selected); close(); }}><Icon name="check" />Use this image</button>
        </MediaDetails> : <p className={`${s.cardHint} ${c.pickerHint}`}>Select an image to see its details, or upload a new one.</p>}
      </div>
    </div>
  </Modal>;
}

export type ImageChoice = { src: string; alt: string };

/** Featured image box: preview, choose/replace/remove, and alt text for this use of the image. */
export function ImageField({ label, value, onChange, required, round }: { label: string; value: ImageChoice; onChange: (value: ImageChoice) => void; required?: boolean; round?: boolean }) {
  const [picking, setPicking] = useState(false);
  return <div className={c.imageField}>
    <span className={c.fieldLabel}>{label}{required && <i aria-hidden="true"> *</i>}</span>
    <button type="button" className={`${c.imagePreview} ${round ? c.imageRound : ""}`} onClick={() => setPicking(true)} aria-label={value.src ? `Replace ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`}>
      {value.src ? <Image src={value.src} alt="" fill sizes="360px" className="object-cover" /> : <span><Icon name="image" />Choose image</span>}
    </button>
    {value.src && <>
      <div className={c.inlineActions}><button type="button" className={s.textButton} onClick={() => setPicking(true)}>Replace</button><button type="button" className={s.deleteLink} onClick={() => onChange({ src: "", alt: "" })}>Remove</button></div>
      <label className={c.field}><span>Alt text</span><input value={value.alt} maxLength={200} onChange={(event) => onChange({ ...value, alt: event.target.value })} placeholder="Describe the image" /></label>
    </>}
    {picking && <MediaPicker close={() => setPicking(false)} choose={(item) => onChange({ src: item.url, alt: value.src === item.url && value.alt ? value.alt : item.alt })} />}
  </div>;
}
