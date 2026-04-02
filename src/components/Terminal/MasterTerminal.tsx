'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import CFODash from '@/components/Terminal/CFODash';
import ArbFeed, { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
import PropFilter from '@/components/Terminal/PropFilter';
import MissionAlpha from '@/components/Terminal/MissionAlpha';
import HedgeCalculator from '@/components/Terminal/HedgeCalculator';
import HedgeAlertCard from '@/components/Terminal/HedgeAlertCard';
import HedgeTeaser from '@/components/Terminal/HedgeTeaser';
import BookieSettings from '@/components/Terminal/BookieSettings';

type TerminalFilter = 'all' | 'game' | 'prop';

export default function MasterTerminal() {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [isPro, setIsPro] = useState(false); // Pulled from Supabase
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [activeBookies, setActiveBookies] = useState<string[]>(['fanduel', 'draftkings', 'betmgm']);
  const [bankroll] = useState(1000);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const topArbs = useMemo(() => {
    return [...arbs]
      .filter(
        (arb) =>
          activeBookies.includes(arb.bookie_a.toLowerCase()) &&
          activeBookies.includes(arb.bookie_b.toLowerCase()),
      )
      .sort((a, b) => b.profit_percent - a.profit_percent);
  }, [activeBookies, arbs]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    let channel: RealtimeChannel | null = null;
    let isMounted = true;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id || !isMounted) {
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro,active_bookies')
        .eq('id', user.id)
        .single();

      if (isMounted) {
        setIsPro(Boolean(profile?.is_pro));
        if (Array.isArray(profile?.active_bookies) && profile.active_bookies.length > 0) {
          setActiveBookies(profile.active_bookies.map((book: string) => book.toLowerCase()));
        }
      }

      channel = supabase
        .channel(`profile-changes-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            const nextIsPro = Boolean(payload.new?.is_pro);
            const previousIsPro = Boolean(payload.old?.is_pro);
            setIsPro(nextIsPro);
            if (Array.isArray(payload.new?.active_bookies) && payload.new.active_bookies.length > 0) {
              setActiveBookies(payload.new.active_bookies.map((book: string) => book.toLowerCase()));
            }
            if (nextIsPro && !previousIsPro) {
              setShowMission(true);
            }
          },
        )
        .subscribe();
    })();

    return () => {
      isMounted = false;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleUpgrade = async () => {
    if (isCheckingOut) {
      return;
    }

    try {
      setIsCheckingOut(true);
      const response = await fetch('/api/checkout', { method: 'POST' });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { url?: string };
      if (payload.url) {
        window.location.href = payload.url;
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  const teaserEvent = topArbs[0]?.event_name ?? 'No live game selected';

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

      <div className="mb-6">
        <BookieSettings currentBooks={activeBookies} onChange={setActiveBookies} />
      </div>

      {/* 4. THE LIVE EDGE FEED */}
      <ArbFeed filter={filter} locked={!isPro} rows={topArbs} />

      <div className="mt-8">
        <HedgeCalculator />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {isPro ? (
          <HedgeAlertCard
            originalBet={{
              wager: 100,
              odds: 200,
              event_name: teaserEvent,
            }}
            liveOpponentOdds={-125}
          />
        ) : (
          <HedgeTeaser
            isPremium={false}
            event={teaserEvent}
            potentialProfit="42.50"
            onUpgrade={handleUpgrade}
            isCheckingOut={isCheckingOut}
          />
        )}
      </div>

      {showMission && <MissionAlpha arbs={topArbs} bankroll={bankroll} onClose={() => setShowMission(false)} />}
    </main>
  );
}
