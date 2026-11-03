"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { eventsApi } from "@/lib/event-client";
import { EventApiError, eventErrorMessage, type ApiEvent } from "@/lib/event-api";
import { DataUnavailable } from "./page-shell";
import { EventThumbnail } from "./event-thumbnail";
import { EventForm } from "./event-form";
import { JoinEvent } from "./join-event";
import { EventLoading } from "./event-loading";

type RecordState = { id: string; event?: ApiEvent; error?: string };
function useEventRecord(id: string) {
  const [state, setState] = useState<RecordState>({ id });
  useEffect(() => {
    const controller = new AbortController();
    eventsApi.details(id, controller.signal).then(event => {
      if (!controller.signal.aborted) setState({ id, event });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ id, error: error instanceof EventApiError && error.status === 400 ? "The event identifier is invalid." : eventErrorMessage(error) });
    });
    return () => controller.abort();
  }, [id]);
  return state.id === id ? state : { id };
}
function RecordStatus({ state }: { state: RecordState }) {
  return state.error ? <DataUnavailable title="Event unavailable" description={state.error} />
    : <EventLoading message="Loading event details..." detail />;
}
function OwnerActions({ event }: { event: ApiEvent }) {
  const router = useRouter(), lock = useRef(false);
  const [confirming, setConfirming] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null), trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirming) cancel.current?.focus(); }, [confirming]);
  function dismiss() { if (lock.current) return; setConfirming(false); trigger.current?.focus(); }
  return <div>
    <Link className="text-link" href={`/events/${event.id}/edit`}>Edit Event</Link>
    <button ref={trigger} className="button button-outline" type="button" disabled={pending || expired} onClick={() => { setError(""); setConfirming(true); }}>Delete Event</button>
    {confirming && <div className="interface-notice" role="group" aria-labelledby={`delete-${event.id}`} onKeyDown={key => { if (key.key === "Escape") dismiss(); }}>
      <h3 id={`delete-${event.id}`}>Delete this event permanently?</h3><p>This action cannot be undone.</p>
      <button ref={cancel} className="button button-outline" type="button" disabled={pending} onClick={dismiss}>Cancel deletion</button>
      <button className="button button-solid" type="button" disabled={pending || expired} onClick={async () => {
        if (lock.current) return; lock.current = true; setPending(true); setError("");
        try { await eventsApi.remove(event.id); router.replace("/events"); router.refresh(); }
        catch (failure) { setError(eventErrorMessage(failure)); setExpired(failure instanceof EventApiError && failure.status === 401); lock.current = false; setPending(false); }
      }}>{pending ? "Deleting..." : "Confirm deletion"}</button>
    </div>}
    <p className="form-status" role="status">{error}</p>
    {expired && <Link className="text-link" href={`/login?returnTo=${encodeURIComponent(`/events/${event.id}`)}`}>Log in again</Link>}
  </div>;
}
export function EventRecord({ id, editing = false }: { id: string; editing?: boolean }) {
  const state = useEventRecord(id), session = authClient.useSession();
  const owner = !session.isPending && !session.error && !!state.event && session.data?.user.id === state.event.creatorId;
  if (!state.event) return <RecordStatus state={state} />;
  const event = state.event;
  if (editing) {
    if (session.isPending) return <p role="status">Verifying your session...</p>;
    if (!owner) return <DataUnavailable title="Editing unavailable" description="Only the verified creator can edit this event. Please check your account or log in again." />;
    return <EventForm key={event.id} initialEvent={event} />;
  }
  const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(event.eventDate));
  return <div className="detail-grid">
    <article className="section-heading" style={{ minWidth: 0, overflowWrap: "anywhere" }}><div className="event-thumbnail"><EventThumbnail src={event.thumbnailUrl} alt={event.thumbnailAlt} /></div><h2>{event.title}</h2><p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{event.description}</p></article>
    <aside className="detail-panel"><h2>Event details</h2><dl><dt>Location</dt><dd>{event.location}</dd><dt>Event type</dt><dd>{event.eventType}</dd><dt>Date</dt><dd><time dateTime={event.eventDate}>{date} (Bangladesh, UTC+6)</time></dd></dl>
      {owner && <OwnerActions event={event} />}
      <a className="text-link" href="#educational-project-notice">About these listings</a>
      <JoinEvent eventId={event.id} />
    </aside>
  </div>;
}
