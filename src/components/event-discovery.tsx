"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { eventsApi } from "@/lib/event-client";
import { EVENT_CATEGORIES, eventErrorMessage, type ApiEvent } from "@/lib/event-api";
import { collectPublicEvents, discoverEvents, type EventSort } from "@/lib/event-discovery";
import { UpcomingEventsContent } from "./upcoming-events";
import "./professional-refinements.css";

export function EventDiscovery({ page }: { page: number }) {
  const [keyword, setKeyword] = useState(""), [category, setCategory] = useState(""), [sort, setSort] = useState<EventSort>("earliest");
  const [attempt, setAttempt] = useState(0), [visiblePage, setVisiblePage] = useState(1);
  const active = !!keyword.trim() || !!category || sort !== "earliest";
  const [result, setResult] = useState<{ key: string; events?: ApiEvent[]; error?: string }>({ key: "" });
  const key = `${page}:${active}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]);
    const request = active ? collectPublicEvents((p, s) => eventsApi.list(p, s), signal) : eventsApi.list(page, signal).then(data => data.events);
    request.then(events => { if (!controller.signal.aborted) setResult({ key, events }); })
      .catch(error => { if (!controller.signal.aborted) setResult({ key, error: eventErrorMessage(error) }); });
    return () => controller.abort();
  }, [page, active, attempt, key]);
  const current = result.key === key ? result : { key };
  const matches = current.events ? discoverEvents(current.events, keyword, category, sort) : [];
  const count = Math.max(1, Math.ceil(matches.length / 6));
  const selectedPage = Math.min(visiblePage, count);
  function reset() { setKeyword(""); setCategory(""); setSort("earliest"); setVisiblePage(1); }
  return <>
    <form className="discovery-controls" role="search" aria-label="Find events" onSubmit={event => event.preventDefault()}>
      <label htmlFor="event-search">Search events<input id="event-search" type="search" value={keyword} placeholder="Title, location or description" maxLength={200} onChange={event => { setKeyword(event.target.value); setVisiblePage(1); }} /></label>
      <label htmlFor="event-category">Category<select aria-label="Category" id="event-category" value={category} onChange={event => { setCategory(event.target.value); setVisiblePage(1); }}><option value="">All categories</option>{EVENT_CATEGORIES.map(value => <option key={value}>{value}</option>)}</select></label>
      <label htmlFor="event-sort">Sort by<select aria-label="Sort by" id="event-sort" value={sort} onChange={event => { setSort(event.target.value as EventSort); setVisiblePage(1); }}><option value="earliest">Date: earliest first</option><option value="latest">Date: latest first</option><option value="title">Title: A–Z</option></select></label>
      <button type="button" className="button button-outline" onClick={reset}>Reset filters</button>
    </form>
    <p className="section-note" role="status">{current.events ? `${matches.length} ${active ? `matching ${matches.length === 1 ? "event" : "events"}` : `events on page ${page}`}` : current.error ? "Event results unavailable." : "Loading event results..."}</p>
    {current.error ? <><p role="alert">{current.error}</p><button className="button button-outline" type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></>
      : current.events && active && !matches.length ? <div className="data-unavailable"><h2>No matching events</h2><p>Try another keyword or category.</p><button className="button button-outline" type="button" onClick={reset}>Reset all filters</button></div>
      : <UpcomingEventsContent state={current.events ? { status: "ready", events: active ? matches.slice((selectedPage - 1) * 6, selectedPage * 6) : matches } : { status: "loading" }} detailsHrefFor={event => `/events/${event.id}`} headingLevel={2} />}
    {active && current.events && matches.length > 6 && <nav className="section-heading-row" aria-label="Filtered event pages"><button type="button" className="button button-outline" disabled={selectedPage === 1} onClick={() => setVisiblePage(selectedPage - 1)}>Previous results</button><p role="status">Page {selectedPage} of {count}</p><button type="button" className="button button-outline" disabled={selectedPage === count} onClick={() => setVisiblePage(selectedPage + 1)}>Next results</button></nav>}
    {!active && <nav className="section-heading-row" aria-label="Event pages">{page > 1 && <Link className="text-link" href={`/events?page=${page - 1}`}>Previous page</Link>}<p className="section-note">Page {page}</p>{current.events?.length === 6 && page < 1000 && <Link className="text-link" href={`/events?page=${page + 1}`}>Next page</Link>}</nav>}
  </>;
}
