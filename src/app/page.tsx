import { HomeHero } from "@/components/home-hero";
import { CommunityImpact } from "@/components/community-impact";
import { HomeCommunity } from "@/components/home-community";
import { HomeFeatures } from "@/components/home-features";
import { UpcomingEvents } from "@/components/upcoming-events";
import { CommunityGallery } from "@/components/community-gallery";
import { NewsletterSection } from "@/components/newsletter-section";

export default function Home() {
  return <>
    <main id="main-content" tabIndex={-1}>
      <HomeHero />
      <CommunityImpact />
      <UpcomingEvents />
      <HomeCommunity />
      <HomeFeatures />
      <CommunityGallery />
      <NewsletterSection />
    </main>
  </>;
}
