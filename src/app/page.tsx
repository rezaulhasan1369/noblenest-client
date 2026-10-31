import { BackendHealth } from "@/components/backend-health";
export default function Home() {
  return <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-8">
    <p className="text-sm">Phase D0 / Deployment verification</p>
    <h1 className="text-4xl font-semibold">NobleNest</h1>
    <p>The frontend is running. Check the backend connection below.</p>
    <BackendHealth />
    <p className="text-sm text-gray-600">Authentication, events, and the approved visual design are planned for later phases.</p>
  </main>;
}
