"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const storageKey = "aviva-theme";
let sessionPreference: Theme | null = null;

function savedTheme(): Theme | null {
  if (sessionPreference) return sessionPreference;
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.dispatchEvent(new Event("aviva:theme-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("aviva:theme-change", callback);
  return () => window.removeEventListener("aviva:theme-change", callback);
}

function snapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeController() {
  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const synchronize = () => applyTheme(savedTheme() ?? (system.matches ? "dark" : "light"));
    const systemChanged = () => { if (!savedTheme()) synchronize(); };
    const storageChanged = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) { sessionPreference = null; synchronize(); }
    };
    synchronize();
    system.addEventListener("change", systemChanged);
    window.addEventListener("storage", storageChanged);
    return () => {
      system.removeEventListener("change", systemChanged);
      window.removeEventListener("storage", storageChanged);
    };
  }, []);
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "dark" as Theme);
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const toggle = () => {
    const next = snapshot() === "dark" ? "light" : "dark";
    sessionPreference = next;
    try { localStorage.setItem(storageKey, next); } catch { /* Keep the choice for this session when storage is unavailable. */ }
    applyTheme(next);
  };

  return <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={toggle}>
    <svg className="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>
    <svg className="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.6 14.5A8.8 8.8 0 0 1 9.5 3.4a8.8 8.8 0 1 0 11.1 11.1Z" /></svg>
  </button>;
}
