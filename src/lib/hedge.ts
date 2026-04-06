export type HedgeInputs = {
  wager: number;
  originalOdds: number;
  liveOpponentOdds: number;
};

export type HedgeMetrics = {
  potentialPayout: number;
  hedgeWager: number;
  guaranteedProfit: number;
};

export function toDecimalOdds(americanOdds: number): number {
  if (!Number.isFinite(americanOdds) || americanOdds === 0) {
    return Number.NaN;
  }

  return americanOdds > 0
    ? americanOdds / 100 + 1
    : 100 / Math.abs(americanOdds) + 1;
}

export function calculateHedgeMetrics({
  wager,
  originalOdds,
  liveOpponentOdds,
}: HedgeInputs): HedgeMetrics {
  const decimalOriginal = toDecimalOdds(originalOdds);
  const decimalLive = toDecimalOdds(liveOpponentOdds);

  if (
    !Number.isFinite(wager) ||
    wager <= 0 ||
    !Number.isFinite(decimalOriginal) ||
    !Number.isFinite(decimalLive)
  ) {
    return {
      potentialPayout: 0,
      hedgeWager: 0,
      guaranteedProfit: 0,
    };
  }

  const potentialPayout = wager * decimalOriginal;
  const hedgeWager = potentialPayout / decimalLive;
  const guaranteedProfit = potentialPayout - wager - hedgeWager;

  return {
    potentialPayout,
    hedgeWager,
    guaranteedProfit,
  };
}
