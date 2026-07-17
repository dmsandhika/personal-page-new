-- Tipe pekerjaan untuk tiap experience: 'work' (kerja) atau 'intern' (magang).
alter table experience add column if not exists employment_type text not null default 'work';
