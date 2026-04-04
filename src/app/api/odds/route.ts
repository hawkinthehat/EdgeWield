import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;
  const sport = 'upcoming';
  const region = 'us';

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ODDS_API_KEY' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v3/odds/?apiKey=${apiKey}&sport=${sport}&region=${region}&mkt=h2h`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch odds feed' }, { status: response.status });
    }

    const data = (await response.json()) as unknown;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
