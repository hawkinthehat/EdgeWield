'use client';

import { useState } from 'react';

const BOOKIES = ['FanDuel', 'DraftKings', 'BetMGM', 'Caesars', 'Pinnacle'] as const;

export default function BookieSelector() {
  const [selected, setSelected] = useState<string[]>(['FanDuel']);

  const toggleBookie = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((bookie) => bookie !== name) : [...prev, name]));
  };

  return (
    <section className="rounded-3xl border border-edge-border bg-edge-slate/20 p-6">
      <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-slate-500">Active Bookies</h3>
      <div className="flex flex-wrap gap-2">
        {BOOKIES.map((bookie) => (
          <button
            key={bookie}
            type="button"
            onClick={() => toggleBookie(bookie)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selected.includes(bookie)
                ? 'bg-edge-emerald text-edge-navy shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'border border-edge-border bg-edge-navy text-slate-500'
            }`}
          >
            {bookie}
          </button>
        ))}
      </div>
    </section>
  );
}
