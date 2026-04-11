type BookmakerMeta = {
  badge: string;
  accentClass: string;
};

const BOOKMAKER_META: Record<string, BookmakerMeta> = {
  fanduel: { badge: 'FD', accentClass: 'border-sky-400/40 bg-sky-500/10 text-sky-100' },
  draftkings: { badge: 'DK', accentClass: 'border-orange-400/40 bg-orange-500/10 text-orange-100' },
  betmgm: { badge: 'MGM', accentClass: 'border-amber-400/40 bg-amber-500/10 text-amber-100' },
  caesars: { badge: 'CZ', accentClass: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-100' },
  pinnaclesports: { badge: 'PN', accentClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' },
  pinnacle: { badge: 'PN', accentClass: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' },
  betrivers: { badge: 'BR', accentClass: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100' },
};

function normalizeBookmakerName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getBookmakerMeta(name: string): BookmakerMeta {
  const normalizedName = normalizeBookmakerName(name);
  const mapped = BOOKMAKER_META[normalizedName];
  if (mapped) {
    return mapped;
  }

  const fallbackBadge = name
    .trim()
    .split(/\s+/)
    .map((token) => token[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return {
    badge: fallbackBadge || 'BK',
    accentClass: 'border-slate-500/30 bg-slate-700/20 text-slate-100',
  };
}
