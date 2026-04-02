import { NextResponse } from 'next/server';
import { fetchOddsApiEvents, scanForArbOpportunities } from '@/lib/oddsScanner';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function isPeakHour(now: Date) {
  const hour = now.getHours();
  return hour >= 17 && hour <= 22;
}

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ODDS_API_KEY', synced: false }, { status: 500 });
  }

  try {
    const now = new Date();
    const peak = isPeakHour(now);
    const events = await fetchOddsApiEvents({ apiKey });
    const arbs = scanForArbOpportunities(events);
    const supabase = getSupabaseAdmin();

    // Keep table as latest snapshot for the live terminal feed.
    await supabase.from('live_arbs').delete().not('id', 'is', null);

    if (arbs.length > 0) {
      const { error } = await supabase.from('live_arbs').insert(arbs);
      if (error) {
        throw new Error(`Failed to insert synced arbs: ${error.message}`);
      }
    }

    return NextResponse.json({
      synced: true,
      peak_time: peak,
      records: arbs.length,
      scanned_events: events.length,
      synced_at: now.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown sync failure';
    console.error('sync_odds_failed', message);
    return NextResponse.json({ error: 'Odds sync failed', synced: false }, { status: 500 });
  }
}
