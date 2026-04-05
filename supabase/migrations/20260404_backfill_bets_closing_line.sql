-- Backfill closing_line for graded bets so CLV metrics can compute immediately.
-- 1) Prefer market_cache odds when we can infer the opposing line.
-- 2) Fall back to odds_at_entry when no market snapshot exists.

update public.bets as b
set closing_line = case
  when b.side = 'home' then mc.best_away_odds
  when b.side = 'away' then mc.best_home_odds
  when b.team is not null and mc.home_team is not null and b.team = mc.home_team then mc.best_away_odds
  when b.team is not null and mc.away_team is not null and b.team = mc.away_team then mc.best_home_odds
  else null
end
from public.market_cache as mc
where b.closing_line is null
  and b.status in ('won', 'lost', 'pushed', 'hedged')
  and b.game_id is not null
  and mc.id = b.game_id
  and (
    (b.side = 'home' and mc.best_away_odds is not null)
    or (b.side = 'away' and mc.best_home_odds is not null)
    or (b.side is null and b.team is not null and mc.home_team is not null and b.team = mc.home_team and mc.best_away_odds is not null)
    or (b.side is null and b.team is not null and mc.away_team is not null and b.team = mc.away_team and mc.best_home_odds is not null)
  );

update public.bets
set closing_line = odds_at_entry
where closing_line is null
  and status in ('won', 'lost', 'pushed', 'hedged');
