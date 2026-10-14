"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { Fingerprint } from "../../components/design";
import { login } from "../actions";
import s from "../studio.module.css";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, "");
  return <main className={`${s.shell} ${s.login}`}>
    <form className={s.loginCard} action={action}>
      <Fingerprint className={s.loginPrint} />
      <Link href="/" className={s.loginLogo} aria-label="Aviva home"><Image src="/images/aviva-logo.svg" alt="Aviva Web Technology" width={152} height={85} unoptimized /></Link>
      <span className={s.overline}>ADMIN STUDIO</span>
      <h1>Sign in</h1>
      <p className={s.cardHint}>Manage projects, blog posts and inquiries.</p>
      <label>Email<input name="email" type="email" required autoComplete="username" autoFocus /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      <p className={s.formError} role="alert">{error}</p>
      <button className={s.primaryButton} type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  </main>;
}
