"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import p from "../pages.module.css";

const subjects = ["Web Design", "Web Development", "Branding", "SEO", "Something else"];

const icons: Record<string, ReactNode> = {
  name: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.5" /></svg>,
  email: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="m4 6 8 6 8-6" stroke="currentColor" strokeWidth="1.5" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
  message: <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 20 1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
};

/** "Drop us a message" card. Messages are saved by the site's inquiries endpoint. */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "Contact message", ...Object.fromEntries(new FormData(form)) }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error);
      form.reset();
      setStatus("sent");
    } catch (failure) {
      setError(failure instanceof Error && failure.message ? failure.message : "We couldn’t send that just now. Please try again.");
      setStatus("error");
    }
  };
  return <form className={p.form} onSubmit={submit} aria-labelledby="message-heading">
    <span className={p.formRing} aria-hidden="true" />
    <h2 id="message-heading">Drop Us a Message</h2>
    <div className={p.fields}>
      <label className={p.field}>{icons.name}<span>Full Name:</span><input name="name" autoComplete="name" required /></label>
      <label className={p.field}>{icons.email}<span>Email Address:</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className={p.field}>{icons.phone}<span>Phone:</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label className={`${p.field} ${p.select}`}><span>Subject:</span><select name="subject" defaultValue={subjects[0]}>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
      <label className={`${p.field} ${p.message}`}>{icons.message}<span>Message:</span><textarea name="message" rows={4} required /></label>
      <input className={p.trap} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    </div>
    <button type="submit" className={p.send} disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Message"}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6 18 18M18 8v10H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
    <p className={p.formStatus} aria-live="polite">{status === "sent" ? "Thank you. We’ve received your message and will reply within one business day." : status === "error" ? error : ""}</p>
  </form>;
}
