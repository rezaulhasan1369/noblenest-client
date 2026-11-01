"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const pathname = usePathname();
  if (pathname.startsWith("/dev/")) return children;
  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <SiteHeader home={pathname === "/"} upcomingEventsHref="/events" session={session} />
    {children}
    <SiteFooter signedIn={session.status === "signed-in"} />
  </>;
}
