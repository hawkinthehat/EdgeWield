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
    <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-zinc-900/85 p-6 text-white shadow-[0_0_24px_rgba(15,23,42,0.4)]">
      <div className="absolute right-0 top-0 p-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
        <Zap size={14} /> Hedge Opportunity Detected
      </div>

      <h3 className="mb-1 text-xl font-bold">{originalBet.event_name}</h3>
      <p className="mb-6 text-sm text-slate-400">
        Opponent odds moved to <span className="font-mono font-bold text-white">{liveOpponentOdds}</span>
      </p>

      <div className="flex items-end justify-between rounded-2xl border border-slate-600 bg-slate-800/50 p-4">
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Lock In Profit</p>
          <div className="font-mono text-3xl font-bold text-emerald-400">${formattedProfit}</div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-slate-400">Required Hedge</p>
          <div className="text-lg font-mono font-bold">${formattedHedgeWager}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirmExit}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-500 bg-slate-800 py-4 font-bold text-white transition-all hover:border-slate-300 hover:bg-slate-700"
      >
        Confirm Exit Strategy <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
