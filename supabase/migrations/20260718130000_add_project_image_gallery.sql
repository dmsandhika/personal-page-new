-- Galeri: satu project bisa punya banyak gambar. image_url lama tetap ada
-- sebagai sampul (cover) untuk kompatibilitas & OG image.
alter table projects add column if not exists image_urls text[] not null default '{}';

-- Pindahkan gambar tunggal yang sudah ada ke dalam array.
update projects
set image_urls = array[image_url]
where image_url is not null
  and image_url <> ''
  and array_length(image_urls, 1) is null;
