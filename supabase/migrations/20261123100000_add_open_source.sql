-- Section Open Source: library / tool / image buatan sendiri.
-- Statistik (stars, versi, unduhan) tidak disimpan di sini, tapi diambil live
-- dari GitHub / npm / Packagist / Docker Hub (lihat src/lib/open-source-stats.ts).
create table if not exists open_source (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  repo text,                       -- "owner/nama" di GitHub
  kind text not null default 'library'
    check (kind in ('library', 'tool', 'app', 'image')),
  npm_package text,                -- mis. "@dimas/ui" atau "nama-paket"
  composer_package text,           -- mis. "vendor/paket"
  docker_image text,               -- mis. "user/image" atau "library/nginx"
  homepage_url text,               -- docs / website
  description text not null default '',
  description_en text,
  description_ar text,
  description_jv text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table open_source enable row level security;

create policy "Public can read open_source" on open_source for select using (true);
