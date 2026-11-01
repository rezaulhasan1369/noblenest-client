import type { UpcomingEvent } from "./upcoming-events";

export type EventDetailsRecord = UpcomingEvent & { description: string; creatorId: string };
export type OwnedEventRecord = { event: EventDetailsRecord; permissions: { canEdit: boolean; canDelete: boolean } };
export type JoinedEventRecord = { participationId: string; event: EventDetailsRecord };

// Presentation ordering only. Permission flags must come from an authenticated
// server; neither a flag nor a browser-supplied creator ID grants authorization.
export function orderJoinedEvents(records: readonly JoinedEventRecord[]): JoinedEventRecord[] {
  return [...records].sort((a, b) => Date.parse(a.event.eventDate) - Date.parse(b.event.eventDate));
}
