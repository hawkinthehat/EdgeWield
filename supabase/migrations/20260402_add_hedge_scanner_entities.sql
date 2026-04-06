alter table if exists public.bets
  add column if not exists game_id text,
  add column if not exists team text,
  add column if not exists side text check (side in ('home', 'away'));

create index if not exists bets_game_id_idx on public.bets (game_id);
create index if not exists bets_status_idx on public.bets (status);

create table if not exists public.market_cache (
  id text primary key,
  event_name text,
  home_team text,
  away_team text,
  best_home_odds integer,
  best_away_odds integer,
  best_home_book text,
  best_away_book text,
  updated_at timestamp with time zone default now()
);

alter table if exists public.market_cache
  add column if not exists best_home_book text,
  add column if not exists best_away_book text;

create index if not exists market_cache_updated_at_idx on public.market_cache (updated_at desc);

create table if not exists public.hedge_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_name text not null,
  opponent_odds integer not null,
  created_at timestamp with time zone default now()
);

create index if not exists hedge_alerts_user_id_idx on public.hedge_alerts (user_id);
create index if not exists hedge_alerts_created_at_idx on public.hedge_alerts (created_at desc);

alter table public.hedge_alerts enable row level security;

drop policy if exists "Users can view their own hedge alerts" on public.hedge_alerts;
create policy "Users can view their own hedge alerts"
on public.hedge_alerts
for select
using (auth.uid() = user_id);
