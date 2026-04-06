alter table if exists profiles
  add column if not exists total_bankroll numeric,
  add column if not exists unit_size_percentage numeric default 0.01,
  add column if not exists risk_tolerance text,
  add column if not exists onboarding_completed boolean default false;

update profiles
set total_bankroll = coalesce(total_bankroll, bankroll_size, 1000)
where total_bankroll is null;
