import { requireSession } from "@/lib/auth-server";
import { PageShell } from "@/components/page-shell";
import { EventRecord } from "@/components/event-record";
export default async function EditPage({params}:{params:Promise<{id:string}>}){const { id } = await params; await requireSession("/events/" + encodeURIComponent(id) + "/edit"); return <PageShell eyebrow="Edit Event" title="Make room for a better plan." description="Update the details of your community initiative."><EventRecord key={id} id={id} editing /></PageShell>;}
