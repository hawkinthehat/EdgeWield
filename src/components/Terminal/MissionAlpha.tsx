'use client';

import { ChevronRight, Target } from 'lucide-react';
import { calculateWield } from '@/lib/engine/kelly';
import type { ArbRow } from '@/components/Terminal/ArbFeed';

export default function MissionAlpha({
  arbs,
  bankroll,
  onClose,
}: {
  arbs: ArbRow[];
  bankroll: number;
  onClose: () => void;
}) {
  const topArb = arbs[0];

  if (!topArb) {
    return null;
  }

  const wield = calculateWield(topArb.odds_a, topArb.odds_b, bankroll);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-edge-navy/95 p-4 backdrop-blur-xl">
      <div className="w-full max-w-xl rounded-[2.5rem] border-2 border-edge-emerald bg-edge-slate/20 p-8 shadow-[0_0_80px_rgba(16,185,129,0.2)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-edge-emerald p-2">
            <Target className="text-edge-navy" size={20} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">
            Mission: Alpha One
          </h2>
        </div>

        <p className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          Status: <span className="text-edge-emerald">Pro Terminal Online</span>. Execute your first edge now.
        </p>

        <div className="mb-8 rounded-3xl border border-edge-border bg-edge-navy p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Market</p>
              <h3 className="text-lg font-black text-white">{topArb.event_name}</h3>
              <p className="text-xs font-bold text-edge-emerald italic">{topArb.market_type}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Est. Profit</p>
              <p className="text-3xl font-black text-edge-emerald">+{wield?.profitPct ?? topArb.profit_percent.toFixed(2)}%</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-edge-border bg-edge-slate/10 p-4">
              <p className="text-[9px] font-bold uppercase text-slate-500">{topArb.bookie_a}</p>
              <p className="text-xl font-black text-white italic">{topArb.odds_a}</p>
              <p className="mt-2 text-[10px] font-black text-edge-emerald">BET: ${wield?.allocation.a ?? '0.00'}</p>
            </div>
            <div className="rounded-2xl border border-edge-border bg-edge-slate/10 p-4">
              <p className="text-[9px] font-bold uppercase text-slate-500">{topArb.bookie_b}</p>
              <p className="text-xl font-black text-white italic">{topArb.odds_b}</p>
              <p className="mt-2 text-[10px] font-black text-edge-emerald">BET: ${wield?.allocation.b ?? '0.00'}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-edge-emerald py-5 font-black uppercase tracking-widest text-edge-navy transition-all hover:scale-105"
        >
          I have executed this trade <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
