const DEFAULT_SPORT = 'americanfootball_nfl';
const DEFAULT_REGION = 'us';
const DEFAULT_MARKET = 'h2h';

type OddsOutcome = {
  name: string;
  price: number;
};

type OddsMarket = {
  key: string;
  outcomes: OddsOutcome[];
};

type OddsBookmaker = {
  title: string;
  markets: OddsMarket[];
};

export type OddsApiEvent = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time?: string;
  bookmakers: OddsBookmaker[];
};

type BestPrice = {
  bookie: string;
  price: number;
};

export type ArbOpportunity = {
  id: string;
  market_type: string;
  event_name: string;
  home_team: string;
  away_team: string;
  bookie_a: string;
  odds_a: number;
  bookie_b: string;
  odds_b: number;
  profit_percent: number;
  commence_time: string;
  is_prop: boolean;
};

export function getOddsApiDefaults() {
  return {
    sport: DEFAULT_SPORT,
    region: DEFAULT_REGION,
    market: DEFAULT_MARKET,
  };
}

export async function fetchOddsApiEvents({
  apiKey,
  sport = DEFAULT_SPORT,
  region = DEFAULT_REGION,
  market = DEFAULT_MARKET,
}: {
  apiKey: string;
  sport?: string;
  region?: string;
  market?: string;
}): Promise<OddsApiEvent[]> {
  const endpoint = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`);
  endpoint.searchParams.set('apiKey', apiKey);
  endpoint.searchParams.set('regions', region);
  endpoint.searchParams.set('markets', market);
  endpoint.searchParams.set('oddsFormat', 'decimal');

  const response = await fetch(endpoint.toString(), {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Odds API request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    throw new Error('Odds API payload was not an array');
  }

  return payload as OddsApiEvent[];
}

function resolveOutcomePrice(market: OddsMarket, teamName: string): number | null {
  const outcome = market.outcomes.find((candidate) => candidate.name === teamName);
  return outcome && Number.isFinite(outcome.price) ? outcome.price : null;
}

function resolveH2hMarket(bookmaker: OddsBookmaker): OddsMarket | null {
  const market = bookmaker.markets.find((candidate) => candidate.key === 'h2h');
  if (!market || !Array.isArray(market.outcomes)) {
    return null;
  }
  return market;
}

function updateBestPrice(current: BestPrice | null, next: BestPrice): BestPrice {
  if (!current || next.price > current.price) {
    return next;
  }
  return current;
}

export function scanForArbOpportunities(events: OddsApiEvent[]): ArbOpportunity[] {
  const opportunities: ArbOpportunity[] = [];

  events.forEach((event) => {
    if (!event.home_team || !event.away_team || !Array.isArray(event.bookmakers)) {
      return;
    }

    let bestHome: BestPrice | null = null;
    let bestAway: BestPrice | null = null;

    event.bookmakers.forEach((bookmaker) => {
      const market = resolveH2hMarket(bookmaker);
      if (!market) {
        return;
      }

      const homePrice = resolveOutcomePrice(market, event.home_team);
      const awayPrice = resolveOutcomePrice(market, event.away_team);

      if (Number.isFinite(homePrice) && homePrice) {
        bestHome = updateBestPrice(bestHome, { bookie: bookmaker.title, price: homePrice });
      }

      if (Number.isFinite(awayPrice) && awayPrice) {
        bestAway = updateBestPrice(bestAway, { bookie: bookmaker.title, price: awayPrice });
      }
    });

    if (!bestHome || !bestAway) {
      return;
    }

    const totalProbability = 1 / bestHome.price + 1 / bestAway.price;
    if (totalProbability >= 1) {
      return;
    }

    opportunities.push({
      id: event.id,
      market_type: 'h2h',
      event_name: `${event.home_team} vs ${event.away_team}`,
      home_team: event.home_team,
      away_team: event.away_team,
      bookie_a: bestHome.bookie,
      odds_a: bestHome.price,
      bookie_b: bestAway.bookie,
      odds_b: bestAway.price,
      profit_percent: Number(((1 - totalProbability) * 100).toFixed(2)),
      commence_time: event.commence_time ?? new Date().toISOString(),
      is_prop: false,
    });
  });

  return opportunities.sort((a, b) => b.profit_percent - a.profit_percent);
}
