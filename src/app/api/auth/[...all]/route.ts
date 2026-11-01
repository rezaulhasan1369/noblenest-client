import { getAuth } from "@/lib/auth-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handler(request: Request) {
  try {
    let boundedRequest = request;
    if (request.body) {
      const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let length = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > 16384) { await reader.cancel(); return Response.json({ error: "Request too large" }, { status: 413 }); } chunks.push(value); }
      const body = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
      boundedRequest = new Request(request.url, { method: request.method, headers: request.headers, body });
    }
    const result = await getAuth().handler(boundedRequest);
    if (result.status >= 500) return Response.json({ code: "AUTH_UNAVAILABLE", message: "Authentication is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    result.headers.set("Cache-Control", "no-store"); return result;
  } catch { return Response.json({ code: "AUTH_UNAVAILABLE", message: "Authentication is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
export { handler as GET, handler as POST };
