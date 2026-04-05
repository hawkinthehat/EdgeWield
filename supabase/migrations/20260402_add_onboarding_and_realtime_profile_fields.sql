alter table if exists public.profiles
  add column if not exists total_bankroll numeric,
  add column if not exists unit_size_percentage numeric,
  add column if not exists risk_tolerance text,
  add column if not exists onboarding_completed boolean default false;

update public.profiles
set total_bankroll = bankroll_size
where total_bankroll is null and bankroll_size is not null;

alter table if exists public.profiles
  alter column total_bankroll set default 1000,
  alter column unit_size_percentage set default 0.01,
  alter column risk_tolerance set default 'Standard',
  alter column onboarding_completed set default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_risk_tolerance_check'
  ) then
    alter table public.profiles
      add constraint profiles_risk_tolerance_check
      check (risk_tolerance in ('Conservative', 'Standard', 'Aggressive'));
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if exists (select 1 from pg_class where relname = 'bets' and relnamespace = 'public'::regnamespace) then
      begin
        alter publication supabase_realtime add table public.bets;
      exception
        when duplicate_object then null;
      end;
    end if;

    if exists (select 1 from pg_class where relname = 'profiles' and relnamespace = 'public'::regnamespace) then
      begin
        alter publication supabase_realtime add table public.profiles;
      exception
        when duplicate_object then null;
      end;
    end if;
  end if;
end $$;
