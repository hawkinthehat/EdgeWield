create extension if not exists pgcrypto;

create table if not exists public.bets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  event_name text not null,
  sport text not null,
  start_time timestamp with time zone,
  sportsbook text,
  wager_amount decimal(12, 2) not null,
  odds_at_entry integer not null,
  bet_type text,
  unit_count decimal(3, 2),
  closing_line integer,
  status text check (status in ('pending', 'won', 'lost', 'pushed', 'hedged')) default 'pending',
  is_tilt_bet boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists bets_user_id_idx on public.bets (user_id);
create index if not exists bets_created_at_idx on public.bets (created_at desc);

alter table public.bets enable row level security;

drop policy if exists "Users can manage their own bets" on public.bets;
create policy "Users can manage their own bets"
on public.bets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
