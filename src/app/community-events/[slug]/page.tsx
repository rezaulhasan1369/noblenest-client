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
  return <PageShell eyebrow={`Community idea ${image.id} | ${image.category}`} title={image.title} description="Explore the purpose and potential impact of this community-service idea.">
    <div className="concept-showcase">
      <figure><div className="concept-image"><Image src={image.cacheRevision ? `${image.src}?v=${image.cacheRevision}` : image.src} alt={image.alt} fill sizes="(max-width: 767px) 100vw, 65vw" /></div><figcaption className="section-note">AI-generated artwork.</figcaption></figure>
      <div className="concept-copy">
        <p className="eyebrow">Suggested setting</p><p>{concept.proposedLocation}, Bangladesh</p>
        <h2>The idea</h2><p>{concept.description}</p>
        <h2>Purpose &amp; anticipated impact</h2><p>{concept.anticipatedImpact}</p>
        <p className="section-note">Explore more community ideas or browse Upcoming Events.</p>
      </div>
    </div>
    <nav className="concept-navigation" aria-label="Community idea navigation"><Link className="text-link" href="/#community-gallery">Back to Gallery</Link><Link className="button button-solid" href="/events">Explore Upcoming Events</Link></nav>
  </PageShell>;
}
