import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import type { UpcomingEvent, UpcomingEventsState } from "@/lib/upcoming-events";
import { EventFeed } from "./event-feed";
import { EventLoading } from "./event-loading";

export function UpcomingEventsContent({ state, detailsHrefFor, preview = false, headingLevel = 3 }: { state: UpcomingEventsState; detailsHrefFor?: (event: UpcomingEvent) => string | undefined; preview?: boolean; headingLevel?: 2 | 3 }) {
  if (state.status === "loading") return <EventLoading />;
  if (state.status === "ready" && state.events.length > 0) return <div className="events-grid">{state.events.map(event => <EventCard event={event} detailsHref={detailsHrefFor?.(event)} preview={preview} headingLevel={headingLevel} key={event.id} />)}</div>;
  const messages = {
    unavailable: { label: "Live feed · not connected", title: "Good things are taking shape.", description: "The event feed isn’t connected yet. Upcoming community activities will appear here when live event data is available." },
    error: { label: "Event feed unavailable", title: "A little pause, not the end.", description: "We couldn’t load upcoming events. Please try again later." },
    ready: { label: "No upcoming events", title: "Room for the next good thing.", description: "There are no upcoming events to show right now. Check back for new community activities." },
  };
  const message = messages[state.status];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <div className="events-message" role="status">
    <div className="events-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M12 12h24v27H12V12Zm6-5v10M30 7v10M12 21h24m-17 8 4 4 7-7" /></svg></div>
    <p className="eyebrow">{message.label}</p><Heading>{message.title}</Heading><p>{message.description}</p>
  </div>;
}

export function UpcomingEvents() {
  return <section id="upcoming-events" className="upcoming-section" aria-labelledby="events-heading" tabIndex={-1}>
    <div className="content-width">
      <div className="section-heading section-heading-row"><div><p className="eyebrow">A little time. A meaningful difference.</p><h2 id="events-heading">Upcoming Events</h2><p className="section-intro">Discover a cause, find your people, and make room for something good.</p></div><Link href="/events" className="text-link">View All Events <ArrowIcon /></Link></div>
      <EventFeed />
    </div>
  </section>;
}
