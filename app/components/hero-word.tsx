"use client";

import { useEffect, useRef } from "react";

const words = ["DEVELOPMENT", "DESIGN", "SOLUTIONS"];

export function HeroWord({ className }: { className: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = root.current, reel = track.current;
    if (!element || !reel) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    let animation: Animation | undefined;
    let index = 0, visible = true;
    const reset = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      animation?.cancel();
      index = 0;
      reel.style.transform = "translateY(0)";
    };
    const sync = () => {
      reset();
      if (reduced.matches || !visible || document.hidden) return;
      timer = setInterval(() => {
        const next = index + 1;
        animation = reel.animate([
          { transform: `translateY(-${index * 25}%)` },
          { transform: `translateY(-${next * 25}%)` },
        ], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
        animation.onfinish = () => {
          index = next % words.length;
          reel.style.transform = `translateY(-${index * 25}%)`;
          animation?.cancel();
        };
      }, 2000);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { reset(); observer.disconnect(); reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <span ref={root} className={`${className} hero-word`}>
    <span className="hero-word-label">DEVELOPMENT</span>
    <span className="hero-word-window" aria-hidden="true"><span ref={track} className="hero-word-track">{[...words, words[0]].map((word, index) => <span key={index}>{word}</span>)}</span></span>
  </span>;
}
