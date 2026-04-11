'use client';

const BOOKIES = [
  { name: 'FanDuel', badge: 'FD', accent: 'from-sky-500/25 to-sky-400/5' },
  { name: 'DraftKings', badge: 'DK', accent: 'from-orange-500/25 to-orange-400/5' },
  { name: 'BetMGM', badge: 'MGM', accent: 'from-amber-500/25 to-amber-400/5' },
  { name: 'Caesars', badge: 'CZ', accent: 'from-indigo-500/25 to-indigo-400/5' },
  { name: 'Pinnacle', badge: 'PN', accent: 'from-emerald-500/25 to-emerald-400/5' },
] as const;

type BookieSelectorProps = {
  selected: string[];
  onChange: (next: string[]) => void;
};

export default function BookieSelector({ selected, onChange }: BookieSelectorProps) {
  const toggleBookie = (name: string) => {
    const nextSelection = selected.includes(name)
      ? selected.filter((bookie) => bookie !== name)
      : [...selected, name];
    if (nextSelection.length > 0) {
      onChange(nextSelection);
    }
  };

  return (
    <section className="rounded-3xl border border-edge-border bg-edge-slate/20 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Active Bookies</h3>
        <span className="rounded-full border border-edge-emerald/40 bg-edge-emerald/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-edge-emerald">
          {selected.length} enabled
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKIES.map((bookie) => {
          const isActive = selected.includes(bookie.name);
          return (
            <button
              key={bookie.name}
              type="button"
              onClick={() => toggleBookie(bookie.name)}
              className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-xs transition-all ${
                isActive
                  ? `border-edge-emerald/60 bg-gradient-to-br ${bookie.accent} text-white shadow-[0_0_18px_rgba(16,185,129,0.2)]`
                  : 'border-edge-border bg-edge-navy text-slate-400 hover:border-slate-600'
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-black tracking-wide ${
                  isActive
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-300 group-hover:border-slate-500'
                }`}
              >
                {bookie.badge}
              </span>
              <span className="font-bold">{bookie.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
