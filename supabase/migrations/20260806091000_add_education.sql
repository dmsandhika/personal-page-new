create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  institution_en text,
  institution_ar text,
  institution_jv text,
  institution_logo_url text,
  degree text not null default 'S1',
  field_of_study text not null,
  field_of_study_en text,
  field_of_study_ar text,
  field_of_study_jv text,
  location text,
  location_en text,
  location_ar text,
  location_jv text,
  start_date date not null,
  end_date date,
  description text,
  description_en text,
  description_ar text,
  description_jv text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table education enable row level security;

create policy "Public can read education" on education for select using (true);
