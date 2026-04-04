export interface MarketGap {
  event: string;
  profit: number;
  bookieA: string;
  oddsA: number;
  bookieB: string;
  oddsB: number;
}

export function calculateHedge(odds1: number, odds2: number): number {
  if (!Number.isFinite(odds1) || !Number.isFinite(odds2) || odds1 <= 0 || odds2 <= 0) {
    return 0;
  }

  const prob1 = 1 / odds1;
  const prob2 = 1 / odds2;
  const totalProb = prob1 + prob2;

  if (totalProb < 1) {
    return Number(((1 - totalProb) * 100).toFixed(2));
  }

  return 0;
}
