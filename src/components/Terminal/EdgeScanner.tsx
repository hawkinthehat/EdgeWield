'use client';

import { ExternalLink, Target, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateKelly } from '@/lib/engine/kelly';
import type { EdgeBet } from '@/lib/scanner';

type EdgeScannerProps = {
  bets: EdgeBet[];
  bankroll?: number;
};

function formatAmericanOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function americanToDecimalOdds(odds: number): number {
  return odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
}

export function KellySidebar({
  activeBet,
  bankroll = 10_000,
}: {
  activeBet: EdgeBet | null;
  bankroll?: number;
}) {
  if (!activeBet) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h5 className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Recommended Stake
          </h5>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select a scanner bet to calculate stake sizing.
          </p>
        </div>
      </div>
    );
  }

  const quarterKelly = calculateKelly(americanToDecimalOdds(activeBet.best_odds), activeBet.win_prob, 0.25);
  const suggestedStake = bankroll * (quarterKelly.percentage / 100);
  const unitSize = Math.max(1, bankroll * 0.01);
  const units = suggestedStake / unitSize;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-500/20 bg-blue-600/5 p-6">
        <h5 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
          <Target size={14} /> Recommended Stake
        </h5>
        <div className="mb-6">
          <p className="text-4xl font-black italic text-white">${suggestedStake.toFixed(2)}</p>
          <p className="text-[10px] font-bold uppercase text-slate-500">{units.toFixed(2)} Units (Quarter Kelly)</p>
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-blue-600 py-4 text-[10px] font-black uppercase text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          Log to Bankroll
        </button>
      </div>

      <div className="px-2">
        <h5 className="mb-4 text-[9px] font-black uppercase tracking-widest text-slate-600">Market Integrity</h5>
        <div className="mb-2 flex justify-between text-[11px]">
          <span className="font-bold text-slate-500">Sharp Liquidity</span>
          <span className="font-mono text-white">{quarterKelly.isAdvantage ? 'High' : 'Moderate'}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className={`${quarterKelly.isAdvantage ? 'w-[85%]' : 'w-[60%]'} h-full bg-blue-500`} />
        </div>
      </div>
    </div>
  );
}

export default function EdgeScanner({ bets, bankroll }: EdgeScannerProps) {
  const [activeBetId, setActiveBetId] = useState<string | null>(bets[0]?.id ?? null);
  const activeBet = useMemo(() => bets.find((bet) => bet.id === activeBetId) ?? null, [bets, activeBetId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="w-full space-y-4">
        <div className="grid grid-cols-12 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <div className="col-span-5">Event / Market</div>
          <div className="col-span-2 text-center">Best Odds</div>
          <div className="col-span-2 text-center">Fair Value</div>
          <div className="col-span-3 text-right">Edge %</div>
        </div>

        {bets.map((bet) => {
          const isActive = bet.id === activeBet?.id;
          return (
            <div
              key={bet.id}
              className={`group grid grid-cols-12 items-center rounded-2xl border bg-[#161821] px-6 py-5 transition-all ${
                isActive ? 'border-blue-500/60' : 'border-white/5 hover:border-blue-500/50'
              }`}
            >
              <div className="col-span-5">
                <h4 className="mb-1 text-sm font-bold text-white">{bet.event}</h4>
                <p className="text-[10px] font-mono uppercase text-slate-500">
                  {bet.market} • {bet.selection}
                </p>
              </div>

              <div className="col-span-2 text-center">
                <div className="inline-block rounded-lg border border-blue-500/20 bg-blue-600/10 px-3 py-1">
                  <span className="text-sm font-black text-blue-500">{formatAmericanOdds(bet.best_odds)}</span>
                </div>
                <p className="mt-1 text-[9px] font-bold uppercase text-slate-600">{bet.bookie}</p>
              </div>

              <div className="col-span-2 text-center">
                <span className="text-xs font-mono font-bold text-slate-400">{formatAmericanOdds(bet.fair_odds)}</span>
                <p className="mt-1 text-[9px] font-bold uppercase text-slate-600">Sharp Avg</p>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-4">
                <div className="text-right">
                  <p className="leading-none text-lg font-black italic text-white">{bet.edge_pct}%</p>
                  <p className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-widest text-blue-500">
                    <TrendingUp size={11} />
                    Expected Value
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBetId(bet.id)}
                  className="rounded-lg bg-white/5 p-2 text-slate-500 transition-all hover:bg-white/10 hover:text-white"
                  aria-label={`Select ${bet.event} ${bet.selection}`}
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <KellySidebar activeBet={activeBet} {...(typeof bankroll === 'number' ? { bankroll } : {})} />
    </div>
  );
}
