alter table if exists profiles
  add column if not exists risk_tolerance text,
  add column if not exists unit_size_percentage numeric,
  add column if not exists onboarding_completed boolean default false;
