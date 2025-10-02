-- Add want_to_learn column to profiles table
alter table public.profiles
  add column if not exists want_to_learn jsonb default '[]'::jsonb;
