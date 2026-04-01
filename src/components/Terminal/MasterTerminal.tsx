'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import CFODash from '@/components/Terminal/CFODash';
import ArbFeed, { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
import PropFilter from '@/components/Terminal/PropFilter';
import MissionAlpha from '@/components/Terminal/MissionAlpha';
import HedgeCalculator from '@/components/Terminal/HedgeCalculator';

type TerminalFilter = 'all' | 'game' | 'prop';

export default function MasterTerminal() {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [isPro, setIsPro] = useState(false); // Pulled from Supabase
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [bankroll] = useState(1000);

  const topArbs = useMemo(() => {
    return [...arbs].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [arbs]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        const nextIsPro = Boolean(payload.new?.is_pro);
        const previousIsPro = Boolean(payload.old?.is_pro);
        setIsPro(nextIsPro);
        if (nextIsPro && !previousIsPro) {
          setShowMission(true);
        }
      })
      .subscribe();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

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
      <CFODash />

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
