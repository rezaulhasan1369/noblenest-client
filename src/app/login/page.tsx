import { PageShell } from "@/components/page-shell";
import { ConnectedAuthForm } from "@/components/connected-auth-form";
import { googleConfigured } from "@/lib/auth-server";
import { safeReturnTo } from "@/lib/auth-policy";
export default async function AuthPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
 const params = await searchParams;
 return <PageShell eyebrow="Welcome back" title="A little good starts with you." description="Sign in to make room for community in your day."><ConnectedAuthForm mode="login" returnTo={safeReturnTo(params.returnTo)} googleEnabled={googleConfigured()} /></PageShell>;
}
