# Aevra Deployment Checklist

## Current State

Aevra is worth deploying as a demo/MVP because the product flows are usable end to end:

- Web UI builds as a static Vite app.
- API builds as a NestJS service.
- Demo auth, OTP, activity tracking, race tracking, checkout selection, integrations, feed, sharing, challenges, and clubs work without external accounts.

It is not ready for paid public users until the provider-backed items below are connected.

## Production Steps

1. Choose hosting.

Use Vercel, Netlify, Cloudflare Pages, or S3/CloudFront for `apps/web/dist`.

Use Render, Railway, Fly.io, ECS, Kubernetes, Azure App Service, or Google Cloud Run for the NestJS API.

2. Add infrastructure.

Create Postgres for core data.

Create TimescaleDB or Postgres with Timescale extension for GPS/time-series streams.

Create Redis for live race state, leaderboards, sessions, and queues.

Create object storage for activity media.

3. Set environment variables.

Use `.env.example` as the source list.

Set `VITE_API_BASE_URL` in the web host to your deployed API URL plus `/api`.

Set `JWT_SECRET` to a long random production secret.

Set payment, email, OAuth, map, database, Redis, storage, and CDN values.

4. Connect real providers.

Razorpay for India checkout.

Stripe Checkout for card and wallet-heavy countries.

PayPal for broad fallback coverage.

Firebase/Twilio/AWS for OTP.

Google and Apple OAuth.

Mapbox for production maps and route planning.

5. Run checks.

```powershell
pnpm install
pnpm typecheck
pnpm build
```

6. Deploy.

Deploy the API first.

Deploy the web app second with `VITE_API_BASE_URL` pointed at the live API.

7. Validate after deploy.

Create account.

Verify OTP.

Record and finish an activity.

Share a feed post.

Join a challenge and club.

Start a race and send a cheer.

Open checkout for your selected country.

Connect a demo integration.

Check mobile layout.

## Known Production Gaps

- Runtime data is still in memory in the current API.
- Payment endpoints currently return configured checkout URLs or demo-mode activation.
- OTP returns a demo code until a real email/SMS provider is connected.
- OAuth returns demo tokens until Google/Apple credentials are connected.
- Map UI is a code-native route visualization until Mapbox is connected.
- Social posting uses native browser share and outbound share links. Direct posting requires each platform's review and permissions.
