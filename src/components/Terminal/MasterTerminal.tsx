'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import CFODash from '@/components/Terminal/CFODash';
import ArbFeed, { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
import PropFilter from '@/components/Terminal/PropFilter';
import FirstEdgeModal from '@/components/Terminal/FirstEdgeModal';
import HedgeCalculator from '@/components/Terminal/HedgeCalculator';
import HedgeAlertCard from '@/components/Terminal/HedgeAlertCard';
import HedgeTeaser from '@/components/Terminal/HedgeTeaser';
import BookieSelector from '@/components/Terminal/BookieSelector';
import UnitsCalc from '@/components/Terminal/UnitsCalc';
import EdgeFeed from '@/components/Terminal/EdgeFeed';
import EdgeScanner from '@/components/Terminal/EdgeScanner';
import UpgradeButton from '@/components/UpgradeButton';
import Sidebar from '@/components/Sidebar';
import type { EdgeBet } from '@/lib/scanner';

type TerminalFilter = 'all' | 'game' | 'prop';

function isTrueFlag(value: string | undefined) {
  return (value ?? '').trim().toLowerCase() === 'true';
}

export default function MasterTerminal() {
  const isProBypassEnabled = isTrueFlag(process.env.NEXT_PUBLIC_ENABLE_PRO_BYPASS);
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [isPro, setIsPro] = useState(false); // Pulled from Supabase
  const [devAccessOverride, setDevAccessOverride] = useState(isProBypassEnabled);
  const [userIdentity, setUserIdentity] = useState<{ id: string; email: string } | null>(null);
  const [showFirstEdgeModal, setShowFirstEdgeModal] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [bankroll] = useState(1000);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [scannerBets, setScannerBets] = useState<EdgeBet[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const canAccessProScanner = isProBypassEnabled || isPro || devAccessOverride;

  const topArbs = useMemo(() => {
    return [...arbs].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [arbs]);

  useEffect(() => {
    if (isProBypassEnabled) {
      setDevAccessOverride(true);
      return;
    }

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
        if (isMounted) {
          setDevAccessOverride(isProBypassEnabled);
        }
        return;
      }
      setUserIdentity({ id: user.id, email: user.email ?? '' });

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro,is_premium,role,subscription_status')
        .eq('id', user.id)
        .single();

      if (isMounted) {
        const hasProAccess =
          Boolean(profile?.is_pro) ||
          Boolean(profile?.is_premium) ||
          profile?.role === 'pro' ||
          profile?.subscription_status === 'active';
        const email = user.email ?? '';
        const bypassEmail = process.env.NEXT_PUBLIC_DEV_BYPASS_EMAIL ?? '';
        const bypassByEmail = bypassEmail.length > 0 && email.toLowerCase() === bypassEmail.toLowerCase();

        setIsPro(hasProAccess);
        setDevAccessOverride(isProBypassEnabled || bypassByEmail);
      }

      channel = supabase
        .channel(`profile-changes-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => {
            const nextIsPro =
              Boolean(payload.new?.is_pro) ||
              Boolean(payload.new?.is_premium) ||
              payload.new?.role === 'pro' ||
              payload.new?.subscription_status === 'active';
            const previousIsPro =
              Boolean(payload.old?.is_pro) ||
              Boolean(payload.old?.is_premium) ||
              payload.old?.role === 'pro' ||
              payload.old?.subscription_status === 'active';
            setIsPro(nextIsPro);
            if (nextIsPro && !previousIsPro) {
              setShowFirstEdgeModal(true);
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
  }, [isProBypassEnabled]);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const requestStartedAt = performance.now();
        const response = await fetch('/api/scanner', { cache: 'no-store' });
        const responseLatency = Math.round(performance.now() - requestStartedAt);
        if (!response.ok) {
          if (isMounted) {
            setLatencyMs(responseLatency);
          }
          return;
        }
        const payload = (await response.json()) as { bets?: EdgeBet[] };
        if (isMounted) {
          setLatencyMs(responseLatency);
          setScannerBets(Array.isArray(payload.bets) ? payload.bets : []);
        }
      } catch {
        if (isMounted) {
          setLatencyMs(null);
          setScannerBets([]);
        }
      }
    })();

    return () => {
      isMounted = false;
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
  const topEdge = topArbs[0];
  const isLatencySlow = latencyMs !== null && latencyMs > 350;
  const latencyStateClass = isLatencySlow ? 'text-red-400' : 'text-emerald-400';

  return (
    <div className="flex min-h-screen bg-zinc-950 text-slate-300">
      <Sidebar userBankroll={bankroll} />
      <main className="ml-72 flex-1 overflow-y-auto p-8">
        {/* 1. THE REVENUE HEADER */}
        <div className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Arbitrage Terminal</h1>
            <p className="mt-2 font-mono text-[10px] uppercase text-emerald-400">
              Status: Live Odds Sync Active
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-zinc-900/90 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bankroll</p>
              <p className="mt-2 text-2xl font-black italic text-white">${bankroll.toLocaleString()}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Capital Allocated</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-zinc-900/90 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Latency</p>
              <p className={`mt-2 text-2xl font-black italic ${latencyStateClass}`}>
                {latencyMs === null ? '--' : `${latencyMs}ms`}
              </p>
              <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${latencyStateClass}`}>
                Latency: {isLatencySlow ? 'SLOW' : 'OK'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. THE CFO ANALYTICS */}
        <CFODash />

        {/* 3. THE MARKET CONTROL */}
        <div className="mb-6 mt-12 flex items-center justify-between gap-4">
          <PropFilter active={filter} onChange={setFilter} />
          {!canAccessProScanner && (
            <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                Upgrade to unlock Player Props
              </p>
            </div>
          )}
        </div>
        <div className="mb-8">
          <BookieSelector />
        </div>

        {/* 4. THE LIVE EDGE FEED */}
        <ArbFeed filter={filter} locked={!canAccessProScanner} rows={arbs} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <HedgeCalculator />
          <UnitsCalc oddsA={topEdge?.odds_a ?? 2.1} oddsB={topEdge?.odds_b ?? 2.05} />
        </div>

        <div className="mt-8">
          {canAccessProScanner ? (
            <div className="space-y-8">
              <EdgeFeed rows={topArbs} />
              {scannerBets.length > 0 && <EdgeScanner bets={scannerBets} bankroll={bankroll} />}
            </div>
          ) : (
            <div className="rounded-[3rem] border-2 border-dashed border-slate-700 bg-zinc-900/70 p-12 text-center">
              <h3 className="mb-4 text-2xl font-bold text-white">Locked Analytics</h3>
              <p className="mb-8 text-slate-400">Upgrade to Pro to see live market gaps and lock in your profit.</p>
              {userIdentity ? (
                <UpgradeButton userId={userIdentity.id} email={userIdentity.email} />
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="mx-auto rounded-2xl bg-emerald-400 px-8 py-4 font-black text-zinc-950"
                >
                  UPGRADE TO PRO
                </button>
              )}
              <p className="mt-4 text-[10px] font-bold tracking-widest text-emerald-400">
                USE CODE &quot;BETA50&quot; AT CHECKOUT
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {canAccessProScanner ? (
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

        {showFirstEdgeModal && (
          <FirstEdgeModal arbs={topArbs} bankroll={bankroll} onClose={() => setShowFirstEdgeModal(false)} />
        )}
      </main>
    </div>
  );
}
