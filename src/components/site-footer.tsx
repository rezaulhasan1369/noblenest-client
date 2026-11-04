import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { EDUCATIONAL_DISCLOSURE } from "@/lib/educational-disclosure";
import "./site-footer.css";

const socialPlaceholders = [
  { name: "X", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231ZM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77Z" /> },
  { name: "Instagram", icon: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1.1" /></> },
  { name: "Facebook", icon: <path d="M14.1 22v-9.1h3.1l.5-3.6h-3.6V7c0-1 .3-1.7 1.8-1.7h1.9V2.1c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.5H7.2v3.6h3.1V22h3.8Z" /> },
  { name: "YouTube", icon: <path fillRule="evenodd" d="M21.6 6.3a2.7 2.7 0 0 0-1.9-1.9C18 4 12 4 12 4s-6 0-7.7.4a2.7 2.7 0 0 0-1.9 1.9C2 8 2 12 2 12s0 4 .4 5.7a2.7 2.7 0 0 0 1.9 1.9C6 20 12 20 12 20s6 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9C22 16 22 12 22 12s0-4-.4-5.7ZM10 8.5l6 3.5-6 3.5v-7Z" /> },
];

export function SiteFooter({ signedIn = false }: { signedIn?: boolean }) {
  return <footer className="site-footer">
    <div className="footer-art" aria-hidden="true" />
    <div className="content-width footer-content">
      <div className="footer-grid">
        <div className="footer-mission"><BrandLogo /><p>A little care for our communities.<br />A little hope for the world we share.</p><span>Small acts. Big change.</span>
          <div className="footer-social">
            <ul aria-label="Social media placeholders">{socialPlaceholders.map(({ name, icon }) => <li key={name}><span className="footer-social-placeholder" role="img" aria-label={`${name} — placeholder; no account linked`}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">{icon}</svg></span></li>)}</ul>
            <p className="footer-social-note">Social channels coming soon</p>
          </div>
        </div>
        <nav aria-label="Footer explore"><h2>Quick Links</h2><Link href="/">Home</Link><Link href="/#our-purpose">Our purpose</Link><Link href="/events">Upcoming Events</Link><Link href="/#community-gallery">Community gallery</Link></nav>
        <nav aria-label="Footer account"><h2>Make room for good</h2>{!signedIn && <p className="form-hint">Sign in to access your account.</p>}<Link href={signedIn ? "/create-event" : "/login?returnTo=%2Fcreate-event"}>Create Event</Link><Link href={signedIn ? "/manage-events" : "/login?returnTo=%2Fmanage-events"}>Manage Events</Link><Link href={signedIn ? "/joined-events" : "/login?returnTo=%2Fjoined-events"}>Joined Events</Link><Link href={signedIn ? "/profile" : "/login?returnTo=%2Fprofile"}>Your profile</Link></nav>
        <nav aria-label="Footer resources"><h2>Explore more</h2><Link href="/#features">How it works</Link><Link href="/#ways-to-help">Ways to help</Link><Link href="/#newsletter">Newsletter preview</Link><Link href={signedIn ? "/profile" : "/register"}>{signedIn ? "Your account" : "Create an account"}</Link></nav>
      </div>
      <div className="footer-lower">
        <p id="educational-project-notice" tabIndex={-1}>{EDUCATIONAL_DISCLOSURE}</p>
        <div className="footer-bottom"><p>© {new Date().getUTCFullYear()} NobleNest. Built around community.</p><p>Rooted in kindness. Growing together.</p></div>
      </div>
    </div>
  </footer>;
}
