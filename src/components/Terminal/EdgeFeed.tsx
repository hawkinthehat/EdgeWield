'use client';

import { useEffect, useState } from 'react';
import type { ArbRow } from '@/components/Terminal/ArbFeed';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type EdgeFeedRow = ArbRow & {
  sideA?: { bookie: string; odds: number; team: string };
  sideB?: { bookie: string; odds: number; team: string };
};

export default function EdgeFeed({ useDatabase = false }: { useDatabase?: boolean }) {
  const [arbs, setArbs] = useState<EdgeFeedRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFromScan = async () => {
      const res = await fetch('/api/scan', { cache: 'no-store' });
      const data = (await res.json()) as { arbs?: EdgeFeedRow[] };
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
        setArbs((data ?? []) as EdgeFeedRow[]);
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
                    Wield: {sideABookie} ({Number(sideAOdds).toFixed(2)}) &amp; {sideBBookie} (
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
