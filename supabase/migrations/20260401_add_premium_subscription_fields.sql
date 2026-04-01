alter table if exists profiles
  add column if not exists is_premium boolean default false,
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_status text;

alter table if exists profiles
  alter column is_premium set default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_subscription_status_check'
  ) then
    alter table profiles
      add constraint profiles_subscription_status_check
      check (
        subscription_status is null
        or subscription_status in ('active', 'canceled', 'past_due')
      );
  end if;
end $$;
