-- Ensure UUID generation extension is available
create extension if not exists "pgcrypto";

-- Classes table stores offerings that users can view and register for
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references auth.users (id) on delete set null,
  title text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  weeks integer not null check (weeks > 0),
  total_spots integer not null check (total_spots > 0),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  start_time time not null,
  end_time time not null,
  meeting_days text not null,
  schedule_summary text not null,
  location_tag text not null check (location_tag = 'DTLA'),
  location_details text not null,
  requirements text,
  host_blurb text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint classes_time_check check (end_time > start_time)
);

alter table public.classes enable row level security;

-- Reuse the generic updated_at trigger for the classes table
create trigger on_classes_updated
  before update on public.classes
  for each row
  execute procedure public.handle_updated_at();

-- Policies: authenticated users can read all classes
create policy "Authenticated users can view classes"
  on public.classes for select
  using (auth.role() = 'authenticated');

-- Only the hosting user can insert, update, or delete their classes
create policy "Hosts can insert their own classes"
  on public.classes for insert
  with check (auth.uid() = host_id);

create policy "Hosts can modify their own classes"
  on public.classes for update
  using (auth.uid() = host_id) with check (auth.uid() = host_id);

create policy "Hosts can delete their own classes"
  on public.classes for delete
  using (auth.uid() = host_id);

-- Class registrations table tracks which users have registered
create table public.class_registrations (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (class_id, user_id)
);

alter table public.class_registrations enable row level security;

create index class_registrations_user_id_idx on public.class_registrations (user_id);
create index class_registrations_class_id_idx on public.class_registrations (class_id);

create trigger on_class_registrations_updated
  before update on public.class_registrations
  for each row
  execute procedure public.handle_updated_at();

-- Policies: authenticated users can see classes they host or attend
create policy "Authenticated users can view registration counts"
  on public.class_registrations for select
  using (auth.role() = 'authenticated');

-- Allow authenticated users to register themselves
create policy "Users can register for classes"
  on public.class_registrations for insert
  with check (
    auth.role() = 'authenticated' and auth.uid() = user_id
  );

-- Allow users to cancel their own registrations
create policy "Users can cancel their registrations"
  on public.class_registrations for delete
  using (auth.uid() = user_id);
