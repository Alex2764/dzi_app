-- dzi-it-app — Supabase schema
-- Run once in: Supabase Dashboard → SQL Editor → New query → paste all → Run

create extension if not exists pgcrypto;

-- Прогрес по урок (замества localStorage — виж app/src/lib/storage.ts преди миграцията).
-- Формулата за percent е чернова — виж CLAUDE.md §11.4 (отворен въпрос "Скала на процентите").
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  percent integer not null default 0,
  attempts integer not null default 0,
  last_attempt_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "own lesson progress" on public.lesson_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
