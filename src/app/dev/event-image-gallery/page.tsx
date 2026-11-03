import { notFound } from "next/navigation";
import Link from "next/link";
import { eventImageManifest } from "@/lib/event-image-manifest";
import { EventThumbnail } from "@/components/event-thumbnail";
import { EventCard } from "@/components/event-card";
import { createDemoEvent } from "@/app/dev/event-fixtures";
import "./review.css";

export default function EventImageGallery() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main className="content-width state-preview-page asset-review-page">
    <p className="eyebrow">Development only · owner-selected AI imagery</p>
    <h1>Event image review</h1>
    <p>18 demonstration assets, in the owner’s numbered order. These images illustrate fictional concepts; they are not records of actual events or verified locations. No event records or subscriptions are created here.</p>
    <nav aria-label="Development previews"><Link className="text-link" href="/dev/homepage-states">Six-event card preview</Link><Link className="text-link" href="/">Return to homepage</Link></nav>
    <div className="asset-review-grid">{eventImageManifest.map(image => <article className="asset-review-item" id={`asset-${image.id}`} key={image.id}>
      <div className="asset-review-image" style={{ aspectRatio: `${image.width} / ${image.height}` }}><EventThumbnail src={image.src} alt={image.alt} variants={image.variants} fit="contain" /></div>
      <div className="asset-review-copy"><p className="eyebrow">Demo {image.id} · {image.category}</p><h2>{image.title}</h2>
        <dl><dt>Selected source</dt><dd>{image.source.split("/").slice(-2).join("/")}</dd>
          <dt>Source dimensions / file size</dt><dd>{image.sourceWidth} × {image.sourceHeight}px · {(image.sourceBytes / 1024).toFixed(1)} KiB</dd>
          <dt>Optimized dimensions / file size</dt><dd>{image.width} × {image.height}px · {(image.bytes / 1024).toFixed(1)} KiB</dd>
          <dt>Optimized filename</dt><dd>{image.src.split("/").at(-1)}</dd></dl>
        {image.concerns.map(concern => <p className="asset-review-concern" key={concern}>{concern}</p>)}
        <a className="text-link" href={image.src}>Open full-resolution WebP</a>
      </div>
    </article>)}</div>
    <section className="asset-thumbnail-review" aria-labelledby="replacement-heading"><h2 id="replacement-heading">Replacement thumbnail checks</h2><p>Event 12 uses its original resolution. Event 14 uses the replacement workshop image in its original 4:3 aspect ratio.</p>
      <div className="asset-replacement-grid">{eventImageManifest.filter(image => image.id === "12" || image.id === "14").map(image => <div id={`thumbnail-${image.id}`} key={image.id}><EventCard event={createDemoEvent(image)} preview /></div>)}</div>
    </section>
  </main>;
}
