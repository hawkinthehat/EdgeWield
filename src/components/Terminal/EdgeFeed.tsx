'use client';

import type { ArbRow } from '@/components/Terminal/ArbFeed';

type EdgeFeedRow = {
  event: string;
  profit: number;
  bookA: string;
  bookB: string;
};

function toEdgeRows(rows?: ArbRow[]): EdgeFeedRow[] {
  if (!rows || rows.length === 0) {
    return [
      { event: 'Lakers vs Celtics', profit: 4.2, bookA: 'FanDuel (-110)', bookB: 'DraftKings (+125)' },
      { event: 'Chiefs vs Eagles', profit: 2.1, bookA: 'BetMGM (+105)', bookB: 'Caesars (+105)' },
    ];
  }

  return rows.map((row) => ({
    event: row.event_name,
    profit: row.profit_percent,
    bookA: `${row.bookie_a} (${row.odds_a.toFixed(2)})`,
    bookB: `${row.bookie_b} (${row.odds_b.toFixed(2)})`,
  }));
}

export default function EdgeFeed({ rows }: { rows?: ArbRow[] }) {
  const edges = toEdgeRows(rows);

  return (
    <section className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-edge-emerald">Live Potential Edges</h2>
      {edges.map((edge, index) => {
        const isArb = edge.profit > 0;
        return (
          <article
            key={`${edge.event}-${index}`}
            className={`rounded-2xl border-2 p-6 transition-all ${
              isArb
                ? 'border-edge-emerald bg-edge-emerald/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                : 'border-edge-border bg-edge-slate/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                {isArb && (
                  <span className="mb-2 inline-block rounded bg-edge-emerald px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-edge-navy">
                    Arb Detected
                  </span>
                )}
                <h4 className="text-xl font-black">{edge.event}</h4>
                <p className="mt-1 text-xs text-slate-500">Execute: {edge.bookA} &amp; {edge.bookB}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-edge-emerald">+{edge.profit.toFixed(2)}%</span>
                <p className="text-[10px] font-bold uppercase text-slate-500">Locked Profit</p>
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-white px-3 py-1 text-[10px] font-bold uppercase text-edge-navy"
                >
                  Wield It
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
