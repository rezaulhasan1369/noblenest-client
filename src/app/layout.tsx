import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "NobleNest | Deployment verification", description: "NobleNest deployment foundation and backend connectivity check." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
