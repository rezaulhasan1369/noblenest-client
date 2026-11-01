import { notFound } from "next/navigation";
import Link from "next/link";
import { BackendHealth } from "@/components/backend-health";

export default function DevelopmentVerification() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-8">
    <h1 className="text-3xl font-semibold">NobleNest D0 verification</h1>
    <p>Development-only frontend-to-backend connectivity check.</p>
    <BackendHealth />
    <Link href="/">Return to homepage</Link>
  </main>;
}
