import type { ApiEvent, EventPage } from "./event-api";

export type EventSort = "earliest" | "latest" | "title";
export function discoverEvents(events: readonly ApiEvent[], keyword: string, category: string, sort: EventSort) {
  const term = keyword.trim().toLocaleLowerCase("en");
  return events.filter(event => (!category || event.eventType === category) && (!term ||
    [event.title, event.location, event.description].some(value => value.toLocaleLowerCase("en").includes(term))))
    .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title, "en") :
      (sort === "latest" ? -1 : 1) * a.eventDate.localeCompare(b.eventDate)) || a.id.localeCompare(b.id));
}

// Only public GETs, bounded to 100 pages / 600 records. Never present a truncated
// scan as a complete result. Existing server validation and future filtering apply.
export async function collectPublicEvents(load: (page: number, signal: AbortSignal) => Promise<EventPage>, signal: AbortSignal) {
  const events: ApiEvent[] = [], ids = new Set<string>();
  for (let page = 1; page <= 100; page++) {
    signal.throwIfAborted();
    const data = await load(page, signal);
    for (const event of data.events) {
      if (ids.has(event.id)) throw Error("Event listing changed. Please retry.");
      ids.add(event.id); events.push(event);
    }
    if (data.events.length < 6) return events;
  }
  throw Error("The event collection is too large to search here.");
}
