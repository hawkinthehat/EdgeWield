export interface MarketGap {
  event: string;
  profit: number;
  bookieA: string;
  oddsA: number;
  bookieB: string;
  oddsB: number;
}

export type TerminalData = {
  edges: unknown[];
  bankroll: {
    total: number;
    monthlyROI: number;
  };
  news: Array<{
    id: number;
    player: string;
    status: string;
  }>;
};

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

export async function getTerminalData(): Promise<TerminalData> {
  const apiKey = process.env.THE_ODDS_API_KEY ?? process.env.ODDS_API_KEY;
  const fallback: TerminalData = {
    edges: [],
    bankroll: { total: 12450.0, monthlyROI: 14.2 },
    news: [{ id: 1, player: 'Lamar Jackson', status: 'OUT' }],
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const endpoint = new URL('https://api.the-odds-api.com/v4/sports/upcoming/odds/');
    endpoint.searchParams.set('regions', 'us');
    endpoint.searchParams.set('apiKey', apiKey);
    const res = await fetch(endpoint.toString(), { cache: 'no-store' });

    if (!res.ok) {
      return fallback;
    }

    const data = (await res.json()) as unknown;

    return {
      edges: Array.isArray(data) ? data.slice(0, 10) : [],
      bankroll: { total: 12450.0, monthlyROI: 14.2 },
      news: [{ id: 1, player: 'Lamar Jackson', status: 'OUT' }],
    };
  } catch {
    return fallback;
  }
}
