import { PageShell } from "@/components/page-shell";
import { UpcomingEventsContent } from "@/components/upcoming-events";
export default function EventsPage(){ return <PageShell eyebrow="Upcoming Events" title="Find your next small act." description="A place to discover community activities, close to home and close to what matters."><UpcomingEventsContent state={{status:"unavailable"}} /></PageShell>; }
