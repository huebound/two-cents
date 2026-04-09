-- Make total_spots and meeting_days optional
alter table public.classes alter column total_spots drop not null;
alter table public.classes alter column meeting_days drop not null;
