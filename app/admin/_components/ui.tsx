"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import s from "../studio.module.css";

export type IconName = "grid" | "folder" | "article" | "people" | "mail" | "settings" | "arrow" | "chevron" | "plus" | "search" | "bell" | "close" | "menu" | "check" | "edit" | "globe" | "chart" | "up" | "down" | "upload" | "trash" | "lock" | "layers" | "image" | "file" | "back" | "external" | "bold" | "italic" | "underline" | "strike" | "link" | "list" | "ordered" | "quote" | "h2" | "h3" | "undo" | "redo" | "unlink" | "code" | "rule";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    folder: <path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    article: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    settings: <><path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 2 3h3l1-3 3-1 2-3-2-2 1-3-2-3-3 1-2-3H9Z" /><circle cx="12" cy="12" r="3" /></>,
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <path d="m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    chart: <path d="M4 3v17h17M8 15l4-5 4 2 5-6" />,
    up: <path d="m6 15 6-6 6 6" />,
    down: <path d="m6 9 6 6 6-6" />,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
    trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5-9 8" /></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M14 3v6h6" /></>,
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
    bold: <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7V5Zm0 7h7a3.5 3.5 0 0 1 0 7H7v-7Z" />,
    italic: <path d="M10 5h8M6 19h8M14 5l-4 14" />,
    underline: <path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />,
    strike: <path d="M4 12h16M16 6.5C15 5 13.6 4.5 12 4.5c-2.5 0-4 1.3-4 3.2 0 1.3.8 2.3 2.4 2.9M8 17.5c1 1.4 2.4 2 4.2 2 2.6 0 4.3-1.3 4.3-3.4 0-.8-.2-1.5-.7-2.1" />,
    link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
    unlink: <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7M4 4l16 16" />,
    list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
    ordered: <path d="M10 6h10M10 12h10M10 18h10M4 5h1.5v4M4 9h3M4 14.5c.4-.6 1-1 1.7-1 .8 0 1.3.5 1.3 1.2 0 1.3-3 2-3 3.8h3" />,
    quote: <path d="M7 17c-2 0-3-1.5-3-3.5C4 10 6 7.5 9 6.5M17 17c-2 0-3-1.5-3-3.5 0-3.5 2-6 5-7M4 13.5h5v4H4zM14 13.5h5v4h-5z" />,
    h2: <path d="M4 6v12M12 6v12M4 12h8M15 10c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.3 0 2.2-5 3.2-5 6.7h5" />,
    h3: <path d="M4 6v12M12 6v12M4 12h8M15.5 9h4l-2.5 3c1.5 0 2.7.9 2.7 2.5S18.5 17.5 17 17.5c-1 0-1.8-.4-2.3-1.2" />,
    undo: <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
    redo: <path d="m15 14 5-5-5-5M20 9H9a5 5 0 0 0 0 10h3" />,
    code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />,
    rule: <path d="M3 12h18" />,
  };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Status({ published, label }: { published: boolean; label?: string }) {
  return <span className={`${s.status} ${published ? s.published : s.draft}`}><span />{label ?? (published ? "Published" : "Draft")}</span>;
}

export function Modal({ title, wide, children, close }: { title: string; wide?: boolean; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog className={`${s.modal} ${wide ? s.modalWide : ""}`} ref={ref} aria-labelledby="admin-dialog-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    <div className={s.modalHeading}><div><span className={s.overline}>AVIVA STUDIO</span><h2 id="admin-dialog-title">{title}</h2></div><button type="button" className={s.iconButton} aria-label="Close dialog" onClick={close}><Icon name="close" /></button></div>
    {children}
  </dialog>;
}

const ToastContext = createContext<(message: string) => void>(() => undefined);
export const useToast = () => useContext(ToastContext);

/** Short confirmation messages ("Saved") shown in the corner of every admin page. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const show = useCallback((next: string) => setMessage(next), []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  return <ToastContext.Provider value={show}>
    {children}
    {message && <div className={s.toast} role="status"><span><Icon name="check" /></span>{message}<button type="button" aria-label="Dismiss notification" onClick={() => setMessage("")}><Icon name="close" /></button></div>}
  </ToastContext.Provider>;
}

export { dateTime, initials, shortDate } from "./format";
