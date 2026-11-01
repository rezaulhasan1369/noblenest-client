export const UPCOMING_EVENTS_PATH = "/api/events/upcoming";
export const UPCOMING_EVENTS_LIMIT = 6;

export type UpcomingEvent = {
  id: string;
  title: string;
  location: string;
  eventType: string;
  eventDate: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  description?: string;
};

export type UpcomingEventsState =
  | { status: "unavailable" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; events: readonly UpcomingEvent[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error("Invalid event response");
  return value.trim();
}

function imageUrl(value: unknown): string {
  const src = requiredText(value, 2048);
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("\\")) return src;
  const url = new URL(src);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid event response");
  return src;
}

// Proposed contract, not a claim that an endpoint exists. Reject stale, malformed,
// duplicate, unsorted or oversized responses instead of presenting fictional data.
export function parseUpcomingEvents(payload: unknown, now = Date.now()): UpcomingEvent[] {
  if (!isRecord(payload) || !Array.isArray(payload.events) || payload.events.length > UPCOMING_EVENTS_LIMIT) throw new Error("Invalid event response");
  const ids = new Set<string>();
  let previousDate = now;
  return payload.events.map((value: unknown) => {
    if (!isRecord(value)) throw new Error("Invalid event response");
    const eventDate = requiredText(value.eventDate, 24);
    const date = Date.parse(eventDate);
    if (!Number.isFinite(date) || new Date(date).toISOString() !== eventDate || date <= now || date < previousDate) throw new Error("Invalid event response");
    previousDate = date;
    const id = requiredText(value.id, 128);
    if (ids.has(id)) throw new Error("Invalid event response");
    ids.add(id);
    return {
      id, eventDate,
      title: requiredText(value.title, 200),
      location: requiredText(value.location, 300),
      eventType: requiredText(value.eventType, 80),
      thumbnailUrl: imageUrl(value.thumbnailUrl),
      thumbnailAlt: requiredText(value.thumbnailAlt, 300),
      ...(value.description === undefined ? {} : { description: requiredText(value.description, 5000) }),
    };
  });
}

export async function fetchUpcomingEvents(baseUrl: string, signal?: AbortSignal): Promise<UpcomingEvent[]> {
  const response = await fetch(new URL(UPCOMING_EVENTS_PATH, baseUrl), {
    credentials: "omit",
    cache: "no-store",
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Upcoming events could not be loaded");
  return parseUpcomingEvents(await response.json());
}
