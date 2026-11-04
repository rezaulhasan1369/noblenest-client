"use client";
import { useEffect, useRef, useState } from "react";
import { eventsApi } from "@/lib/event-client";
import { collectPublicEvents } from "@/lib/event-discovery";
import { eventErrorMessage } from "@/lib/event-api";

export function CollectionSummary() {
  const controller = useRef<AbortController | null>(null);
  const [result, setResult] = useState<{ count?: number; categories?: number; pending?: boolean; error?: string }>({});
  useEffect(() => () => controller.current?.abort(), []);
  return <section aria-labelledby="collection-summary-heading"><h2 id="collection-summary-heading">The event collection</h2>
    <p>These counts describe application listings, not real-world attendance or community impact.</p>
    {result.count !== undefined && <p role="status">{result.count} upcoming listings across {result.categories} categories in the last completed read.</p>}
    {result.error && <p role="status">{result.error}</p>}
    <button type="button" className="button button-outline" disabled={result.pending} onClick={async () => {
      if (controller.current && !controller.current.signal.aborted) return;
      const request = new AbortController(); controller.current = request; setResult({ pending: true });
      try {
        const events = await collectPublicEvents((page, signal) => eventsApi.list(page, signal), AbortSignal.any([request.signal, AbortSignal.timeout(30000)]));
        if (!request.signal.aborted) setResult({ count: events.length, categories: new Set(events.map(event => event.eventType)).size });
      } catch (error) { if (!request.signal.aborted) setResult({ error: eventErrorMessage(error) }); }
      finally { if (controller.current === request) controller.current = null; }
    }}>{result.pending ? "Reading event collection..." : "Refresh collection summary"}</button>
  </section>;
}
