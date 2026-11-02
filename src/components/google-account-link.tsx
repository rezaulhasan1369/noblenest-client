"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "./auth-provider";

type Status = "checking" | "ready" | "linked" | "pending" | "error" | "expired";
export function GoogleAccountLink({ userId }: { userId: string }) {
  const [status, setStatus] = useState<Status>("checking"), [attempt, setAttempt] = useState(0);
  const lock = useRef(false), active = useRef<AbortController | null>(null);
  const callback = useSearchParams().get("googleLink"), { notify } = useAuth();
  useEffect(() => {
    const controller = new AbortController(); active.current = controller;
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]);
    authClient.listAccounts({ fetchOptions: { signal, retry: 0 } }).then(result => {
      if (controller.signal.aborted) return;
      if (signal.aborted) { setStatus("error"); return; }
      if (result.error) { setStatus(result.error.status === 401 || result.error.status === 403 ? "expired" : "error"); return; }
      // Keep only provider presence in component state; never retain tokens or
      // trust an account belonging to another user for this profile's controls.
      const accounts = result.data;
      if (!Array.isArray(accounts) || accounts.some(account => !account || account.userId !== userId || typeof account.providerId !== "string")) { setStatus("error"); return; }
      const linked = accounts.some(account => account.providerId === "google");
      setStatus(linked ? "linked" : "ready");
      if (linked && callback === "returned") notify("Your Google account is connected.");
    }).catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => { controller.abort(); active.current?.abort(); };
  }, [userId, attempt, callback, notify]);

  return <section aria-labelledby="google-link-heading" aria-busy={status === "checking" || status === "pending"}>
    <h3 id="google-link-heading">Google account</h3>
    <p className="form-hint">Connect the Google account with the same email to sign in to this existing NobleNest account.</p>
    <p className="form-status" role="status" aria-atomic="true">
      {status === "checking" ? "Checking connected accounts..." : status === "linked" ? "Your Google account is connected."
        : status === "pending" ? "Opening Google to connect your account..." : status === "expired" ? "Your session could not be verified. Please log in again."
          : status === "error" ? "We could not verify or connect your Google account. Please try again."
            : callback === "error" ? "Google was not connected. You can try again."
              : callback === "returned" ? "Google connection could not be confirmed. You can try again." : "Google is not connected yet."}
    </p>
    {(status === "ready" || status === "pending") && <button className="button button-outline" type="button" disabled={status === "pending"} onClick={async () => {
      if (lock.current) return; lock.current = true; setStatus("pending");
      const controller = new AbortController(); active.current?.abort(); active.current = controller;
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]);
      try {
        const session = await authClient.getSession({ fetchOptions: { signal, retry: 0 } });
        if (controller.signal.aborted) return;
        signal.throwIfAborted();
        if (session.error || session.data?.user.id !== userId) { setStatus("expired"); lock.current = false; return; }
        const result = await authClient.linkSocial({ provider: "google", callbackURL: "/profile?googleLink=returned", errorCallbackURL: "/profile?googleLink=error", fetchOptions: { signal, retry: 0 } });
        if (controller.signal.aborted) return;
        signal.throwIfAborted();
        if (result.error || !result.data?.redirect || !result.data.url) {
          setStatus(result.error?.status === 401 || result.error?.status === 403 ? "expired" : "error"); lock.current = false;
        }
        // A redirect response is initiation only. Success is reported only after
        // the returned profile fetches and confirms a linked Google provider.
      } catch { if (!controller.signal.aborted) { setStatus("error"); lock.current = false; } }
    }}>{status === "pending" ? "Connecting Google..." : "Connect Google Account"}</button>}
    {status === "error" && <button className="button button-outline" type="button" onClick={() => { lock.current = false; setStatus("checking"); setAttempt(value => value + 1); }}>Try again</button>}
    {status === "expired" && <Link className="text-link" href="/login?returnTo=%2Fprofile">Log in again</Link>}
  </section>;
}
