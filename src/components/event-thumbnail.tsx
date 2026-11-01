"use client";

import Image from "next/image";
import { useState } from "react";

type ImageVariant = { src: string; width: number };
const sizes = "(max-width: 599px) 100vw, (max-width: 1023px) 50vw, 33vw";

export function EventThumbnail({ src, alt, variants, fit = "cover" }: { src: string; alt: string; variants?: readonly ImageVariant[]; fit?: "cover" | "contain" }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <div className="event-image-fallback" role="img" aria-label={`Image unavailable: ${alt}`}><span aria-hidden="true">◇</span><span>Community activity</span><small>Image unavailable</small></div>
    : <picture>
      {variants?.length ? <source type="image/webp" srcSet={variants.map(image => `${image.src} ${image.width}w`).join(", ")} sizes={sizes} /> : null}
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: fit }} unoptimized onError={() => setFailed(true)} />
    </picture>;
}
