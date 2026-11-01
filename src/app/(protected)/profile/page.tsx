import { PageShell } from "@/components/page-shell";
import { requireSession } from "@/lib/auth-server";
import Image from "next/image";
import Link from "next/link";
export default async function ProfilePage() {
 const { user } = await requireSession("/profile");
 return <PageShell eyebrow="Your profile" title="The person behind the small acts." description="A home for your account and community participation."><section className="auth-panel profile-card"><Image src={user.image || "/images/profile-placeholder.svg"} alt="Your profile photo" width={80} height={80} unoptimized /><p className="eyebrow">A little good starts with you</p><h2>{user.name}</h2><p className="profile-email">{user.email}</p><span className="profile-status">Signed in to NobleNest</span><p className="form-hint">Your account information comes from your verified session. Profile editing is not available yet.</p><Link href="/joined-events" className="text-link">Your community journey</Link></section></PageShell>;
}
