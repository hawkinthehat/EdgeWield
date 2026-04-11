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
        <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400">Live Potential Edges</h2>
        {edges.map((edge, index) => {
          const isArb = edge.profit > 0;
          const isBookmakerAActive = edge.bookA.includes('FanDuel') || edge.bookA.includes('DraftKings');
          const isBookmakerBActive = edge.bookB.includes('FanDuel') || edge.bookB.includes('DraftKings');
          return (
            <article
              key={`${edge.event}-${index}`}
              className={`rounded-2xl border-2 p-6 transition-all ${
                isArb
                  ? 'border-emerald-400/45 bg-emerald-400/8 shadow-[0_0_30px_rgba(52,211,153,0.14)]'
                  : 'border-slate-700 bg-zinc-900/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  {isArb && (
                    <span className="mb-2 inline-block rounded bg-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-zinc-950">
                      Arb Detected
                    </span>
                  )}
                  <h4 className="text-xl font-black text-white">{edge.event}</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Bet both sides:{' '}
                    <span className={isBookmakerAActive ? 'text-emerald-400' : 'text-slate-400'}>{edge.bookA}</span> &amp;{' '}
                    <span className={isBookmakerBActive ? 'text-emerald-400' : 'text-slate-400'}>{edge.bookB}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">+{edge.profit.toFixed(2)}%</span>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Locked Profit</p>
                  <button
                    type="button"
                    className="mt-2 rounded-lg border border-slate-500 bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase text-white"
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
      <div className="animate-pulse text-xs font-black uppercase text-slate-400">
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
              className="rounded-3xl border-2 border-emerald-400/45 bg-emerald-400/8 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded bg-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950">
                    Arbitrage Lock
                  </span>
                  <h4 className="mt-2 text-xl font-black text-white">{arb.event_name}</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Bet both sides:{' '}
                    <span
                      className={sideABookie === 'FanDuel' || sideABookie === 'DraftKings' ? 'text-emerald-400' : 'text-slate-400'}
                    >
                      {sideABookie}
                    </span>{' '}
                    ({Number(sideAOdds).toFixed(2)}) &amp;{' '}
                    <span
                      className={sideBBookie === 'FanDuel' || sideBBookie === 'DraftKings' ? 'text-emerald-400' : 'text-slate-400'}
                    >
                      {sideBBookie}
                    </span>{' '}
                    ({Number(sideBOdds).toFixed(2)})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-emerald-400">
                    +{Number(arb.profit_percent).toFixed(2)}%
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Guaranteed
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-[3rem] border-2 border-dashed border-slate-700 p-12 text-center text-slate-500">
          No Arbs Detected. Monitoring 50,000+ lines...
        </div>
      )}
    </div>
  );
}
