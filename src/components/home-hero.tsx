import Image from "next/image";
import heroPhoto from "../../public/images/community-planting.webp";
import Link from "next/link";
import { BotanicalMark } from "./brand-logo";
import { ArrowIcon } from "@/components/arrow-icon";

export function HomeHero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading" tabIndex={-1}>
      <div className="hero-content content-width">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="small-seed" /> Rooted in kindness. Growing together.</p>
          <h1 id="hero-heading">Small acts.<br /><span>Big change.</span></h1>
          <p className="hero-description">Find a cause close to your heart. Meet people who care. Make a little room for a kinder, greener community.</p>
          <div className="hero-actions">
            <Link href="/events" className="button button-light">Explore Events <ArrowIcon /></Link>
            <Link href="/create-event" className="button hero-secondary" aria-describedby="hero-account-note">Create Event</Link>
          </div>
          <p className="hero-account-note" id="hero-account-note">An account is required to prepare an initiative. Live event publishing is coming later.</p>
        </div>
        <figure className="hero-visual">
          <div className="hero-photo-frame"><Image src={heroPhoto} alt="A group of volunteers working together to plant a young tree" fill sizes="(max-width: 767px) 90vw, 50vw" preload placeholder="blur" className="hero-photo" /></div>
          <BotanicalMark className="hero-leaf" />
          <figcaption>Rooted in care.<br /><em>Grown together.</em></figcaption>
        </figure>
      </div>
    </section>
  );
}
