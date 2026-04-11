'use client';

type FilterValue = 'all' | 'game' | 'prop';

type PropFilterProps = {
  active: FilterValue;
  onChange: (next: FilterValue) => void;
};

const FILTERS: Array<{ key: FilterValue; label: string }> = [
  { key: 'all', label: 'All Markets' },
  { key: 'game', label: 'Game Lines' },
  { key: 'prop', label: 'Player Props' },
];

export default function PropFilter({ active, onChange }: PropFilterProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-zinc-900/80 p-2">
      {FILTERS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              'rounded-xl border px-3 py-2 text-[11px] font-black uppercase tracking-wide text-white transition',
              isActive
                ? 'border-slate-400 bg-slate-800/90'
                : 'border-slate-600 bg-slate-800/40 hover:border-slate-400',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
