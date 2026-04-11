'use client';

import type { KeyboardEvent } from 'react';
import { Lock } from 'lucide-react';
import { getBookmakerMeta } from '@/lib/bookmakers';
import { formatAmericanOdds } from '@/lib/oddsFormat';

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
  onSelect?: (arb: ArbCardData) => void;
};

export default function ArbCard({ arb, userTier, onUnlock, onSelect }: ArbCardProps) {
  const isLocked = arb.type === 'prop' && userTier === 'trial';
  const displayName = isLocked ? 'Locked Player Prop' : arb.player_name;
  const bookieA = getBookmakerMeta(arb.bookie_a);
  const bookieB = getBookmakerMeta(arb.bookie_b);
  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSelect = () => {
    if (isLocked || !onSelect) {
      return;
    }
    onSelect(arb);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      role={isLocked ? undefined : 'button'}
      tabIndex={isLocked ? -1 : 0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={`group relative overflow-hidden rounded-3xl border bg-edge-slate/10 p-6 transition-all duration-300 ${
        isLocked ? 'border-white/10 shadow-[0_14px_40px_rgba(2,6,23,0.45)]' : 'border-edge-border'
      } ${isLocked ? '' : 'cursor-pointer hover:border-edge-emerald/60 hover:bg-edge-slate/20'}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-black/50 via-edge-navy/60 to-black/70 p-6 text-center backdrop-blur-md transition-all duration-300 group-hover:backdrop-blur-sm">
          <div className="mb-3 rounded-full border border-edge-emerald/35 bg-edge-emerald/15 p-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <Lock className="text-edge-emerald" size={20} />
          </div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Sea Hawk Access Required</p>
          <p className="mb-4 max-w-[22ch] text-[10px] font-semibold text-slate-300">
            Upgrade to unlock player-level edges and prop-specific lines.
          </p>
          <button
            type="button"
            onClick={handleUnlock}
            aria-label="Upgrade to Sea Hawk to unlock full terminal"
            className="mt-1 rounded-lg bg-edge-emerald px-4 py-2 text-[10px] font-black uppercase tracking-wide text-edge-navy shadow-lg shadow-edge-emerald/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-edge-emerald/40"
          >
            Upgrade to Sea Hawk
          </button>
        </div>
      )}

      <div
        aria-hidden={isLocked}
        className={isLocked ? 'pointer-events-none select-none blur-[3px] saturate-[0.75] opacity-90' : ''}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-black uppercase italic text-white">{displayName}</h3>
          <span className="font-black text-edge-emerald">+{arb.roi.toFixed(2)}%</span>
        </div>
        <p className="text-[10px] font-bold uppercase text-slate-500">{arb.market}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-edge-navy p-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-black ${bookieA.accentClass}`}
              >
                {bookieA.badge}
              </span>
              <p className="text-[8px] uppercase text-slate-500">{arb.bookie_a}</p>
            </div>
            <p className="mt-1 text-sm font-black text-white">{formatAmericanOdds(arb.odds_a)}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-edge-navy p-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-black ${bookieB.accentClass}`}
              >
                {bookieB.badge}
              </span>
              <p className="text-[8px] uppercase text-slate-500">{arb.bookie_b}</p>
            </div>
            <p className="mt-1 text-sm font-black text-white">{formatAmericanOdds(arb.odds_b)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
