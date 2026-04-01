'use client';

type FilterType = 'all' | 'game' | 'prop';

type ArbRow = {
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

const sampleRows: ArbRow[] = [
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

function filterRows(rows: ArbRow[], filter: FilterType, locked: boolean): ArbRow[] {
  if (locked) {
    return rows.filter((row) => !row.is_prop && filter !== 'prop');
  }
  if (filter === 'game') {
    return rows.filter((row) => !row.is_prop);
  }
  if (filter === 'prop') {
    return rows.filter((row) => row.is_prop);
  }
  return rows;
}

export default function ArbFeed({
  filter,
  locked,
}: {
  filter: FilterType;
  locked: boolean;
}) {
  const rows = filterRows(sampleRows, filter, locked);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">Live Edge Feed</p>
        <p className="text-[10px] uppercase tracking-widest text-edge-emerald">{rows.length} opportunities</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="py-2">Market</th>
              <th className="py-2">Event</th>
              <th className="py-2">Book A</th>
              <th className="py-2">Odds A</th>
              <th className="py-2">Book B</th>
              <th className="py-2">Odds B</th>
              <th className="py-2">Profit</th>
              <th className="py-2">Start</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-900 text-xs text-slate-200">
                <td className="py-3 font-mono uppercase">{row.market_type}</td>
                <td className="py-3">{row.event_name}</td>
                <td className="py-3">{row.bookie_a}</td>
                <td className="py-3">{row.odds_a.toFixed(2)}</td>
                <td className="py-3">{row.bookie_b}</td>
                <td className="py-3">{row.odds_b.toFixed(2)}</td>
                <td className="py-3 font-black text-edge-emerald">{row.profit_percent.toFixed(2)}%</td>
                <td className="py-3">{new Date(row.commence_time).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {locked && (
        <p className="mt-3 text-[10px] uppercase tracking-widest text-amber-400">
          Player props hidden on free tier.
        </p>
      )}
    </section>
  );
}
