import { EventThumbnail } from "@/components/event-thumbnail";
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import type { UpcomingEvent } from "@/lib/upcoming-events";
import { eventImageManifest } from "@/lib/event-image-manifest";

export function EventCard({ event, detailsHref, preview = false }: { event: UpcomingEvent; detailsHref?: string; preview?: boolean }) {
  // Only enrich an exact owner-asset URL match; future uploaded URLs stay intact.
  const image = eventImageManifest.find(asset => asset.src === event.thumbnailUrl);
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" }).format(new Date(event.eventDate));
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka" }).format(new Date(event.eventDate));
  return <article className="event-card">
    <div className="event-thumbnail"><EventThumbnail key={event.thumbnailUrl} src={event.thumbnailUrl} alt={event.thumbnailAlt} variants={image?.variants} fit={image && image.width / image.height > 2.2 ? "contain" : "cover"} /><span className="event-category">{event.eventType}</span></div>
    <div className="event-card-body">
      {preview && <p className="event-preview-label">Demo event · simulated schedule</p>}
      <div className="event-card-meta"><time dateTime={event.eventDate}>{date}<span>{time} · Bangladesh (UTC+6)</span></time></div>
      <h3>{event.title}</h3>
      <p className="event-location"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" /><circle cx="12" cy="9" r="2" /></svg>{event.location}</p>
      <p className="event-description">{event.description || "Explore the details to learn about this activity before deciding how to take part."}</p>
      {detailsHref
        ? <Link className="event-action" href={detailsHref} aria-label={`View Event: ${event.title}`}>View Event <ArrowIcon diagonal /></Link>
        : <div className="event-action-unavailable"><button className="event-action" disabled type="button">View Event <ArrowIcon diagonal /></button><p>Event details are not available yet.</p></div>}
    </div>
  </article>;
}
