create or replace function public.update_bankroll_on_bet_settlement()
returns trigger
language plpgsql
as $$
begin
  -- If the bet was updated to 'won'
  if (new.status = 'won' and old.status = 'pending') then
    update public.profiles
    set bankroll_size = bankroll_size + (
      new.wager_amount * (
        case
          when new.odds_at_entry > 0 then (new.odds_at_entry / 100.0) + 1
          else (100.0 / abs(new.odds_at_entry)) + 1
        end
      )
    )
    where id = new.user_id;

  -- If the bet was updated to 'pushed'
  -- Note: We assume the wager was subtracted when placed,
  -- so we only add back on wins/pushes.
  elsif (new.status = 'pushed' and old.status = 'pending') then
    update public.profiles
    set bankroll_size = bankroll_size + new.wager_amount
    where id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_bet_status_change on public.bets;
create trigger on_bet_status_change
  after update of status on public.bets
  for each row
  execute function public.update_bankroll_on_bet_settlement();

create or replace function public.deduct_wager_on_bet_creation()
returns trigger
language plpgsql
as $$
begin
  update public.profiles
  set bankroll_size = bankroll_size - new.wager_amount
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists on_new_bet_placed on public.bets;
create trigger on_new_bet_placed
  after insert on public.bets
  for each row
  execute function public.deduct_wager_on_bet_creation();
