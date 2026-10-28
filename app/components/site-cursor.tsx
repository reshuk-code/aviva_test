"use client";

import { useEffect } from "react";

export function SiteCursor() {
  useEffect(() => {
    const allowed = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const root = document.documentElement;
    const cursor = document.createElement("div");
    cursor.className = "aviva-cursor";
    cursor.setAttribute("aria-hidden", "true");
    const dot = document.createElement("span"), ring = document.createElement("span");
    dot.className = "aviva-cursor-dot"; ring.className = "aviva-cursor-ring";
    cursor.append(ring, dot); document.body.append(cursor);
    let x = 0, y = 0, ringX = 0, ringY = 0, frame = 0, last = 0, shown = false;
    const hide = () => {
      shown = false; cancelAnimationFrame(frame); frame = 0;
      cursor.removeAttribute("data-visible"); cursor.removeAttribute("data-pressed");
      root.classList.remove("aviva-cursor-active");
    };
    const paint = (now: number) => {
      const blend = 1 - Math.exp(-18 * Math.min((now - last) / 1000 || 1 / 60, .05)); last = now;
      ringX += (x - ringX) * blend; ringY += (y - ringY) * blend;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
      frame = Math.abs(x - ringX) + Math.abs(y - ringY) > .1 ? requestAnimationFrame(paint) : 0;
    };
    const move = (event: PointerEvent) => {
      const target = event.target;
      // The admin panel keeps the normal system cursor.
      if (!allowed.matches || event.pointerType !== "mouse" || !(target instanceof Element) || /^\/admin(\/|$)/.test(location.pathname)) return hide();
      if (target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),iframe,[disabled]')) return hide();
      const host = target.closest("dialog[open]") ?? document.body;
      if (cursor.parentElement !== host) host.append(cursor);
      x = event.clientX; y = event.clientY;
      if (!shown) { ringX = x; ringY = y; last = performance.now(); }
      shown = true;
      cursor.dataset.visible = "true";
      cursor.dataset.mode = target.closest('a,button,[role="button"]') ? "link" : target.closest('img,canvas,.cursor-photo') ? "image" : "default";
      root.classList.add("aviva-cursor-active");
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const press = () => { if (shown) cursor.dataset.pressed = "true"; };
    const release = () => cursor.removeAttribute("data-pressed");
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    allowed.addEventListener("change", hide);
    return () => {
      hide(); cursor.remove();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", press); document.removeEventListener("pointerup", release);
      document.removeEventListener("keydown", keyboard); document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", hide); allowed.removeEventListener("change", hide);
    };
  }, []);
  return null;
}
