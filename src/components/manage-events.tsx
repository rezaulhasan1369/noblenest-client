"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { eventsApi } from "@/lib/event-client";
import { EventApiError, type OwnedEventPage } from "@/lib/event-api";
import { EventCard } from "./event-card";
import { DataUnavailable } from "./page-shell";
import { EventLoading } from "./event-loading";

function Loading() { return <EventLoading message="Loading your events..." privateCards />; }
function LoginAgain({ page, pageSize }: { page: number; pageSize: number }) {
  return <><DataUnavailable title="Please log in again" description="Your session could not be verified. Log in again to load your events." /><Link className="text-link" href={`/login?returnTo=${encodeURIComponent(`/manage-events?page=${page}&pageSize=${pageSize}`)}`}>Log in again</Link></>;
}
type Result = { key: string; data?: OwnedEventPage; error?: number };
function OwnedEventList({ page, pageSize }: { page: number; pageSize: number }) {
  const key = `${page}:${pageSize}`;
  const [result, setResult] = useState<Result>({ key });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    eventsApi.mine(page, pageSize, controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ key, data });
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ key, error: error instanceof EventApiError ? error.status : 503 });
    });
    return () => controller.abort();
  }, [key, page, pageSize, attempt]);
  const state = result.key === key ? result : { key };
  if (state.error === 401) return <LoginAgain page={page} pageSize={pageSize} />;
  const href = (nextPage: number) => `/manage-events?page=${nextPage}&pageSize=${pageSize}`;
  return <>
    {state.error ? <><DataUnavailable title="Your event list is unavailable" description={state.error === 400 ? "The page request was rejected. Choose a valid page and try again." : "We could not load your events. Please try again later."} /><button className="button button-outline" type="button" onClick={() => { setResult({ key }); setAttempt(value => value + 1); }}>Try again</button></>
      : !state.data ? <Loading />
      : state.data.events.length ? <div className="events-grid">{state.data.events.map(event => <EventCard key={event.id} event={event} detailsHref={`/events/${event.id}`} editHref={`/events/${event.id}/edit`} />)}</div>
      : <DataUnavailable title={page === 1 ? "Your next good idea starts here." : "No events on this page"} description={page === 1 ? "You have not created any events yet. Create an event to start a community initiative." : "There are no events on this page. Return to an earlier page to see your initiatives."} />}
    <nav className="section-heading-row" aria-label="Your event pages">
      {page > 1 && <Link className="text-link" href={href(page - 1)}>Previous page</Link>}
      <p className="section-note" role="status">Page {page}</p>
      {state.data && state.data.events.length === pageSize && page < 1000 && <Link className="text-link" href={href(page + 1)}>Next page</Link>}
    </nav>
  </>;
}
export function ManageEvents({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number }) {
  const session = authClient.useSession();
  // Never retain another account's data across logout, account changes or failed
  // session reads. The user ID only keys local state; it is never sent as owner.
  if (session.isPending) return <Loading />;
  if (session.error) return session.error.status === 401 || session.error.status === 403
    ? <LoginAgain page={page} pageSize={pageSize} />
    : <DataUnavailable title="Session check unavailable" description="We could not verify your session. Please reload this page shortly." />;
  if (!session.data?.user.id) return <LoginAgain page={page} pageSize={pageSize} />;
  return <OwnedEventList key={session.data.user.id} page={page} pageSize={pageSize} />;
}
