import Image from "next/image";
import Link from "next/link";
import { communityEventConcepts } from "@/lib/community-event-concepts";

export function CommunityGallery() {
  return <section id="community-gallery" className="community-gallery content-width" aria-labelledby="gallery-heading" tabIndex={-1}>
    <div className="section-heading section-heading-row"><div><p className="eyebrow">Many ways to make a difference</p><h2 id="gallery-heading">Good looks different<br />on everyone.</h2></div><p>Explore 18 ideas for caring<br />for the places we share.</p></div>
    <div className="concept-gallery-grid">
      {communityEventConcepts.map(({ slug, image }) => <Link key={slug} href={`/community-events/${slug}`} className="concept-gallery-card" aria-labelledby={`concept-title-${image.id}`}>
        <figure>
          <div className="concept-image"><Image src={image.cacheRevision ? `${image.src}?v=${image.cacheRevision}` : image.src} alt={image.alt} fill sizes="(max-width: 389px) 100vw, (max-width: 1023px) 50vw, 33vw" /></div>
          <figcaption><span className="gallery-number" aria-hidden="true">{image.id}</span><div><p>{image.category}</p><h3 id={`concept-title-${image.id}`}>{image.title}</h3></div></figcaption>
        </figure>
      </Link>)}
    </div>
    <p className="section-note">Explore each idea to learn about its purpose and potential impact.</p>
  </section>;
}
