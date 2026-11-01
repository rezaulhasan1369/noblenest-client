"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({ plugins: [jwtClient()] });
// JWTs stay in memory for the duration of one request; never localStorage.
export async function authenticatedApiFetch(path: string, init: RequestInit = {}) {
  if (!path.startsWith("/api/") || path.includes("..") || path.includes("\\")) throw Error("Invalid API path");
  const origin = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!origin) throw Error("API is not configured");
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw Error("Please log in again.");
  const headers = new Headers(init.headers); headers.set("Authorization", "Bearer " + data.token);
  return fetch(new URL(path, origin), { ...init, headers, credentials: "omit", cache: "no-store", redirect: "error" });
}
