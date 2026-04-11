export function toAmericanOddsNumber(odds: number): number | null {
  if (!Number.isFinite(odds) || odds === 0) {
    return null;
  }

  if (Math.abs(odds) >= 100) {
    return Math.round(odds);
  }

  if (odds <= 1) {
    return null;
  }

  const american = odds >= 2 ? (odds - 1) * 100 : -100 / (odds - 1);
  if (!Number.isFinite(american) || american === 0) {
    return null;
  }

  return Math.round(american);
}

export function formatAmericanOdds(odds: number): string {
  const normalized = toAmericanOddsNumber(odds);
  if (normalized === null) {
    return '--';
  }
  return normalized > 0 ? `+${normalized}` : `${normalized}`;
}
