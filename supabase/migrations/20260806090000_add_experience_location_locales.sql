-- Terjemahan lokasi experience (misal "Jarak Jauh" -> "Remote").
alter table experience add column if not exists location_en text;
alter table experience add column if not exists location_ar text;
alter table experience add column if not exists location_jv text;
