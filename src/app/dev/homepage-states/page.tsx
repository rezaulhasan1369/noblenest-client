import { notFound } from "next/navigation";
import Link from "next/link";
import { HomepageStatePreview } from "@/components/homepage-state-preview";
import { eventImageManifest } from "@/lib/event-image-manifest";
import { createDemoEvent } from "@/app/dev/event-fixtures";
import { BrandLogo } from "@/components/brand-logo";

export default function HomepageStates() {
  if (process.env.NODE_ENV !== "development") notFound();
  const events = eventImageManifest.slice(0, 6).map(createDemoEvent);
  return <main className="content-width state-preview-page">
    <p className="eyebrow">Development only</p><h1>Homepage component states</h1>
    <p>Fictional layout fixtures only. These are not database events, and no event details or participation is available.</p>
    <Link className="text-link" href="/">Return to homepage</Link>
    <p><Link className="text-link" href="/dev/event-image-gallery">Review all 18 demonstration images</Link></p>
    <h2 className="eyebrow" style={{ marginTop: 32 }}>Upcoming event states</h2>
    <HomepageStatePreview events={events} />
    <section className="logo-preview-grid" aria-labelledby="logo-candidate-heading"><h2 id="logo-candidate-heading">Botanical logo candidate</h2><div className="logo-preview logo-on-dark"><BrandLogo /><p>Dark background</p></div><div className="logo-preview logo-on-light"><BrandLogo /><p>Light background</p></div></section>
  </main>;
}
