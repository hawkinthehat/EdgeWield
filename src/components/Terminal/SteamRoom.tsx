'use client';

import type { ArbRow } from '@/components/Terminal/ArbFeed';
import { formatAmericanOdds } from '@/lib/oddsFormat';

type SteamRoomProps = {
  rows: ArbRow[];
};

type SteamMovementRow = {
  id: string;
  event: string;
  market: string;
  bookA: string;
  bookB: string;
  oddA: string;
  oddB: string;
  movementScore: number;
  velocityLabel: string;
  windowLabel: string;
};

const movementWindows = ['15s', '30s', '45s', '60s'] as const;
const velocityLabels = ['Warming', 'Building', 'Breaking', 'Explosive'] as const;

function toMovementRows(rows: ArbRow[]): SteamMovementRow[] {
  return rows
    .map((row, index) => {
      const averageOdds = (row.odds_a + row.odds_b) / 2;
      const impliedDrift = Math.abs((row.odds_a - row.odds_b) / averageOdds) * 100;
      const movementScore = Math.max(0.1, row.profit_percent * 1.8 + impliedDrift);
      const velocityLabel = velocityLabels[Math.min(velocityLabels.length - 1, Math.floor(movementScore / 2.5))] ?? 'Warming';
      return {
        id: row.id,
        event: row.event_name,
        market: row.market_type.toUpperCase(),
        bookA: row.bookie_a,
        bookB: row.bookie_b,
        oddA: formatAmericanOdds(row.odds_a),
        oddB: formatAmericanOdds(row.odds_b),
        movementScore,
        velocityLabel,
        windowLabel: movementWindows[index % movementWindows.length] ?? '30s',
      };
    })
    .sort((a, b) => b.movementScore - a.movementScore)
    .slice(0, 12);
}

export default function SteamRoom({ rows }: SteamRoomProps) {
  const movementRows = toMovementRows(rows);
  const averageMovement =
    movementRows.length === 0
      ? 0
      : movementRows.reduce((total, row) => total + row.movementScore, 0) / movementRows.length;
  const highVelocityCount = movementRows.filter((row) => row.velocityLabel === 'Explosive').length;

  return (
    <section className="space-y-4 rounded-2xl border border-edge-border bg-edge-slate/10 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-edge-emerald">Steam Room</h2>
          <p className="mt-1 text-xs text-slate-400">Market movement feed for early momentum before hard arbs print.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:grid-cols-3">
          <div className="rounded-xl border border-edge-border bg-edge-navy/70 px-3 py-2">
            <p>Tracked Ladders</p>
            <p className="mt-1 text-sm text-white">{movementRows.length}</p>
          </div>
          <div className="rounded-xl border border-edge-border bg-edge-navy/70 px-3 py-2">
            <p>Avg Movement</p>
            <p className="mt-1 text-sm text-edge-emerald">{averageMovement.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-edge-border bg-edge-navy/70 px-3 py-2">
            <p>Explosive</p>
            <p className="mt-1 text-sm text-amber-400">{highVelocityCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <div className="overflow-hidden rounded-xl border border-edge-border lg:col-span-9">
          <div className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] border-b border-edge-border bg-edge-navy px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Event / Market</span>
            <span>Books</span>
            <span>Price Sweep</span>
            <span>Velocity</span>
            <span className="text-right">Window</span>
          </div>
          <div className="divide-y divide-edge-border bg-slate-950/70">
            {movementRows.length > 0 ? (
              movementRows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr] items-center px-3 py-2 text-xs text-slate-200"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{row.event}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{row.market}</p>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">
                    {row.bookA} / {row.bookB}
                  </p>
                  <p className="font-mono text-[11px]">
                    {row.oddA} <span className="text-slate-500">vs</span> {row.oddB}
                  </p>
                  <p className="text-[11px] font-black text-edge-emerald">{row.velocityLabel}</p>
                  <p className="text-right font-mono text-[11px] text-amber-400">{row.windowLabel}</p>
                </div>
              ))
            ) : (
              <p className="px-3 py-6 text-center text-xs text-slate-500">No movement spikes detected. Listening to live ladders.</p>
            )}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-3">
          {movementRows.slice(0, 4).map((row) => (
            <article key={`${row.id}-tile`} className="rounded-xl border border-edge-border bg-edge-navy/70 p-3">
              <p className="truncate text-[11px] font-semibold text-white">{row.event}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">{row.market}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Movement</p>
                  <p className="font-mono text-sm font-black text-edge-emerald">{row.movementScore.toFixed(2)}</p>
                </div>
                <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-400">
                  {row.windowLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
