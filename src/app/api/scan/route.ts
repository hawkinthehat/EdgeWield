import { NextResponse } from 'next/server';
import { fetchOddsApiEvents, scanForArbOpportunities } from '@/lib/oddsScanner';

export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ODDS_API_KEY', arbs: [] }, { status: 500 });
  }

  try {
    const events = await fetchOddsApiEvents({ apiKey });
    const arbs = scanForArbOpportunities(events);

    return NextResponse.json({ arbs, scanned_events: events.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown scan failure';
    console.error('scan_failed', message);
    return NextResponse.json({ error: 'Scout failed to initialize', arbs: [] }, { status: 500 });
  }
}
