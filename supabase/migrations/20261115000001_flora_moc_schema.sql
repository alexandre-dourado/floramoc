-- Flora MOC — esquema, RLS, triggers, view pública, Storage e métricas admin.

-- ───────────── Tabelas ─────────────
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  common_name text not null,
  scientific_name text,
  category text not null,
  identification_level text not null,
  occurrence_type text not null,
  quantity_estimate text not null default 'unknown',
  latitude double precision not null,
  longitude double precision not null,
  location_precision text not null default 'exact',
  photo_path text,
  description text,
  status text not null default 'pending',
  moderation_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plants_common_name_len check (char_length(btrim(common_name)) between 1 and 100),
  constraint plants_scientific_name_len check (scientific_name is null or char_length(scientific_name) <= 150),
  constraint plants_category_chk check (category in ('tree','shrub','flower','palm','grass','succulent','herb','other')),
  constraint plants_ident_chk check (identification_level in ('identified','probable','unknown')),
  constraint plants_occurrence_chk check (occurrence_type in ('individual','group')),
  constraint plants_quantity_chk check (quantity_estimate in ('one','few','many','unknown')),
  constraint plants_precision_chk check (location_precision in ('exact','approximate')),
  constraint plants_status_chk check (status in ('pending','approved','rejected','archived')),
  constraint plants_description_len check (description is null or char_length(description) <= 500),
  constraint plants_note_len check (moderation_note is null or char_length(moderation_note) <= 1000),
  constraint plants_lat_chk check (latitude between -90 and 90),
  constraint plants_lng_chk check (longitude between -180 and 180),
  constraint plants_photo_path_chk check (
    photo_path is null or photo_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  )
);

create table if not exists public.plant_reports (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open',
  admin_note text,
  resolved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint reports_reason_chk check (reason in ('wrong_id','wrong_location','inappropriate','private_location','other')),
  constraint reports_status_chk check (status in ('open','resolved','dismissed')),
  constraint reports_details_len check (details is null or char_length(details) <= 500),
  constraint reports_note_len check (admin_note is null or char_length(admin_note) <= 1000)
);

create index if not exists plants_status_idx on public.plants (status);
create index if not exists plants_created_by_idx on public.plants (created_by);
create index if not exists plants_created_at_idx on public.plants (created_at);
create index if not exists plants_latlng_idx on public.plants (latitude, longitude);
create index if not exists plants_common_name_idx on public.plants (lower(common_name));
create index if not exists plants_scientific_name_idx on public.plants (lower(scientific_name));
create unique index if not exists plant_reports_one_open_idx
  on public.plant_reports (plant_id, reported_by) where status = 'open';
create index if not exists plant_reports_status_idx on public.plant_reports (status);

-- ───────────── is_admin() ─────────────
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ───────────── Triggers: plants ─────────────
create or replace function public.plants_guard()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  adm boolean;
begin
  -- Acesso direto (SQL Editor / service role): sem auth.uid().
  if uid is null then
    if tg_op = 'UPDATE' then new.updated_at := now(); end if;
    return new;
  end if;

  adm := public.is_admin();

  if tg_op = 'INSERT' then
    if not adm then
      if new.created_by <> uid then
        raise exception 'O registro deve pertencer ao usuário autenticado.' using errcode = '42501';
      end if;
      perform pg_advisory_xact_lock(hashtext('plants:' || uid::text));
      if (select count(*) from public.plants
            where created_by = uid and created_at > now() - interval '1 hour') >= 5 then
        raise exception 'Limite de 5 registros por hora atingido. Tente novamente mais tarde.' using errcode = 'P0001';
      end if;
      new.status := 'pending';
      new.moderation_note := null;
      new.reviewed_by := null;
      new.reviewed_at := null;
    end if;
    return new;
  end if;

  -- UPDATE
  new.updated_at := now();
  new.created_by := old.created_by;
  if adm then
    if new.status is distinct from old.status then
      new.reviewed_by := uid;
      new.reviewed_at := now();
    end if;
  else
    -- Dono: qualquer edição volta para análise; campos de moderação são preservados.
    new.status := 'pending';
    new.moderation_note := old.moderation_note;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
  end if;
  return new;
end;
$$;
revoke all on function public.plants_guard() from public, anon, authenticated;

drop trigger if exists plants_guard_trg on public.plants;
create trigger plants_guard_trg
  before insert or update on public.plants
  for each row execute function public.plants_guard();

