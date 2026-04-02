type JsonLike = string | number | boolean | null | Record<string, unknown> | JsonLike[];

type SupabaseLike = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: JsonLike) => Promise<{ data: any; error?: { message: string } | null }>;
      single: () => Promise<{ data: any; error?: { message: string } | null }>;
    };
    insert: (values: Record<string, unknown>) => Promise<{ error?: { message: string } | null }>;
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: JsonLike) => Promise<{ error?: { message: string } | null }>;
    };
  };
};

type BetRow = {
  id: string;
  user_id: string;
  game_id: string | null;
  event_name: string;
  team: string | null;
  side: 'home' | 'away' | null;
  wager_amount: number;
  odds_at_entry: number;
  status: 'pending' | 'won' | 'lost' | 'pushed' | 'hedged';
};

type MarketCacheRow = {
  id: string;
  home_team: string | null;
  away_team: string | null;
  best_home_odds: number | null;
  best_away_odds: number | null;
};

function toDecimalOdds(americanOdds: number): number {
  return americanOdds > 0
    ? americanOdds / 100 + 1
    : 100 / Math.abs(americanOdds) + 1;
}

function checkHedgeProfitability(bet: BetRow, opponentOdds: number): boolean {
  if (
    !Number.isFinite(bet.wager_amount) ||
    bet.wager_amount <= 0 ||
    !Number.isFinite(bet.odds_at_entry) ||
    !Number.isFinite(opponentOdds) ||
    opponentOdds === 0
  ) {
    return false;
  }

  const originalDecimal = toDecimalOdds(bet.odds_at_entry);
  const opponentDecimal = toDecimalOdds(opponentOdds);
  const potentialPayout = bet.wager_amount * originalDecimal;
  const hedgeWager = potentialPayout / opponentDecimal;
  const guaranteedProfit = potentialPayout - bet.wager_amount - hedgeWager;

  return guaranteedProfit > 0;
}

function resolveOpponentOdds(bet: BetRow, market: MarketCacheRow): number | null {
  if (bet.side === 'home') {
    return market.best_away_odds ?? null;
  }

  if (bet.side === 'away') {
    return market.best_home_odds ?? null;
  }

  if (bet.team && market.home_team && bet.team === market.home_team) {
    return market.best_away_odds ?? null;
  }

  if (bet.team && market.away_team && bet.team === market.away_team) {
    return market.best_home_odds ?? null;
  }

  return null;
}

async function sendHedgeAlert(userId: string, eventName: string, opponentOdds: number, supabase: SupabaseLike) {
  const { error } = await supabase.from('hedge_alerts').insert({
    user_id: userId,
    event_name: eventName,
    opponent_odds: opponentOdds,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.warn('failed_to_insert_hedge_alert', { userId, eventName, error: error.message });
  }
}

export async function scanForHedges(supabase: SupabaseLike) {
  const { data: activeBets, error: activeBetsError } = await supabase
    .from('bets')
    .select('id,user_id,game_id,event_name,team,side,wager_amount,odds_at_entry,status')
    .eq('status', 'pending');

  if (activeBetsError) {
    throw new Error(`Failed to fetch pending bets: ${activeBetsError.message}`);
  }

  if (!Array.isArray(activeBets)) {
    return;
  }

  for (const bet of activeBets as BetRow[]) {
    if (!bet.game_id) {
      continue;
    }

    const { data: liveMarket, error: liveMarketError } = await supabase
      .from('market_cache')
      .select('id,home_team,away_team,best_away_odds,best_home_odds')
      .eq('id', bet.game_id)
      .single();

    if (liveMarketError || !liveMarket) {
      continue;
    }

    const opponentOdds = resolveOpponentOdds(bet, liveMarket as MarketCacheRow);
    if (!Number.isFinite(opponentOdds)) {
      continue;
    }

    const isProfitable = checkHedgeProfitability(bet, opponentOdds as number);

    if (isProfitable) {
      await sendHedgeAlert(bet.user_id, bet.event_name, opponentOdds as number, supabase);

      await supabase
        .from('bets')
        .update({ status: 'hedged' })
        .eq('id', bet.id);
    }
  }
}
