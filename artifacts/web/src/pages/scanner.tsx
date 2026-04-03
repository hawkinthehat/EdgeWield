import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetEdges } from "@workspace/api-client-react";
import type { MarketGap } from "@workspace/api-client-react";
import { RefreshCw, TrendingUp, X, DollarSign, Zap, Shield } from "lucide-react";

const SPORTS = [
  { label: "Upcoming", key: "upcoming" },
  { label: "NFL", key: "americanfootball_nfl" },
  { label: "NBA", key: "basketball_nba" },
  { label: "MLB", key: "baseball_mlb" },
  { label: "NHL", key: "icehockey_nhl" },
  { label: "Soccer", key: "soccer_epl" },
  { label: "MMA", key: "mma_mixed_martial_arts" },
];

const REFRESH_INTERVAL = 30;

function StakeBadge({ label, bookie, odds, stake, team }: { label: string; bookie: string; odds: number; stake: number; team: string }) {
  return (
    <div className="flex-1 bg-edge-navy/60 border border-edge-border rounded-xl p-4 space-y-2">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-white font-bold text-sm leading-tight">{team}</div>
      <div className="text-slate-400 text-xs">{bookie}</div>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-edge-emerald font-black text-2xl">${stake.toFixed(2)}</span>
        <span className="text-slate-500 text-xs">@ {odds.toFixed(2)}</span>
      </div>
    </div>
  );
}

