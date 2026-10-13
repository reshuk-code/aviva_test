"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Arrow, Logo } from "./design";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Our works", href: "#projects" },
  { label: "Get quote", href: "mailto:avivanepal@example.com?subject=Project%20quote", quote: true },
  { label: "Contact", href: "#contact" },
];

const primaryLinks = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
];

const linkGroups = [
  { label: "Design & development", links: [
    { label: "Web Design", href: "#services" },
    { label: "Web Development", href: "#services" },
    { label: "UI / UX Design", href: "#services" },
    { label: "WordPress", href: "#services" },
  ] },
  { label: "Brand & strategy", links: [
    { label: "Brand Identity", href: "#services" },
    { label: "Marketing Campaigns", href: "#services" },
    { label: "Creative Consulting", href: "#services" },
    { label: "Digital Strategy", href: "#services" },
  ] },
  { label: "Explore Aviva", links: [
    { label: "Selected Projects", href: "#projects" },
    { label: "Why Aviva", href: "#why-us" },
    { label: "Latest Insights", href: "#blog" },
    { label: "About the Studio", href: "#about" },
  ] },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreScroll = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 80);
      setShowTop(window.scrollY > 500);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const menu = dialog.current;
    if (!open || !menu) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const stableGutter = getComputedStyle(document.documentElement).scrollbarGutter.includes("stable");
    const padding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.overflow = "hidden";
    if (scrollbar > 0 && !stableGutter) body.style.paddingRight = `${padding + scrollbar}px`;
    restoreScroll.current = () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreScroll.current = undefined;
    };
    menu.showModal();
    menu.scrollTop = 0;
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      restoreScroll.current?.();
      if (menu.open) menu.close();
    };
  }, [open]);

  const closeMenu = () => {
    restoreScroll.current?.();
    dialog.current?.close();
    setOpen(false);
  };

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const href = event.currentTarget.getAttribute("href");
    closeMenu();
    if (!href?.startsWith("#")) return;
    // Preserve normal anchor navigation, then give keyboard users the destination.
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      }
      target.focus({ preventScroll: true });
    });
  };

  return (
    <><header className={`header${scrolled ? " header-scrolled" : ""}`}>
      <div className="header-brand"><Logo /></div>
      <span className="header-tagline">The team behind your team<span>- Since 2007</span></span>
      <nav aria-label="Main navigation" className="navigation">
        {navigation.map((link) => <a key={link.label} href={link.href} data-quote={link.quote ? "" : undefined}>{link.label}</a>)}
      </nav>
      <div className="header-actions"><button type="button" className="menu-button" aria-label="Open navigation" aria-haspopup="dialog" aria-controls="fullscreen-navigation" aria-expanded={open} onClick={() => setOpen(true)}>
        {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
      </button></div>

      <dialog ref={dialog} id="fullscreen-navigation" className="fullscreen-menu" aria-label="Aviva navigation" onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClose={() => { if (!dialog.current?.open) setOpen(false); }} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const links = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <div className="fullscreen-menu-inner">
          <div className="fullscreen-menu-header">
            <Logo onClick={navigate} />
            <div className="fullscreen-menu-actions"><button ref={closeButton} type="button" className="fullscreen-menu-close" aria-label="Close navigation" onClick={closeMenu}><span /><span /></button></div>
          </div>

          <nav className="fullscreen-menu-body" aria-label="Full-screen navigation">
            <div className="fullscreen-menu-primary">
              {primaryLinks.map((link, index) => <a key={link.label} href={link.href} className={index === 0 ? "menu-featured" : ""} onClick={navigate}><span>{link.label}</span><Arrow /></a>)}
            </div>
            <div className="fullscreen-menu-groups">
              {linkGroups.map((group) => <div key={group.label} className="fullscreen-menu-group"><h2>{group.label}</h2>{group.links.map((link) => <a key={link.label} href={link.href} onClick={navigate}>{link.label}</a>)}</div>)}
            </div>
          </nav>

          <div className="fullscreen-menu-footer">
            <p>Independent minds.<br /><span>Extraordinary digital experiences.</span></p>
            <div className="fullscreen-menu-contact">
              <a href="mailto:avivanepal@example.com" onClick={navigate}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="m4 6 8 6 8-6" stroke="currentColor" strokeWidth="1.4" /></svg>avivanepal@example.com</a>
              <a className="fullscreen-menu-project" href="mailto:avivanepal@example.com?subject=New%20project" onClick={navigate}>Let’s start a project <Arrow /></a>
            </div>
          </div>
        </div>
      </dialog>
    </header>
    <button type="button" className={`back-to-top${showTop && !open ? " is-visible" : ""}`} aria-label="Back to top" tabIndex={showTop && !open ? 0 : -1} aria-hidden={!showTop || open} onClick={() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
      document.querySelector<HTMLAnchorElement>(".header-brand .logo")?.focus({ preventScroll: true });
    }}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/></svg><span>TOP</span></button></>
  );
}
