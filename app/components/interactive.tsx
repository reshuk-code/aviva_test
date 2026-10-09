"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { bindImageTilt } from "./image-tilt";
import { Arrow, Art } from "./design";
export { Header } from "./site-header";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motionPreference.matches || !("IntersectionObserver" in window)) return;

    // Leave content visible until hydration and only prepare offscreen sections.
    if (element.getBoundingClientRect().top < window.innerHeight - 40) return;
    const siblings = Array.from(element.parentElement?.children ?? []);
    element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element), 3) * 75}ms`);
    element.dataset.reveal = "pending";

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        element.dataset.reveal = "visible";
        observer.unobserve(element);
      }
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    observer.observe(element);
    const showImmediately = () => {
      if (motionPreference.matches) { delete element.dataset.reveal; observer.disconnect(); }
    };
    motionPreference.addEventListener("change", showImmediately);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", showImmediately);
      delete element.dataset.reveal;
    };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function ScrollEffects() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const objects = [
      { selector: ".hero-ring", speed: -.1 },
      { selector: ".about-scribble", speed: .045 },
      { selector: ".about-print", speed: -.035 },
      { selector: ".awards-scribble", speed: .05 },
      { selector: ".testimonial-art", speed: -.04 },
    ].flatMap(({ selector, speed }) => Array.from(document.querySelectorAll<HTMLElement>(selector)).map((element) => ({ element, anchor: element.closest("section") ?? element.parentElement ?? element, speed, photograph: false })));
    const photographs = Array.from(document.querySelectorAll<HTMLElement>(".project-image > img, .studio-film > img, .stats-banner > img")).map((element) => ({ element, anchor: element.parentElement ?? element, speed: .025, photograph: true }));
    const targets = [...objects, ...photographs].map((target) => ({ ...target, current: 0, destination: 0, visible: false }));
    const marquee = document.querySelector<HTMLElement>(".marquee-outline");
    const marqueeSection = marquee?.closest("section");
    let marqueeDestination = 0, marqueeCurrent = 0, marqueeVisible = false;
    let frame = 0;
    let dirty = true, lastTime = 0;
    const measure = () => {
      const viewportHeight = window.innerHeight;
      const mobileFactor = window.innerWidth <= 700 ? .4 : 1;
      for (const target of targets) {
        const bounds = target.anchor.getBoundingClientRect();
        target.visible = bounds.bottom >= -100 && bounds.top <= viewportHeight + 100;
        if (!target.visible) continue;
        const distance = viewportHeight / 2 - (bounds.top + bounds.height / 2);
        const limit = target.photograph ? Math.min(32, bounds.height * .019) : 48;
        // A soft bound avoids the abrupt stop of a clamped parallax offset.
        target.destination = limit * Math.tanh(distance * target.speed * mobileFactor / limit);
      }
      if (marqueeSection) {
        const bounds = marqueeSection.getBoundingClientRect();
        marqueeVisible = bounds.bottom > 0 && bounds.top < viewportHeight;
        marqueeDestination = (viewportHeight / 2 - bounds.top) * -.09 * mobileFactor;
      }
      dirty = false;
    };
    const update = (time: number) => {
      frame = 0;
      if (preference.matches || document.hidden) return;
      if (dirty) measure();
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60;
      lastTime = time;
      const blend = 1 - Math.exp(-9 * delta);
      let settling = false;
      for (const target of targets) {
        if (!target.visible) continue;
        const difference = target.destination - target.current;
        target.current = Math.abs(difference) < .05 ? target.destination : target.current + difference * blend;
        if (Math.abs(difference) >= .05) settling = true;
        target.element.style.setProperty("--parallax-y", `${target.current.toFixed(2)}px`);
      }
      if (marquee && marqueeVisible) {
        const difference = marqueeDestination - marqueeCurrent;
        marqueeCurrent = Math.abs(difference) < .05 ? marqueeDestination : marqueeCurrent + difference * blend;
        marquee.style.setProperty("--marquee-x", `${marqueeCurrent.toFixed(2)}px`);
        if (Math.abs(difference) >= .05) settling = true;
      }
      if (settling) frame = window.requestAnimationFrame(update);
      else lastTime = 0;
    };
    const schedule = () => {
      dirty = true;
      if (!frame && !preference.matches && !document.hidden) frame = window.requestAnimationFrame(update);
    };
    const resetMotion = () => {
      if (preference.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        targets.forEach(({ element }) => element.style.removeProperty("--parallax-y"));
        targets.forEach((target) => { target.current = 0; target.destination = 0; });
        marquee?.style.removeProperty("--marquee-x");
        marqueeCurrent = 0;
      } else schedule();
    };
    const visibility = () => {
      shell?.toggleAttribute("data-motion-paused", document.hidden);
      if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else schedule();
    };
    const shell = document.querySelector<HTMLElement>(".site-shell");
    const ambient = document.querySelectorAll<HTMLElement>(".ambient-light, .hero-ring, .marquee-track, .marquee-print, .about-print, .services-print, .collage-symbol, .play-button-art");
    const ambientObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.toggleAttribute("data-motion-paused", !entry.isIntersecting);
    }, { rootMargin: "80px" });
    ambient.forEach((element) => ambientObserver.observe(element));
    const resizer = new ResizeObserver(schedule);
    document.querySelectorAll("main > section, main > .reveal, .hero").forEach((element) => resizer.observe(element));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    preference.addEventListener("change", resetMotion);
    document.addEventListener("visibilitychange", visibility);
    shell?.toggleAttribute("data-motion-paused", document.hidden);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", resetMotion);
      document.removeEventListener("visibilitychange", visibility);
      resizer.disconnect();
      ambientObserver.disconnect();
      ambient.forEach((element) => element.removeAttribute("data-motion-paused"));
      shell?.removeAttribute("data-motion-paused");
      targets.forEach(({ element }) => element.style.removeProperty("--parallax-y"));
      marquee?.style.removeProperty("--marquee-x");
    };
  }, []);
  return null;
}

export function HeroControls() {
  const [slide, setSlide] = useState(0);
  return <><div className={`hero-alternate ${slide === 1 ? "is-active" : ""}`}><Image src="/images/studio-meeting.jpg" alt="Our team at work" fill sizes="69vw" className="object-cover" /></div><div className="hero-controls"><button type="button" aria-label="Previous studio image" onClick={() => setSlide((slide + 1) % 2)}>←</button><button type="button" aria-label="Next studio image" onClick={() => setSlide((slide + 1) % 2)}>→</button></div></>;
}

function Modal({ open, onClose, title, children, className = "" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) { dialog.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = overflow; dialog.close(); }; }
  }, [open]);
  return <dialog ref={ref} aria-label={title} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className={`detail-modal ${className}`}><button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>×</button>{open && children}</dialog>;
}

type Project = { image: string; category: string; title: string; description: string };
export function ProjectCard({ project, showTitle = true }: { project: Project; showTitle?: boolean }) {
  const [open, setOpen] = useState(false);
  const card = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = card.current;
    if (!element) return;
    return bindImageTilt(element);
  }, []);
  return (
    <>
      <button ref={card} type="button" onClick={() => setOpen(true)} className="project-card" aria-label={`View ${project.title}`}>
        <div className="project-image">
          <Image src={`/images/${project.image}.webp`} alt={project.description} fill sizes="(max-width: 700px) 90vw, 42vw" className="object-cover" />
        </div>
        <div className="project-caption">
          <p>{project.category}</p>
          {showTitle && <h3>{project.title}</h3>}
          <span className="art project-arrow" aria-hidden="true">
            <Image src="/images/project-arrow.svg" alt="" fill sizes="29px" className="object-contain" />
          </span>
        </div>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={project.title}>
        <div className="modal-project-image">
          <Image src={`/images/${project.image}.webp`} alt={project.title} fill sizes="80vw" className="object-contain" />
        </div>
        <div className="modal-copy">
          <p className="eyebrow">{project.category}</p>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <a href="mailto:avivanepal@example.com" className="gold-link">Let’s create something together <Arrow /></a>
        </div>
      </Modal>
    </>
  );
}

const reviews = [
  { image: "ellipse-5", name: "Ryan Mitchell", role: "Website design", text: "I have been working with this digital agency for years, and I cannot recommend them enough. Their creative web designs, professional SEO services, and quality graphic solutions, combined with their reliable support, have helped strengthen our online presence." },
  { image: "ellipse-209-1", name: "Sophie Williams", role: "Brand identity", text: "From our very first conversation, the team understood our vision. They brought our brand to life with thoughtful design, beautiful detail, and a website that our customers love to use." },
  { image: "ellipse-4-2", name: "Emma Wilson", role: "Digital strategy", text: "A creative team with an incredible eye for detail. They made every part of the process feel easy, and the result is a distinctive digital experience that has helped our business grow." },
];
export function Testimonials() {
  const [active, setActive] = useState(0);
  const review = reviews[active];
  return <div className="testimonial-panel"><div className="testimonial-avatars">{reviews.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} className={active === index ? "active" : ""} aria-label={`Read ${item.name}'s testimonial`} aria-pressed={active === index}><Art name={item.image} alt={item.name} /></button>)}</div><div className="testimonial-copy" aria-live="polite"><blockquote>{review.text}</blockquote><h3>{review.name}</h3><p>{review.role}</p><div className="testimonial-controls"><button type="button" aria-label="Previous testimonial" onClick={() => setActive((active + 2) % 3)}>‹</button><button type="button" aria-label="Next testimonial" onClick={() => setActive((active + 1) % 3)}>›</button></div></div><Art name="vector-1" className="testimonial-quote" /></div>;
}

