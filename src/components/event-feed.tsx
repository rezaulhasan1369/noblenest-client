"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UpcomingEventsContent } from "./upcoming-events";
import type { UpcomingEventsState } from "@/lib/upcoming-events";
import { eventsApi } from "@/lib/event-client";

export function EventFeed({ page }: { page?: number }) {
  const [result, setResult] = useState<{ page?: number; state: UpcomingEventsState }>({ page, state: { status: "loading" } });
  useEffect(() => {
    const controller = new AbortController();
    const promise = page === undefined ? eventsApi.upcoming(controller.signal) : eventsApi.list(page, controller.signal).then(data => data.events);
    promise.then(events => { if (!controller.signal.aborted) setResult({ page, state: { status: "ready", events } }); })
      .catch(() => { if (!controller.signal.aborted) setResult({ page, state: { status: "error" } }); });
    return () => controller.abort();
  }, [page]);
  const state = result.page === page ? result.state : { status: "loading" } as const;
  return <>
    <UpcomingEventsContent state={state} detailsHrefFor={event => `/events/${event.id}`} headingLevel={page === undefined ? 3 : 2} />
    {page !== undefined && <nav className="section-heading-row" aria-label="Event pages">
      {page > 1 && <Link className="text-link" href={`/events?page=${page - 1}`}>Previous page</Link>}
      <p className="section-note" aria-live="polite">Page {page}</p>
      {state.status === "ready" && state.events.length === 6 && page < 1000 && <Link className="text-link" href={`/events?page=${page + 1}`}>Next page</Link>}
    </nav>}
  </>;
}
