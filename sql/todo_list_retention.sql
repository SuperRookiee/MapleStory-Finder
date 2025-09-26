-- Schema and retention utilities for the todo list feature.
-- Run this script inside your Supabase project's SQL editor.

create extension if not exists pg_cron;

-- Shared helper to keep updated_at columns in sync.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

comment on function public.update_updated_at_column()
    is 'Automatically refreshes the updated_at column whenever a row is modified.';

-- Boss checklist storage (weekly & monthly).
create table if not exists public.todo_boss (
    user_id uuid not null references auth.users (id) on delete cascade,
    category text not null check (category in ('weekly_boss', 'monthly_boss')),
    period_key text not null,
    data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, category, period_key)
);

comment on table public.todo_boss is 'Stores weekly and monthly boss checklist states grouped by period key.';

-- Schedule & memo storage (weekly memos, monthly calendar).
create table if not exists public.todo_schedule (
    user_id uuid not null references auth.users (id) on delete cascade,
    category text not null check (category in ('memo', 'calendar')),
    period_key text not null,
    data jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, category, period_key)
);

comment on table public.todo_schedule is 'Stores weekly memos and monthly calendar events for the todo list.';

-- Symbol quest checklist (weekly reset).
create table if not exists public.todo_symbol (
    user_id uuid not null references auth.users (id) on delete cascade,
    period_key text not null,
    data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, period_key)
);

comment on table public.todo_symbol is 'Tracks Arcane River and Grandis symbol quest completion states by weekly period.';

-- Ensure updated_at is refreshed on update for each table.
drop trigger if exists set_todo_boss_updated_at on public.todo_boss;
create trigger set_todo_boss_updated_at
before update on public.todo_boss
for each row execute function public.update_updated_at_column();

drop trigger if exists set_todo_schedule_updated_at on public.todo_schedule;
create trigger set_todo_schedule_updated_at
before update on public.todo_schedule
for each row execute function public.update_updated_at_column();

drop trigger if exists set_todo_symbol_updated_at on public.todo_symbol;
create trigger set_todo_symbol_updated_at
before update on public.todo_symbol
for each row execute function public.update_updated_at_column();

-- Automated cleanup to keep historical data under control.
create or replace function public.cleanup_expired_todo_entries(months integer default 6)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    retention_cutoff timestamptz := now() - make_interval(months => months);
    current_kst timestamptz := timezone('Asia/Seoul', now());
    weekly_diff integer := mod(extract(dow from current_kst)::int + 7 - 4, 7);
    weekly_reset_key text := to_char(date_trunc('day', current_kst) - (weekly_diff * interval '1 day'), 'YYYY-MM-DD');
begin
    delete from public.todo_boss as entries
    where coalesce(entries.updated_at, to_timestamp(nullif(entries.period_key, ''), 'YYYY-MM-DD')) < retention_cutoff;

    delete from public.todo_schedule as entries
    where coalesce(entries.updated_at, to_timestamp(nullif(entries.period_key, ''), 'YYYY-MM-DD')) < retention_cutoff;

    delete from public.todo_symbol as entries
    where entries.period_key < weekly_reset_key;
end;
$$;

comment on function public.cleanup_expired_todo_entries(integer)
    is 'Deletes old boss, schedule, and symbol checklist rows beyond the retention window.';

-- Replace any existing scheduled job with the same name to avoid duplicates.
select cron.unschedule(jobid)
from cron.job
where jobname = 'todo_list_retention_cleanup';

-- Schedule the cleanup to run daily at 04:00 KST (19:00 UTC).
select cron.schedule(
    'todo_list_retention_cleanup',
    '0 19 * * *',
    $$select public.cleanup_expired_todo_entries();$$
);
