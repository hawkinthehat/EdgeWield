'use client';

import { useEffect, useState } from 'react';
import { Calculator, Lock } from 'lucide-react';

type HedgeResult = {
  hedge: number;
  profit: number;
};

function toDecimalOdds(odds: number): number {
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
}

export default function HedgeCalculator() {
  const [wager, setWager] = useState<number>(100);
  const [originalOdds, setOriginalOdds] = useState<number>(200);
  const [liveOpponentOdds, setLiveOpponentOdds] = useState<number>(-120);
  const [result, setResult] = useState<HedgeResult>({ hedge: 0, profit: 0 });

  useEffect(() => {
    const decimalOriginal = toDecimalOdds(originalOdds);
    const decimalLive = toDecimalOdds(liveOpponentOdds);
    const potentialPayout = wager * decimalOriginal;
    const recommendedHedge = potentialPayout / decimalLive;
    const guaranteedProfit = potentialPayout - wager - recommendedHedge;

    setResult({
      hedge: Number.isFinite(recommendedHedge)
        ? parseFloat(recommendedHedge.toFixed(2))
        : 0,
      profit: Number.isFinite(guaranteedProfit)
        ? parseFloat(guaranteedProfit.toFixed(2))
        : 0,
    });
  }, [wager, originalOdds, liveOpponentOdds]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="mb-6 flex items-center gap-2">
        <Calculator className="text-edge-emerald" />
        <h3 className="text-xl font-black italic text-white">Hedge Optimizer</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Original Wager ($)
          </label>
          <input
            type="number"
            value={wager}
            onChange={(event) => setWager(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Original Odds
            </label>
            <input
              type="number"
              value={originalOdds}
              onChange={(event) => setOriginalOdds(Number(event.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Opponent Odds
            </label>
            <input
              type="number"
              value={liveOpponentOdds}
              onChange={(event) => setLiveOpponentOdds(Number(event.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white"
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-edge-emerald/30 bg-edge-emerald/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-edge-emerald">Recommended Hedge:</span>
            <span className="text-2xl font-black text-white">${result.hedge}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-300">Guaranteed Profit:</span>
            <span className="text-2xl font-black text-emerald-300">${result.profit}</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 font-bold text-white"
        >
          <Lock size={18} /> Save to Vantedge Portfolio
        </button>
      </div>
    </section>
  );
}
