import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { communityEventConcepts } from "@/lib/community-event-concepts";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return communityEventConcepts.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const concept = communityEventConcepts.find(item => item.slug === slug);
  return { title: concept ? `${concept.image.title} | NobleNest community idea` : "Community idea not found | NobleNest" };
}
export default async function CommunityEventShowcase({ params }: Props) {
  const { slug } = await params;
  const concept = communityEventConcepts.find(item => item.slug === slug);
  if (!concept) notFound();
  const { image } = concept;
  return <PageShell eyebrow={`Community idea ${image.id} | ${image.category}`} title={image.title} description="An illustrative community-service concept, not a scheduled event.">
    <div className="concept-showcase">
      <figure><div className="concept-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 100vw, 65vw" /></div><figcaption className="section-note">AI-generated illustration. No real activity or attendance is documented by this image.</figcaption></figure>
      <div className="concept-copy">
        <p className="eyebrow">Proposed location</p><p>{concept.proposedLocation} - suggested by the illustration title; no venue is confirmed.</p>
        <h2>The idea</h2><p>{concept.description}</p>
        <h2>Purpose &amp; anticipated impact</h2><p>{concept.anticipatedImpact}</p>
        <p className="section-note">This concept has no confirmed date, organizer or registration. Explore Upcoming Events for actual event listings.</p>
      </div>
    </div>
    <nav className="concept-navigation" aria-label="Community idea navigation"><Link className="text-link" href="/#community-gallery">Back to Gallery</Link><Link className="button button-solid" href="/events">Explore Upcoming Events</Link></nav>
  </PageShell>;
}
