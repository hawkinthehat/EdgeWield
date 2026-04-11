'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
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
const FILTER_OPTIONS: Array<{ value: TerminalFilter; label: string }> = [
  { value: 'all', label: 'All Markets' },
  { value: 'game', label: 'Game Lines' },
  { value: 'prop', label: 'Player Props' },
];

function isTrueFlag(value: string | undefined) {
  return (value ?? '').trim().toLowerCase() === 'true';
}

function formatStartLabel(commenceTime: string) {
  const start = new Date(commenceTime).getTime();
  if (Number.isNaN(start)) {
    return 'Start time pending';
  }

  const diffMinutes = Math.round((start - Date.now()) / 60_000);
  if (diffMinutes <= 0) {
    return 'Live now';
  }

  if (diffMinutes < 60) {
    return `Starts in ${diffMinutes}m`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  return `Starts in ${diffHours}h`;
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

  const canAccessProScanner = isProBypassEnabled || isPro || devAccessOverride;

  const topArbs = useMemo(() => {
    return [...arbs].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [arbs]);
  const visibleArbs = useMemo(() => {
    const scopedRows =
      filter === 'game' ? arbs.filter((row) => !row.is_prop) : filter === 'prop' ? arbs.filter((row) => row.is_prop) : arbs;
    return [...scopedRows].sort((a, b) => b.profit_percent - a.profit_percent);
  }, [arbs, filter]);

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
        const response = await fetch('/api/scanner', { cache: 'no-store' });
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

  return (
    <div className="flex min-h-screen bg-zinc-950 text-slate-100">
      <Sidebar userBankroll={bankroll} />
      <main className="ml-72 flex-1 overflow-y-auto p-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-100">Arbitrage Terminal</h1>
            <p className="mt-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Status: Live Odds Sync Active
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Beta Access</p>
            <p className="text-xs font-bold text-slate-200">Seat #42/100</p>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-400/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Latency</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">42ms</p>
          </div>
          <div className="rounded-2xl border border-blue-400/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Bankroll</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">${bankroll.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-blue-400/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Active
            </p>
          </div>
        </div>

        <div className="mb-6 mt-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {FILTER_OPTIONS.map((option) => {
              const isActive = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={[
                    'rounded-xl border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition',
                    isActive
                      ? 'border-blue-300/60 bg-blue-400/10 text-blue-200'
                      : 'border-blue-400/30 bg-transparent text-slate-400 hover:border-blue-300/50 hover:text-slate-200',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {!canAccessProScanner && (
            <div className="rounded-xl border border-blue-400/25 bg-slate-900/50 px-4 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                Upgrade to unlock Player Props
              </p>
            </div>
          )}
        </div>
        <div className="mb-8">
          <BookieSelector />
        </div>

        <section className="rounded-2xl border border-blue-400/20 bg-slate-900/40 p-2 backdrop-blur-md">
          <div className="mb-1 flex items-center justify-between border-b border-blue-400/15 px-4 pb-3 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Live Edge Feed</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400">{visibleArbs.length} opportunities</p>
          </div>
          <div>
            {visibleArbs.map((row) => {
              const isLockedRow = !canAccessProScanner && row.is_prop;
              return (
                <div
                  key={row.id}
                  className="grid gap-4 border-b border-blue-400/10 px-4 py-4 last:border-b-0 md:grid-cols-[2.2fr_1.6fr_1fr]"
                >
                  <div className={isLockedRow ? 'opacity-70' : ''}>
                    <p className="truncate text-sm font-semibold text-slate-100">{row.event_name}</p>
                    <p className="mt-1 truncate text-[11px] uppercase tracking-[0.12em] text-slate-400">
                      {row.home_team} vs {row.away_team} • {row.market_type.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <div className={isLockedRow ? 'opacity-70' : ''}>
                    <p className="text-xs font-medium text-slate-300">
                      {row.bookie_a} {row.odds_a.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-300">
                      {row.bookie_b} {row.odds_b.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    {isLockedRow ? (
                      <p className="text-sm font-semibold uppercase tracking-[0.1em] text-blue-300/80">Pro Only</p>
                    ) : (
                      <p className="text-xl font-bold text-lime-400">+{row.profit_percent.toFixed(2)}%</p>
                    )}
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{formatStartLabel(row.commence_time)}</p>
                    {!isLockedRow && (
                      <p className="mt-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {visibleArbs.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">No opportunities found for this filter.</p>
            )}
          </div>
          {!canAccessProScanner && (
            <p className="px-4 pb-2 pt-3 text-[10px] uppercase tracking-[0.16em] text-blue-300/75">
              Player props stay locked on trial tier.
            </p>
          )}
        </section>

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
            <div className="rounded-3xl border border-blue-400/20 bg-slate-900/40 p-12 text-center">
              <h3 className="mb-4 text-2xl font-bold text-slate-100">Locked Analytics</h3>
              <p className="mb-8 text-slate-400">Upgrade to Pro to see live market gaps and lock in your profit.</p>
              {userIdentity ? (
                <UpgradeButton userId={userIdentity.id} email={userIdentity.email} />
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="mx-auto rounded-xl border border-blue-400/40 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition hover:border-blue-300/60 hover:bg-blue-400/10"
                >
                  UPGRADE TO PRO
                </button>
              )}
              <p className="mt-4 text-[10px] font-semibold tracking-[0.14em] text-lime-400">
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
