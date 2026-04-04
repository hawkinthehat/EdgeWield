'use server'

type OddsOutcome = {
  name: string
  price: number
}

type OddsMarket = {
  key: string
  outcomes?: OddsOutcome[]
}

type OddsBookmaker = {
  title: string
  markets?: OddsMarket[]
}

type OddsGame = {
  id: string
  home_team: string
  away_team: string
  bookmakers?: OddsBookmaker[]
}

export type LiveOddsRow = {
  id: string
  home_team: string
  away_team: string
  best_ml_home: number | null
}

const REGION = 'us'

export const fetchLiveOdds = async (sport: string): Promise<LiveOddsRow[]> => {
  const apiKey = process.env.THE_ODDS_API_KEY

  if (!apiKey) {
    throw new Error('THE_ODDS_API_KEY is not configured')
  }

  const url = new URL(`https://api.the-odds-api.com/v4/sports/${sport}/odds/`)
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('regions', REGION)
  url.searchParams.set('markets', 'h2h,spreads')

  const response = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch odds for ${sport}: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as OddsGame[]

  // Compare supported books and return the best home-team moneyline price.
  return data.map((game) => {
    const prices = (game.bookmakers ?? [])
      .filter((bookmaker) =>
        ['FanDuel', 'DraftKings', 'BetMGM'].includes(bookmaker.title),
      )
      .flatMap((bookmaker) => bookmaker.markets ?? [])
      .filter((market) => market.key === 'h2h')
      .flatMap((market) => market.outcomes ?? [])
      .filter((outcome) => outcome.name === game.home_team)
      .map((outcome) => outcome.price)
      .filter((price) => Number.isFinite(price))

    return {
      id: game.id,
      home_team: game.home_team,
      away_team: game.away_team,
      best_ml_home: prices.length ? Math.max(...prices) : null,
    }
  })
}
