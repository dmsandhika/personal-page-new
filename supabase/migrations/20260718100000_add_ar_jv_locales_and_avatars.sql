-- Konten multibahasa untuk Arab (ar) & Jawa (jv), plus foto hero per bahasa.
-- Bahasa dasar tetap Indonesia (kolom title/bio/avatar_url yang sudah ada).
alter table profile add column if not exists title_ar text;
alter table profile add column if not exists title_jv text;
alter table profile add column if not exists bio_ar text;
alter table profile add column if not exists bio_jv text;

-- Foto hero berbeda per bahasa. avatar_url = default (Indonesia).
alter table profile add column if not exists avatar_url_en text;
alter table profile add column if not exists avatar_url_ar text;
alter table profile add column if not exists avatar_url_jv text;
