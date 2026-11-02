import "server-only";
import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { validateAuth, profileUpdateInput } from "./form-validation";
import { safeReturnTo } from "./auth-policy";

function explicitOrigin(value: string) {
  const url = new URL(value);
  if (url.origin !== value || url.username || url.password || (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) throw Error("Invalid authentication origin");
  return value;
}
function buildAuth() {
  const { MONGODB_URI, MONGODB_DB_NAME, BETTER_AUTH_SECRET, BETTER_AUTH_URL, AUTH_JWT_AUDIENCE } = process.env;
  if (!MONGODB_URI || MONGODB_DB_NAME?.toLowerCase() !== "noblenest" || !BETTER_AUTH_SECRET || BETTER_AUTH_SECRET.length < 32 || !BETTER_AUTH_URL || !AUTH_JWT_AUDIENCE) throw Error("Authentication configuration unavailable");
  const origin = explicitOrigin(BETTER_AUTH_URL), audience = explicitOrigin(AUTH_JWT_AUDIENCE);
  const client = new MongoClient(MONGODB_URI, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 10000 });
  return betterAuth({
    appName: "NobleNest", baseURL: origin, secret: BETTER_AUTH_SECRET,
    database: mongodbAdapter(client.db(MONGODB_DB_NAME), { client }),
    disabledPaths: ["/request-password-reset", "/reset-password", "/change-password", "/delete-user", "/change-email"],
    trustedOrigins: [origin], logger: { disabled: true },
    advanced: { cookiePrefix: "noblenest", useSecureCookies: process.env.NODE_ENV === "production", database: { generateId: () => randomUUID() } },
    emailAndPassword: { enabled: true, minPasswordLength: 6, maxPasswordLength: 128, requireEmailVerification: false, autoSignIn: true },
    user: { modelName: "nn_auth_user" }, account: { modelName: "nn_auth_account" }, verification: { modelName: "nn_auth_verification" },
    session: { modelName: "nn_auth_session", expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "database", modelName: "nn_auth_rate_limit", window: 60, max: 60, customRules: { "/sign-in/email": { window: 60, max: 5 }, "/sign-up/email": { window: 60, max: 5 } } },
    socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } } : {},
    hooks: { before: createAuthMiddleware(async ctx => {
      if (ctx.path === "/update-user") {
        try { ctx.body = profileUpdateInput(ctx.body); }
        catch { throw new APIError("BAD_REQUEST", { message: "Use a valid name and HTTPS profile photo. Only profile fields can be changed." }); }
        return;
      }
      if (ctx.path !== "/sign-up/email") return;
      const body = ctx.body;
      if (!body || typeof body.email !== "string" || typeof body.password !== "string" || typeof body.name !== "string" || (body.image !== undefined && typeof body.image !== "string") || Object.keys(validateAuth(body, "register")).length) throw new APIError("BAD_REQUEST", { message: "Check the registration fields and password requirements." });
    }) },
    plugins: [jwt({ disableSettingJwtHeader: true, schema: { jwks: { modelName: "nn_auth_jwks" } }, jwt: { issuer: origin, audience, expirationTime: "5m", definePayload: ({ session }) => ({ sid: session.id, scope: "noblenest:events" }) } })],
  });
}
type AuthInstance = ReturnType<typeof buildAuth>;
const globals = globalThis as typeof globalThis & { nobleNestAuth?: AuthInstance };
export function getAuth() { return globals.nobleNestAuth ??= buildAuth(); }
export const verifiedSession = cache(async () => {
  const requestHeaders = await headers();
  if (!requestHeaders.get("cookie")?.includes("noblenest")) return null;
  try { return await getAuth().api.getSession({ headers: requestHeaders }); } catch { return null; }
});
export async function requireSession(returnTo: string) {
  const session = await verifiedSession();
  if (!session) redirect("/login?returnTo=" + encodeURIComponent(safeReturnTo(returnTo)));
  return session;
}
export function googleConfigured() { return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET); }