-- ───────────── Triggers: plant_reports ─────────────
create or replace function public.plant_reports_guard()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  adm boolean;
begin
  if uid is null then return new; end if;
  adm := public.is_admin();

  if tg_op = 'INSERT' then
    if not adm then
      if new.reported_by <> uid then
        raise exception 'A denúncia deve pertencer ao usuário autenticado.' using errcode = '42501';
      end if;
      perform pg_advisory_xact_lock(hashtext('reports:' || uid::text));
      if (select count(*) from public.plant_reports
            where reported_by = uid and created_at > now() - interval '1 day') >= 10 then
        raise exception 'Limite de 10 denúncias por dia atingido.' using errcode = 'P0001';
      end if;
      new.status := 'open';
      new.admin_note := null;
      new.resolved_by := null;
      new.resolved_at := null;
    end if;
    return new;
  end if;

  if not adm then
    raise exception 'Operação não permitida.' using errcode = '42501';
  end if;
  new.plant_id := old.plant_id;
  new.reported_by := old.reported_by;
  new.reason := old.reason;
  new.details := old.details;
  if new.status is distinct from old.status then
    if new.status = 'open' then
      new.resolved_by := null;
      new.resolved_at := null;
    else
      new.resolved_by := uid;
      new.resolved_at := now();
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.plant_reports_guard() from public, anon, authenticated;

drop trigger if exists plant_reports_guard_trg on public.plant_reports;
create trigger plant_reports_guard_trg
  before insert or update on public.plant_reports
  for each row execute function public.plant_reports_guard();

-- ───────────── View pública (somente aprovados, sem campos internos) ─────────────
create or replace view public.plants_public as
  select id, common_name, scientific_name, category, identification_level, occurrence_type,
         quantity_estimate, latitude, longitude, location_precision, photo_path, description,
         created_at, updated_at
  from public.plants
  where status = 'approved';

-- ───────────── Grants ─────────────
revoke all on public.plants, public.plant_reports, public.admin_users from public, anon, authenticated;
revoke all on public.plants_public from public, anon, authenticated;
grant select on public.plants_public to anon, authenticated;
grant select, insert, update, delete on public.plants to authenticated;
grant select, insert, update on public.plant_reports to authenticated;

-- ───────────── RLS ─────────────
alter table public.admin_users enable row level security;  -- sem policies: nenhum acesso pelo cliente
alter table public.plants enable row level security;
alter table public.plant_reports enable row level security;

drop policy if exists plants_select_own on public.plants;
create policy plants_select_own on public.plants for select to authenticated
  using (created_by = (select auth.uid()));

drop policy if exists plants_select_admin on public.plants;
create policy plants_select_admin on public.plants for select to authenticated
  using ((select public.is_admin()));

drop policy if exists plants_insert_own on public.plants;
create policy plants_insert_own on public.plants for insert to authenticated
  with check (created_by = (select auth.uid()) and status = 'pending');

drop policy if exists plants_update_own on public.plants;
create policy plants_update_own on public.plants for update to authenticated
  using (created_by = (select auth.uid()) and status in ('pending','approved'))
  with check (created_by = (select auth.uid()) and status = 'pending');

drop policy if exists plants_update_admin on public.plants;
create policy plants_update_admin on public.plants for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists plants_delete_own on public.plants;
create policy plants_delete_own on public.plants for delete to authenticated
  using (created_by = (select auth.uid()) and status = 'pending');

drop policy if exists plants_delete_admin on public.plants;
create policy plants_delete_admin on public.plants for delete to authenticated
  using ((select public.is_admin()));

drop policy if exists reports_insert_own on public.plant_reports;
create policy reports_insert_own on public.plant_reports for insert to authenticated
  with check (
    reported_by = (select auth.uid()) and status = 'open'
    and exists (select 1 from public.plants_public p where p.id = plant_id)
  );

drop policy if exists reports_select_own on public.plant_reports;
create policy reports_select_own on public.plant_reports for select to authenticated
  using (reported_by = (select auth.uid()));

drop policy if exists reports_select_admin on public.plant_reports;
create policy reports_select_admin on public.plant_reports for select to authenticated
  using ((select public.is_admin()));

drop policy if exists reports_update_admin on public.plant_reports;
create policy reports_update_admin on public.plant_reports for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ───────────── Métricas administrativas ─────────────
create or replace function public.admin_stats()
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso negado.' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'pending', (select count(*) from public.plants where status = 'pending'),
    'approved', (select count(*) from public.plants where status = 'approved'),
    'rejected_archived', (select count(*) from public.plants where status in ('rejected','archived')),
    'open_reports', (select count(*) from public.plant_reports where status = 'open'),
    'contributors', (select count(distinct created_by) from public.plants where status = 'approved'),
    'last_30_days', (select count(*) from public.plants where created_at > now() - interval '30 days'),
    'by_category', coalesce((
      select jsonb_object_agg(category, n)
      from (select category, count(*) as n from public.plants where status = 'approved' group by category) t
    ), '{}'::jsonb)
  );
end;
$$;
revoke all on function public.admin_stats() from public, anon, authenticated;
grant execute on function public.admin_stats() to authenticated;
