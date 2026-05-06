# Aevra

Aevra is a Strava-like fitness and race platform built from the survey requirements in `Survey of Strava and Competing Apps.pdf`.

The repo now contains:

- `apps/api`: NestJS API with auth, OTP demo flow, activities, streams, feed, clubs, challenges, races, billing hooks, integrations, validation, analytics, and GraphQL.
- `apps/web`: React/Vite app with a polished responsive UI for onboarding, recording, social feed, route exploration, clubs, challenges, live race tracking, training, subscriptions, integrations, and privacy controls.
- `packages/*`: shared types, analytics, config, and eventing contracts.

## Run Locally

1. Install dependencies:

```powershell
pnpm install
```

2. Start the API:

```powershell
pnpm dev
```

3. Start the web app in another terminal:

```powershell
pnpm dev:web
```

4. Open:

```text
http://localhost:5173
```

The API runs on:

```text
http://localhost:4000/api
```

## Demo Features

- Signup, login, and email OTP verification.
- GPS-style activity recording with timer, distance, pace, heart rate, laps, and safety beacon toggle.
- Activity posting into the feed.
- Kudos, comments, native sharing, link copy, WhatsApp, X, LinkedIn, and Instagram caption flow.
- Route builder, route list, segment-style leaderboard entry point.
- Clubs and challenges with join actions.
- Live race start, position update, leaderboard, spectator map, and send-a-cheer.
- Training coach screen with selectable guided sessions.
- Country-aware checkout provider selection.
- Integration connection UI for Strava, Garmin, Apple Health, and Health Connect.
- Privacy controls and deployment readiness checklist.

## Deployment

This project is ready to build as a web frontend plus API service. It is not production-live until real provider secrets are added.

Required provider setup before real users:

1. Create a production database, preferably Postgres plus TimescaleDB for stream data.
2. Create Redis for hot leaderboards, live race state, and queues.
3. Add a payment provider:
   - India: Razorpay for UPI, cards, netbanking, and wallets.
   - US, UK, Singapore, UAE, and similar markets: Stripe Checkout.
   - Other global fallback: PayPal Checkout.
4. Add email/SMS OTP provider such as Firebase Auth, AWS SES plus SNS, Twilio Verify, or a local provider.
5. Add OAuth credentials for Google and Apple.
6. Add map provider key such as Mapbox.
7. Add social app review/credentials only where direct posting APIs are required. Browser share and share-link flows work without private keys.

Useful environment variables are listed in `.env.example`.

## Build

```powershell
pnpm build
pnpm typecheck
```

For static frontend hosting, deploy `apps/web/dist`.

For API hosting, deploy `apps/api/dist` after `pnpm build:api`.
