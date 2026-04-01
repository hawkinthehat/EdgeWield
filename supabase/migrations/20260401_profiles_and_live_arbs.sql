create extension if not exists "uuid-ossp";

-- Profiles with subscription tiers
create table if not exists profiles (
  id uuid references auth.users primary key,
  bankroll_size numeric default 1000,
  is_pro boolean default false, -- THE $99 GATE
  active_bookies text[] default '{FanDuel,DraftKings}',
  updated_at timestamp with time zone default now()
);

-- The live edge table
create table if not exists live_arbs (
  id uuid default uuid_generate_v4() primary key,
  market_type text, -- 'h2h', 'player_points', etc.
  event_name text,
  home_team text,
  away_team text,
  bookie_a text,
  odds_a numeric,
  bookie_b text,
  odds_b numeric,
  profit_percent numeric,
  commence_time timestamp with time zone,
  is_prop boolean default false
);
