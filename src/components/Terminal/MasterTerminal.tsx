'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import CFODash from '@/components/Terminal/CFODash';
import ArbFeed, { type ArbRow, sampleRows } from '@/components/Terminal/ArbFeed';
import PropFilter from '@/components/Terminal/PropFilter';
import MissionAlpha from '@/components/Terminal/MissionAlpha';
import HedgeCalculator from '@/components/Terminal/HedgeCalculator';
import Sidebar from '@/components/Navigation/Sidebar';
import WatcherOnboarding, { type OnboardingCompleteData } from '@/components/Onboarding/WatcherOnboarding';
import HedgeAlertCard from '@/components/Terminal/HedgeAlertCard';
import HedgeTeaser from '@/components/Terminal/HedgeTeaser';
import BookieSelector from '@/components/Terminal/BookieSelector';
import UnitsCalc from '@/components/Terminal/UnitsCalc';
import EdgeFeed from '@/components/Terminal/EdgeFeed';
import UpgradeButton from '@/components/UpgradeButton';

type TerminalFilter = 'all' | 'game' | 'prop';
type RiskProfile = 'Conservative' | 'Standard' | 'Aggressive';

type UserProfile = {
  is_pro: boolean;
  is_premium: boolean;
  bankroll_size: number;
  total_bankroll: number;
  unit_size_percentage: number;
  risk_tolerance: RiskProfile | null;
  onboarding_completed: boolean;
};

const defaultProfile: UserProfile = {
  is_pro: false,
  is_premium: false,
  bankroll_size: 1000,
  total_bankroll: 1000,
  unit_size_percentage: 0.01,
  risk_tolerance: 'Standard',
  onboarding_completed: false,
};

function normalizeRisk(value: string | null | undefined): RiskProfile {
  if (value === 'Conservative' || value === 'Aggressive' || value === 'Standard') {
    return value;
  }
  return 'Standard';
}

function mergeProfile(previous: UserProfile, incoming: Partial<UserProfile>): UserProfile {
  const bankrollSizeCandidate = Number(incoming.bankroll_size ?? previous.bankroll_size ?? 1000);
  const totalBankrollCandidate = Number(
    incoming.total_bankroll ?? incoming.bankroll_size ?? previous.total_bankroll ?? 1000,
  );
  const unitSizeCandidate = Number(incoming.unit_size_percentage ?? previous.unit_size_percentage ?? 0.01);
  const nextRisk =
    incoming.risk_tolerance === null
      ? null
      : normalizeRisk((incoming.risk_tolerance as string | undefined) ?? previous.risk_tolerance ?? undefined);

  return {
    ...previous,
    ...incoming,
    is_pro: Boolean(incoming.is_pro ?? previous.is_pro),
    is_premium: Boolean(incoming.is_premium ?? previous.is_premium),
    bankroll_size: Number.isFinite(bankrollSizeCandidate) ? bankrollSizeCandidate : previous.bankroll_size,
    total_bankroll: Number.isFinite(totalBankrollCandidate) ? totalBankrollCandidate : previous.total_bankroll,
    unit_size_percentage: Number.isFinite(unitSizeCandidate) ? unitSizeCandidate : previous.unit_size_percentage,
    risk_tolerance: nextRisk,
    onboarding_completed: Boolean(incoming.onboarding_completed ?? previous.onboarding_completed),
  };
}

