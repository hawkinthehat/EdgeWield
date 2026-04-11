import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

type OddsApiOutcome = {
  name: string;
  price: number;
};

type OddsApiMarket = {
  outcomes?: OddsApiOutcome[];
};

type OddsApiBookmaker = {
  markets?: OddsApiMarket[];
};

type OddsApiGame = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time?: string | null;
  bookmakers?: OddsApiBookmaker[];
};

export type MarketCacheRow = {
  id: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  commence_time: string | null;
  best_home_odds: number | null;
  best_away_odds: number | null;
  last_updated: string;
};

function getBestOdds(bookmakers: OddsApiBookmaker[] | undefined, teamName: string): number | null {
  if (!bookmakers?.length) {
    return null;
  }

  const prices = bookmakers
    .map((bookmaker) => {
      const outcomes = bookmaker.markets?.[0]?.outcomes ?? [];
      return outcomes.find((outcome) => outcome.name === teamName)?.price;
    })
    .filter((price): price is number => typeof price === 'number' && Number.isFinite(price));

  if (!prices.length) {
    return null;
  }

  return Math.max(...prices);
}

export async function getConsolidatedOdds(sport: string): Promise<MarketCacheRow[]> {
  const supabase = getSupabaseAdmin();
  const freshnessCutoff = new Date(Date.now() - 10 * 60_000).toISOString();
  const oddsApiKey = process.env.ODDS_API_KEY;

  const { data: cachedOdds, error: cacheError } = await supabase
    .from('market_cache')
    .select('*')
    .eq('sport_key', sport)
    .gt('last_updated', freshnessCutoff);

  if (cacheError) {
    throw new Error(`Failed to read market cache: ${cacheError.message}`);
  }

  if (cachedOdds && cachedOdds.length > 0) {
    console.log('EdgeWield Terminal: Serving from cache');
    return cachedOdds as MarketCacheRow[];
  }

  if (!oddsApiKey) {
    throw new Error('Missing ODDS_API_KEY environment variable');
  }

  console.log('EdgeWield Terminal: Refreshing live market data');
  const endpoint = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`);
  endpoint.searchParams.set('apiKey', oddsApiKey);
  endpoint.searchParams.set('regions', 'us');
  endpoint.searchParams.set('markets', 'h2h');

  const response = await fetch(endpoint.toString(), { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Odds API request failed with ${response.status}`);
  }

  const liveData = (await response.json()) as OddsApiGame[];
  const now = new Date().toISOString();

  const formattedOdds: MarketCacheRow[] = liveData.map((game) => ({
    id: game.id,
    sport_key: sport,
    home_team: game.home_team,
    away_team: game.away_team,
    commence_time: game.commence_time ?? null,
    best_home_odds: getBestOdds(game.bookmakers, game.home_team),
    best_away_odds: getBestOdds(game.bookmakers, game.away_team),
    last_updated: now,
  }));

  if (formattedOdds.length > 0) {
    const { error: upsertError } = await supabase
      .from('market_cache')
      .upsert(formattedOdds, { onConflict: 'id' });

    if (upsertError) {
      throw new Error(`Failed to upsert market cache: ${upsertError.message}`);
    }
  }

  return formattedOdds;
}
