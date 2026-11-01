import Link from "next/link"; import { PageShell } from "@/components/page-shell";
export default function NotFound(){return <PageShell eyebrow="404" title="A little off the beaten path." description="That page could not be found."><Link href="/" className="button button-solid">Return to NobleNest</Link></PageShell>;}
