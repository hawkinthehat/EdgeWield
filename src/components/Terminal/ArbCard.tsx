'use client';

import { Lock } from 'lucide-react';

export type UserTier = 'trial' | 'pro';

export type ArbCardData = {
  type: 'prop' | 'game';
  player_name: string;
  roi: number;
  market: string;
  bookie_a: string;
  odds_a: number;
  bookie_b: string;
  odds_b: number;
};

type ArbCardProps = {
  arb: ArbCardData;
  userTier: UserTier;
  onUnlock?: () => void;
};

export default function ArbCard({ arb, userTier, onUnlock }: ArbCardProps) {
  const isLocked = arb.type === 'prop' && userTier === 'trial';
  const displayName = isLocked ? 'Top Secret Player' : arb.player_name;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-edge-border bg-edge-slate/10 p-6">
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-edge-navy/40 p-6 text-center backdrop-blur-md">
          <div className="mb-3 rounded-full bg-edge-emerald/20 p-3">
            <Lock className="text-edge-emerald" size={20} />
          </div>
          <p className="mb-1 text-xs font-black uppercase tracking-tighter text-white">Pro Strategy Locked</p>
          <p className="mb-4 text-[10px] font-bold text-slate-400">
            Upgrade to Pro to see the specific Player &amp; Prop
          </p>
          <button
            type="button"
            onClick={onUnlock}
            aria-label="Upgrade to Pro to unlock full terminal"
            className="rounded-lg bg-edge-emerald px-4 py-2 text-[10px] font-black uppercase text-edge-navy transition-all hover:scale-105"
          >
            Unlock Full Terminal
          </button>
        </div>
      )}

      <div className={isLocked ? 'select-none blur-sm' : ''}>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-black uppercase italic text-white">{displayName}</h3>
          <span className="font-black text-edge-emerald">+{arb.roi.toFixed(2)}%</span>
        </div>
        <p className="text-[10px] font-bold uppercase text-slate-500">{arb.market}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-edge-navy p-3">
            <p className="text-[8px] uppercase text-slate-500">{arb.bookie_a}</p>
            <p className="text-sm font-black text-white">{arb.odds_a.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-edge-navy p-3">
            <p className="text-[8px] uppercase text-slate-500">{arb.bookie_b}</p>
            <p className="text-sm font-black text-white">{arb.odds_b.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
