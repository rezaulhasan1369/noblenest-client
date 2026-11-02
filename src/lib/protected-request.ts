type TokenResult = { data?: { token?: string } | null; error?: unknown };
export function createAuthenticatedRequest({ baseUrl, getToken, request = fetch, timeoutMs = 15000 }: {
  baseUrl?: string; getToken: (signal: AbortSignal) => Promise<TokenResult>; request?: typeof fetch; timeoutMs?: number;
}) {
  return async (path: string, init: RequestInit = {}) => {
    if (!path.startsWith("/api/") || path.includes("..") || path.includes("\\")) throw Error("Invalid API path");
    if (!baseUrl) throw Error("API is not configured");
    const timeout = AbortSignal.timeout(timeoutMs);
    const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
    signal.throwIfAborted();
    // Race as well as passing the signal: a stalled transport must not keep the
    // UI pending or cause a mutation after cancellation, even if it ignores abort.
    let abort: (() => void) | undefined;
    let token: TokenResult;
    try {
      token = await new Promise<TokenResult>((resolve, reject) => {
        abort = () => reject(signal.reason);
        signal.addEventListener("abort", abort, { once: true });
        Promise.resolve().then(() => { signal.throwIfAborted(); return getToken(signal); })
          .then(resolve, reject);
      });
    } catch {
      if (signal.aborted) throw signal.reason;
      throw Error("Authentication is temporarily unavailable.");
    } finally {
      // Clean up when the race settles, even if getToken never settles.
      if (abort) signal.removeEventListener("abort", abort);
    }
    signal.throwIfAborted();
    if (token.error || !token.data?.token) throw Error("Please log in again.");
    const headers = new Headers(init.headers); headers.set("Authorization", "Bearer " + token.data.token);
    return request(new URL(path, baseUrl), { ...init, signal, headers, credentials: "omit", cache: "no-store", redirect: "error" });
  };
}
