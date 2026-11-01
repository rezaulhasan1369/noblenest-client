import { PageShell, DataUnavailable } from "@/components/page-shell";
import { EventFeed } from "@/components/event-feed";
import { eventPage } from "@/lib/event-api";
export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  let page: number;
  try {
    if (Object.keys(query).some(key => key !== "page") || Array.isArray(query.page)) throw Error();
    page = eventPage(query.page ?? 1);
  } catch { return <PageShell eyebrow="Upcoming Events" title="Find your next small act." description="Discover community activities."><DataUnavailable title="Invalid event page" description="Choose a page number from 1 to 1000." /></PageShell>; }
  return <PageShell eyebrow="Upcoming Events" title="Find your next small act." description="A place to discover community activities, close to home and close to what matters."><EventFeed key={page} page={page} /></PageShell>;
}
