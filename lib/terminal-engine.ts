import { createClient } from '@supabase/supabase-js'

type MarketOutcome = {
  name: string
  price?: number
}

type Market = {
  outcomes?: MarketOutcome[]
}

type Bookmaker = {
  markets?: Market[]
}

type OddsApiGame = {
  id: string
  home_team: string
  away_team: string
  commence_time?: string | null
  bookmakers?: Bookmaker[]
}

export type MarketCacheRow = {
  id: string
  sport_key: string
  home_team: string
  away_team: string
  commence_time: string | null
  best_home_odds: number | null
  best_away_odds: number | null
  last_updated: string
}

function bestOddsForTeam(game: OddsApiGame, teamName: string): number | null {
  const prices = (game.bookmakers ?? [])
    .flatMap((bookmaker) => bookmaker.markets ?? [])
    .flatMap((market) => market.outcomes ?? [])
    .filter((outcome) => outcome.name === teamName && typeof outcome.price === 'number')
    .map((outcome) => outcome.price as number)

  if (prices.length === 0) return null
  return Math.max(...prices)
}

export async function getConsolidatedOdds(sport: string): Promise<MarketCacheRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  const tenMinutesAgo = new Date(Date.now() - 10 * 60_000).toISOString()

  const { data: cachedOdds, error: cacheError } = await supabase
    .from('market_cache')
    .select('*')
    .eq('sport_key', sport)
    .gt('last_updated', tenMinutesAgo)

  if (cacheError) {
    throw new Error(`Failed to query market cache: ${cacheError.message}`)
  }

  if (cachedOdds && cachedOdds.length > 0) {
    console.log('EdgeWield Terminal: Serving from cache')
    return cachedOdds as MarketCacheRow[]
  }

  const oddsApiKey = process.env.ODDS_API_KEY
  if (!oddsApiKey) {
    throw new Error('ODDS_API_KEY is required')
  }

  console.log('EdgeWield Terminal: Refreshing live market data')
  const endpoint = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`)
  endpoint.searchParams.set('apiKey', oddsApiKey)
  endpoint.searchParams.set('regions', 'us')
  endpoint.searchParams.set('markets', 'h2h')

  const response = await fetch(endpoint.toString())

  if (!response.ok) {
    throw new Error(`Odds API request failed with status ${response.status}`)
  }

  const liveData = (await response.json()) as OddsApiGame[]

  const formattedOdds: MarketCacheRow[] = liveData.map((game) => ({
    id: game.id,
    sport_key: sport,
    home_team: game.home_team,
    away_team: game.away_team,
    commence_time: game.commence_time ?? null,
    best_home_odds: bestOddsForTeam(game, game.home_team),
    best_away_odds: bestOddsForTeam(game, game.away_team),
    last_updated: new Date().toISOString(),
  }))

  const { error: upsertError } = await supabase.from('market_cache').upsert(formattedOdds)
  if (upsertError) {
    throw new Error(`Failed to upsert market cache rows: ${upsertError.message}`)
  }

  return formattedOdds
}
