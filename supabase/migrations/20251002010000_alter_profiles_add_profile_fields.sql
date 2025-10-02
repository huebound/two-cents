alter table public.profiles
  add column if not exists username text unique,
  add column if not exists want_to_learn_role text;

create index if not exists profiles_username_idx on public.profiles (username);
