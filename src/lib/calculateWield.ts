export type WieldCalculation = {
  profitPct: string;
  totalStake: string;
  allocation: { a: string; b: string };
};

export const calculateWield = (
  oddsA: number,
  oddsB: number,
  bankroll: number,
): WieldCalculation | null => {
  // 1) Calculate arbitrage percentage from reciprocal odds.
  const invA = 1 / oddsA;
  const invB = 1 / oddsB;
  const totalInv = invA + invB;

  if (!Number.isFinite(totalInv) || totalInv <= 0 || totalInv >= 1) {
    return null;
  }

  // 2) Guaranteed profit %, then 3) hedge allocation by normalized inverse odds.
  const profitPct = 1 / totalInv - 1;
  const stakeA = (bankroll * invA) / totalInv;
  const stakeB = (bankroll * invB) / totalInv;

  return {
    profitPct: (profitPct * 100).toFixed(2),
    totalStake: (stakeA + stakeB).toFixed(2),
    allocation: { a: stakeA.toFixed(2), b: stakeB.toFixed(2) },
  };
};
