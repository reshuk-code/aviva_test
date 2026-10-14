"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Settings } from "../../lib/content";
import { changePassword, saveSettings } from "../actions";
import c from "../cms.module.css";
import s from "../studio.module.css";
import { Field, Panel, useDraft } from "./editor";
import { ImageField } from "./media";
import { Icon, useToast } from "./ui";

export function SettingsForm({ settings }: { settings: Settings }) {
  const { value: v, update, dirty } = useDraft(settings);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    start(async () => {
      const result = await saveSettings(v);
      if ("error" in result) return setError(result.error);
      setError(""); toast("Settings saved. The website is updated."); router.refresh();
    });
  };
  const input = (key: keyof Settings, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => <input value={v[key]} onChange={(event) => update(key, event.target.value)} {...props} />;
  return <form className={c.editor} onSubmit={submit}>
    <div className={c.editorHead}><div className={c.editorTitle}><h1>Settings</h1></div></div>
    {error && <p className={c.errorBanner} role="alert">{error}</p>}
    <div className={c.editorGrid}>
      <div className={c.editorMain}>
        <Panel title="Site identity &amp; SEO">
          <Field label="Site name" hint="Used in share previews.">{input("siteName", { maxLength: 120 })}</Field>
          <Field label="Website address" hint="Your live domain, e.g. https://avivanepal.com. Used for canonical links and the sitemap.">{input("siteUrl", { maxLength: 200, placeholder: "https://", type: "url" })}</Field>
          <Field label="Title suffix" hint={`Added after page titles, e.g. “Blog${v.titleSuffix}”.`}>{input("titleSuffix", { maxLength: 60 })}</Field>
          <Field label="Default meta description" count={v.defaultDescription.length} max={160}><textarea rows={3} value={v.defaultDescription} maxLength={320} onChange={(event) => update("defaultDescription", event.target.value)} /></Field>
          <ImageField label="Default share image" value={{ src: v.defaultImage, alt: "" }} onChange={(image) => update("defaultImage", image.src)} />
        </Panel>
        <Panel title="Contact details">
          <Field label="Address">{input("address", { maxLength: 200 })}</Field>
          <Field label="Email">{input("email", { maxLength: 120, type: "email" })}</Field>
          <Field label="Phone">{input("phone", { maxLength: 40 })}</Field>
          <Field label="Mobile numbers" hint="Separate numbers with commas.">{input("mobiles", { maxLength: 120 })}</Field>
          <Field label="WhatsApp" hint="With country code, e.g. +9779851001237.">{input("whatsapp", { maxLength: 40 })}</Field>
        </Panel>
        <Panel title="Social links">
          <Field label="Facebook">{input("facebook", { maxLength: 300, type: "url", placeholder: "https://facebook.com/…" })}</Field>
          <Field label="Instagram">{input("instagram", { maxLength: 300, type: "url", placeholder: "https://instagram.com/…" })}</Field>
          <Field label="LinkedIn">{input("linkedin", { maxLength: 300, type: "url", placeholder: "https://linkedin.com/…" })}</Field>
        </Panel>
      </div>
      <aside className={c.editorSide}>
        <div className={c.publishBox}><h2>Save</h2>{dirty && <p className={c.meta}>Unsaved changes</p>}<button className={`${s.primaryButton} ${c.saveButton}`} type="submit" disabled={pending}><Icon name="check" />{pending ? "Saving…" : "Save settings"}</button></div>
        <PasswordPanel />
      </aside>
    </div>
  </form>;
}

function PasswordPanel() {
  const [values, setValues] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const change = () => {
    if (values.next !== values.confirm) return setError("The new passwords don’t match.");
    start(async () => {
      const result = await changePassword(values.current, values.next);
      if ("error" in result) return setError(result.error);
      setError(""); setValues({ current: "", next: "", confirm: "" }); toast("Password changed.");
    });
  };
  const field = (key: keyof typeof values, label: string, autoComplete: string) => <Field label={label}><input type="password" value={values[key]} autoComplete={autoComplete} onChange={(event) => setValues({ ...values, [key]: event.target.value })} /></Field>;
  return <Panel title="Your password">
    {field("current", "Current password", "current-password")}
    {field("next", "New password", "new-password")}
    {field("confirm", "Confirm new password", "new-password")}
    {error && <p className={s.formError} role="alert">{error}</p>}
    <button type="button" className={s.secondaryButton} disabled={pending || !values.current || values.next.length < 10} onClick={change}><Icon name="lock" />Change password</button>
    <p className={c.hint}>At least 10 characters.</p>
  </Panel>;
}
