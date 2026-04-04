export type ClvSample = {
  entryOdds: number;
  closingOdds: number;
};

export function americanOddsToImpliedProbability(americanOdds: number): number | null {
  if (!Number.isFinite(americanOdds) || americanOdds === 0) {
    return null;
  }

  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  }

  const absoluteOdds = Math.abs(americanOdds);
  return absoluteOdds / (absoluteOdds + 100);
}

export function calculateCLV(entryOdds: number, closingOdds: number): number | null {
  const entryProbability = americanOddsToImpliedProbability(entryOdds);
  const closingProbability = americanOddsToImpliedProbability(closingOdds);

  if (entryProbability === null || closingProbability === null) {
    return null;
  }

  return (closingProbability - entryProbability) * 100;
}

export function calculateAverageCLV(samples: ClvSample[]): number | null {
  const clvValues = samples
    .map((sample) => calculateCLV(sample.entryOdds, sample.closingOdds))
    .filter((value): value is number => value !== null);

  if (clvValues.length === 0) {
    return null;
  }

  const total = clvValues.reduce((sum, value) => sum + value, 0);
  return total / clvValues.length;
}

export function formatSignedPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}
