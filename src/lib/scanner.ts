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

const DEFAULT_SPORT = 'upcoming';

function americanToImpliedProbability(odds: number): number {
  if (!Number.isFinite(odds) || odds === 0) {
    return 0;
  }
  return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
}

function impliedProbabilityToAmerican(probability: number): number {
  const safeProbability = Math.min(0.99, Math.max(0.01, probability));
  if (safeProbability >= 0.5) {
    return -Math.round((safeProbability / (1 - safeProbability)) * 100);
  }
  return Math.round(((1 - safeProbability) / safeProbability) * 100);
}

function toEdgeBet(event: OddsApiEvent, selection: string, offers: Array<{ bookie: string; odds: number }>): EdgeBet | null {
  if (offers.length < 2) {
    return null;
  }

  const bestOffer = offers.reduce((best, current) => (current.odds > best.odds ? current : best));
  const marketProbabilities = offers.map((offer) => americanToImpliedProbability(offer.odds)).filter((prob) => prob > 0);
  if (marketProbabilities.length === 0) {
    return null;
  }

  const fairProbability = marketProbabilities.reduce((sum, prob) => sum + prob, 0) / marketProbabilities.length;
  const bestImpliedProbability = americanToImpliedProbability(bestOffer.odds);
  if (bestImpliedProbability <= 0) {
    return null;
  }

  const edgePct = ((fairProbability - bestImpliedProbability) / bestImpliedProbability) * 100;
  if (edgePct <= 0) {
    return null;
  }

  return {
    id: `${event.id}-${selection.toLowerCase().replaceAll(/\s+/g, '-')}`,
    event: `${event.away_team} vs ${event.home_team}`,
    market: 'Moneyline',
    selection,
    best_odds: bestOffer.odds,
    bookie: bestOffer.bookie,
    fair_odds: impliedProbabilityToAmerican(fairProbability),
    edge_pct: Number(edgePct.toFixed(1)),
    win_prob: Number((fairProbability * 100).toFixed(1)),
  };
}

export async function getScannerData(): Promise<EdgeBet[]> {
  const apiKey = process.env.THE_ODDS_API_KEY;
  if (!apiKey) {
    console.error('EdgeScanner: Missing THE_ODDS_API_KEY');
    return [];
  }

  const url = new URL(`https://api.the-odds-api.com/v4/sports/${DEFAULT_SPORT}/odds/`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('regions', 'us');
  url.searchParams.set('markets', 'h2h');
  url.searchParams.set('oddsFormat', 'american');

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) {
      console.error(`EdgeScanner: Odds API request failed (${response.status})`);
      return [];
    }

    const events = (await response.json()) as OddsApiEvent[];
    if (!Array.isArray(events)) {
      return [];
    }

    const edgeBets = events
      .flatMap((event) => {
        const offersBySelection = new Map<string, Array<{ bookie: string; odds: number }>>();

        for (const bookmaker of event.bookmakers ?? []) {
          const h2hMarket = (bookmaker.markets ?? []).find((market) => market.key === 'h2h');
          for (const outcome of h2hMarket?.outcomes ?? []) {
            if (!Number.isFinite(outcome.price)) {
              continue;
            }
            const offers = offersBySelection.get(outcome.name) ?? [];
            offers.push({ bookie: bookmaker.title, odds: outcome.price });
            offersBySelection.set(outcome.name, offers);
          }
        }

        return Array.from(offersBySelection.entries())
          .map(([selection, offers]) => toEdgeBet(event, selection, offers))
          .filter((bet): bet is EdgeBet => Boolean(bet));
      })
      .sort((a, b) => b.edge_pct - a.edge_pct)
      .slice(0, 20);

    return edgeBets;
  } catch (error) {
    console.error('EdgeScanner: Failed to fetch live scanner data', error);
    return [];
  }
}
