import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REQUIRED_ENV_SETS: Array<{ label: string; keys: string[] }> = [
  { label: 'NEXT_PUBLIC_URL_OR_SITE_URL', keys: ['NEXT_PUBLIC_URL', 'NEXT_PUBLIC_SITE_URL'] },
  { label: 'NEXT_PUBLIC_SUPABASE_URL', keys: ['NEXT_PUBLIC_SUPABASE_URL'] },
  { label: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', keys: ['NEXT_PUBLIC_SUPABASE_ANON_KEY'] },
  { label: 'SUPABASE_SERVICE_ROLE_KEY', keys: ['SUPABASE_SERVICE_ROLE_KEY'] },
  { label: 'STRIPE_SECRET_KEY', keys: ['STRIPE_SECRET_KEY'] },
  { label: 'STRIPE_PRICE_ID_SCOUT', keys: ['STRIPE_PRICE_ID_SCOUT'] },
  { label: 'STRIPE_PRICE_ID_PRO', keys: ['STRIPE_PRICE_ID_PRO'] },
  { label: 'STRIPE_WEBHOOK_SECRET', keys: ['STRIPE_WEBHOOK_SECRET'] },
  { label: 'THE_ODDS_API_KEY_OR_ODDS_API_KEY', keys: ['THE_ODDS_API_KEY', 'ODDS_API_KEY'] },
];

export async function GET() {
  const missing = REQUIRED_ENV_SETS.filter((set) => !set.keys.some((name) => process.env[name])).map(
    (set) => set.label,
  );

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
