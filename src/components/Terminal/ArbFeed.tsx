'use client';

import { useState } from 'react';
import ArbCard, { type ArbCardData, type UserTier } from '@/components/Terminal/ArbCard';
import BetCalculator from '@/components/Terminal/BetCalculator';

type FilterType = 'all' | 'h2h' | 'spreads';

export type ArbRow = {
  id: string;
  market_type: string;
  event_name: string;
  home_team: string;
  away_team: string;
  bookie_a: string;
  odds_a: number;
  bookie_b: string;
  odds_b: number;
  profit_percent: number;
  commence_time: string;
  is_prop: boolean;
};

export const sampleRows: ArbRow[] = [
  {
    id: 'row-1',
    market_type: 'h2h',
    event_name: 'Lakers vs Celtics',
    home_team: 'Lakers',
    away_team: 'Celtics',
    bookie_a: 'FanDuel',
    odds_a: 2.18,
    bookie_b: 'DraftKings',
    odds_b: 2.05,
    profit_percent: 2.14,
    commence_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    is_prop: false,
  },
  {
    id: 'row-2',
    market_type: 'player_points',
    event_name: 'Jokic Points O/U 27.5',
    home_team: 'Nuggets',
    away_team: 'Suns',
    bookie_a: 'FanDuel',
    odds_a: 2.12,
    bookie_b: 'BetMGM',
    odds_b: 2.02,
    profit_percent: 1.78,
    commence_time: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    is_prop: true,
  },
  {
    id: 'row-3',
    market_type: 'spread',
    event_name: 'Chiefs -3.5 / Bills +3.5',
    home_team: 'Chiefs',
    away_team: 'Bills',
    bookie_a: 'Caesars',
    odds_a: 2.06,
    bookie_b: 'DraftKings',
    odds_b: 2.07,
    profit_percent: 0.92,
    commence_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    is_prop: false,
  },
];

function filterRows(rows: ArbRow[], filter: FilterType): ArbRow[] {
  if (filter === 'h2h') {
    return rows.filter((row) => row.market_type.toLowerCase() === 'h2h');
  }
  if (filter === 'spreads') {
    return rows.filter((row) => {
      const marketType = row.market_type.toLowerCase();
      return marketType === 'spread' || marketType === 'spreads';
    });
  }
  return rows;
}

function toArbCardData(row: ArbRow): ArbCardData {
  return {
    type: row.is_prop ? 'prop' : 'game',
    player_name: row.event_name,
    roi: row.profit_percent,
    market: row.market_type,
    bookie_a: row.bookie_a,
    odds_a: row.odds_a,
    bookie_b: row.bookie_b,
    odds_b: row.odds_b,
  };
}

export default function ArbFeed({
  filter,
  locked,
  rows = sampleRows,
}: {
  filter: FilterType;
  locked: boolean;
  rows?: ArbRow[];
}) {
  const visibleRows = filterRows(rows, filter);
  const userTier: UserTier = locked ? 'trial' : 'pro';
  const [showBetCalculator, setShowBetCalculator] = useState(false);
  const primaryRow = visibleRows[0];
  const fallbackRow = sampleRows[0];
  const activeRow = primaryRow ?? fallbackRow;

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">Live Edge Feed</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBetCalculator(true)}
            className="rounded-lg border border-[#39FF14]/40 bg-[#39FF14]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#39FF14] transition hover:border-[#39FF14] hover:bg-[#39FF14]/20"
          >
            Eagle-Eye Calculator
          </button>
          <p className="text-[10px] uppercase tracking-widest text-[#39FF14]">{visibleRows.length} opportunities</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {visibleRows.map((row) => (
          <ArbCard key={row.id} userTier={userTier} arb={toArbCardData(row)} />
        ))}
      </div>
      {locked && (
        <p className="mt-3 text-[10px] uppercase tracking-widest text-amber-400">
          Sea Hawk-only markets remain blurred on Kestrel tier.
        </p>
      )}
      {activeRow && (
        <BetCalculator
          isOpen={showBetCalculator}
          onClose={() => setShowBetCalculator(false)}
          marketName={activeRow.event_name}
          bookA={activeRow.bookie_a}
          oddsA={activeRow.odds_a}
          bookB={activeRow.bookie_b}
          oddsB={activeRow.odds_b}
        />
      )}
    </section>
  );
}
