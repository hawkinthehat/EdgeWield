export interface MarketGap {
  event: string;
  teamA: string;
  teamB: string;
  sportKey: string;
  marketType: string;
  profit: number;
  bookieA: string;
  oddsA: number;
  bookieB: string;
  oddsB: number;
  stakeA: number;
  stakeB: number;
  guaranteedProfit: number;
  payout: number;
}

export function calculateArb(
  odds1: number,
  odds2: number,
  totalStake = 100
): { profitPct: number; stakeA: number; stakeB: number; payout: number; guaranteedProfit: number } | null {
  const prob1 = 1 / odds1;
  const prob2 = 1 / odds2;
  const totalProb = prob1 + prob2;

  if (totalProb >= 1) return null;

  const payout = totalStake / totalProb;
  const guaranteedProfit = payout - totalStake;
  const profitPct = (guaranteedProfit / totalStake) * 100;
  const stakeA = totalStake * (prob1 / totalProb);
  const stakeB = totalStake * (prob2 / totalProb);

  return {
    profitPct: Number(profitPct.toFixed(2)),
    stakeA: Number(stakeA.toFixed(2)),
    stakeB: Number(stakeB.toFixed(2)),
    payout: Number(payout.toFixed(2)),
    guaranteedProfit: Number(guaranteedProfit.toFixed(2)),
  };
}
