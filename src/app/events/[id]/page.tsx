import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { EventRecord } from "@/components/event-record";
import { EDUCATIONAL_DISCLOSURE } from "@/lib/educational-disclosure";
export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PageShell eyebrow="Event details" title="A closer look at a small act." description={EDUCATIONAL_DISCLOSURE}><EventRecord key={id} id={id} /><Link href="/events" className="text-link">Back to Upcoming Events</Link></PageShell>;
}
