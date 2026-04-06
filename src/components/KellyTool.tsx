'use client';

import { useMemo, useState } from 'react';

type KellyToolProps = {
  bankroll?: number;
};

export default function KellyTool({ bankroll = 1000 }: KellyToolProps) {
  const [odds, setOdds] = useState(2.1);
  const [prob, setProb] = useState(52);

  const { recommendedBet, kellyPercent } = useMemo(() => {
    const b = odds - 1;
    const p = prob / 100;
    const q = 1 - p;

    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(p) || p < 0 || p > 1) {
      return { recommendedBet: 0, kellyPercent: 0 };
    }

    const rawKelly = (b * p - q) / b;
    const quarterKelly = rawKelly * 0.25;
    const safeKelly = Math.max(0, quarterKelly);

    return {
      recommendedBet: bankroll * safeKelly,
      kellyPercent: safeKelly * 100,
    };
  }, [bankroll, odds, prob]);

  return (
    <div className="mt-6 rounded-[2.5rem] border border-edge-emerald/30 bg-edge-slate/30 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-edge-emerald">Kelly Optimizer</h3>
        <span className="rounded bg-edge-emerald/10 px-2 py-1 text-[10px] text-edge-emerald">1/4 Kelly (Safe)</span>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">Decimal Odds</label>
          <input
            type="number"
            value={odds}
            onChange={(e) => setOdds(Number(e.target.value))}
            className="w-full rounded-xl border border-edge-border bg-edge-navy p-3 font-black text-white"
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">Win Probability %</label>
          <input
            type="number"
            value={prob}
            onChange={(e) => setProb(Number(e.target.value))}
            className="w-full rounded-xl border border-edge-border bg-edge-navy p-3 font-black text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-edge-border bg-edge-navy p-6">
        <div>
          <p className="text-[10px] font-bold uppercase italic text-slate-500">Execution Amount</p>
          <p className="text-3xl font-black text-white">${recommendedBet.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase italic text-slate-500">Risk %</p>
          <p className="text-xl font-black text-edge-emerald">{kellyPercent.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}
