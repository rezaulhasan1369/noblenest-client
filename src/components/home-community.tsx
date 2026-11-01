import Image from "next/image";
import cleanup from "../../public/images/gallery/cleanup.webp";
import donation from "../../public/images/gallery/donation.webp";
import { ArrowIcon } from "./arrow-icon";
import { BotanicalMark } from "./brand-logo";

export function HomeCommunity() {
  return <section id="our-purpose" className="community-section" aria-labelledby="purpose-heading" tabIndex={-1}>
    <div className="content-width community-inner">
      <div className="community-copy"><p className="eyebrow">More than events · the NobleNest idea</p>
        <h2 id="purpose-heading">People. Purpose.<br /><em>Possibility.</em></h2>
        <p>A better world begins a little closer to home. NobleNest is taking shape as a place to find meaningful activities, share your ideas, and connect through a cause.</p>
        <a href="#features" className="button button-light">Find your little good <ArrowIcon /></a>
      </div>
      <div className="community-collage">
        <div className="community-main-photo"><Image src={cleanup} alt="Volunteers caring for shared woodland by collecting litter" fill sizes="(max-width: 767px) 80vw, 28vw" placeholder="blur" /></div>
        <div className="community-small-photo"><Image src={donation} alt="People working side by side to sort food donations" fill sizes="(max-width: 767px) 45vw, 15vw" placeholder="blur" /></div>
        <BotanicalMark className="community-leaf" />
      </div>
      <div id="ways-to-help" className="community-values" tabIndex={-1}><p className="eyebrow">What&apos;s your little good?</p>
        <p><BotanicalMark />Meet like-minded people</p><p><BotanicalMark />Support a local cause</p><p><BotanicalMark />Contribute to a stronger community</p>
        <span>Illustrative photography. Event participation will be connected in a later phase.</span>
      </div>
    </div>
  </section>;
}
