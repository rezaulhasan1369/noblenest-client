"use client";
import { createEventApi } from "./event-api";
import { authenticatedApiFetch } from "./auth-client";

export const eventsApi = createEventApi({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, authenticatedFetch: authenticatedApiFetch });
