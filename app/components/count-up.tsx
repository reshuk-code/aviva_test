"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const numberStyle: CSSProperties = { gridArea: "1 / 1", font: "inherit", color: "inherit", letterSpacing: "inherit", WebkitTextStroke: "inherit" };

export function CountUp({ value, suffix = "", as: Tag = "strong" }: { value: number; suffix?: string; as?: "strong" | "dt" }) {
  const root = useRef<HTMLElement>(null);
  const animated = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = root.current, number = animated.current;
    if (!element || !number) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, started = false, complete = false;
    const finish = () => { cancelAnimationFrame(frame); number.textContent = `${value}${suffix}`; };
    if (reduced.matches || !("IntersectionObserver" in window)) return;
    number.textContent = `0${suffix}`;
    const observer = new IntersectionObserver(([entry]) => {
      if (complete) return;
      if (!entry.isIntersecting || entry.intersectionRatio < .6) {
        cancelAnimationFrame(frame); started = false; number.textContent = `0${suffix}`; return;
      }
      if (started) return;
      started = true;
      let start = 0;
      const tick = (now: number) => {
        if (element.closest('[data-reveal="pending"]')) { frame = requestAnimationFrame(tick); return; }
        if (!start) start = now;
        const progress = Math.min((now - start) / 1800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = `${Math.round(value * eased)}${suffix}`;
        if (progress < 1) frame = requestAnimationFrame(tick);
        else { complete = true; observer.disconnect(); }
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: [0, .6], rootMargin: "-85px 0px -60px 0px" });
    observer.observe(element);
    const preference = () => { if (reduced.matches) { observer.disconnect(); finish(); } };
    reduced.addEventListener("change", preference);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); reduced.removeEventListener("change", preference); };
  }, [value, suffix]);

  return <Tag ref={root as React.RefObject<HTMLElement & HTMLDListElement>} className="count-up" style={{ display: "inline-grid", fontVariantNumeric: "tabular-nums" }}>
    <span style={{ ...numberStyle, opacity: 0 }}>{value}{suffix}</span>
    <span ref={animated} aria-hidden="true" style={numberStyle}>{value}{suffix}</span>
  </Tag>;
}
