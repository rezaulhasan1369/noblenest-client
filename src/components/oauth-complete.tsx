"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
export function OAuthComplete({ destination }: { destination: string }) {
  const router = useRouter(); const { notify } = useAuth();
  useEffect(() => { notify("Welcome to NobleNest."); router.replace(destination); router.refresh(); }, [destination, router, notify]);
  return <p role="status">You are signed in. Opening your page…</p>;
}
