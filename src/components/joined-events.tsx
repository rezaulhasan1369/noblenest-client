"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { eventsApi } from "@/lib/event-client";
import { EventApiError, type JoinedEventPage } from "@/lib/event-api";
import { EventCard } from "./event-card";
import { DataUnavailable } from "./page-shell";

function Loading() { return <p className="section-note" role="status" aria-busy="true">Loading your joined events...</p>; }
function LoginAgain({ page, pageSize }: { page: number; pageSize: number }) {
  return <><DataUnavailable title="Please log in again" description="Your session could not be verified. Log in again to load your joined events." /><Link className="text-link" href={`/login?returnTo=${encodeURIComponent(`/joined-events?page=${page}&pageSize=${pageSize}`)}`}>Log in again</Link></>;
}
type Result = { key: string; data?: JoinedEventPage; error?: number };
function JoinedEventList({ page, pageSize }: { page: number; pageSize: number }) {
  const key = `${page}:${pageSize}`;
  const [result, setResult] = useState<Result>({ key }), [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    eventsApi.joined(page, pageSize, controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ key, data });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ key, error: error instanceof EventApiError ? error.status : 503 });
    });
    return () => controller.abort();
  }, [key, page, pageSize, attempt]);
  const state = result.key === key ? result : { key };
  if (state.error === 401) return <LoginAgain page={page} pageSize={pageSize} />;
  const href = (next: number) => `/joined-events?page=${next}&pageSize=${pageSize}`;
  return <>
    {state.error ? <><DataUnavailable title="Your joined events are unavailable" description={state.error === 400 ? "The page request was rejected. Choose a valid page and try again." : "We could not load your joined events. Please try again shortly."} /><button className="button button-outline" type="button" onClick={() => { setResult({ key }); setAttempt(value => value + 1); }}>Try again</button></>
      : !state.data ? <Loading />
      : state.data.events.length ? <div className="events-grid">{state.data.events.map(row => <EventCard key={row.participationId} event={row.event} joinedAt={row.joinedAt} detailsHref={`/events/${row.event.id}`} />)}</div>
      : <DataUnavailable title={page === 1 ? "A space for the things you show up for." : "No joined events on this page"} description={page === 1 ? "You have no joined events to show. Explore upcoming activities to find a cause you care about." : "Return to an earlier page to see your joined activities."} />}
    <nav className="section-heading-row" aria-label="Joined event pages">
      {page > 1 && <Link className="text-link" href={href(page - 1)}>Previous page</Link>}
      <p className="section-note" role="status">Page {page}</p>
      {state.data && state.data.events.length === pageSize && page < 1000 && <Link className="text-link" href={href(page + 1)}>Next page</Link>}
    </nav>
  </>;
}
export function JoinedEvents({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number }) {
  const session = authClient.useSession();
  if (session.isPending) return <Loading />;
  if (session.error) return session.error.status === 401 || session.error.status === 403
    ? <LoginAgain page={page} pageSize={pageSize} />
    : <><DataUnavailable title="Session check unavailable" description="We could not verify your session. Please reload this page shortly." /><a className="text-link" href={`/joined-events?page=${page}&pageSize=${pageSize}`}>Reload joined events</a></>;
  if (!session.data?.user.id) return <LoginAgain page={page} pageSize={pageSize} />;
  // The user ID only resets UI state; database ownership is decided by the JWT.
  return <JoinedEventList key={session.data.user.id} page={page} pageSize={pageSize} />;
}
