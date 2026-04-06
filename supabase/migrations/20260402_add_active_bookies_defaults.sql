alter table if exists public.profiles
  add column if not exists active_bookies text[] default '{fanduel,draftkings,betmgm}';

alter table if exists public.profiles
  alter column active_bookies set default '{fanduel,draftkings,betmgm}';

update public.profiles
set active_bookies = array['fanduel', 'draftkings', 'betmgm']
where active_bookies is null
   or array_length(active_bookies, 1) is null
   or active_bookies = array['FanDuel', 'DraftKings'];
