-- Create storage bucket for class images
insert into storage.buckets (id, name, public)
values ('class-images', 'class-images', true);

-- Policy: Anyone can view class images (public bucket)
create policy "Class images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'class-images');

-- Policy: Authenticated users can upload class images
create policy "Authenticated users can upload class images"
  on storage.objects for insert
  with check (
    bucket_id = 'class-images' and
    auth.role() = 'authenticated'
  );

-- Policy: Users can update their own class images
create policy "Users can update their own class images"
  on storage.objects for update
  using (
    bucket_id = 'class-images' and
    auth.role() = 'authenticated'
  );

-- Policy: Users can delete their own class images
create policy "Users can delete their own class images"
  on storage.objects for delete
  using (
    bucket_id = 'class-images' and
    auth.role() = 'authenticated'
  );

-- Add image_url column to classes table
alter table public.classes
  add column if not exists image_url text;
