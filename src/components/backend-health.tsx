"use client";
import { useState } from "react";
import { getApiBaseUrl } from "@/lib/env";
export function BackendHealth() {
  const [status, setStatus] = useState("Not checked");
  const [busy, setBusy] = useState(false);
  async function checkHealth() {
    setBusy(true);
    setStatus("Checking backend...");
    try {
      const response = await fetch(getApiBaseUrl() + "/api/health", { cache: "no-store", credentials: "omit", signal: AbortSignal.timeout(15000) });
      const body: unknown = await response.json();
      if (!response.ok || typeof body !== "object" || body === null || !("status" in body) || body.status !== "ok") throw new Error("Unhealthy response");
      setStatus("Backend is reachable and healthy.");
    } catch {
      setStatus("Backend check failed. Verify the API URL, service availability, and allowed frontend origin.");
    } finally { setBusy(false); }
  }
  return <section className="rounded-lg border border-gray-300 p-5" aria-label="Backend connectivity">
    <p role="status" aria-live="polite" className="mb-4">{status}</p>
    <button type="button" disabled={busy} onClick={checkHealth} className="rounded bg-gray-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-60">{busy ? "Checking..." : "Check backend connection"}</button>
  </section>;
}
