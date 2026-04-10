# AGENTS.md

## Cursor Cloud specific instructions

### Overview

EdgeWield is a single Next.js 16 (App Router, Turbopack) application — a sports betting arbitrage terminal. All infrastructure (Supabase, Stripe, The Odds API, Resend) is cloud-hosted; there are no local databases or containers to run.

### Running the app

- **Dev server:** `npm run dev` (port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint, flat config in `eslint.config.mjs`)

### Environment variables

Copy `.env.example` → `.env.local` and fill in real values. The app starts without real keys but external-service features (auth, odds scanning, payments, email) will not work. See `.env.example` for the full list of required variables.

### Key caveats

- The Supabase client (`src/lib/supabase.ts`) returns `null` when env vars are missing — the app won't crash, but auth-gated routes (dashboard, terminal) will redirect or fail silently.
- `@supabase/auth-helpers-nextjs` is deprecated; the dependency still works but may emit npm warnings.
- There are no automated tests in this repo — validation relies on lint, build, and manual testing.
- There are duplicate library files at both `/lib/` and `/src/lib/` (e.g. supabase client, kelly engine). Changes may need to be applied in both locations.
