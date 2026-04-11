'use client';

import { useEffect, useState } from 'react';
import type { ArbRow } from '@/components/Terminal/ArbFeed';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type ScanEdgeFeedRow = ArbRow & {
  sideA?: { bookie: string; odds: number; team: string };
  sideB?: { bookie: string; odds: number; team: string };
};

type DisplayEdgeFeedRow = {
  event: string;
  profit: number;
  bookA: string;
  bookB: string;
};

function toDisplayRows(rows?: ArbRow[]): DisplayEdgeFeedRow[] {
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

export default function EdgeFeed({
  rows,
  useDatabase = false,
}: {
  rows?: ArbRow[];
  useDatabase?: boolean;
}) {
  const [arbs, setArbs] = useState<ScanEdgeFeedRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFromScan = async () => {
      const res = await fetch('/api/scan', { cache: 'no-store' });
      const data = (await res.json()) as { arbs?: ScanEdgeFeedRow[] };
      if (!isMounted) return;
      setArbs(data.arbs ?? []);
      setLoading(false);
    };

    const fetchFromDB = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase
          .from('live_arbs')
          .select('*')
          .order('profit_percent', { ascending: false });
        if (!isMounted) return;
        setArbs((data ?? []) as ScanEdgeFeedRow[]);
      } catch {
        // Swallow client init errors so this widget can render in non-configured envs.
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const runFetch = async () => {
      if (useDatabase) {
        await fetchFromDB();
        return;
      }
      await fetchFromScan();
    };

    void runFetch();
    const interval = setInterval(() => void runFetch(), 60_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [useDatabase]);

  if (rows) {
    const edges = toDisplayRows(rows);
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
                  <p className="mt-1 text-xs text-slate-500">
                    Bet both sides: {edge.bookA} &amp; {edge.bookB}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-edge-emerald">+{edge.profit.toFixed(2)}%</span>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Locked Profit</p>
                  <button
                    type="button"
                    className="mt-2 rounded-lg bg-white px-3 py-1 text-[10px] font-bold uppercase text-edge-navy"
                  >
                    Place Bets
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse text-xs font-black uppercase text-slate-500">
        Scanning Markets...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {arbs.length > 0 ? (
        arbs.map((arb) => {
          const sideABookie = arb.sideA?.bookie ?? arb.bookie_a;
          const sideAOdds = arb.sideA?.odds ?? arb.odds_a;
          const sideBBookie = arb.sideB?.bookie ?? arb.bookie_b;
          const sideBOdds = arb.sideB?.odds ?? arb.odds_b;

          return (
            <div
              key={arb.id}
              className="rounded-3xl border-2 border-edge-emerald bg-edge-emerald/5 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded bg-edge-emerald px-2 py-0.5 text-[10px] font-black uppercase text-edge-navy">
                    Arbitrage Lock
                  </span>
                  <h4 className="mt-2 text-xl font-black">{arb.event_name}</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Bet both sides: {sideABookie} ({Number(sideAOdds).toFixed(2)}) &amp; {sideBBookie} (
                    {Number(sideBOdds).toFixed(2)})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-edge-emerald">
                    +{Number(arb.profit_percent).toFixed(2)}%
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Guaranteed
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-[3rem] border-2 border-dashed border-edge-border p-12 text-center text-slate-600">
          No Arbs Detected. Monitoring 50,000+ lines...
        </div>
      )}
    </div>
  );
}
