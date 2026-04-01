alter table if exists profiles
  add column if not exists role text default 'free',
  add column if not exists stripe_customer_id text unique;
