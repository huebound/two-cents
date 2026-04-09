-- Make schedule_summary and location_details optional
alter table public.classes alter column schedule_summary drop not null;
alter table public.classes alter column location_details drop not null;
