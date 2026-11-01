import { requireSession } from "@/lib/auth-server";
import { safeReturnTo } from "@/lib/auth-policy";
import { OAuthComplete } from "@/components/oauth-complete";
import { PageShell } from "@/components/page-shell";
export default async function CompletePage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const destination = safeReturnTo((await searchParams).returnTo);
  await requireSession(destination);
  return <PageShell eyebrow="Welcome" title="A little good starts with you." description="Your account is ready."><OAuthComplete destination={destination} /></PageShell>;
}
