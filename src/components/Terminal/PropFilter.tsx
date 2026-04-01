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
    <div className="flex items-center gap-2">
      {FILTERS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              'rounded-xl border px-3 py-2 text-[11px] font-black uppercase tracking-wide transition',
              isActive
                ? 'border-edge-emerald bg-edge-emerald/20 text-edge-emerald'
                : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500',
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
