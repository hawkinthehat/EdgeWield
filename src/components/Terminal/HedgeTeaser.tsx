'use client';

import { Lock, Zap, TrendingUp } from 'lucide-react';

interface HedgeTeaserProps {
  isPremium: boolean;
  event: string;
  potentialProfit: string; // e.g., "45.20"
  onUpgrade: () => void;
  isCheckingOut?: boolean;
}

export default function HedgeTeaser({
  isPremium,
  event,
  potentialProfit,
  onUpgrade,
  isCheckingOut = false,
}: HedgeTeaserProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
          <Zap size={14} className="fill-emerald-400" /> Live Opportunity
        </div>
        {!isPremium && (
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500">
            PRO FEATURE
          </span>
        )}
      </div>

      <h3 className="mb-6 text-lg font-bold text-white">{event}</h3>

      <div className="relative">
        <div
          className={`flex items-center justify-between rounded-2xl bg-slate-800/50 p-5 transition-all duration-700 ${
            !isPremium ? 'scale-95 select-none blur-md' : 'blur-0'
          }`}
        >
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">
              Guaranteed Exit
            </p>
            <div className="text-3xl font-mono font-bold text-emerald-400">
              ${isPremium ? potentialProfit : 'XX.XX'}
            </div>
          </div>
          <TrendingUp className="h-10 w-10 text-slate-700" />
        </div>

        {!isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div className="mb-3 rounded-full bg-blue-600 p-3 shadow-lg shadow-blue-500/40">
              <Lock size={20} className="text-white" />
            </div>
            <p className="mb-1 text-center text-sm font-bold text-white">
              Unlock Calculation
            </p>
            <p className="max-w-[140px] text-center text-[11px] text-slate-400">
              Get the exact hedge amount for this game.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={isPremium ? () => {} : onUpgrade}
        disabled={!isPremium && isCheckingOut}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold transition-all ${
          isPremium
            ? 'bg-slate-800 text-white hover:bg-slate-700'
            : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60'
        }`}
      >
        {isPremium
          ? 'View Strategy'
          : isCheckingOut
            ? 'Redirecting to Checkout...'
            : 'Upgrade to EdgeWield Pro'}
      </button>
    </div>
  );
}
