alter table profile add column if not exists title_en text;
alter table profile add column if not exists bio_en text;

alter table projects add column if not exists title_en text;
alter table projects add column if not exists description_en text;

alter table experience add column if not exists role_en text;
alter table experience add column if not exists description_en text;
