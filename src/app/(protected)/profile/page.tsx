import { PageShell } from "@/components/page-shell";
import { googleConfigured, requireSession } from "@/lib/auth-server";
import { ProfileEditor } from "@/components/profile-editor";
export default async function ProfilePage() {
 const { user } = await requireSession("/profile");
 return <PageShell eyebrow="Your profile" title="The person behind the small acts." description="A home for your account and community participation."><ProfileEditor user={{ id: user.id, name: user.name, email: user.email, image: user.image }} googleEnabled={googleConfigured()} /></PageShell>;
}
