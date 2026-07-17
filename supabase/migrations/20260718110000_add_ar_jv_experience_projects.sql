-- Terjemahan Arab (ar) & Jawa (jv) untuk experience & projects.
-- Bahasa dasar tetap Indonesia (kolom tanpa sufiks).
alter table experience add column if not exists role_ar text;
alter table experience add column if not exists role_jv text;
alter table experience add column if not exists description_ar text;
alter table experience add column if not exists description_jv text;

alter table projects add column if not exists title_ar text;
alter table projects add column if not exists title_jv text;
alter table projects add column if not exists description_ar text;
alter table projects add column if not exists description_jv text;
