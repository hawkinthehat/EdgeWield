export interface MarketGap {
  event: string;
  profit: number;
  bookieA: string;
  oddsA: number;
  bookieB: string;
  oddsB: number;
}

export function calculateKelly(
  decimalOdds: number,
  winProb: number,
  fraction: number = 0.25
) {
  const b = decimalOdds - 1;
  const p = winProb / 100;
  const q = 1 - p;
  const rawKelly = (b * p - q) / b;
  const safeKelly = rawKelly * fraction;
  return {
    percentage: Math.max(0, Number((safeKelly * 100).toFixed(2))),
    isAdvantage: rawKelly > 0,
  };
}

export function calculateHedge(odds1: number, odds2: number): number {
  // Convert American Odds to Decimal if necessary, but most APIs give Decimal
  // Formula: 1/OddsA + 1/OddsB = Implied Probability
  const prob1 = 1 / odds1;
  const prob2 = 1 / odds2;
  const totalProb = prob1 + prob2;

  // If totalProb < 1, there is a "Lock" (Arbitrage/Hedge Opportunity)
  if (totalProb < 1) {
    return Number(((1 - totalProb) * 100).toFixed(2));
  }
  return 0; // No edge found
}
