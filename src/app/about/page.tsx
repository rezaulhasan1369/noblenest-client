import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CollectionSummary } from "@/components/collection-summary";
import "@/components/professional-refinements.css";

export default function AboutPage() {
  return <PageShell eyebrow="About NobleNest" title="Small acts. Shared purpose." description="A full-stack learning project built around a community-event concept.">
    <div className="about-copy"><h2>A place to explore community ideas</h2><p>NobleNest brings event discovery, account access and personal activity lists together in one educational application. Its collection explores cleanup, planting, donation and community-service ideas through original activity concepts and artwork.</p>
      <h2>How NobleNest works</h2><ol><li><strong>Discover.</strong> Browse event details, search by interest and compare dates.</li><li><strong>Join.</strong> Sign in to use the application&apos;s participation workflow.</li><li><strong>Manage.</strong> Follow your joined entries or manage listings you organize from your account.</li></ol>
      <p>The project demonstrates a Next.js frontend, an Express API and MongoDB persistence. Account permissions determine which records can be managed; public browsing does not require an account.</p>
      <p><Link className="text-link" href="/events">Explore the event collection</Link> · <Link className="text-link" href="/#our-purpose">Our purpose</Link></p>
      <CollectionSummary />
    </div>
  </PageShell>;
}