export default function MasterTerminal() {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [userIdentity, setUserIdentity] = useState<{ id: string; email: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const isPro = userProfile.is_pro || userProfile.is_premium;
  const bankroll = Number(userProfile.total_bankroll || userProfile.bankroll_size || 1000);

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
    let mounted = true;

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !mounted) {
        return;
      }

      setUserIdentity({ id: user.id, email: user.email ?? '' });

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'is_pro, is_premium, bankroll_size, total_bankroll, unit_size_percentage, risk_tolerance, onboarding_completed',
        )
        .eq('id', user.id)
        .single();

      if (!mounted || error || !data) {
        return;
      }

      const nextProfile = data as Partial<UserProfile>;
      setUserProfile((prev) => mergeProfile(prev, nextProfile));
      setShowOnboarding(!Boolean(nextProfile.onboarding_completed));
      channel = supabase
        .channel(`profile-changes-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const nextProfile = payload.new as Partial<UserProfile>;
            const oldProfile = payload.old as Partial<UserProfile>;
            const wasPro = Boolean(oldProfile?.is_pro || oldProfile?.is_premium);
            const nowPro = Boolean(nextProfile?.is_pro || nextProfile?.is_premium);

            setUserProfile((prev) => mergeProfile(prev, nextProfile));

            if (nowPro && !wasPro) {
              setShowMission(true);
            }

            if (nextProfile.onboarding_completed !== undefined) {
              setShowOnboarding(!Boolean(nextProfile.onboarding_completed));
            }
          },
        )
        .subscribe();
    };

    void loadProfile();

    return () => {
      mounted = false;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleOnboardingComplete = (data: OnboardingCompleteData) => {
    setUserProfile((prev) => ({
      ...prev,
      bankroll_size: data.bankroll,
      total_bankroll: data.bankroll,
      unit_size_percentage: data.unit_size_percentage,
      risk_tolerance: normalizeRisk(data.risk),
      onboarding_completed: data.onboarding_completed,
    }));
    setShowOnboarding(false);
  };
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
    <>
      <Sidebar userProfile={userProfile} />
      <main className="ml-64 min-h-screen bg-edge-navy p-8 text-white">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Terminal_v1.0</h1>
            <p className="mt-2 font-mono text-[10px] uppercase text-edge-emerald">
              Status: 90s Pulse Sync Active
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-slate-500">Beta Access</p>
            <p className="text-xs font-black italic text-white">Seat #42/100</p>
          </div>
        </div>

        <div className="mb-8">
          <BookieSelector />
        </div>

        {/* 2. THE CFO ANALYTICS */}
        <CFODash />

        {/* 3. THE MARKET CONTROL */}
        <div className="mb-6 mt-12 flex items-center justify-between gap-4">
          <PropFilter active={filter} onChange={setFilter} />
          {!isPro && (
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                  Upgrade to unlock Player Props
                </p>
              </div>
              {userIdentity ? (
                <div className="w-56">
                  <UpgradeButton userId={userIdentity.id} email={userIdentity.email} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={isCheckingOut}
                  className="rounded-xl bg-edge-emerald px-4 py-3 text-xs font-black uppercase text-edge-navy disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckingOut ? 'Redirecting...' : 'WIELD THE PRO EDGE'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 4. THE LIVE EDGE FEED */}
        <ArbFeed filter={filter} locked={!isPro} rows={arbs} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <HedgeCalculator />
          <UnitsCalc oddsA={topEdge?.odds_a ?? 2.1} oddsB={topEdge?.odds_b ?? 2.05} />
        </div>

        <div className="mt-8">
          {isPro ? (
            <EdgeFeed rows={topArbs} />
          ) : (
            <div className="rounded-[3rem] border-2 border-dashed border-edge-border bg-edge-slate/20 p-12 text-center">
              <h3 className="mb-4 text-2xl font-bold">Locked Analytics</h3>
              <p className="mb-8 text-slate-500">
                Upgrade to Pro to see live market gaps and lock in your profit.
              </p>
              {userIdentity ? (
                <UpgradeButton userId={userIdentity.id} email={userIdentity.email} />
              ) : (
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="mx-auto rounded-2xl bg-edge-emerald px-8 py-4 font-black text-edge-navy"
                >
                  WIELD THE PRO EDGE
                </button>
              )}
              <p className="mt-4 text-[10px] font-bold tracking-widest text-edge-emerald">
                USE CODE &quot;BETA50&quot; AT CHECKOUT
              </p>
            </div>
          )}
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
        )}
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

      {arbs[0] && (
        <div className="mt-8">
          <QuickAddBet game={arbs[0]} userBankroll={bankroll} unitSizePercent={0.01} />
        </div>
      )}

      {showMission && <MissionAlpha arbs={topArbs} bankroll={bankroll} onClose={() => setShowMission(false)} />}
      </main>
      {showOnboarding && <WatcherOnboarding onComplete={handleOnboardingComplete} />}
    </>
  );
}
