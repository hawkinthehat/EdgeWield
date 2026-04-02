import { useState } from 'react';
import { calculateKelly } from '@/lib/engine';

export default function KellyTool({ bankroll = 1000 }: { bankroll?: number }) {
  const [odds, setOdds] = useState(2.10);
  const [prob, setProb] = useState(52);

  const { percentage, isAdvantage } = calculateKelly(odds, prob);
  const recommendedBet = (percentage / 100) * bankroll;

  return (
    <div className="p-8 bg-edge-slate/30 border border-edge-emerald/30 rounded-[2.5rem]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-edge-emerald">
          Kelly Optimizer
        </h3>
        <span className="text-[10px] bg-edge-emerald/10 text-edge-emerald px-3 py-1 rounded-full border border-edge-emerald/20 font-bold">
          ¼ Kelly · Safe Mode
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            Decimal Odds
          </label>
          <input
            type="number"
            step="0.01"
            min="1.01"
            value={odds}
            onChange={(e) => setOdds(Number(e.target.value))}
            className="w-full bg-edge-navy border border-edge-border p-3 rounded-xl font-black text-white focus:outline-none focus:border-edge-emerald/60 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            Win Probability %
          </label>
          <input
            type="number"
            step="0.5"
            min="1"
            max="99"
            value={prob}
            onChange={(e) => setProb(Number(e.target.value))}
            className="w-full bg-edge-navy border border-edge-border p-3 rounded-xl font-black text-white focus:outline-none focus:border-edge-emerald/60 transition-colors"
          />
        </div>
      </div>

      <div className="bg-edge-navy p-6 rounded-2xl border border-edge-border flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mb-1">
            Execution Amount
          </p>
          <p className={`text-3xl font-black ${isAdvantage ? 'text-white' : 'text-slate-600'}`}>
            ${recommendedBet.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mb-1">
            Risk %
          </p>
          <p className={`text-xl font-black ${isAdvantage ? 'text-edge-emerald' : 'text-slate-600'}`}>
            {percentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {!isAdvantage && (
        <p className="mt-4 text-center text-[10px] text-red-400/70 font-bold uppercase tracking-widest">
          No edge — Kelly recommends $0 at these inputs
        </p>
      )}
    </div>
  );
}