function WieldModal({ edge, stake, onClose }: { edge: MarketGap; stake: number; onClose: () => void }) {
  const ratio = stake / 100;
  const scaledStakeA = Number((edge.stakeA * ratio).toFixed(2));
  const scaledStakeB = Number((edge.stakeB * ratio).toFixed(2));
  const scaledPayout = Number((edge.payout * ratio).toFixed(2));
  const scaledProfit = Number((edge.guaranteedProfit * ratio).toFixed(2));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-edge-slate border border-edge-border rounded-3xl p-8 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-edge-emerald mb-1">{edge.marketType} · Arb Found</div>
            <h2 className="text-xl font-black text-white leading-tight">{edge.event}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="bg-edge-emerald/10 border border-edge-emerald/30 rounded-2xl p-4 mb-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-edge-emerald mb-1">Guaranteed Profit</div>
          <div className="text-4xl font-black text-edge-emerald">+{edge.profit}%</div>
          <div className="text-slate-400 text-sm mt-1">
            ${scaledProfit} profit on ${stake} total stake
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <StakeBadge label="Bet Side A" bookie={edge.bookieA} odds={edge.oddsA} stake={scaledStakeA} team={edge.teamA} />
          <StakeBadge label="Bet Side B" bookie={edge.bookieB} odds={edge.oddsB} stake={scaledStakeB} team={edge.teamB} />
        </div>

        <div className="bg-edge-navy/40 rounded-xl p-4 text-sm text-slate-400 mb-6 space-y-1">
          <div className="flex justify-between">
            <span>Total Stake</span>
            <span className="text-white font-bold">${stake.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Guaranteed Payout</span>
            <span className="text-white font-bold">${scaledPayout.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-edge-border pt-2 mt-2">
            <span>Guaranteed Profit</span>
            <span className="text-edge-emerald font-black">+${scaledProfit.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 text-center leading-relaxed">
          Odds shift fast. Verify lines before placing. EdgeWield shows opportunities — execution is yours.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Scanner() {
  const [sport, setSport] = useState("upcoming");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [activeEdge, setActiveEdge] = useState<MarketGap | null>(null);
  const [stake, setStake] = useState(100);

  const { data: edges, isLoading, isError, refetch, isFetching } = useGetEdges(
    { sport }
  );

  const handleRefresh = useCallback(() => {
    refetch();
    setCountdown(REFRESH_INTERVAL);
  }, [refetch]);

  useEffect(() => {
    setCountdown(REFRESH_INTERVAL);
  }, [sport]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          return REFRESH_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      refetch();
    }, REFRESH_INTERVAL * 1000);
    return () => clearInterval(refreshTimer);
  }, [refetch]);

  const profitColor = (p: number) => {
    if (p >= 2) return "text-green-400";
    if (p >= 1) return "text-edge-emerald";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-[80vh] pb-24">
      <AnimatePresence>
        {activeEdge && (
          <WieldModal edge={activeEdge} stake={stake} onClose={() => setActiveEdge(null)} />
        )}
      </AnimatePresence>

      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edge-emerald/10 border border-edge-emerald/20 text-edge-emerald text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap size={10} /> Live Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-3">
            Edge <span className="text-edge-emerald">Scanner</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Real-time arbitrage detection across major sportsbooks. When we find a gap, you wield it.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {SPORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSport(s.key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  sport === s.key
                    ? "bg-edge-emerald text-edge-navy shadow-lg shadow-edge-emerald/20"
                    : "bg-edge-slate/40 border border-edge-border text-slate-400 hover:border-edge-emerald/40 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-edge-slate/40 border border-edge-border rounded-xl px-3 py-1.5">
              <DollarSign size={14} className="text-slate-500" />
              <input
                type="number"
                value={stake}
                min={10}
                max={100000}
                step={10}
                onChange={(e) => setStake(Number(e.target.value) || 100)}
                className="w-20 bg-transparent text-white text-sm font-bold focus:outline-none"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center gap-2 text-slate-500 hover:text-edge-emerald transition-colors text-xs font-black uppercase tracking-widest disabled:opacity-40"
            >
              <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
              {isFetching ? "Scanning..." : `${countdown}s`}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-edge-emerald mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-edge-emerald animate-pulse inline-block" />
              Scanning markets...
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-edge-slate/40 border border-edge-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex justify-between items-center">
            <span>Scanner error — check your Odds API key.</span>
            <button onClick={handleRefresh} className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg uppercase font-black transition-colors">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="text-[10px] font-black uppercase tracking-widest text-edge-emerald mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-edge-emerald animate-pulse inline-block" />
              {edges && edges.length > 0 ? `${edges.length} edge${edges.length > 1 ? "s" : ""} detected` : "No edges detected"}
            </div>

            {edges && edges.length === 0 && (
              <div className="p-12 bg-edge-slate/20 border border-edge-border rounded-2xl text-center">
                <Shield size={32} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Market is efficient right now.</p>
                <p className="text-slate-600 text-sm mt-1">Scanner refreshes every {REFRESH_INTERVAL}s. Edges appear and close fast.</p>
              </div>
            )}

            <div className="space-y-3">
              {edges?.map((edge, i) => (
                <motion.div
                  key={`${edge.event}-${edge.marketType}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 bg-edge-slate/40 border border-edge-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-edge-emerald/40 transition-all cursor-pointer"
                  onClick={() => setActiveEdge(edge)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-edge-border/40 px-2 py-0.5 rounded-lg">
                        {edge.marketType}
                      </span>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight truncate">{edge.event}</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {edge.bookieA} <span className="text-slate-600 mx-1">vs</span> {edge.bookieB}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className={`text-3xl font-black ${profitColor(edge.profit)}`}>
                        +{edge.profit}%
                      </div>
                      <div className="text-slate-500 text-xs">
                        ${(edge.guaranteedProfit * (stake / 100)).toFixed(2)} on ${stake}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveEdge(edge); }}
                      className="bg-edge-emerald text-edge-navy px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap hover:bg-white transition-colors shadow-lg shadow-edge-emerald/10 group-hover:shadow-edge-emerald/30"
                    >
                      Wield It
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {!isLoading && edges && edges.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
          <p className="text-[10px] text-slate-600 text-center">
            Scanning {MARKETS_LABEL} across US sportsbooks. Odds update live — act fast.
          </p>
        </div>
      )}
    </div>
  );
}

const MARKETS_LABEL = "Moneyline, Spread & Totals";
