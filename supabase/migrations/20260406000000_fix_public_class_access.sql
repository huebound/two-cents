-- Allow public (unauthenticated) users to read classes
drop policy if exists "Authenticated users can view classes" on public.classes;

create policy "Anyone can view classes"
  on public.classes for select
  using (true);

-- Allow public (unauthenticated) users to read registration counts
drop policy if exists "Authenticated users can view registration counts" on public.class_registrations;

create policy "Anyone can view registration counts"
  on public.class_registrations for select
  using (true);