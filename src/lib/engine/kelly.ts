export type WieldCalculation = {
  profitPct: string;
  totalStake: string;
  allocation: { a: string; b: string };
};

export type KellyCalculation = {
  percentage: number;
  isAdvantage: boolean;
};

export function calculateKelly(
  decimalOdds: number,
  winProb: number,
  fraction: number = 0.25,
): KellyCalculation {
  if (
    !Number.isFinite(decimalOdds) ||
    !Number.isFinite(winProb) ||
    !Number.isFinite(fraction) ||
    decimalOdds <= 1 ||
    winProb < 0 ||
    winProb > 100 ||
    fraction < 0
  ) {
    return { percentage: 0, isAdvantage: false };
  }

  const b = decimalOdds - 1;
  const p = winProb / 100;
  const q = 1 - p;

  // Basic Kelly formula.
  const rawKelly = (b * p - q) / b;
  const safeKelly = rawKelly * fraction;

  return {
    percentage: Math.max(0, Number((safeKelly * 100).toFixed(2))),
    isAdvantage: rawKelly > 0,
  };
}

export const calculateWield = (
  oddsA: number,
  oddsB: number,
  bankroll: number,
): WieldCalculation | null => {
  const invA = 1 / oddsA;
  const invB = 1 / oddsB;
  const totalInv = invA + invB;

  if (!Number.isFinite(totalInv) || totalInv <= 0 || totalInv >= 1) {
    return null;
  }

  const profitPct = 1 / totalInv - 1;
  const stakeA = (bankroll * invA) / totalInv;
  const stakeB = (bankroll * invB) / totalInv;

  return {
    profitPct: (profitPct * 100).toFixed(2),
    totalStake: (stakeA + stakeB).toFixed(2),
    allocation: { a: stakeA.toFixed(2), b: stakeB.toFixed(2) },
  };
};
