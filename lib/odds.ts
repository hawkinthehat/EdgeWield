export type LiveOddsGame = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  best_home_odds: number | null;
};

type OddsApiOutcome = {
  name: string;
  price: number;
};

type OddsApiMarket = {
  key: string;
  outcomes?: OddsApiOutcome[];
};

type OddsApiBookmaker = {
  markets?: OddsApiMarket[];
};

type OddsApiGame = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: OddsApiBookmaker[];
};

export async function getLiveOdds(sport: string = 'americanfootball_nfl'): Promise<LiveOddsGame[]> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    console.error('Odds Fetch Error: Missing ODDS_API_KEY environment variable.');
    return [];
  }

  const url = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('regions', 'us');
  url.searchParams.set('markets', 'h2h');
  url.searchParams.set('oddsFormat', 'american');

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 300 } }); // Cache for 5 mins
    if (!response.ok) {
      console.error(`Odds Fetch Error: HTTP ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as OddsApiGame[];
    if (!Array.isArray(data)) {
      console.error('Odds Fetch Error: Unexpected API response shape.');
      return [];
    }

    return data.map((game) => {
      const homeOddsAcrossBooks = (game.bookmakers ?? [])
        .map((bookmaker) => {
          const h2hMarket = (bookmaker.markets ?? []).find((market) => market.key === 'h2h') ?? bookmaker.markets?.[0];
          const homeOutcome = (h2hMarket?.outcomes ?? []).find((outcome) => outcome.name === game.home_team);
          return homeOutcome?.price;
        })
        .filter((price): price is number => typeof price === 'number');

      const bestHomeOdds = homeOddsAcrossBooks.length > 0 ? Math.max(...homeOddsAcrossBooks) : null;

      return {
        id: game.id,
        home_team: game.home_team,
        away_team: game.away_team,
        commence_time: game.commence_time,
        best_home_odds: bestHomeOdds,
      };
    });
  } catch (error) {
    console.error('Odds Fetch Error:', error);
    return [];
  }
}
