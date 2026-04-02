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

type TerminalFilter = 'all' | 'game' | 'prop';
type RiskProfile = 'Conservative' | 'Standard' | 'Aggressive';

type UserProfile = {
  is_pro: boolean;
  is_premium: boolean;
  bankroll_size: number;
  total_bankroll: number;
  unit_size_percentage: number;
  risk_tolerance: string | null;
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

export default function MasterTerminal() {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);

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

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'is_pro, is_premium, bankroll_size, total_bankroll, unit_size_percentage, risk_tolerance, onboarding_completed',
        )
        .eq('id', user.id)
        .single();

      if (error || !data || !mounted) {
        return;
      }

      const nextProfile = data as Partial<UserProfile>;

      setUserProfile((prev) => ({
        ...prev,
        ...nextProfile,
        bankroll_size: Number(nextProfile.bankroll_size ?? prev.bankroll_size ?? 1000),
        total_bankroll: Number(
          nextProfile.total_bankroll ?? nextProfile.bankroll_size ?? prev.total_bankroll ?? 1000,
        ),
        unit_size_percentage: Number(nextProfile.unit_size_percentage ?? prev.unit_size_percentage ?? 0.01),
      }));
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

            setUserProfile((prev) => ({
              ...prev,
              ...nextProfile,
              bankroll_size: Number(nextProfile?.bankroll_size ?? prev.bankroll_size ?? 1000),
              total_bankroll: Number(
                nextProfile?.total_bankroll ?? nextProfile?.bankroll_size ?? prev.total_bankroll ?? 1000,
              ),
              unit_size_percentage: Number(nextProfile?.unit_size_percentage ?? prev.unit_size_percentage ?? 0.01),
            }));

            if (nowPro && !wasPro) {
              setShowMission(true);
            }

            if (nextProfile.onboarding_completed) {
              setShowOnboarding(false);
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

  return (
    <>
      <Sidebar userProfile={userProfile} />
      <main className="min-h-screen bg-edge-navy p-8 pl-72 text-white">
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
      {showOnboarding && <WatcherOnboarding onComplete={handleOnboardingComplete} />}
    </>
  );
}
