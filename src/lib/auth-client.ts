"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthenticatedRequest } from "./protected-request";
export const authClient = createAuthClient({ plugins: [jwtClient()] });
// JWTs stay in memory for the duration of one request; never localStorage.
export const authenticatedApiFetch = createAuthenticatedRequest({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  getToken: signal => authClient.token({ fetchOptions: { signal, retry: 0 } }),
});
