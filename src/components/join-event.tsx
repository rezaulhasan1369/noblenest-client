"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { eventsApi } from "@/lib/event-client";
import { EventApiError } from "@/lib/event-api";

type JoinState = { status: "idle" | "pending" | "success" | "already-joined" | "error"; message?: string; expired?: boolean };
const loginHref = (id: string) => `/login?returnTo=${encodeURIComponent(`/events/${id}`)}`;
function JoinRequest({ eventId }: { eventId: string }) {
  const lock = useRef(false), controller = useRef<AbortController | null>(null);
  const [state, setState] = useState<JoinState>({ status: "idle" });
  useEffect(() => () => controller.current?.abort(), []);
  const messageId = `join-status-${eventId}`;
  return <div>
    <button className="button button-solid" type="button" disabled={state.status !== "idle"} aria-describedby={messageId} aria-busy={state.status === "pending"} onClick={async () => {
      if (lock.current) return; lock.current = true;
      const request = new AbortController(); controller.current = request;
      setState({ status: "pending", message: "Joining event..." });
      try {
        const result = await eventsApi.join(eventId, request.signal);
        if (request.signal.aborted) return;
        setState(result.alreadyJoined ? { status: "already-joined", message: "You have already joined this event." }
          : { status: "success", message: "You have joined this event." });
      } catch (error) {
        if (request.signal.aborted) return;
        const code = error instanceof EventApiError ? error.status : 503;
        setState({ status: "error", expired: code === 401, message: code === 401 ? "Your session has expired. Please log in again."
          : code === 404 ? "This event is no longer available."
          : code === 400 ? "This event could not be joined. Please check the event link."
          : "Joining is unavailable. We could not confirm your participation. Please try again later." });
      }
    }}>{state.status === "pending" ? "Joining..." : state.status === "success" || state.status === "already-joined" ? "Joined" : "Join Event"}</button>
    <p id={messageId} className="form-status" role="status" aria-atomic="true">{state.message || "Join this community activity with your signed-in account."}</p>
    {state.expired ? <Link className="text-link" href={loginHref(eventId)}>Log in again</Link>
      : state.status === "error" ? <a className="text-link" href={`/events/${eventId}`}>Reload event</a> : null}
  </div>;
}
export function JoinEvent({ eventId }: { eventId: string }) {
  const session = authClient.useSession();
  if (session.isPending) return <><button className="button button-solid" type="button" disabled>Join Event</button><p role="status">Checking your session...</p></>;
  if (session.error) return <><button className="button button-solid" type="button" disabled>Join Event</button><p role="status">Your session could not be verified. Please log in again or reload this page.</p><Link className="text-link" href={loginHref(eventId)}>Log in again</Link></>;
  if (!session.data?.user.id) return <><Link className="button button-solid" href={loginHref(eventId)}>Join Event</Link><p>Log in before joining this community activity.</p></>;
  // This key resets presentation on event/account changes. Identity is never
  // submitted: only the existing Bearer JWT establishes the participant.
  return <JoinRequest key={`${eventId}:${session.data.user.id}`} eventId={eventId} />;
}
