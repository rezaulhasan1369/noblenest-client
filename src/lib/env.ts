export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) throw new Error("API URL is not configured");
  const url = new URL(value);
  if (url.origin !== value || !["http:", "https:"].includes(url.protocol)) throw new Error("API URL must be an HTTP origin without a trailing slash");
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) throw new Error("Production API URL must use HTTPS");
  return value;
}
