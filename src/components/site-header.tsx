"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { SessionControls } from "@/components/session-controls";
import { getPublicNavigation, UNAVAILABLE_SESSION, type HeaderSession } from "@/lib/header-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function SiteHeader({ session = UNAVAILABLE_SESSION, upcomingEventsHref, home = true }: { session?: HeaderSession; upcomingEventsHref?: string; home?: boolean }) {
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const selectedAnchor = useRef<HTMLElement | null>(null);
  const navigation = getPublicNavigation(upcomingEventsHref).map(item => ({ ...item, href: item.href?.startsWith("#") && !home ? `/${item.href}` : item.href }));

  function closeMenu() { dialogRef.current?.close(); }

  useEffect(() => { dialogRef.current?.close(); }, [session.status]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (media.matches) dialogRef.current?.close(); };
    media.addEventListener("change", onResize);
    return () => {
      media.removeEventListener("change", onResize);
      if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function onMenuClose() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    triggerRef.current?.setAttribute("aria-expanded", "false");
    selectedAnchor.current?.focus({ preventScroll: true });
    selectedAnchor.current = null;
  }

  return (
    <header className={`site-header${scrolled || !home ? " is-scrolled" : ""}`}>
      <div className="header-inner content-width">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item => item.href
            ? <Link key={item.id} href={item.href} aria-current={item.id === "home" && home ? "page" : undefined}>{item.label}</Link>
            : <span key={item.id} className="unavailable-nav" aria-disabled="true" title="Upcoming Events is planned for a later phase">{item.label} <span>soon</span></span>)}
        </nav>
        <div className="desktop-actions">
          <ThemeToggle />
          <SessionControls session={session} />
          <Link href={home ? "#ways-to-help" : "/#ways-to-help"} className="button button-small button-light">Get involved <ArrowIcon diagonal /></Link>
        </div>
        <div className="mobile-header-actions"><ThemeToggle /><button ref={triggerRef} type="button" className="menu-trigger" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded="false" aria-controls="mobile-navigation"
          onClick={() => {
            dialogRef.current?.showModal();
            previousOverflow.current = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            triggerRef.current?.setAttribute("aria-expanded", "true");
          }}>
          <span /><span />
        </button></div>
      </div>
      <dialog ref={dialogRef} id="mobile-navigation" className="mobile-menu" aria-labelledby="mobile-menu-title" onClose={onMenuClose}
        onClick={event => {
          const link = (event.target as Element).closest("a");
          if (!link) return;
          const destination = new URL(link.href, window.location.href);
          if (destination.pathname === window.location.pathname && destination.hash) {
            selectedAnchor.current = document.getElementById(destination.hash.slice(1));
          }
          closeMenu();
        }}
        onKeyDown={event => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a[href], button:not([disabled])");
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first?.focus();
          }
        }}>
        <div className="mobile-menu-header">
          <BrandLogo />
          <button type="button" className="close-menu" aria-label="Close navigation menu" onClick={closeMenu} autoFocus>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </div>
        <h2 id="mobile-menu-title" className="eyebrow">A little good starts here</h2>
        <nav aria-label="Mobile navigation">
          {navigation.map(item => item.href
            ? <Link key={item.id} href={item.href}>{item.label} <ArrowIcon diagonal /></Link>
            : <span key={item.id} aria-disabled="true" className="mobile-unavailable">{item.label} <small>Coming soon</small></span>)}
          <SessionControls session={session} mobile />
        </nav>
        <Link href={home ? "#ways-to-help" : "/#ways-to-help"} className="button button-light">Get involved <ArrowIcon diagonal /></Link>
        <p className="mobile-menu-note">Browse events, create an initiative, or view your joined events.</p>
      </dialog>
    </header>
  );
}
