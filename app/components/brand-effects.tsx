"use client";

import { useEffect } from "react";
import { bindImageTilt } from "./image-tilt";

export function BrandEffects() {
  useEffect(() => {
    const cleanups = Array.from(document.querySelectorAll<HTMLElement>(".cursor-photo, .hero-office, .cursor-portrait, .blog-card")).map(bindImageTilt);
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const light = document.createElement("div");
    light.className = "image-cursor-light";
    light.setAttribute("aria-hidden", "true");
    document.body.append(light);
    let frame = 0;
    let active: HTMLImageElement | null = null;
    let clientX = 0, clientY = 0;

    const hide = () => {
      light.style.opacity = "0";
      active = null;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const paint = () => {
      frame = 0;
      if (!active || !active.isConnected) return hide();
      const bounds = active.getBoundingClientRect();
      const parent = active.parentElement;
      const imageStyle = getComputedStyle(active);
      const parentStyle = parent ? getComputedStyle(parent) : null;
      const clip = parent && parentStyle && [parentStyle.overflow, parentStyle.overflowX, parentStyle.overflowY].some(value => value === "hidden" || value === "clip") ? parent.getBoundingClientRect() : bounds;
      // The alpha mask keeps the highlight inside cutout images as well as photos.
      Object.assign(light.style, {
        left: `${bounds.left}px`, top: `${bounds.top}px`,
        width: `${bounds.width}px`, height: `${bounds.height}px`,
        borderRadius: imageStyle.borderRadius !== "0px" ? imageStyle.borderRadius : parent ? getComputedStyle(parent).borderRadius : "0px",
        maskImage: `url("${active.currentSrc || active.src}")`,
        maskSize: imageStyle.objectFit === "contain" ? "contain" : "cover",
        maskPosition: imageStyle.objectPosition,
        clipPath: `inset(${Math.max(0, clip.top - bounds.top)}px ${Math.max(0, bounds.right - clip.right)}px ${Math.max(0, bounds.bottom - clip.bottom)}px ${Math.max(0, clip.left - bounds.left)}px)`,
        opacity: "1",
      });
      light.style.setProperty("--light-x", `${clientX - bounds.left}px`);
      light.style.setProperty("--light-y", `${clientY - bounds.top}px`);
      light.style.setProperty("--light-radius", `${Math.min(240, Math.max(85, bounds.width * .38))}px`);
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || !pointer.matches || event.pointerType !== "mouse") return hide();
      const target = event.target;
      if (!(target instanceof HTMLImageElement) || target.closest(".logo")) return hide();
      if (!target.complete || target.naturalWidth === 0) return hide();
      // A dialog is in the browser's top layer, so keep its highlight there too.
      const host = target.closest("dialog") ?? document.body;
      if (light.parentElement !== host) host.append(light);
      active = target;
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const visibility = () => {
      document.body.toggleAttribute("data-effects-paused", document.hidden);
      if (document.hidden) hide();
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.toggleAttribute("data-effects-offscreen", !entry.isIntersecting);
    }, { rootMargin: "80px" });
    const animated = document.querySelectorAll(".ambient-motion, .logo");
    animated.forEach(element => observer.observe(element));
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", hide, { passive: true });
    window.addEventListener("scroll", hide, { capture: true, passive: true });
    window.addEventListener("resize", hide, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", hide);
    pointer.addEventListener("change", hide);
    visibility();
    return () => {
      hide();
      light.remove();
      observer.disconnect();
      animated.forEach(element => element.removeAttribute("data-effects-offscreen"));
      document.body.removeAttribute("data-effects-paused");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", hide);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", hide);
      pointer.removeEventListener("change", hide);
    };
  }, []);
  return null;
}
