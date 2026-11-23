-- Status proyek open source: sedang dikerjakan atau siap dipakai.
alter table open_source
  add column if not exists status text not null default 'ready'
  check (status in ('in_progress', 'ready'));
