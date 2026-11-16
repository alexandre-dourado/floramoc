-- Bucket de fotos: leitura pública por URL (nomes UUID imprevisíveis), upload restrito ao próprio prefixo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plant-photos', 'plant-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists plant_photos_insert_own on storage.objects;
create policy plant_photos_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists plant_photos_select_own on storage.objects;
create policy plant_photos_select_own on storage.objects for select to authenticated
  using (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- O autor remove a própria foto, exceto quando ela pertence a um registro aprovado.
drop policy if exists plant_photos_delete_own on storage.objects;
create policy plant_photos_delete_own on storage.objects for delete to authenticated
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and not exists (select 1 from public.plants p where p.photo_path = name and p.status = 'approved')
  );

drop policy if exists plant_photos_delete_admin on storage.objects;
create policy plant_photos_delete_admin on storage.objects for delete to authenticated
  using (bucket_id = 'plant-photos' and (select public.is_admin()));
