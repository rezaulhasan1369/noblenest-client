# NobleNest

A social development events platform for discovering community activities, creating initiatives and following participation. Built for Programming Hero Batch 14 Assignment 8, Category Hermione.

## Links and release status

- Official live website: https://noblenest-web.onrender.com
- Client repository: https://github.com/rezaulhasan1369/noblenest-client
- Server repository: https://github.com/rezaulhasan1369/noblenest-server
- Backend API: https://noblenest-api.onrender.com

The frontend and API are separate Render Free Node web services in Singapore, using the existing MongoDB Atlas database and restricted network access. The earlier Vercel frontend is retained as a rollback fallback, not the official submission website. Free services can sleep when idle, so first requests may take longer.

Production deployment, guest sessions/JWKS and public pages have passed verification. The owner reports production browser authentication acceptance at 9/9 PASS, including email/password, Google OAuth, protected-page refresh and logout. The existing local backend result is 78/78 PASS. Complete live event-management acceptance remains a separate check with approved QA data; these authentication results do not establish it.

## Features

- Email/password registration with name, email, required HTTPS photo URL, password validation and accessible success/error notifications.
- Public listings/details and the six nearest future events on the homepage.
- Authenticated creation, owner-only editing/deletion and private Manage Events.
- Authenticated Join Event with duplicate protection and date-ordered Joined Events.
- Session-aware navigation, profile photo, accessible display-name tooltip and logout.
- Profile viewing and name/photo updates; email remains read-only.
- Light/dark theme, responsive layouts and accessible static loading skeletons.
- Google OAuth using the existing Google client and official Render callback.
- Community Gallery with 18 approved illustrations and 18 standalone showcase pages, separate from scheduled MongoDB events.
- Newsletter design preview. Newsletter delivery and event search/filter are not implemented.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, design-token CSS and Better Auth with MongoDB sessions. Companion API: Express, MongoDB and verified short-lived JWTs. Existing dependencies and lockfile remain unchanged.

## Local development

Use Node.js 24 and npm. Run `npm ci` in each independent repository. Copy the client `.env.example` to ignored `.env.local` and the server `.env.example` to ignored `.env`, then privately supply approved development configuration. Automated tests must not target live Atlas.

Use the same loopback host everywhere. The verified local Express API uses **port 5000**, not 5001. Override legacy host/port examples in copied templates:

- Frontend and Better Auth origin: `http://127.0.0.1:3000`.
- Public API origin and JWT audience on both services: `http://127.0.0.1:5000`.
- Backend CORS origin and JWT issuer: the frontend origin above.
- Backend JWKS URL: the frontend origin followed by `/api/auth/jwks`.
- Backend `PORT`: 5000.

Start the API with `npm run dev` in the server repository, then the frontend with `npm run dev -- --hostname 127.0.0.1` in the client repository. Both services must use the same approved database and exact database-name spelling; its name must case-insensitively match NobleNest. No database is provisioned automatically.

Required client environment-variable names, without credential values:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Public API origin, embedded during build |
| `MONGODB_URI` | Private server-side database connection |
| `MONGODB_DB_NAME` | Existing NobleNest database |
| `BETTER_AUTH_SECRET` | Existing private secret, at least 32 characters |
| `BETTER_AUTH_URL` | Frontend/auth origin |
| `AUTH_JWT_AUDIENCE` | Same API origin used by the backend |
| `GOOGLE_CLIENT_ID` | Existing Google client, required for Google login |
| `GOOGLE_CLIENT_SECRET` | Existing private Google OAuth secret |

The API additionally needs `PORT`, `NODE_ENV`, `CLIENT_ORIGIN`, `AUTH_JWT_ISSUER` and `AUTH_JWKS_URL`, plus its MongoDB and audience variables. Configure all three API auth URLs together. Never put secrets in public variables, source, screenshots or commits. Remote production origins require HTTPS.

Checks: npm run typecheck, npm run lint, npm run build. Production locally: npm run build then npm start. Run builds/browser checks sequentially. Workspace frontend tests live under ../docs; see the D5 completion report for commands and evidence boundaries.

Production mode intentionally rejects local HTTP auth origins. Render builds with `npm ci --include=dev && npm run build` and starts with `npm run start -- --hostname 0.0.0.0 --port $PORT`. The deployed build also checks the approved source revision. Documentation HEADs and deployed revisions are recorded separately; a documentation push alone does not establish a new deployment.

## Authentication and security

Better Auth owns registration, cookies, sessions and logout. Protected Next pages verify a server session. Private API requests use in-memory Bearer JWTs with signature, issuer, audience, scope and active-session checks. Creator IDs control ownership; new events privately store creator email from a trusted server account lookup, never from the request body. Public event DTOs omit email.

Profile changes allow only name/photo, with session-owned updates and refreshed navigation. Existing accounts without a photo can still log in; required photo validation applies to new email/password registrations and profile updates. No email verification or password-reset flow was added.

Email/password and Google OAuth production flows have passed owner-supervised acceptance. The Google callback is the official Render origin followed by `/api/auth/callback/google`. GitHub OAuth is not implemented. Future auth configuration changes require targeted verification.

## Database and deployment prerequisites

Joining requires a usable full unique participant index on {eventId:1,userId:1} and appropriate database permissions. The API fails closed when it cannot confirm the index; it never creates that index. Provisioning needs separate owner-authorized operational work. Historical events without creatorEmail remain readable/editable and are not backfilled with invented values.

Local tests use isolated data and do not establish live event persistence. Before submission, complete approved production CRUD/isolation and joining/duplicate checks. Event deletion currently does not cascade participation deletion; joined listings hide missing-event references. Orphan-free cleanup is not established. The homepage implements a six-event limit, but needs six valid future records to demonstrate that count live. Durable event API abuse protection remains a follow-up; no rate-limit infrastructure was provisioned.

Use the approved hosting project/environment and obtain owner review before publication. A healthy liveness endpoint alone does not establish database or authenticated feature readiness.
