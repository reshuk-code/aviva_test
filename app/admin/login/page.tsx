import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentAdmin } from "../../lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in | Aviva Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return <LoginForm />;
}
