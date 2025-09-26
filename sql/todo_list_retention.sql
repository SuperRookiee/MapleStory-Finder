-- Set up automated cleanup for todo list data older than six months.
-- Run this script inside your Supabase project's SQL editor.

create extension if not exists pg_cron;

create or replace function public.cleanup_expired_todo_list_entries(months integer default 6)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    delete from public.todo_list as entries
    where entries.category in ('weekly_boss', 'monthly_boss', 'memo', 'calendar')
      and coalesce(
            entries.updated_at,
            to_timestamp(nullif(entries.period_key, ''), 'YYYY-MM-DD')
          ) < now() - make_interval(months => months);
end;
$$;

comment on function public.cleanup_expired_todo_list_entries(integer)
    is 'Deletes boss, calendar, and memo rows whose last update (or period key) is older than the configured number of months.';

-- Replace any existing scheduled job with the same name to avoid duplicates.
select cron.unschedule(jobid)
from cron.job
where jobname = 'todo_list_retention_cleanup';

-- Schedule the cleanup to run daily at 04:00 KST (19:00 UTC).
select cron.schedule(
    'todo_list_retention_cleanup',
    '0 19 * * *',
    $$select public.cleanup_expired_todo_list_entries();$$
);
