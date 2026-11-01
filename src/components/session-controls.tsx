"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { getProtectedNavigation, type HeaderSession } from "@/lib/header-navigation";

// Session state comes from Better Auth; private pages also enforce server guards.
export function SessionControls({ session, mobile = false }: { session: HeaderSession; mobile?: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipId = useId();
  const accountRef = useRef<HTMLDetailsElement>(null);

  if (session.status === "unavailable") {
    return mobile
      ? <span aria-disabled="true" className="mobile-unavailable">Login <small>Coming soon</small></span>
      : <button type="button" className="login-button" disabled title="Login is not available yet">Login <span className="sr-only">— coming soon</span></button>;
  }
  if (session.status === "signed-out") {
    return <Link className={mobile ? "mobile-login" : "login-button"} href={session.loginHref}>Login</Link>;
  }

  async function logout() {
    if (session.status !== "signed-in" || pending) return;
    setPending(true);
    setError("");
    try { await session.logout(); }
    catch { setError("Logout could not be completed. Please try again."); }
    finally { setPending(false); }
  }

  return <details className="session-account" ref={accountRef} onKeyDown={event => {
    if (event.key === "Escape") {
      event.preventDefault();
      setTooltipOpen(false);
      if (accountRef.current) {
        accountRef.current.open = false;
        accountRef.current.querySelector("summary")?.focus();
      }
    }
  }}>
    <summary aria-label={`Account for ${session.user.displayName}`} aria-describedby={tooltipOpen ? tooltipId : undefined}
      onFocus={() => setTooltipOpen(true)} onBlur={() => setTooltipOpen(false)}
      onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
      <Image src={session.user.imageUrl} alt="" width={40} height={40} unoptimized />
      <span role="tooltip" id={tooltipId} className="profile-tooltip" hidden={!tooltipOpen}>{session.user.displayName}</span>
    </summary>
    <div className="account-panel">
      <p>{session.user.displayName}</p>
      <nav aria-label="Protected navigation" onClick={() => { if (accountRef.current) accountRef.current.open = false; }}>
        <Link href="/profile">Your profile</Link>
        {getProtectedNavigation(session).map(link => <Link key={link.id} href={link.href}>{link.label}</Link>)}
      </nav>
      <button type="button" disabled={pending} onClick={logout}>{pending ? "Logging out…" : "Logout"}</button>
      {error && <p role="status">{error}</p>}
    </div>
  </details>;
}
