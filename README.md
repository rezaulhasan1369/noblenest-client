# NobleNest

A social development events platform for discovering community activities, creating initiatives and following participation. Built for Programming Hero Batch 14 Assignment 8, Category Hermione.

## Links and release status

- Live frontend: https://noblenest-client-dps25.vercel.app — **current deployment revision/functionality unverified**; local D5 changes are not pushed or deployed.
- Client repository: https://github.com/rezaulhasan1369/noblenest-client
- Server repository: https://github.com/rezaulhasan1369/noblenest-server
- API: https://noblenest-api.onrender.com — current revision/database readiness unverified.

Repository links are documented submission targets; external accessibility was not checked in this phase.

## Features

- Email/password registration with name, email, required HTTPS photo URL, password validation and accessible success/error notifications.
- Public listings/details and the six nearest future events on the homepage.
- Authenticated creation, owner-only editing/deletion and private Manage Events.
- Authenticated Join Event with duplicate protection and date-ordered Joined Events.
- Session-aware navigation, profile photo, accessible display-name tooltip and logout.
- Profile viewing and name/photo updates; email remains read-only.
- Light/dark theme, responsive layouts and accessible static loading skeletons.
- Static community gallery and newsletter design. Newsletter delivery and search/filter are outside the supplied rubric.

## Technology

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, design-token CSS and Better Auth with MongoDB sessions. Companion API: Express, MongoDB and verified short-lived JWTs. Existing dependencies and lockfile remain unchanged.

## Local development

Use Node.js 24 and npm. Run npm ci, copy .env.example to the ignored .env.local and privately supply approved development configuration. Start the companion API, then npm run dev. Use one consistent loopback host and matching ports for auth origins, JWT audience and CORS.

Example (placeholders only):

    NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5001
    MONGODB_URI=<approved-development-mongodb-uri>
    MONGODB_DB_NAME=noblenest
    BETTER_AUTH_SECRET=<private-random-secret-at-least-32-characters>
    BETTER_AUTH_URL=http://127.0.0.1:3000
    AUTH_JWT_AUDIENCE=http://127.0.0.1:5001

Configure the API with the same database/issuer/audience pair, PORT=5001 and CLIENT_ORIGIN=http://127.0.0.1:3000. No database is provisioned automatically. Never put secrets in public variables, source, screenshots or commits. NEXT_PUBLIC_API_BASE_URL is embedded during build. Remote production origins must use HTTPS.

Checks: npm run typecheck, npm run lint, npm run build. Production locally: npm run build then npm start. Run builds/browser checks sequentially. Workspace frontend tests live under ../docs; see the D5 completion report for commands and evidence boundaries.

## Authentication and security

Better Auth owns registration, cookies, sessions and logout. Protected Next pages verify a server session. Private API requests use in-memory Bearer JWTs with signature, issuer, audience, scope and active-session checks. Creator IDs control ownership; new events privately store creator email from a trusted server account lookup, never from the request body. Public event DTOs omit email.

Profile changes allow only name/photo, with session-owned updates and refreshed navigation. Existing accounts without a photo can still log in; required photo validation applies to new email/password registrations and profile updates. No email verification or password-reset flow was added.

Google/GitHub OAuth completion and actual provider verification are **deferred to the owner**. Existing conditional Google wiring is unchanged; a visible provider button is not proof of a working round trip.

## Database and deployment prerequisites

Joining requires a usable full unique participant index on {eventId:1,userId:1} and appropriate database permissions. The API fails closed when it cannot confirm the index; it never creates that index. Provisioning needs separate owner-authorized operational work. Historical events without creatorEmail remain readable/editable and are not backfilled with invented values.

Local tests use isolated data and do not establish real persistence or deployed readiness. Before submission, verify registration/login/refresh/logout, two-account CRUD/isolation, joining/duplicates, exact deployed revisions, deep links and private-route refresh. Durable event API abuse protection remains a follow-up; no rate-limit infrastructure was provisioned.

Use the approved hosting project/environment and obtain owner review before publication. A healthy liveness endpoint alone does not establish database or authenticated feature readiness.
