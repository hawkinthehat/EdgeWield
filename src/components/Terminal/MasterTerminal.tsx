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

type TerminalFilter = 'all' | 'h2h' | 'spreads';

function isTrueFlag(value: string | undefined) {
  return (value ?? '').trim().toLowerCase() === 'true';
}

export default function MasterTerminal() {
  const isProBypassEnabled = isTrueFlag(process.env.NEXT_PUBLIC_ENABLE_PRO_BYPASS);
  const [filter, setFilter] = useState<TerminalFilter>('all');
  const [isPro, setIsPro] = useState(false); // Pulled from Supabase
  const [devAccessOverride, setDevAccessOverride] = useState(isProBypassEnabled);
  const [userIdentity, setUserIdentity] = useState<{ id: string; email: string } | null>(null);
  const [showFirstEdgeModal, setShowFirstEdgeModal] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [selectedBookies, setSelectedBookies] = useState<string[]>(['FanDuel', 'DraftKings', 'BetMGM']);
  const [showFilters, setShowFilters] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [bankroll] = useState(1000);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [scannerBets, setScannerBets] = useState<EdgeBet[]>([]);
  const [scannerLatencyMs, setScannerLatencyMs] = useState<number | null>(null);

  const canAccessProScanner = isProBypassEnabled || isPro || devAccessOverride;

  const visibleArbs = useMemo(() => {
    return arbs.filter((row) => {
      const marketType = row.market_type.toLowerCase();
      if (filter === 'h2h' && marketType !== 'h2h') {
        return false;
      }
      if (filter === 'spreads' && marketType !== 'spread' && marketType !== 'spreads') {
        return false;
      }

      const rowBookies = [row.bookie_a, row.bookie_b];
      return rowBookies.some((bookie) => selectedBookies.includes(bookie));
    });
  }, [arbs, filter, selectedBookies]);

  const topArbs = useMemo(() => {
    return [...visibleArbs].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [visibleArbs]);

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
        const startedAt = performance.now();
        const response = await fetch('/api/scanner', { cache: 'no-store' });
        const finishedAt = performance.now();
        if (isMounted) {
          setScannerLatencyMs(Math.max(1, Math.round(finishedAt - startedAt)));
        }
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { bets?: EdgeBet[] };
        if (isMounted) {
          setScannerBets(Array.isArray(payload.bets) ? payload.bets : []);
        }
      } catch {
        if (isMounted) {
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
  const statusTone = scannerBets.length > 0 ? 'text-edge-emerald' : 'text-amber-400';
  const statusLabel = scannerBets.length > 0 ? 'Live' : 'Syncing';
  const latencyLabel = scannerLatencyMs ? `${scannerLatencyMs}ms` : '--';

  return (
    <div className="min-h-screen bg-edge-navy text-white lg:flex">
      <div className="hidden lg:block">
        <Sidebar userBankroll={bankroll} />
      </div>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:ml-72 lg:p-8">
        {/* 1. THE REVENUE HEADER */}
        <div id="terminal-top" className="mb-8 space-y-5 lg:mb-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter sm:text-4xl">Arbitrage Terminal</h1>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-edge-emerald">
                Status: Live Odds Sync Active
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Beta Access</p>
              <p className="text-xs font-black italic text-white">Seat #42/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-edge-border bg-edge-slate/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Latency</p>
              <p className="mt-1 text-lg font-black text-white">{latencyLabel}</p>
            </div>
            <div id="terminal-bankroll" className="rounded-2xl border border-edge-border bg-edge-slate/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bankroll</p>
              <p className="mt-1 text-lg font-black text-white">${bankroll.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-edge-border bg-edge-slate/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
              <p className={`mt-1 text-lg font-black ${statusTone}`}>{statusLabel}</p>
            </div>
          </div>
        </div>

        {/* 2. THE CFO ANALYTICS */}
        <CFODash />

        {/* 3. THE MARKET CONTROL */}
        <div id="terminal-market-controls" className="mb-6 mt-10 rounded-2xl border border-edge-border bg-edge-slate/15 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`rounded-xl border px-4 py-2 text-[11px] font-black uppercase tracking-wide transition ${
                  showFilters
                    ? 'border-edge-emerald bg-edge-emerald/20 text-edge-emerald'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300'
                }`}
              >
                Filters
              </button>
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className={`rounded-xl border px-4 py-2 text-[11px] font-black uppercase tracking-wide transition ${
                  showSettings
                    ? 'border-edge-emerald bg-edge-emerald/20 text-edge-emerald'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300'
                }`}
              >
                Settings
              </button>
            </div>
            {!canAccessProScanner && (
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                  Upgrade from Red-Tail to Sea Hawk for advanced scanner analytics
                </p>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="mb-4">
              <PropFilter active={filter} onChange={setFilter} />
            </div>
          )}

          {showSettings && (
            <div id="terminal-settings">
              <BookieSelector selected={selectedBookies} onChange={setSelectedBookies} />
            </div>
          )}
        </div>

        {/* 4. THE LIVE EDGE FEED */}
        <ArbFeed filter={filter} locked={!canAccessProScanner} rows={visibleArbs} />

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
            <div className="rounded-[3rem] border-2 border-dashed border-edge-border bg-edge-slate/20 p-12 text-center">
              <h3 className="mb-4 text-2xl font-bold">Locked Analytics</h3>
              <p className="mb-8 text-slate-500">
                Upgrade from Red-Tail to Sea Hawk to see live market gaps and lock in your profit.
              </p>
              {userIdentity ? (
                <UpgradeButton userId={userIdentity.id} email={userIdentity.email} />
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="mx-auto rounded-2xl bg-edge-emerald px-8 py-4 font-black text-edge-navy"
                >
                  UPGRADE TO SEA HAWK
                </button>
              )}
              <p className="mt-4 text-[10px] font-bold tracking-widest text-edge-emerald">
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
