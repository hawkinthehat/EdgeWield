export interface EdgeBet {
  id: string;
  event: string;
  market: string; // e.g., "Moneyline"
  selection: string; // e.g., "Lakers"
  best_odds: number; // e.g., +110
  bookie: string; // e.g., "DraftKings"
  fair_odds: number; // e.g., -105 (The "True" price)
  edge_pct: number; // e.g., 4.2%
  win_prob: number; // e.g., 52.5%
}

type OddsApiOutcome = {
  name: string;
  price: number;
  point?: number;
};

type OddsApiMarket = {
  key: string;
  outcomes?: OddsApiOutcome[];
};

type OddsApiBookmaker = {
  title: string;
  markets?: OddsApiMarket[];
};

type OddsApiEvent = {
  id: string;
  home_team: string;
  away_team: string;
  bookmakers?: OddsApiBookmaker[];
};

function americanToImpliedProbability(odds: number): number {
  if (odds > 0) {
    return 100 / (odds + 100);
  }
  return Math.abs(odds) / (Math.abs(odds) + 100);
}

function formatSpreadPoint(point: number | undefined): string {
  if (!Number.isFinite(point)) {
    return '0';
  }
  const value = Number(point);
  return value > 0 ? `+${value}` : `${value}`;
}

function buildEdgeBets(events: OddsApiEvent[]): EdgeBet[] {
  const edges: EdgeBet[] = [];

  for (const event of events) {
    if (!event.id || !event.home_team || !event.away_team || !Array.isArray(event.bookmakers)) {
      continue;
    }

    type Aggregate = {
      id: string;
      event: string;
      market: string;
      selection: string;
      bestOdds: number;
      bestBookie: string;
      allOdds: number[];
    };

    const marketSelectionMap = new Map<string, Aggregate>();

    for (const bookmaker of event.bookmakers) {
      if (!bookmaker?.title || !Array.isArray(bookmaker.markets)) {
        continue;
      }

      for (const market of bookmaker.markets) {
        if ((market.key !== 'h2h' && market.key !== 'spreads') || !Array.isArray(market.outcomes)) {
          continue;
        }

        for (const outcome of market.outcomes) {
          if (!outcome?.name || !Number.isFinite(outcome.price)) {
            continue;
          }

          const selection =
            market.key === 'spreads'
              ? `${outcome.name} ${formatSpreadPoint(outcome.point)}`
              : outcome.name;
          const marketLabel =
            market.key === 'h2h' ? 'Moneyline' : `Spread (${formatSpreadPoint(outcome.point)})`;
          const aggregateKey = `${event.id}:${market.key}:${selection}`;
          const existing = marketSelectionMap.get(aggregateKey);

          if (!existing) {
            marketSelectionMap.set(aggregateKey, {
              id: aggregateKey,
              event: `${event.away_team} vs ${event.home_team}`,
              market: marketLabel,
              selection,
              bestOdds: outcome.price,
              bestBookie: bookmaker.title,
              allOdds: [outcome.price],
            });
            continue;
          }

          existing.allOdds.push(outcome.price);
          if (outcome.price > existing.bestOdds) {
            existing.bestOdds = outcome.price;
            existing.bestBookie = bookmaker.title;
          }
        }
      }
    }

    for (const aggregate of marketSelectionMap.values()) {
      if (aggregate.allOdds.length === 0) {
        continue;
      }

      const fairOdds = Math.round(
        aggregate.allOdds.reduce((runningTotal, odds) => runningTotal + odds, 0) / aggregate.allOdds.length,
      );

      if (!Number.isFinite(fairOdds) || fairOdds === 0 || aggregate.bestOdds === 0) {
        continue;
      }

      const bestImpliedProb = americanToImpliedProbability(aggregate.bestOdds);
      const fairImpliedProb = americanToImpliedProbability(fairOdds);
      const edgePct = ((fairImpliedProb - bestImpliedProb) / bestImpliedProb) * 100;

      if (!Number.isFinite(edgePct) || edgePct <= 0) {
        continue;
      }

      edges.push({
        id: aggregate.id,
        event: aggregate.event,
        market: aggregate.market,
        selection: aggregate.selection,
        best_odds: Math.round(aggregate.bestOdds),
        bookie: aggregate.bestBookie,
        fair_odds: fairOdds,
        edge_pct: Number(edgePct.toFixed(2)),
        win_prob: Number((fairImpliedProb * 100).toFixed(2)),
      });
    }
  }

  return edges.sort((a, b) => b.edge_pct - a.edge_pct).slice(0, 40);
}

export async function getScannerData(): Promise<EdgeBet[]> {
  const apiKey = process.env.THE_ODDS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing THE_ODDS_API_KEY');
  }

  const endpoint = new URL('https://api.the-odds-api.com/v4/sports/basketball_nba/odds');
  endpoint.searchParams.set('apiKey', apiKey);
  endpoint.searchParams.set('regions', 'us');
  endpoint.searchParams.set('markets', 'h2h,spreads');
  endpoint.searchParams.set('oddsFormat', 'american');

  const response = await fetch(endpoint.toString(), {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`The Odds API request failed (${response.status})`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  return buildEdgeBets(payload as OddsApiEvent[]);
}
