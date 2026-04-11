'use client';

import { useMemo, useState } from 'react';
import { X, Calculator } from 'lucide-react';

type BetCalculatorProps = {
  isOpen: boolean;
  onClose: () => void;
  marketName: string;
  bookA: string;
  oddsA: number;
  bookB: string;
  oddsB: number;
};

function formatCurrency(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BetCalculator({
  isOpen,
  onClose,
  marketName,
  bookA,
  oddsA,
  bookB,
  oddsB,
}: BetCalculatorProps) {
  const [totalStake, setTotalStake] = useState('100');
  const totalStakeValue = Number(totalStake);
  const validStake = Number.isFinite(totalStakeValue) && totalStakeValue > 0;

  const normalizeDecimalOdds = (odds: number) => {
    if (!Number.isFinite(odds) || odds <= 0) {
      return Number.NaN;
    }
    return odds;
  };

  const result = useMemo(() => {
    const a = normalizeDecimalOdds(oddsA);
    const b = normalizeDecimalOdds(oddsB);

    if (!validStake || a <= 1 || b <= 1) {
      return null;
    }

    const stakeA = (totalStakeValue * b) / (a + b);
    const stakeB = totalStakeValue - stakeA;
    const payoutA = stakeA * a;
    const payoutB = stakeB * b;
    const minPayout = Math.min(payoutA, payoutB);
    const guaranteedProfit = minPayout - totalStakeValue;
    const roi = (guaranteedProfit / totalStakeValue) * 100;

    return {
      stakeA,
      stakeB,
      payoutA,
      payoutB,
      guaranteedProfit,
      roi,
    };
  }, [oddsA, oddsB, totalStakeValue, validStake]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-[0_0_50px_rgba(57,255,20,0.12)] sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Eagle-Eye Calculator</p>
            <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight text-white">{marketName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-600 bg-slate-800 p-2 text-slate-300 transition-colors hover:border-[#39FF14]/50 hover:text-[#39FF14]"
            aria-label="Close calculator"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Stake</p>
            <input
              type="number"
              min="1"
              step="0.01"
              value={totalStake}
              onChange={(event) => setTotalStake(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-semibold text-white outline-none transition-colors focus:border-[#39FF14]"
              placeholder="100.00"
            />
          </div>
          <div className="rounded-xl border border-slate-600 bg-slate-900 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Odds Inputs</p>
            <p className="mt-2 text-xs text-slate-200">
              {bookA}: <span className="font-black text-[#39FF14]">{oddsA.toFixed(2)}</span>
            </p>
            <p className="text-xs text-slate-200">
              {bookB}: <span className="font-black text-[#39FF14]">{oddsB.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {!result ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
            Enter a valid total stake to calculate exact hedge amounts.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{bookA} Stake</p>
                <p className="mt-2 text-2xl font-black text-[#39FF14]">${formatCurrency(result.stakeA)}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                  Payout: ${formatCurrency(result.payoutA)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{bookB} Stake</p>
                <p className="mt-2 text-2xl font-black text-[#39FF14]">${formatCurrency(result.stakeB)}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                  Payout: ${formatCurrency(result.payoutB)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#39FF14]/45 bg-[#39FF14]/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#39FF14]">Guaranteed Outcome</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <p className="text-3xl font-black text-white">
                  {result.guaranteedProfit >= 0 ? '+' : ''}${formatCurrency(result.guaranteedProfit)}
                </p>
                <p className="text-sm font-black uppercase tracking-wider text-slate-300">ROI {result.roi.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <Calculator size={14} className="text-[#39FF14]" />
          Exact split based on decimal-odds hedge math.
        </div>
      </div>
    </div>
  );
}
