"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { eventsApi } from "@/lib/event-client";
import { eventErrorMessage, type ApiEvent } from "@/lib/event-api";
import "./professional-refinements.css";

type Activity = { organized: ApiEvent[]; joined: ApiEvent[] };
function AccountActivity() {
  const [result, setResult] = useState<{ data?: Activity; error?: string }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([eventsApi.mine(1, 12, controller.signal), eventsApi.joined(1, 12, controller.signal)])
      .then(([mine, joined]) => { if (!controller.signal.aborted) {
        const now = Date.now();
        setResult({ data: { organized: mine.events, joined: joined.events.map(row => row.event).filter(event => Date.parse(event.eventDate) > now) } });
      } })
      .catch(error => { if (!controller.signal.aborted) setResult({ error: eventErrorMessage(error) }); });
    return () => controller.abort();
  }, [attempt]);
  if (result.error) return <><p role="status">{result.error}</p><button type="button" className="button button-outline" onClick={() => { setResult({}); setAttempt(value => value + 1); }}>Retry activity reads</button></>;
  if (!result.data) return <p role="status" aria-busy="true">Loading your activity...</p>;
  return <div className="activity-columns">{[
    { title: "My organized events", events: result.data.organized, href: "/manage-events", empty: "No organized events to show yet." },
    { title: "My upcoming participation", events: result.data.joined, href: "/joined-events", empty: "No future participation on your first joined-events page." },
  ].map(group => <section key={group.href}><h3>{group.title}</h3><p className="section-note">{group.events.length} {group.href === "/joined-events" ? "future entries from" : "entries on"} your first page; this is not an account-wide total.</p>
    {group.events.length ? <ul>{group.events.slice(0, 3).map(event => <li key={event.id}><Link className="text-link" href={`/events/${event.id}`}>{event.title}</Link><br /><time dateTime={event.eventDate}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(event.eventDate))} (Bangladesh)</time></li>)}</ul> : <p>{group.empty}</p>}
    <Link className="text-link" href={group.href}>View full list</Link></section>)}</div>;
}
export function ActivityOverview() {
  const session = authClient.useSession();
  if (session.isPending) return <p role="status">Verifying your activity session...</p>;
  if (session.error || !session.data?.user?.id) return <p role="status">Your activity requires a verified session. <Link href="/login?returnTo=%2Fprofile">Log in again</Link></p>;
  return <section className="activity-overview" aria-labelledby="activity-heading"><h2 id="activity-heading">Your activity at a glance</h2>
    <nav aria-label="Activity quick actions" className="activity-quick-links"><Link className="text-link" href="/events">Browse Events</Link><Link className="text-link" href="/create-event">Create Event</Link><Link className="text-link" href="/manage-events">Manage Events</Link><Link className="text-link" href="/joined-events">Joined Events</Link><Link className="text-link" href="/profile">Profile</Link></nav>
    <AccountActivity key={session.data.user.id} /></section>;
}
