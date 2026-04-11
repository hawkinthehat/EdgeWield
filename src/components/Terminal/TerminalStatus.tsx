'use client';

export default function TerminalStatus({ pulseCount }: { pulseCount: number }) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-700 bg-zinc-900/80 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Global Sync
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xl font-black italic text-white">LIVE</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-zinc-900/80 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Lines Scanned
        </p>
        <span className="text-xl font-black italic text-white">
          {(42_801 + pulseCount).toLocaleString()}+
        </span>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-zinc-900/80 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Market Latency
        </p>
        <span className="text-xl font-black italic text-emerald-400">1.2s</span>
      </div>
    </div>
  );
}
