import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PREMIUM_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET',
  'ODDS_API_KEY',
] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

export async function GET() {
  const missing: RequiredEnvVar[] = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        missing,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    missing: [],
  });
}
