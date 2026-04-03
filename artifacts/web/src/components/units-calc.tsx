import { useState, useEffect } from 'react';
import { Calculator, Lock } from 'lucide-react';

export default function UnitsCalc({ oddsA, oddsB, teamA, teamB, bookieA, bookieB }: {
  oddsA: number;
  oddsB: number;
  teamA?: string;
  teamB?: string;
  bookieA?: string;
  bookieB?: string;
}) {
  const [stakeA, setStakeA] = useState<number>(100);
  const [stakeB, setStakeB] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  useEffect(() => {
    const calculatedStakeB = (stakeA * oddsA) / oddsB;
    setStakeB(Number(calculatedStakeB.toFixed(2)));
    const profit = stakeA * oddsA - (stakeA + calculatedStakeB);
    setTotalProfit(Number(profit.toFixed(2)));
  }, [stakeA, oddsA, oddsB]);

  return (
    <div className="bg-edge-navy border border-edge-border p-8 rounded-[2rem] shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={18} className="text-edge-emerald" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Unit Execution
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT: BOOKIE A */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">
            {teamA ? `${teamA} · ` : ''}Main Stake ({bookieA ?? 'Bookie A'})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
              $
            </span>
            <input
              type="number"
              value={stakeA}
              min={1}
              onChange={(e) => setStakeA(Number(e.target.value) || 0)}
              className="w-full bg-edge-slate/40 border border-edge-border p-4 pl-8 rounded-2xl text-xl font-black text-white focus:border-edge-emerald outline-none transition-all"
            />
          </div>
        </div>

        {/* OUTPUT: BOOKIE B */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">
            {teamB ? `${teamB} · ` : ''}Required Hedge ({bookieB ?? 'Bookie B'})
          </label>
          <div className="bg-edge-emerald/10 border border-edge-emerald/30 p-4 rounded-2xl h-[58px] flex flex-col justify-center">
            <span className="text-2xl font-black text-edge-emerald">${stakeB}</span>
            <p className="text-[10px] text-edge-emerald/60 font-bold uppercase mt-0.5 tracking-widest">
              Calculated to Lock Profit
            </p>
          </div>
        </div>
      </div>

      {/* FINAL PROFIT BANNER */}
      <div className="mt-8 p-6 bg-edge-emerald text-edge-navy rounded-2xl flex justify-between items-center shadow-lg shadow-edge-emerald/20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
            Guaranteed Return
          </p>
          <h4 className="text-3xl font-black italic">
            {totalProfit >= 0 ? '+' : ''}${totalProfit}
          </h4>
        </div>
        <div className="bg-edge-navy/10 p-3 rounded-full">
          <Lock size={24} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
