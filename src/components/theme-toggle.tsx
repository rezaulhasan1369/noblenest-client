"use client";
import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => { try { if (!localStorage.getItem("noblenest-theme")) document.documentElement.dataset.theme = media.matches ? "dark" : "light"; } catch {} };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return <button type="button" className="theme-toggle" aria-label="Toggle color theme" title="Toggle light and dark theme" onClick={() => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("noblenest-theme", theme); } catch {}
  }}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" /><path d="M12 5v14a7 7 0 0 0 0-14Z" fill="currentColor" /></svg></button>;
}