type Article = { image: string; date: string; title: string; text: string };
export function BlogCard({ article, hasArrow }: { article: Article; hasArrow: boolean }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className="blog-card" onClick={() => setOpen(true)}><p>{article.date}</p><h3>{article.title}</h3><div className="blog-image"><Image src={`/images/${article.image}.webp`} alt={article.title} fill sizes="(max-width: 700px) 90vw, 28vw" className="object-cover" /></div>{hasArrow && <span className="blog-arrow gold-circle"><Arrow /></span>}</button><Modal open={open} onClose={() => setOpen(false)} title={article.title}><div className="article-modal-image"><Image src={`/images/${article.image}.webp`} alt={article.title} fill sizes="80vw" className="object-cover" /></div><div className="modal-copy"><p className="eyebrow">{article.date} · Insights</p><h2>{article.title}</h2><p>{article.text}</p><a href="mailto:avivanepal@example.com" className="gold-link">Talk to our creative team <Arrow /></a></div></Modal></>;
}

const filmScenes = [{ image: "studio-team.jpg", label: "A little curiosity.", caption: "Inside the Aviva studio" }, { image: "image-192.webp", label: "A different perspective.", caption: "Art, imagination & expression" }, { image: "image-206.webp", label: "Ideas brought to life.", caption: "Design without boundaries" }, { image: "studio-meeting.jpg", label: "Better, together.", caption: "Let’s create your next chapter" }];
export function StudioFilm() {
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open || paused) return;
    const timer = window.setInterval(() => setScene((value) => (value + 1) % filmScenes.length), 4500);
    return () => window.clearInterval(timer);
  }, [open, paused]);
  return <><section className="studio-film" aria-label="Inside the creative studio"><Image src="/images/studio-team.jpg" alt="The team designing digital experiences in our studio" fill sizes="100vw" className="object-cover" /><div className="film-shade" /><button className="play-button play-button-art" type="button" onClick={() => { setScene(0); setPaused(false); setOpen(true); }} aria-label="Play studio visual story"><Image src="/images/play-button.svg" alt="" fill sizes="(max-width: 700px) 96px, 218px" /><span>Play</span></button></section><Modal open={open} onClose={() => setOpen(false)} title="Aviva studio visual story" className="film-modal"><div className={`film-scene ${paused ? "film-paused" : ""}`} key={scene}><Image src={`/images/${filmScenes[scene].image}`} alt={filmScenes[scene].caption} fill sizes="90vw" className="object-cover" /><div className="film-scene-shade" /><div className="film-titles"><p className="eyebrow">{filmScenes[scene].caption}</p><h2>{filmScenes[scene].label}</h2></div></div><div className="film-controls"><button type="button" onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button><div>{filmScenes.map((item, index) => <button key={item.label} type="button" aria-label={`Scene ${index + 1}: ${item.caption}`} aria-pressed={scene === index} className={scene === index ? "selected" : ""} onClick={() => setScene(index)} />)}</div><span>0{scene + 1} / 04</span></div></Modal></>;
}
