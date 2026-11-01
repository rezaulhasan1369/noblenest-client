import Link from "next/link";

/** Original botanical candidate: two leaves grow from one shared stem. */
export function BotanicalMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 42C10 39 5 29 6 14c12 1 21 8 18 28Z" fill="currentColor" />
    <path d="M25 37C22 20 30 7 44 4c1 17-5 29-19 33Z" fill="currentColor" />
    <path d="M24 43C24 28 30 16 38 10M24 41C22 31 16 23 11 19" stroke="var(--logo-vein, #0b2b26)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>;
}

export function BrandLogo() {
  return (
    <Link className="brand" href="/#home" aria-label="NobleNest. Home">
      <span className="brand-badge"><BotanicalMark /></span>
      <span className="brand-wordmark">NobleNest</span>
    </Link>
  );
}
