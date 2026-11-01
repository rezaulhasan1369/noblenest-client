import { PageShell } from "@/components/page-shell";
import { ConnectedAuthForm } from "@/components/connected-auth-form";
import { googleConfigured } from "@/lib/auth-server";
import { safeReturnTo } from "@/lib/auth-policy";
export default async function AuthPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
 const params = await searchParams;
 return <PageShell eyebrow="A shared beginning" title="Find your place in NobleNest." description="Bring your kindness, your ideas, and a little of your time."><ConnectedAuthForm mode="register" returnTo={safeReturnTo(params.returnTo)} googleEnabled={googleConfigured()} /></PageShell>;
}
