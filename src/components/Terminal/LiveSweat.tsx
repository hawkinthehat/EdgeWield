'use client';

import { Eye, EyeOff, Radar } from 'lucide-react';
import { formatAmericanOdds } from '@/lib/oddsFormat';
import type { ArbRow } from '@/components/Terminal/ArbFeed';

type LiveSweatProps = {
  watchlist: ArbRow[];
  onToggleWatch: (row: ArbRow) => void;
};

export default function LiveSweat({ watchlist, onToggleWatch }: LiveSweatProps) {
  return (
    <section className="rounded-2xl border border-edge-border bg-edge-slate/15 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Sweat</p>
          <h2 className="mt-1 text-lg font-black uppercase italic text-white">Pinned Watchlist</h2>
        </div>
        <div className="rounded-xl border border-edge-emerald/30 bg-edge-emerald/10 px-3 py-2 text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Watching</p>
          <p className="text-base font-black text-edge-emerald">{watchlist.length}</p>
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="space-y-3">
          {watchlist.map((row) => (
            <article key={row.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{row.market_type}</p>
                  <h3 className="mt-1 text-sm font-black text-white sm:text-base">{row.event_name}</h3>
                  <p className="mt-2 text-[11px] text-slate-300">
                    {row.bookie_a} {formatAmericanOdds(row.odds_a)} vs {row.bookie_b} {formatAmericanOdds(row.odds_b)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-edge-emerald">+{row.profit_percent.toFixed(2)}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Edge</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onToggleWatch(row)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-300 transition hover:border-edge-emerald/60 hover:text-edge-emerald"
                >
                  <EyeOff size={12} />
                  Unwatch
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-edge-border bg-slate-950/40 px-6 py-10 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-edge-border bg-edge-navy/60">
            <Radar size={18} className="text-edge-emerald" />
          </div>
          <p className="text-sm font-black uppercase tracking-wide text-white">No tracked edges yet</p>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
            Tap the <Eye size={12} className="mx-1 inline-block -translate-y-px" />
            Watch icon on any terminal row to pin it here for active monitoring.
          </p>
        </div>
      )}
    </section>
  );
}
