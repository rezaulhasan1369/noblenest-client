import Image from "next/image";
import cleanup from "../../public/images/gallery/cleanup.webp";
import planting from "../../public/images/gallery/planting.webp";
import donation from "../../public/images/gallery/donation.webp";
import volunteering from "../../public/images/community-planting.webp";
import mentoring from "../../public/images/gallery/mentoring.webp";

const photos = [
  { image: cleanup, label: "Care for shared spaces", category: "Community cleanup", alt: "Gloved volunteers collecting forest litter into bags" },
  { image: planting, label: "Give green a beginning", category: "Planting & gardening", alt: "People tending young plants together at an outdoor workbench" },
  { image: donation, label: "Share what you can", category: "Food donations", alt: "Volunteers sorting canned food donations on a long table" },
  { image: volunteering, label: "Grow something together", category: "Community volunteering", alt: "Volunteers from different generations helping to plant a tree" },
  { image: mentoring, label: "Pass a little knowledge on", category: "Education & mentoring", alt: "An adult guiding schoolchildren through a book outdoors" },
];

export function CommunityGallery() {
  return <section id="community-gallery" className="community-gallery content-width" aria-labelledby="gallery-heading" tabIndex={-1}>
    <div className="section-heading section-heading-row"><div><p className="eyebrow">Many ways to make a difference</p><h2 id="gallery-heading">Good looks different<br />on everyone.</h2></div><p>Sometimes it’s a morning outdoors.<br />Sometimes it’s simply showing up.</p></div>
    <div className="gallery-grid">
      {photos.map((photo, index) => <figure key={photo.category}>
        <div className="gallery-image"><Image src={photo.image} alt={photo.alt} fill sizes="(max-width: 1023px) 50vw, 25vw" placeholder="blur" /></div>
        <figcaption><span className="gallery-number">0{index + 1}</span><div><p>{photo.category}</p><h3>{photo.label}</h3></div></figcaption>
      </figure>)}
    </div>
    <p className="section-note">Illustrative community-service photography, not a record of NobleNest events.</p>
  </section>;
}
