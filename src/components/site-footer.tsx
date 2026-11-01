import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter({ signedIn = false }: { signedIn?: boolean }) {
  return <footer className="site-footer">
    <div className="footer-art" aria-hidden="true" />
    <div className="content-width footer-content">
      <div className="footer-grid">
        <div className="footer-mission"><BrandLogo /><p>A little care for our communities.<br />A little hope for the world we share.</p><span>Small acts. Big change.</span></div>
        <nav aria-label="Footer explore"><h2>Quick Links</h2><Link href="/">Home</Link><Link href="/#our-purpose">Our purpose</Link><Link href="/events">Upcoming Events</Link><Link href="/#community-gallery">Community gallery</Link></nav>
        <nav aria-label="Footer account"><h2>Make room for good</h2>{!signedIn && <p className="form-hint">Sign in to access your account.</p>}<Link href={signedIn ? "/create-event" : "/login?returnTo=%2Fcreate-event"}>Create Event</Link><Link href={signedIn ? "/manage-events" : "/login?returnTo=%2Fmanage-events"}>Manage Events</Link><Link href={signedIn ? "/joined-events" : "/login?returnTo=%2Fjoined-events"}>Joined Events</Link><Link href={signedIn ? "/profile" : "/login?returnTo=%2Fprofile"}>Your profile</Link></nav>
        <nav aria-label="Footer resources"><h2>Explore more</h2><Link href="/#features">How it will work</Link><Link href="/#ways-to-help">Ways to help</Link><Link href="/#newsletter">Newsletter preview</Link><Link href={signedIn ? "/profile" : "/register"}>{signedIn ? "Your account" : "Create an account"}</Link></nav>
      </div>
      <div className="footer-bottom"><p>© {new Date().getUTCFullYear()} NobleNest. Built around community.</p><p>Rooted in kindness. Growing together.</p></div>
    </div>
  </footer>;
}
