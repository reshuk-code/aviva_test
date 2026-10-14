"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "../../components/design";
import type { Admin } from "../../lib/auth";
import { logout } from "../actions";
import s from "../studio.module.css";
import { Icon, initials, ToastProvider, type IconName } from "./ui";

const content: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Pages", href: "/admin/pages", icon: "file" },
  { label: "Services", href: "/admin/services", icon: "layers" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Blog posts", href: "/admin/posts", icon: "article" },
  { label: "Team", href: "/admin/team", icon: "people" },
  { label: "Media", href: "/admin/media", icon: "image" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "mail" },
];

const titles: Record<string, string> = Object.fromEntries([...content, { label: "Settings", href: "/admin/settings" }].map((item) => [item.href, item.label]));

export function Shell({ admin, unread, children }: { admin: Admin; unread: number; children: ReactNode }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // The drawer belongs to the page it was opened on, so following a link closes it.
  const open = openPath === pathname;
  const name = admin.name || admin.email.split("@")[0];
  const active = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  const section = content.find((item) => item.href !== "/admin" && active(item.href)) ?? (pathname.startsWith("/admin/settings") ? { label: "Settings", href: "/admin/settings" } : { label: "Dashboard", href: "/admin" });
  const nested = pathname !== section.href;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenPath(null); };
    const desktop = window.matchMedia("(min-width: 981px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpenPath(null); };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("keydown", close); desktop.removeEventListener("change", closeOnDesktop); document.body.style.overflow = previousOverflow; };
  }, [open]);

  const link = (item: { label: string; href: string; icon: IconName }) => <Link key={item.href} href={item.href} className={active(item.href) ? s.navActive : ""} aria-current={pathname === item.href ? "page" : undefined}>
    <Icon name={item.icon} /><span>{item.label}</span>{item.href === "/admin/inquiries" && unread > 0 && <span className={s.navCount}>{unread}</span>}
  </Link>;

  return <ToastProvider><div className={s.shell}>
    <a className={s.skipLink} href="#admin-content">Skip to content</a>
    {open && <button className={s.sidebarBackdrop} aria-label="Close navigation" onClick={() => setOpenPath(null)} />}
    <aside className={`${s.sidebar} ${open ? s.sidebarOpen : ""}`} aria-label="Admin sidebar" id="admin-navigation">
      <button className={`${s.iconButton} ${s.sidebarClose}`} aria-label="Close sidebar" onClick={() => setOpenPath(null)}><Icon name="close" /></button>
      <div className={s.brand}><Logo href="/admin" /><span>ADMIN STUDIO</span></div>
      <nav className={s.navigation} aria-label="Content">{content.map(link)}</nav>
      <nav className={s.navigation} aria-label="Preferences">{link({ label: "Settings", href: "/admin/settings", icon: "settings" })}<a href="/" target="_blank" rel="noreferrer"><Icon name="external" /><span>View website</span></a></nav>
      <div className={s.sidebarBottom}><div className={s.profile}><span className={s.avatar}>{initials(name)}</span><div>{name}<small>{admin.email}</small></div><form action={logout}><button className={s.signOut} type="submit">Sign out</button></form></div></div>
    </aside>

    <div className={s.mainShell} inert={open}>
      <header className={s.topbar}>
        <div className={s.breadcrumb}>
          <button className={`${s.iconButton} ${s.menuButton}`} aria-label="Open navigation" aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpenPath(pathname)}><Icon name="menu" /></button>
          {nested ? <nav aria-label="Breadcrumb" className={s.crumbs}><Link href={section.href}>{titles[section.href]}</Link><Icon name="chevron" /><strong>{pathname.endsWith("/new") ? "Add new" : "Edit"}</strong></nav> : <strong>{section.label}</strong>}
        </div>
        <div className={s.topbarActions}>
          <Link className={s.notificationButton} href="/admin/inquiries" aria-label={`Inquiries, ${unread} unread`}><Icon name="bell" />{unread > 0 && <span />}</Link>
          <span className={s.topAvatar} aria-label={name}>{initials(name)}</span>
        </div>
      </header>
      <main className={s.main} id="admin-content">
        {children}
        <footer className={s.footer}>Aviva Admin</footer>
      </main>
    </div>
  </div></ToastProvider>;
}
