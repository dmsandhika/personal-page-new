-- Image shown on the BACK of the hero lanyard card. Front uses avatar_url.
alter table profile add column if not exists card_back_url text;
