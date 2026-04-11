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
  const displayName = isLocked ? 'Locked Player Prop' : arb.player_name;
  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-zinc-900/70 p-6 transition-all duration-300 ${
        isLocked ? 'border-slate-700/60 shadow-[0_14px_40px_rgba(2,6,23,0.45)]' : 'border-slate-700'
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl border border-slate-700/70 bg-gradient-to-b from-black/50 via-zinc-900/70 to-black/75 p-6 text-center backdrop-blur-md transition-all duration-300 group-hover:backdrop-blur-sm">
          <div className="mb-3 rounded-full border border-emerald-400/40 bg-emerald-400/15 p-3 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
            <Lock className="text-emerald-400" size={20} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Pro Access Required</p>
          <p className="mb-4 max-w-[22ch] text-[10px] font-semibold text-slate-300">
            Upgrade to unlock player-level edges and prop-specific lines.
          </p>
          <button
            type="button"
            onClick={handleUnlock}
            aria-label="Upgrade to Pro to unlock full terminal"
            className="mt-1 rounded-lg bg-emerald-400 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-emerald-400/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-emerald-400/40"
          >
            Unlock Full Terminal
          </button>
        </div>
      )}

      <div
        aria-hidden={isLocked}
        className={isLocked ? 'pointer-events-none select-none blur-[3px] saturate-[0.75] opacity-90' : ''}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-black uppercase italic text-white">{displayName}</h3>
          <span className="font-black text-emerald-400">+{arb.roi.toFixed(2)}%</span>
        </div>
        <p className="text-[10px] font-bold uppercase text-slate-400">{arb.market}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-700/70 bg-zinc-950 p-3">
            <p
              className={`text-[8px] uppercase ${
                arb.bookie_a === 'FanDuel' || arb.bookie_a === 'DraftKings' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {arb.bookie_a}
            </p>
            <p className="text-sm font-black text-white">{arb.odds_a.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-700/70 bg-zinc-950 p-3">
            <p
              className={`text-[8px] uppercase ${
                arb.bookie_b === 'FanDuel' || arb.bookie_b === 'DraftKings' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {arb.bookie_b}
            </p>
            <p className="text-sm font-black text-white">{arb.odds_b.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
