create table if not exists public.market_cache (
  id text primary key,
  sport_key text not null,
  home_team text not null,
  away_team text not null,
  commence_time timestamp with time zone,
  best_home_odds integer,
  best_away_odds integer,
  last_updated timestamp with time zone default now()
);

create index if not exists idx_sport_key on public.market_cache (sport_key);
