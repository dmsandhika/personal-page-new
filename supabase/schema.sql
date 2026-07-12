-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  title text not null default '',
  bio text not null default '',
  avatar_url text,
  email text not null default '',
  location text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  tags text[] not null default '{}',
  project_url text,
  repo_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Seed a single profile row so the app has something to edit from the start.
insert into profile (name, title, bio, email)
select 'Nama Kamu', 'Software Engineer', 'Tulis bio singkat tentang kamu di sini.', 'you@example.com'
where not exists (select 1 from profile);

alter table profile enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;

-- Public (anon) read access — the site is a public personal page.
create policy "Public can read profile" on profile for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read experience" on experience for select using (true);

-- No insert/update/delete policies for anon: all writes go through the
-- server-side admin client (service role key), which bypasses RLS and is
-- gated by the admin password check in src/middleware.ts.
