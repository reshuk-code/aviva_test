"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/** Thin brand-orange progress bar: starts when an internal link is followed and completes when the new route renders. */
export function TopLoader() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const bar = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const timers = useRef<number[]>([]);

  const clear = () => { timers.current.forEach(window.clearTimeout); timers.current = []; };
  const later = (callback: () => void, delay: number) => { timers.current.push(window.setTimeout(callback, delay)); };
  const show = (progress: number) => {
    const element = bar.current;
    if (!element) return;
    element.classList.toggle("is-active", progress > 0);
    element.style.setProperty("--progress", String(progress / 100));
  };
  const finish = () => {
    if (!loading.current) return;
    loading.current = false;
    clear();
    show(100);
    later(() => bar.current?.classList.remove("is-active"), 300);
    later(() => bar.current?.style.setProperty("--progress", "0"), 700);
  };

  useEffect(() => {
    const start = () => {
      clear();
      loading.current = true;
      show(8);
      // Creep towards 90% so the bar keeps moving on slow connections without ever claiming to be finished.
      const trickle = (value: number) => later(() => { const next = value + (90 - value) * .18; show(next); trickle(next); }, 280);
      trickle(8);
      later(finish, 12000);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.closest("[data-quote]")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    const submit = (event: SubmitEvent) => { if (event.target instanceof HTMLFormElement && event.target.method === "get") start(); };
    // Capture phase: next/link cancels the click before it would bubble up to the document.
    document.addEventListener("click", click, true);
    document.addEventListener("submit", submit);
    return () => { document.removeEventListener("click", click, true); document.removeEventListener("submit", submit); clear(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the handlers only touch refs
  }, []);

  // The new route has rendered.
  useEffect(finish, [pathname, search]);

  return <div ref={bar} className="top-loader" aria-hidden="true"><span /></div>;
}
