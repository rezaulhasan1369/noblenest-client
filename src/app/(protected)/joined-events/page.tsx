import { requireSession } from "@/lib/auth-server";
import Link from "next/link";
import { PageShell, DataUnavailable } from "@/components/page-shell";
import { JoinedEvents } from "@/components/joined-events";
import { ownedEventPagination } from "@/lib/event-api";
export default async function JoinedPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSession("/joined-events");
  const query = await searchParams;
  let pagination;
  try {
    if (Object.keys(query).some(key => !["page", "pageSize"].includes(key)) || Array.isArray(query.page) || Array.isArray(query.pageSize)) throw Error();
    pagination = ownedEventPagination(query.page ?? 1, query.pageSize ?? 12);
  } catch { return <PageShell eyebrow="Joined Events" title="Keep your good intentions close." description="Your joined community activities."><DataUnavailable title="Invalid joined-event page" description="Use a page from 1 to 1000 and a page size from 1 to 50." /><Link className="text-link" href="/joined-events">Return to joined events</Link></PageShell>; }
  return <PageShell eyebrow="Joined Events" title="Keep your good intentions close." description="Your joined community activities, in event-date order."><JoinedEvents {...pagination} /><Link href="/events" className="text-link">Explore Upcoming Events</Link></PageShell>;
}
