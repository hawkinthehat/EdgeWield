'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { WatcherDash } from '@/components/Terminal/CFODash';
import ArbFeed, { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
import PropFilter from '@/components/Terminal/PropFilter';
import MissionAlpha from '@/components/Terminal/MissionAlpha';
import HedgeCalculator from '@/components/Terminal/HedgeCalculator';
import { useWatcherRealtime, type WatcherProfile } from '@/hooks/useWatcherRealtime';

type TerminalFilter = 'all' | 'game' | 'prop';

type MasterTerminalProps = {
  serverProfile?: Partial<WatcherProfile>;
};

export default function MasterTerminal({ serverProfile }: MasterTerminalProps) {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const initialProfile = useMemo<WatcherProfile>(
    () => ({
      id: serverProfile?.id,
      bankroll_size: Number(serverProfile?.bankroll_size ?? 1000),
      is_pro: Boolean(serverProfile?.is_pro),
    }),
    [serverProfile],
  );
  const { profile } = useWatcherRealtime(initialProfile);
  const bankroll = Number(profile.bankroll_size) || 0;
  const isPro = Boolean(profile.is_pro);
  const previousIsProRef = useRef(isPro);

  const topArbs = useMemo(() => {
    return [...arbs].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [arbs]);

  useEffect(() => {
    if (isPro && !previousIsProRef.current) {
      setShowMission(true);
    }
    previousIsProRef.current = isPro;
  }, [isPro]);

  return (
    <main className="min-h-screen bg-edge-navy text-white p-8">
      {/* 1. THE REVENUE HEADER */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Terminal_v1.0
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase text-edge-emerald">
            Status: 90s Pulse Sync Active
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-slate-500">Beta Access</p>
          <p className="text-xs font-black italic text-white">Seat #42/100</p>
        </div>
      </div>

      {/* 2. THE CFO ANALYTICS */}
      <WatcherDash bankroll={bankroll} />

      {/* 3. THE MARKET CONTROL */}
      <div className="mb-6 mt-12 flex items-center justify-between gap-4">
        <PropFilter active={filter} onChange={setFilter} />
        {/* PRO UPSELL BADGE */}
        {!isPro && (
          <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
              Upgrade to unlock Player Props
            </p>
          </div>
        )}
      </div>

      {/* 4. THE LIVE EDGE FEED */}
      <ArbFeed filter={filter} locked={!isPro} rows={arbs} />

      <div className="mt-8">
        <HedgeCalculator />
      </div>

      {showMission && <MissionAlpha arbs={topArbs} bankroll={bankroll} onClose={() => setShowMission(false)} />}
    </main>
  );
}
