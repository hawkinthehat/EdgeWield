-- Core extension for UUID generation
create extension if not exists pgcrypto;

-- Raw heartbeat stream from scanner + execution daemons.
create table if not exists public.terminal_heartbeats (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  heartbeat_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists terminal_heartbeats_source_idx
  on public.terminal_heartbeats (source);

create index if not exists terminal_heartbeats_heartbeat_at_idx
  on public.terminal_heartbeats (heartbeat_at desc);

-- Opportunities detected by the scanner and scored by Kelly engine.
create table if not exists public.arb_opportunities (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  symbol text not null,
  market text not null,
  side text not null check (side in ('long', 'short')),
  probability numeric(8,6) not null check (probability > 0 and probability < 1),
  decimal_odds numeric(8,4) not null check (decimal_odds > 1),
  edge numeric(10,6) not null,
  confidence numeric(8,6) not null default 0,
  status text not null default 'open' check (status in ('open', 'filled', 'expired', 'cancelled')),
  detected_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists arb_opportunities_symbol_status_idx
  on public.arb_opportunities (symbol, status);

create index if not exists arb_opportunities_detected_at_idx
  on public.arb_opportunities (detected_at desc);

-- Executed positions and settlement/cfo figures.
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.arb_opportunities(id) on delete set null,
  source text not null default 'edge-wield',
  symbol text not null,
  side text not null check (side in ('long', 'short')),
  stake numeric(14,2) not null check (stake >= 0),
  pnl numeric(14,2) not null default 0,
  status text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists positions_status_opened_at_idx
  on public.positions (status, opened_at desc);

-- Auto-managed updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_arb_opportunities_updated_at on public.arb_opportunities;
create trigger set_arb_opportunities_updated_at
before update on public.arb_opportunities
for each row
execute function public.set_updated_at();

-- Live CFO snapshot for terminal dashboard.
create or replace view public.cfo_snapshot as
with open_positions as (
  select
    coalesce(sum(stake), 0)::numeric(14,2) as exposure
  from public.positions
  where status = 'open'
),
closed_positions as (
  select
    coalesce(sum(pnl), 0)::numeric(14,2) as realized_pnl
  from public.positions
  where status = 'closed'
)
select
  (100000)::numeric(14,2) as bankroll,
  open_positions.exposure,
  closed_positions.realized_pnl,
  (100000 + closed_positions.realized_pnl - open_positions.exposure)::numeric(14,2) as free_margin
from open_positions, closed_positions;
