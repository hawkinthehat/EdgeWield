export const DEFAULT_BANKROLL_CREDITS = 100_000;
export const HEARTBEAT_STALE_MS = 90_000;

export type TradeSide = "long" | "short";

export interface KellyOpportunity {
  id: string;
  symbol: string;
  market: string;
  side: TradeSide;
  probability: number;
  decimalOdds: number;
  minStake?: number;
  maxStake?: number;
}

export interface KellyConfig {
  bankroll: number;
  fractionalKelly: number;
  maxFractionPerTrade: number;
  maxPortfolioUtilization: number;
  minEdge: number;
}

export interface KellyScore {
  id: string;
  symbol: string;
  market: string;
  side: TradeSide;
  probability: number;
  decimalOdds: number;
  edge: number;
  fullKellyFraction: number;
  appliedKellyFraction: number;
  recommendedStake: number;
  expectedValue: number;
  accepted: boolean;
  rejectionReason?: string;
}

export interface KellyPortfolio {
  bankroll: number;
  totalRecommendedStake: number;
  utilization: number;
  accepted: KellyScore[];
  rejected: KellyScore[];
}

export const DEFAULT_KELLY_CONFIG: KellyConfig = {
  bankroll: DEFAULT_BANKROLL_CREDITS,
  fractionalKelly: 0.5,
  maxFractionPerTrade: 0.05,
  maxPortfolioUtilization: 0.35,
  minEdge: 0
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const roundTo = (value: number, decimals = 2) => {
  const power = 10 ** decimals;
  return Math.round(value * power) / power;
};

export const isHeartbeatStale = (
  heartbeatAt: Date | string | number,
  now: Date = new Date(),
  staleMs: number = HEARTBEAT_STALE_MS
) => {
  const ts = new Date(heartbeatAt).getTime();
  if (Number.isNaN(ts)) {
    return true;
  }
  return now.getTime() - ts > staleMs;
};

export const computeEdge = (probability: number, decimalOdds: number) => {
  return probability * decimalOdds - 1;
};

export const computeKellyFraction = (
  probability: number,
  decimalOdds: number
) => {
  if (probability <= 0 || probability >= 1 || decimalOdds <= 1) {
    return 0;
  }
  const q = 1 - probability;
  const b = decimalOdds - 1;
  const fraction = (probability * b - q) / b;
  return Number.isFinite(fraction) && fraction > 0 ? fraction : 0;
};

export const scoreOpportunity = (
  opportunity: KellyOpportunity,
  config: Partial<KellyConfig> = {}
): KellyScore => {
  const merged = { ...DEFAULT_KELLY_CONFIG, ...config };
  const edge = computeEdge(opportunity.probability, opportunity.decimalOdds);
  const fullKellyFraction = computeKellyFraction(
    opportunity.probability,
    opportunity.decimalOdds
  );
  const appliedKellyFraction = clamp(
    fullKellyFraction * merged.fractionalKelly,
    0,
    merged.maxFractionPerTrade
  );
  const unclampedStake = merged.bankroll * appliedKellyFraction;
  const boundedByMin =
    opportunity.minStake !== undefined
      ? Math.max(unclampedStake, opportunity.minStake)
      : unclampedStake;
  const boundedStake =
    opportunity.maxStake !== undefined
      ? Math.min(boundedByMin, opportunity.maxStake)
      : boundedByMin;

  let accepted = true;
  let rejectionReason: string | undefined;

  if (edge <= merged.minEdge) {
    accepted = false;
    rejectionReason = "edge_below_threshold";
  } else if (appliedKellyFraction <= 0 || boundedStake <= 0) {
    accepted = false;
    rejectionReason = "kelly_non_positive";
  }

  return {
    id: opportunity.id,
    symbol: opportunity.symbol,
    market: opportunity.market,
    side: opportunity.side,
    probability: roundTo(opportunity.probability, 4),
    decimalOdds: roundTo(opportunity.decimalOdds, 4),
    edge: roundTo(edge, 6),
    fullKellyFraction: roundTo(fullKellyFraction, 6),
    appliedKellyFraction: roundTo(appliedKellyFraction, 6),
    recommendedStake: roundTo(accepted ? boundedStake : 0, 2),
    expectedValue: roundTo((accepted ? boundedStake : 0) * edge, 2),
    accepted,
    rejectionReason
  };
};

export const scorePortfolio = (
  opportunities: KellyOpportunity[],
  config: Partial<KellyConfig> = {}
): KellyPortfolio => {
  const merged = { ...DEFAULT_KELLY_CONFIG, ...config };
  const scored = opportunities
    .map((opportunity) => scoreOpportunity(opportunity, merged))
    .sort((a, b) => b.edge - a.edge);

  const accepted: KellyScore[] = [];
  const rejected: KellyScore[] = [];
  let runningStake = 0;
  const stakeCap = merged.bankroll * merged.maxPortfolioUtilization;

  for (const item of scored) {
    if (!item.accepted) {
      rejected.push(item);
      continue;
    }

    const remaining = stakeCap - runningStake;
    if (remaining <= 0) {
      rejected.push({
        ...item,
        accepted: false,
        recommendedStake: 0,
        expectedValue: 0,
        rejectionReason: "portfolio_cap_reached"
      });
      continue;
    }

    const adjustedStake = Math.min(item.recommendedStake, remaining);
    runningStake += adjustedStake;
    accepted.push({
      ...item,
      recommendedStake: roundTo(adjustedStake, 2),
      expectedValue: roundTo(adjustedStake * item.edge, 2)
    });
  }

  return {
    bankroll: merged.bankroll,
    totalRecommendedStake: roundTo(runningStake, 2),
    utilization: roundTo(runningStake / merged.bankroll, 6),
    accepted,
    rejected
  };
};
