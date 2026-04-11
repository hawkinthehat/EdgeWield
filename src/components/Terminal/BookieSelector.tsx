'use client';

import { useState } from 'react';

const BOOKIES = ['FanDuel', 'DraftKings', 'BetMGM', 'Caesars', 'Pinnacle'] as const;

export default function BookieSelector() {
  const [selected, setSelected] = useState<string[]>(['FanDuel']);

  const toggleBookie = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((bookie) => bookie !== name) : [...prev, name]));
  };

  return (
    <section className="rounded-3xl border border-slate-700 bg-zinc-900/80 p-6">
      <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-400">Active Bookies</h3>
      <div className="flex flex-wrap gap-2">
        {BOOKIES.map((bookie) => (
          <button
            key={bookie}
            type="button"
            onClick={() => toggleBookie(bookie)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selected.includes(bookie)
                ? 'border border-emerald-400/60 bg-emerald-400/20 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.28)]'
                : 'border border-slate-600 bg-slate-800/40 text-slate-400'
            }`}
          >
            {bookie}
          </button>
        ))}
      </div>
    </section>
  );
}
