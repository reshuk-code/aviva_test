"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Arrow } from "./design";
import s from "./quote-wizard.module.css";

const whatsapp = "9779851001237";
const email = "avivanepal@example.com";
const services = ["Website design & development", "E-commerce store", "UI / UX design", "Branding & identity", "SEO & digital marketing", "WordPress", "Mobile app", "Something else"];
const budgets = ["Under Rs 50,000", "Rs 50,000 – 1,50,000", "Rs 1,50,000 – 5,00,000", "Rs 5,00,000+", "Not sure yet"];
const timelines = ["As soon as possible", "Within a month", "1 – 3 months", "Flexible"];
const steps = ["What can we help you with?", "Budget and timeline", "Tell us about the project", "Where can we reach you?"];

/** Opens from any element marked `data-quote` and walks the visitor through a short brief. */
export function QuoteWizard() {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [sentVia, setSentVia] = useState("");

  useEffect(() => {
    const trigger = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element) || !event.target.closest("[data-quote]")) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", trigger);
    return () => document.removeEventListener("click", trigger);
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; element.close(); };
  }, [open]);

  // Move focus to the new question so keyboard and screen-reader users follow each step.
  useEffect(() => { if (open) heading.current?.focus(); }, [open, step, sentVia]);

  const close = () => {
    setOpen(false); setError("");
    if (sentVia) { setStep(0); setChosen([]); setBudget(""); setTimeline(""); setDetails(""); setName(""); setPhone(""); setMail(""); setSentVia(""); }
  };
  const toggle = (service: string) => { setError(""); setChosen(chosen.includes(service) ? chosen.filter((item) => item !== service) : [...chosen, service]); };
  const problem = () => {
    if (step === 0 && !chosen.length) return "Pick at least one thing we can help with.";
    if (step === 3 && !name.trim()) return "Please tell us your name.";
    if (step === 3 && !phone.trim() && !mail.trim()) return "Add a phone number or an email so we can reply.";
    if (step === 3 && mail.trim() && !/^\S+@\S+\.\S+$/.test(mail.trim())) return "That email address doesn’t look right.";
    return "";
  };
  const next = (event: FormEvent) => {
    event.preventDefault();
    const issue = problem();
    setError(issue);
    if (!issue && step < steps.length - 1) setStep(step + 1);
  };
  const brief = () => {
    const line = (label: string, value: string) => value.trim() ? [`${label}: ${value.trim()}`] : [];
    return ["Hello Aviva, I’d like a quote.", "", ...line("Services", chosen.join(", ")), ...line("Budget", budget), ...line("Timeline", timeline), ...line("Details", details), "", ...line("Name", name), ...line("Phone", phone), ...line("Email", mail)].join("\n");
  };
  const send = (channel: "WhatsApp" | "email") => {
    const issue = problem();
    setError(issue);
    if (issue) return;
    if (channel === "WhatsApp") window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(brief())}`, "_blank", "noopener");
    else window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Quote request from ${name.trim()}`)}&body=${encodeURIComponent(brief())}`;
    setSentVia(channel);
  };

  return <dialog ref={dialog} className={s.panel} aria-labelledby="quote-heading" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
    {open && <div className={s.sheet}>
      <header className={s.top}>
        <p className={s.eyebrow}>Get a quote</p>
        <button type="button" className={s.close} aria-label="Close quote form" onClick={close}><span /><span /></button>
      </header>
      {sentVia ? <div className={s.done} key="done">
        <span className={s.tick} aria-hidden="true">✓</span>
        <h2 id="quote-heading" ref={heading} tabIndex={-1}>Almost there, {name.trim().split(" ")[0]}.</h2>
        <p>{sentVia === "WhatsApp" ? "Your brief is ready in WhatsApp. Press send there and it comes straight to our team." : "Your brief is ready in your email app. Press send there and it comes straight to our team."}</p>
        <div className={s.doneActions}>
          <button type="button" className={s.primary} onClick={close}>Done</button>
          <button type="button" className={s.ghost} onClick={() => setSentVia("")}>Back to my brief</button>
        </div>
      </div> : <form className={s.form} onSubmit={next} noValidate>
        <div className={s.progress} role="progressbar" aria-label="Quote form progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1}><span style={{ width: `${(step + 1) / steps.length * 100}%` }} /></div>
        <div className={s.body} key={step}>
          <p className={s.count}>Step {step + 1} of {steps.length}</p>
          <h2 id="quote-heading" ref={heading} tabIndex={-1}>{steps[step]}</h2>
          {step === 0 && <><p className={s.hint}>Choose everything that applies.</p><div className={s.chips}>{services.map((service) => <button key={service} type="button" className={s.chip} aria-pressed={chosen.includes(service)} onClick={() => toggle(service)}>{service}</button>)}</div></>}
          {step === 1 && <><p className={s.hint}>Both are optional. A rough idea helps us suggest the right approach.</p>
            <fieldset className={s.group}><legend>Budget</legend><div className={s.chips}>{budgets.map((item) => <button key={item} type="button" className={s.chip} aria-pressed={budget === item} onClick={() => setBudget(budget === item ? "" : item)}>{item}</button>)}</div></fieldset>
            <fieldset className={s.group}><legend>Timeline</legend><div className={s.chips}>{timelines.map((item) => <button key={item} type="button" className={s.chip} aria-pressed={timeline === item} onClick={() => setTimeline(timeline === item ? "" : item)}>{item}</button>)}</div></fieldset></>}
          {step === 2 && <><p className={s.hint}>Optional. Goals, pages you need, sites you like, anything useful.</p><label className={s.field}><span>Project details</span><textarea rows={7} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="We run a travel agency and need a new booking website…" /></label></>}
          {step === 3 && <><p className={s.hint}>We only use these to reply to your request.</p>
            <label className={s.field}><span>Your name</span><input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} /></label>
            <label className={s.field}><span>Phone or WhatsApp</span><input type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => { setPhone(event.target.value); setError(""); }} /></label>
            <label className={s.field}><span>Email</span><input type="email" autoComplete="email" value={mail} onChange={(event) => { setMail(event.target.value); setError(""); }} /></label></>}
          <p className={s.error} role="alert">{error}</p>
        </div>
        <footer className={s.actions}>
          {step > 0 && <button type="button" className={s.ghost} onClick={() => { setError(""); setStep(step - 1); }}>Back</button>}
          {step < steps.length - 1 ? <button type="submit" className={s.primary}>Continue<Arrow /></button> : <>
            <button type="button" className={s.primary} onClick={() => send("WhatsApp")}>Send on WhatsApp<Arrow /></button>
            <button type="button" className={s.secondary} onClick={() => send("email")}>Send by email</button>
          </>}
        </footer>
      </form>}
    </div>}
  </dialog>;
}
