alter table if exists public.market_cache
  add column if not exists best_home_book text,
  add column if not exists best_away_book text;
