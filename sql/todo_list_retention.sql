-- 투두리스트 기능을 위한 스키마 및 보존(레텐션) 유틸리티.
-- Supabase 프로젝트의 SQL Editor에서 실행하세요.

create extension if not exists pg_cron;

-- updated_at 컬럼을 항상 최신 상태로 유지하기 위한 공통 함수
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
    is '행이 수정될 때 updated_at 컬럼을 자동으로 갱신합니다.';

-- 보스 체크리스트 저장소 (주간 / 월간)
create table if not exists public.todo_boss (
                                                user_id uuid not null references auth.users (id) on delete cascade,
    category text not null check (category in ('weekly_boss', 'monthly_boss')),
    period_key text not null,
    data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, category, period_key)
    );

comment on table public.todo_boss is '주간/월간 보스 체크리스트 상태를 period_key 단위로 저장합니다.';

-- 일정 및 메모 저장소 (주간 메모, 월간 캘린더)
create table if not exists public.todo_schedule (
                                                    user_id uuid not null references auth.users (id) on delete cascade,
    category text not null check (category in ('memo', 'calendar')),
    period_key text not null,
    data jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, category, period_key)
    );

comment on table public.todo_schedule is '주간 메모 및 월간 캘린더 이벤트를 저장합니다.';

-- 심볼 퀘스트 체크리스트 (주간 단위)
create table if not exists public.todo_symbol (
                                                  user_id uuid not null references auth.users (id) on delete cascade,
    period_key text not null,
    data jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, period_key)
    );

comment on table public.todo_symbol is '아케인 리버 및 그란디스 심볼 퀘스트 완료 상태를 주간 단위로 추적합니다.';

-- 각 테이블에서 update 발생 시 updated_at 컬럼 자동 갱신 트리거
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

-- 오래된 데이터를 정리하기 위한 자동 정리 함수
create or replace function public.cleanup_expired_todo_entries(months integer default 6)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    -- 보존 기간 기준 (기본 6개월)
retention_cutoff timestamptz := now() - make_interval(months => months);

    -- 한국 시간(KST) 기준 현재 시각
    current_kst timestamptz := timezone('Asia/Seoul', now());

    -- 주간 리셋(목요일 0시) 계산
    weekly_diff integer := mod(extract(dow from current_kst)::int + 7 - 4, 7);
    weekly_reset_key text := to_char(date_trunc('day', current_kst) - (weekly_diff * interval '1 day'), 'YYYY-MM-DD');
begin
    -- 보스 데이터 정리
delete from public.todo_boss as entries
where coalesce(entries.updated_at, to_timestamp(nullif(entries.period_key, ''), 'YYYY-MM-DD')) < retention_cutoff;

-- 일정/메모 데이터 정리
delete from public.todo_schedule as entries
where coalesce(entries.updated_at, to_timestamp(nullif(entries.period_key, ''), 'YYYY-MM-DD')) < retention_cutoff;

-- 심볼 데이터 정리 (지난 주차까지만 보관)
delete from public.todo_symbol as entries
where entries.period_key < weekly_reset_key;
end;
$$;

comment on function public.cleanup_expired_todo_entries(integer)
    is '설정된 보존 기간을 초과한 보스, 일정, 심볼 체크리스트 데이터를 삭제합니다.';

-- 동일 이름의 스케줄 잡이 존재하면 제거
select cron.unschedule(jobid)
from cron.job
where jobname = 'todo_list_retention_cleanup';

-- 매일 KST 00:00 (UTC 15:00)에 정리 작업 실행
select cron.schedule(
               'todo_list_retention_cleanup',
               '0 15 * * *',
               $$select public.cleanup_expired_todo_entries();$$
);

--------------------------------------------------------------------------------
-- [추가] 심볼 체크리스트를 매일 00:00 KST에 초기화하는 함수 및 스케줄러
--------------------------------------------------------------------------------

create or replace function public.reset_todo_symbol_daily()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
today_kst text := to_char(timezone('Asia/Seoul', now()), 'YYYY-MM-DD');
begin
    -- 기존 심볼 데이터 삭제
delete from public.todo_symbol;

-- 모든 유저에 대해 새로운 기간키(today_kst)로 초기화
insert into public.todo_symbol (user_id, period_key, data)
select id, today_kst, '{}'::jsonb
from auth.users;
end;
$$;

comment on function public.reset_todo_symbol_daily()
    is '심볼 체크리스트를 매일 00:00 KST에 초기화합니다.';

-- 기존 잡 제거
select cron.unschedule(jobid)
from cron.job
where jobname = 'todo_list_symbol_daily_reset';

-- 매일 KST 00:00 (UTC 15:00)에 심볼 초기화 실행
select cron.schedule(
               'todo_list_symbol_daily_reset',
               '0 15 * * *',
               $$select public.reset_todo_symbol_daily();$$
);
