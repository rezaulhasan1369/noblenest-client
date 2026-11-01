import type { Metadata } from "next";
import "./globals.css";
import "./reference-theme.css";
import { SiteChrome } from "@/components/site-chrome";
import { AuthProvider } from "@/components/auth-provider";
import { verifiedSession } from "@/lib/auth-server";
import { themeBootstrap } from "@/lib/theme";
export const metadata: Metadata = { title: "NobleNest. | Small acts. Big change.", description: "A little care for our communities and the world we share. Discover the NobleNest idea." };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await verifiedSession();
  const initialUser = session ? { name: session.user.name, email: session.user.email, image: session.user.image } : null;
  return <html lang="en" suppressHydrationWarning><head><script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head><body><AuthProvider initialUser={initialUser}><SiteChrome>{children}</SiteChrome></AuthProvider></body></html>;
}
