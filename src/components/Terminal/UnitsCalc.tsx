'use client';

import { useEffect, useState } from 'react';
import { Calculator, Lock } from 'lucide-react';

type UnitsCalcProps = {
  oddsA: number;
  oddsB: number;
};

export default function UnitsCalc({ oddsA, oddsB }: UnitsCalcProps) {
  const [stakeA, setStakeA] = useState<number>(100);
  const [stakeB, setStakeB] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  useEffect(() => {
    if (!Number.isFinite(oddsA) || !Number.isFinite(oddsB) || oddsB === 0) {
      setStakeB(0);
      setTotalProfit(0);
      return;
    }

    const calculatedStakeB = (stakeA * oddsA) / oddsB;
    setStakeB(Number(calculatedStakeB.toFixed(2)));

    const profit = stakeA * oddsA - (stakeA + calculatedStakeB);
    setTotalProfit(Number(profit.toFixed(2)));
  }, [stakeA, oddsA, oddsB]);

  return (
    <section className="rounded-[2rem] border border-slate-700 bg-zinc-900/80 p-8 shadow-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Calculator size={18} className="text-emerald-400" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Unit Execution</h3>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="ml-2 text-[10px] font-bold uppercase text-slate-400">Main Stake (Bookie A)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
            <input
              type="number"
              value={stakeA}
              onChange={(event) => setStakeA(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-600 bg-zinc-950 p-4 pl-8 text-xl font-black text-white outline-none transition-all focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-2 text-[10px] font-bold uppercase text-slate-400">Required Hedge (Bookie B)</label>
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4">
            <span className="text-2xl font-black text-emerald-400">${stakeB}</span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">
              Calculated to Lock Profit
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-emerald-400/45 bg-emerald-400/20 p-6 text-white shadow-lg shadow-emerald-400/20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/80">Guaranteed Return</p>
          <h4 className="text-3xl font-black italic">+${totalProfit}</h4>
        </div>
        <div className="rounded-full bg-zinc-950/25 p-3">
          <Lock size={24} strokeWidth={3} />
        </div>
      </div>
    </section>
  );
}
