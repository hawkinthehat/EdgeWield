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
import BookieSelector from '@/components/Terminal/BookieSelector';
import UnitsCalc from '@/components/Terminal/UnitsCalc';
import EdgeFeed from '@/components/Terminal/EdgeFeed';
import UpgradeButton from '@/components/UpgradeButton';
import Sidebar from '@/components/Sidebar';

type Outcome = {
  name: string;
  price: number;
};

type Market = {
  outcomes: Outcome[];
};

type Bookmaker = {
  key: string;
  title: string;
  markets: Market[];
  link?: string;
  referral_label?: string;
};

type Game = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers: Bookmaker[];
};

type BetBridgeButtonProps = {
  bookmaker: string;
  marketData: {
    name: string;
    price: number;
    link?: string;
  };
};

function BetBridgeButton({ bookmaker, marketData }: BetBridgeButtonProps) {
  const handleBetClick = () => {
    if (marketData.link) {
      window.location.assign(marketData.link);
      return;
    }

    const schemes: Record<string, string> = {
      fanduel: 'fanduel://sportsbook',
      draftkings: 'draftkings://sportsbook',
      betmgm: 'betmgm://sportsbook',
    };
    window.location.href = schemes[bookmaker.toLowerCase()] ?? '#';
  };

  const brandStyles: Record<string, string> = {
    fanduel: 'bg-[#0062E3] hover:bg-[#0051ba]',
    draftkings: 'bg-[#51A341] hover:bg-[#438a35]',
    betmgm: 'bg-[#1A1A1A] border-b-2 border-[#CCAD60]',
  };

  return (
    <button
      onClick={handleBetClick}
      type="button"
      className={`${brandStyles[bookmaker.toLowerCase()] ?? 'bg-slate-700'} flex w-full items-center justify-between rounded-lg px-4 py-2 text-white shadow-md transition-transform active:scale-95`}
    >
      <span className="text-xs font-bold uppercase">{bookmaker}</span>
      <span className="font-mono text-sm font-black">
        {marketData.price > 0 ? `+${marketData.price}` : marketData.price}
      </span>
    </button>
  );
}

export default function MasterTerminal() {
  const [filter, setFilter] = useState<TerminalFilter>('all'); // all, game, prop
  const [isPro, setIsPro] = useState(false); // Pulled from Supabase
  const [userIdentity, setUserIdentity] = useState<{ id: string; email: string } | null>(null);
  const [showMission, setShowMission] = useState(false);
  const [arbs] = useState<ArbRow[]>(sampleRows);
  const [bankroll] = useState(1000);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
    let isMounted = true;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id || !isMounted) {
        return;
      }
      setUserIdentity({ id: user.id, email: user.email ?? '' });

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .single();

      if (isMounted) {
        setIsPro(Boolean(profile?.is_pro));
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
  const topEdge = topArbs[0];

  return (
    <div className="flex min-h-screen bg-edge-navy text-white">
      <Sidebar userBankroll={bankroll} />
      <main className="ml-72 flex-1 overflow-y-auto p-8">
      {/* 1. THE REVENUE HEADER */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Terminal_v1.0
          </h1>
          <p className="text-sm text-slate-500">Live Market Arbitrage &amp; Deep Links</p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            {error}
          </div>
        )}
      </div>
      <div className="mb-8">
        <BookieSelector />
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
      </main>
    </div>
  );
}
