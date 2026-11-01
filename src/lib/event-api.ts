import type { EventDetailsRecord } from "./event-contracts";

export const EVENT_CATEGORIES = ["Cleanup", "Plantation", "Donation", "Community service"] as const;
export type EventInput = {
  title: string; description: string; eventType: typeof EVENT_CATEGORIES[number];
  thumbnailUrl: string; thumbnailAlt?: string; location: string; eventDate: string;
};
export type ApiEvent = EventDetailsRecord & { createdAt: string; updatedAt: string };
export type EventPage = { events: ApiEvent[]; pagination: { page: number; pageSize: 6 } };
export type OwnedEventPage = { events: ApiEvent[]; pagination: { page: number; pageSize: number } };
export class EventApiError extends Error {
  status: number;
  constructor(status: number) {
    super(status === 401 ? "Your session has expired. Please log in again."
      : status === 404 ? "This event is no longer available or cannot be changed by your account."
      : status === 400 ? "Check the event fields and use a future date, an approved category and a valid HTTPS image URL."
      : "The event service is unavailable. Please try again later.");
    this.status = status;
  }
}
export function eventId(value: string) {
  if (!/^[a-f0-9]{24}$/i.test(value)) throw new EventApiError(400);
  return value;
}
export function eventPage(value: string | number = 1) {
  if (!/^[1-9][0-9]{0,3}$/.test(String(value)) || Number(value) > 1000) throw new EventApiError(400);
  return Number(value);
}
export function ownedEventPagination(page: string | number = 1, pageSize: string | number = 12) {
  const currentPage = eventPage(page);
  if (!/^[1-9][0-9]?$/.test(String(pageSize)) || Number(pageSize) > 50) throw new EventApiError(400);
  return { page: currentPage, pageSize: Number(pageSize) };
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new EventApiError(502);
  return value as Record<string, unknown>;
}
function text(value: unknown, max: number) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new EventApiError(502);
  return value;
}
function timestamp(value: unknown) {
  const result = text(value, 24), date = new Date(result);
  if (!Number.isFinite(+date) || date.toISOString() !== result) throw new EventApiError(502);
  return result;
}
export function parseApiEvent(value: unknown): ApiEvent {
  const data = record(value), id = text(data.id, 24), thumbnailUrl = text(data.thumbnailUrl, 2048);
  if (!/^[a-f0-9]{24}$/i.test(id)) throw new EventApiError(502);
  let url: URL;
  try { url = new URL(thumbnailUrl); } catch { throw new EventApiError(502); }
  if (!thumbnailUrl.startsWith("https://") || /[\s\\\u0000-\u001f\u007f]/.test(thumbnailUrl) || url.protocol !== "https:" || url.username || url.password) throw new EventApiError(502);
  const eventType = text(data.eventType, 80);
  if (!(EVENT_CATEGORIES as readonly string[]).includes(eventType)) throw new EventApiError(502);
  return { id, title: text(data.title, 200), description: text(data.description, 5000),
    location: text(data.location, 300), eventType, thumbnailUrl, thumbnailAlt: text(data.thumbnailAlt, 300),
    eventDate: timestamp(data.eventDate), creatorId: text(data.creatorId, 128),
    createdAt: timestamp(data.createdAt), updatedAt: timestamp(data.updatedAt) };
}
function parseList(value: unknown, limit = 6): ApiEvent[] {
  if (!Array.isArray(value) || value.length > limit) throw new EventApiError(502);
  const events = value.map(parseApiEvent), ids = new Set<string>();
  for (let index = 0; index < events.length; index++) {
    const event = events[index], previous = events[index - 1];
    if (ids.has(event.id) || (previous && (previous.eventDate > event.eventDate || (previous.eventDate === event.eventDate && previous.id > event.id)))) throw new EventApiError(502);
    ids.add(event.id);
  }
  // The server clock defines "future"; avoid rejecting valid results due to
  // a user's clock being ahead. Never pad or reorder server results.
  return events;
}
type ProtectedFetch = (path: string, init?: RequestInit) => Promise<Response>;
export function createEventApi({ baseUrl, publicFetch = fetch, authenticatedFetch }: {
  baseUrl?: string; publicFetch?: typeof fetch; authenticatedFetch?: ProtectedFetch;
}) {
  async function request(path: string, init: RequestInit = {}, protectedRequest = false) {
    if (!baseUrl) throw new EventApiError(503);
    const signal = init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000);
    let response: Response;
    try {
      response = protectedRequest
        ? await (authenticatedFetch ?? (() => { throw new EventApiError(401); }))(path, { ...init, signal })
        : await publicFetch(new URL(path, baseUrl), { ...init, signal, cache: "no-store", credentials: "omit", redirect: "error" });
    } catch (error) {
      if (error instanceof EventApiError) throw error;
      if (protectedRequest && error instanceof Error && error.message === "Please log in again.") throw new EventApiError(401);
      throw new EventApiError(503);
    }
    if (!response.ok) throw new EventApiError(response.status);
    return response;
  }
  async function json(response: Response): Promise<Record<string, unknown>> {
    try { return record(await response.json()); } catch { throw new EventApiError(502); }
  }
  async function mutate(method: "POST" | "PATCH", path: string, input: Partial<EventInput>) {
    const result = await json(await request(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }, true));
    return parseApiEvent(result.event);
  }
  return {
    async mine(page = 1, pageSize = 12, signal?: AbortSignal): Promise<OwnedEventPage> {
      const requested = ownedEventPagination(page, pageSize);
      const data = await json(await request(`/api/events/mine?page=${requested.page}&pageSize=${requested.pageSize}`, { method: "GET", signal }, true));
      const pagination = record(data.pagination);
      if (pagination.page !== requested.page || pagination.pageSize !== requested.pageSize) throw new EventApiError(502);
      return { events: parseList(data.events, requested.pageSize), pagination: requested };
    },
    async upcoming(signal?: AbortSignal) { return parseList((await json(await request("/api/events/upcoming", { signal }))).events); },
    async list(page = 1, signal?: AbortSignal): Promise<EventPage> {
      eventPage(page);
      const data = await json(await request(`/api/events?page=${page}`, { signal })), pagination = record(data.pagination);
      if (pagination.page !== page || pagination.pageSize !== 6) throw new EventApiError(502);
      return { events: parseList(data.events), pagination: { page, pageSize: 6 } };
    },
    async details(id: string, signal?: AbortSignal) { return parseApiEvent((await json(await request(`/api/events/${eventId(id)}`, { signal }))).event); },
    create(input: EventInput) { return mutate("POST", "/api/events", input); },
    update(id: string, input: Partial<EventInput>) { return mutate("PATCH", `/api/events/${eventId(id)}`, input); },
    async remove(id: string) {
      const response = await request(`/api/events/${eventId(id)}`, { method: "DELETE" }, true);
      if (response.status !== 204) throw new EventApiError(502);
    },
  };
}
export function eventErrorMessage(error: unknown) {
  return error instanceof EventApiError ? error.message : "The event service is unavailable. Please try again later.";
}
