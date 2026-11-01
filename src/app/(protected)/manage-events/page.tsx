import { requireSession } from "@/lib/auth-server";
import Link from "next/link";
import { PageShell, DataUnavailable } from "@/components/page-shell";
import { ManageEvents } from "@/components/manage-events";
import { ownedEventPagination } from "@/lib/event-api";
export default async function ManagePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireSession("/manage-events");
  const query = await searchParams;
  let pagination;
  try {
    if (Object.keys(query).some(key => !["page", "pageSize"].includes(key)) || Array.isArray(query.page) || Array.isArray(query.pageSize)) throw Error();
    pagination = ownedEventPagination(query.page ?? 1, query.pageSize ?? 12);
  } catch { return <PageShell eyebrow="Manage Events" title="Care for what you started." description="Manage your community initiatives."><DataUnavailable title="Invalid event page" description="Use a page from 1 to 1000 and a page size from 1 to 50." /><Link className="text-link" href="/manage-events">Return to your events</Link></PageShell>; }
  return <PageShell eyebrow="Manage Events" title="Care for what you started." description="View and care for your past and upcoming community initiatives."><ManageEvents {...pagination} /><Link className="text-link" href="/create-event">Create Event</Link></PageShell>;
}
