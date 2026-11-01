import { requireSession } from "@/lib/auth-server";
import { PageShell, ProtectedPreviewNotice } from "@/components/page-shell"; import { EventForm } from "@/components/event-form";
export default async function CreatePage(){await requireSession("/create-event"); return <PageShell eyebrow="Create Event" title="Give a good idea a beginning." description="Shape an initiative around a cause you care about."><ProtectedPreviewNotice /><EventForm /></PageShell>;}
