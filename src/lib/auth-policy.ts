export function safeReturnTo(value: unknown, fallback = "/profile") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\s\u0000-\u001f%]/.test(value)) return fallback;
  const normalized = new URL(value, "https://noblenest.invalid");
  if (normalized.pathname !== value.split(/[?#]/)[0] || /^\/(api|auth|login|register)(?:\/|$)/.test(normalized.pathname)) return fallback;
  return value;
}
export function authError(code?: string, status?: number) {
  if (code === "INVALID_EMAIL_OR_PASSWORD") return "Email or password is incorrect.";
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "An account could not be created with these details. Try logging in.";
  if (code === "TOO_MANY_REQUESTS" || status === 429) return "Too many attempts. Please wait before trying again.";
  if (status !== undefined && status >= 500) return "Authentication is temporarily unavailable. Please try again shortly.";
  return "Authentication could not be completed. Please try again.";
}
