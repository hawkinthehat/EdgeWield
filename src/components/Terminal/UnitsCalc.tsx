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
    <section className="rounded-[2rem] border border-edge-border bg-edge-navy p-8 shadow-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Calculator size={18} className="text-edge-emerald" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Unit Execution</h3>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="ml-2 text-[10px] font-bold uppercase text-slate-500">Main Stake (Bookie A)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
            <input
              type="number"
              value={stakeA}
              onChange={(event) => setStakeA(Number(event.target.value))}
              className="w-full rounded-2xl border border-edge-border bg-edge-slate/40 p-4 pl-8 text-xl font-black outline-none transition-all focus:border-edge-emerald"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-2 text-[10px] font-bold uppercase text-slate-500">Required Hedge (Bookie B)</label>
          <div className="rounded-2xl border border-edge-emerald/30 bg-edge-emerald/10 p-4">
            <span className="text-2xl font-black text-edge-emerald">${stakeB}</span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-edge-emerald/60">
              Calculated to Lock Profit
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl bg-edge-emerald p-6 text-edge-navy shadow-lg shadow-edge-emerald/20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Guaranteed Return</p>
          <h4 className="text-3xl font-black italic">+${totalProfit}</h4>
        </div>
        <div className="rounded-full bg-edge-navy/10 p-3">
          <Lock size={24} strokeWidth={3} />
        </div>
      </div>
    </section>
  );
}
