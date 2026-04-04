import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { calculateAverageCLV } from '@/lib/clv';

export const runtime = 'nodejs';

const MAX_RECENT_SETTLED_BETS = 200;

type BetClvRow = {
  odds_at_entry: number;
  closing_line: number | null;
};

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('bets')
    .select('odds_at_entry,closing_line,created_at')
    .eq('user_id', user.id)
    .in('status', ['won', 'lost', 'pushed', 'hedged'])
    .not('closing_line', 'is', null)
    .order('created_at', { ascending: false })
    .limit(MAX_RECENT_SETTLED_BETS);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch CLV data' }, { status: 500 });
  }

  const rows = (data ?? []) as BetClvRow[];
  const samples = rows
    .filter((row) => Number.isFinite(row.odds_at_entry) && Number.isFinite(row.closing_line))
    .map((row) => ({
      entryOdds: row.odds_at_entry,
      closingOdds: row.closing_line as number,
    }))
    .filter((sample) => sample.entryOdds !== 0 && sample.closingOdds !== 0);

  const averageClv = calculateAverageCLV(samples);

  return NextResponse.json({
    averageClv,
    sampleCount: samples.length,
  });
}
