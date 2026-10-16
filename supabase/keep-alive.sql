-- Keep-alive table for the Supabase free plan.
--
-- Supabase pauses free projects after 7 days of low database activity. Learnbit's data lives
-- on Aiven, so the only Supabase traffic is auth. `/api/cron/db-health` (run every 3 hours by
-- GitHub Actions) reads this table with the publishable key to keep the project active.
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run. Safe to re-run.

create table if not exists public.keep_alive (
  id smallint primary key default 1 check (id = 1),
  note text not null default 'Read by /api/cron/db-health to keep this project active.'
);

insert into public.keep_alive (id) values (1) on conflict (id) do nothing;

alter table public.keep_alive enable row level security;

drop policy if exists "keep_alive is readable by anyone" on public.keep_alive;

create policy "keep_alive is readable by anyone"
  on public.keep_alive
  for select
  to anon, authenticated
  using (true);

grant select on public.keep_alive to anon, authenticated;
