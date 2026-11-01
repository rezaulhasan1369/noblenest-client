# NobleNest client — Phase D0

Node 24, npm. Run `npm ci`, copy `.env.example` to `.env.local`, then `npm run dev`.
Open http://localhost:3000 and use **Check backend connection** with the server running.

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.
Production locally: `npm run build` then `npm start`.

Set `NEXT_PUBLIC_API_BASE_URL` to the API origin, without a trailing slash or `/api`.
Next.js embeds this public value during build; rebuild after changing it. HTTPS is
required for remote production APIs. Loopback HTTP is allowed for local production tests.
No secrets belong in public variables. Configuration is checked when Next.js loads.

Vercel: import the independently approved client repository, root `.`, Node 24,
framework Next.js, install `npm ci`, build `npm run build`, default output settings.
Set the real HTTPS API origin in Production; configure Preview separately and explicitly
allow each approved preview origin on the server. No wildcard CORS.
Do not create or connect resources until the owner approves.

shadcn/ui prerequisites: Tailwind v4, TypeScript alias, `components.json`, `cn` utility,
class-variance-authority and animation CSS. Install component-specific dependencies and
approved theme tokens only when components are needed in later phases.

See `../docs/phase-d0-deployment-foundation.md` in the local workspace for the full
verification report and preserved design decisions. This client does not implement them.

## Deployment verification

- Production frontend: https://noblenest-client-dps25.vercel.app
- Production API: https://noblenest-api.onrender.com

After an approved GitHub push to `main`, verify that Vercel automatically creates
a production deployment, reaches READY, and reports the exact pushed Git commit SHA.
Confirm the frontend loads and reloads successfully, then use **Check backend
connection** to verify communication with the production API. Automatic deployment
remains unverified until these checks pass; do not substitute a manual deployment.
