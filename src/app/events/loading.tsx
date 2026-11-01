import { PageShell } from "@/components/page-shell"; import { UpcomingEventsContent } from "@/components/upcoming-events";
export default function Loading(){return <PageShell eyebrow="Upcoming Events" title="A little good is on its way." description="Loading community activities…"><UpcomingEventsContent state={{status:"loading"}} /></PageShell>;}
