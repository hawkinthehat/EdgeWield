import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { MarketGap } from '@workspace/api-client-react';
import { supabase } from '@/lib/supabase';
import UnitCalculator from './unit-calculator';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Cards decay over 120s (enough headroom past the 90s refresh interval)
const DECAY_WINDOW_S = 120;

interface BetData {
  game: string;
  bookie: string;
  odds: number;
  hedgeOdds: number;
  hedgeBookie: string;
  profitPct: number;
}

function ArbCard({
  edge,
  fetchedAt,
}: {
  edge: MarketGap;
  fetchedAt: number;
}) {
  const [secondsAgo, setSecondsAgo] = useState(
    () => Math.floor((Date.now() - fetchedAt) / 1000)
  );
  const [selectedBet, setSelectedBet] = useState<BetData | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - fetchedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [fetchedAt]);

  const freshPct = Math.max(0, 100 - (secondsAgo / DECAY_WINDOW_S) * 100);
  const isStale = secondsAgo > 60;

  const handleWield = (side: 'A' | 'B') => {
    setSelectedBet(
      side === 'A'
        ? {
            game: edge.event,
            bookie: edge.bookieA,
            odds: edge.oddsA,
            hedgeOdds: edge.oddsB,
            hedgeBookie: edge.bookieB,
            profitPct: edge.profit,
          }
        : {
            game: edge.event,
            bookie: edge.bookieB,
            odds: edge.oddsB,
            hedgeOdds: edge.oddsA,
            hedgeBookie: edge.bookieA,
            profitPct: edge.profit,
          }
    );
  };

  return (
    <>
      <div className="group relative overflow-hidden p-6 bg-edge-slate/20 border border-edge-border rounded-[2.5rem] hover:border-edge-emerald/50 transition-all">
        {/* Freshness decay bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-edge-emerald transition-all duration-1000"
          style={{ width: `${freshPct}%`, opacity: isStale ? 0.2 : 0.55 }}
        />

        {/* Header row */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold ${isStale ? 'text-orange-500' : 'text-edge-emerald'}`}
              >
                ● {isStale ? 'Stale' : 'Live'}
              </span>
              <span className="text-[10px] text-slate-600 font-bold">{secondsAgo}s ago</span>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">{edge.marketType}</span>
            </div>
            <h4 className="text-lg font-black italic uppercase tracking-tighter text-white leading-tight">
              {edge.event}
            </h4>
          </div>
          <span className="text-edge-emerald font-black text-xl shrink-0">+{edge.profit}%</span>
        </div>

        {/* Clickable odds tiles — tap to open Wield Calculator */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleWield('A')}
            className="p-4 bg-edge-navy rounded-2xl border border-edge-border hover:bg-edge-emerald/10 hover:border-edge-emerald transition-all text-left"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {edge.bookieA}
            </p>
            <p className="text-xl font-black text-white">{edge.oddsA}</p>
            <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">
              Tap to Wield →
            </p>
          </button>

          <button
            onClick={() => handleWield('B')}
            className="p-4 bg-edge-navy rounded-2xl border border-edge-border hover:bg-edge-emerald/10 hover:border-edge-emerald transition-all text-left"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {edge.bookieB}
            </p>
            <p className="text-xl font-black text-white">{edge.oddsB}</p>
            <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">
              Tap to Wield →
            </p>
          </button>
        </div>
      </div>

      {/* Wield Calculator modal — mounts outside the card to avoid overflow clipping */}
      {selectedBet && (
        <UnitCalculator bet={selectedBet} onClose={() => setSelectedBet(null)} />
      )}
    </>
  );
}

export default function EdgeFeed({
  sport = 'upcoming',
}: {
  sport?: string;
}) {
  // Track when SWR last delivered fresh data so every card shares the same clock
  const fetchedAtRef = useRef<number>(Date.now());

  const { data: edges, error, isLoading, isValidating, mutate } = useSWR<MarketGap[]>(
    `/api/odds/edges?sport=${sport}`,
    fetcher,
    {
      refreshInterval: 90_000,
      dedupingInterval: 10_000,
      revalidateOnFocus: true,
      onSuccess: () => {
        fetchedAtRef.current = Date.now();
      },
    }
  );

  // Realtime: toast + instant refetch whenever a new arb lands in live_arbs
  useEffect(() => {
    const supabaseClient = supabase;
    if (!supabaseClient) return;

    const channel = supabaseClient
      .channel('live-arbs-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_arbs' },
        (payload) => {
          const arb = payload.new as { game_name?: string; profit_percent?: number };
          toast.success('New Edge Detected', {
            description: arb.game_name
              ? `${arb.game_name} — +${arb.profit_percent ?? '?'}% profit`
              : 'A new arbitrage opportunity just hit the feed.',
            duration: 6000,
          });
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse text-slate-500 font-black uppercase text-xs tracking-widest">
          Scanning Markets...
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-edge-slate/40 border border-edge-border rounded-3xl animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-sm font-bold flex justify-between items-center">
        <span>Scout failed to initialize. Check API key.</span>
        <button
          onClick={() => mutate()}
          className="text-xs bg-white text-edge-navy px-3 py-1 rounded-lg uppercase font-black"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!edges || edges.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-edge-border rounded-[3rem] text-center text-slate-600 font-bold text-sm">
        No Arbs Detected. Monitoring 50,000+ lines...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-edge-emerald font-black tracking-widest uppercase text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-edge-emerald animate-pulse inline-block" />
          {edges.length} Arbitrage Lock{edges.length > 1 ? 's' : ''} Detected
        </h2>
        <div className="flex items-center gap-3">
          {isValidating && (
            <RefreshCcw size={12} className="animate-spin text-edge-emerald" />
          )}
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Auto-Sync Active
          </span>
          <button
            onClick={() => mutate()}
            className="text-[10px] font-black text-slate-500 hover:text-edge-emerald transition-colors uppercase tracking-widest"
          >
            Refresh
          </button>
        </div>
      </div>

      {edges.map((edge, i) => (
        <ArbCard
          key={`${edge.event}-${edge.marketType}-${i}`}
          edge={edge}
          fetchedAt={fetchedAtRef.current}
        />
      ))}
    </div>
  );
}
