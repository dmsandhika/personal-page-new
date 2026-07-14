insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Public bucket downloads already bypass RLS, but keep an explicit read policy
-- so the objects are also selectable through the API/dashboard.
create policy "Public can read images" on storage.objects
  for select using (bucket_id = 'images');
