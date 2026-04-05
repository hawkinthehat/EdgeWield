'use client';

import { ArrowRight, Zap } from 'lucide-react';
import { calculateHedgeMetrics } from '@/lib/hedge';

type HedgeAlertCardProps = {
  originalBet: {
    wager: number;
    odds: number;
    event_name: string;
  };
  liveOpponentOdds: number;
  onConfirmExit?: () => void;
};

export default function HedgeAlertCard({
  originalBet,
  liveOpponentOdds,
  onConfirmExit,
}: HedgeAlertCardProps) {
  const { hedgeWager, guaranteedProfit } = calculateHedgeMetrics({
    wager: originalBet.wager,
    originalOdds: originalBet.odds,
    liveOpponentOdds,
  });

  const formattedHedgeWager = hedgeWager.toFixed(2);
  const formattedProfit = guaranteedProfit.toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-slate-900 p-6 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]">
      <div className="absolute right-0 top-0 p-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
        <Zap size={14} /> Hedge Opportunity Detected
      </div>

      <h3 className="mb-1 text-xl font-bold">{originalBet.event_name}</h3>
      <p className="mb-6 text-sm text-slate-400">
        Opponent odds moved to <span className="font-mono font-bold text-white">{liveOpponentOdds}</span>
      </p>

      <div className="flex items-end justify-between rounded-2xl border border-blue-500/20 bg-blue-600/10 p-4">
        <div>
          <p className="text-[10px] font-bold uppercase text-blue-300">Lock In Profit</p>
          <div className="font-mono text-3xl font-bold text-emerald-400">${formattedProfit}</div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-blue-300">Required Hedge</p>
          <div className="text-lg font-mono font-bold">${formattedHedgeWager}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirmExit}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold transition-all hover:bg-blue-500"
      >
        Confirm Exit Strategy <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
