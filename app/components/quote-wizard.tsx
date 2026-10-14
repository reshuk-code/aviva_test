"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import s from "./quote-wizard.module.css";

const services = ["Website design & development", "E-commerce store", "UI / UX design", "Branding & identity", "SEO & digital marketing", "WordPress", "Mobile app", "Something else"];
const budgets = ["Under Rs 50,000", "Rs 50,000 – 1,50,000", "Rs 1,50,000 – 5,00,000", "Rs 5,00,000+", "Not sure yet"];
const timelines = ["As soon as possible", "Within a month", "1 – 3 months", "Flexible"];
const dialCodes = [["+977", "Nepal"], ["+91", "India"], ["+1", "USA / Canada"], ["+44", "United Kingdom"], ["+61", "Australia"], ["+971", "UAE"], ["+974", "Qatar"], ["+966", "Saudi Arabia"], ["+81", "Japan"], ["+82", "South Korea"]];

/** Quote request form. Opens from any element marked `data-quote`; a service name as its value preselects that service. */
export function QuoteWizard() {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [service, setService] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");

  useEffect(() => {
    const trigger = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = event.target instanceof Element ? event.target.closest("[data-quote]") : null;
      if (!source) return;
      event.preventDefault();
      const chosen = source.getAttribute("data-quote");
      if (chosen && services.includes(chosen)) setService(chosen);
      setOpen(true);
    };
    // Capture phase, so the quote form wins over next/link navigating to the fallback page.
    document.addEventListener("click", trigger, true);
    return () => document.removeEventListener("click", trigger, true);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    element.showModal();
    // Start on the first field rather than the close button.
    element.querySelector<HTMLElement>("form select, form input")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; element.close(); };
  }, [open]);

  const close = () => {
    setOpen(false); setError("");
    if (sentTo) { setSentTo(""); setService(""); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const name = data.name?.trim(), email = data.email?.trim(), mobile = data.mobile?.trim();
    const issue = !name ? "Please tell us your name." : !email && !mobile ? "Add a mobile number or an email so we can reply." : email && !/^\S+@\S+\.\S+$/.test(email) ? "That email address doesn’t look right." : "";
    setError(issue);
    if (issue) return;
    setSending(true);
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "Quote request", services: data.service, budget: data.budget, timeline: data.timeline, message: data.message, name, email, phone: mobile ? `${data.dial} ${mobile}` : "", company: data.company }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      setSentTo(name.split(" ")[0]);
      form.current?.reset();
    } catch (failure) {
      setError(failure instanceof Error && failure.message ? failure.message : "We couldn’t send that just now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return <dialog ref={dialog} className={s.panel} aria-labelledby="quote-heading" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    {open && <div className={s.card}>
      <header className={s.top}>
        <span className={s.badge}><Image src="/images/aviva-logo.svg" alt="" width={152} height={85} unoptimized /></span>
        <div>
          <h2 id="quote-heading">Get a Quote</h2>
          <p>Share a few details about your project for review</p>
        </div>
        <button type="button" className={s.close} aria-label="Close quote form" onClick={close}><span /><span /></button>
      </header>

      {sentTo ? <div className={s.done} role="status">
        <span className={s.tick} aria-hidden="true">✓</span>
        <h3>Thank you, {sentTo}.</h3>
        <p>We’ve received your request. Our team will review it and get back to you within one business day.</p>
        <button type="button" className={s.submit} onClick={close}>Done</button>
      </div> : <form ref={form} className={s.form} onSubmit={submit} noValidate>
        <h3>Request your quote</h3>
        <p className={s.intro}>Tell us what you need and how we can reach you. Our team will review your request and discuss scope, pricing, and timelines with you.</p>
        <div className={s.grid}>
          <label className={s.field}><span>Service needed</span><select name="service" value={service} onChange={(event) => setService(event.target.value)}><option value="">Choose a service</option>{services.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={s.field}><span>Estimated budget</span><select name="budget" defaultValue=""><option value="">Choose a budget</option>{budgets.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={s.field}><span>Full name</span><input name="name" autoComplete="name" required /></label>
          <label className={s.field}><span>Email address</span><input name="email" type="email" autoComplete="email" /></label>
          <div className={s.field}><label htmlFor="quote-mobile">Mobile number</label><div className={s.phone}><select name="dial" aria-label="Country code" defaultValue="+977">{dialCodes.map(([code, country]) => <option key={code} value={code}>{code} {country}</option>)}</select><input id="quote-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" /></div></div>
          <label className={s.field}><span>Timeline</span><select name="timeline" defaultValue=""><option value="">Choose a timeline</option>{timelines.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={`${s.field} ${s.wide}`}><span>Project details (optional)</span><textarea name="message" rows={4} placeholder="Goals, pages you need, websites you like…" /></label>
          <input className={s.trap} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </div>
        <p className={s.error} role="alert">{error}</p>
        <button type="submit" className={s.submit} disabled={sending}>{sending ? "Sending…" : "Send quote request"}</button>
      </form>}
    </div>}
  </dialog>;
}
