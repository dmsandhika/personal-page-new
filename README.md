# Personal Page

Next.js personal page dengan panel admin untuk edit konten secara dinamis, data disimpan di Supabase.

## Setup

### 1. Buat project Supabase

Buat project baru di [supabase.com](https://supabase.com), lalu buka **SQL Editor** dan jalankan isi file [`supabase/schema.sql`](supabase/schema.sql). Ini akan membuat tabel `profile`, `projects`, `experience`, RLS policy read-only untuk publik, dan seed satu baris profile kosong.

### 2. Isi environment variables

Copy `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi nilainya:

- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` — dari Supabase Project Settings > API.
- `SUPABASE_SERVICE_ROLE_KEY` — dari halaman yang sama (jangan pernah expose ke client/browser).
- `ADMIN_PASSWORD` — password untuk masuk ke `/admin`.
- `ADMIN_SESSION_SECRET` — string acak panjang untuk menandatangani session admin, generate dengan:
  ```bash
  openssl rand -hex 32
  ```

### 3. Jalankan development server

```bash
npm run dev
```

- Halaman publik: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin) (login pakai `ADMIN_PASSWORD`)

Setelah login, isi data di menu **Profile**, **Experience**, dan **Projects** — perubahan langsung tampil di halaman publik.

## Struktur

- `src/app/page.tsx` — halaman publik (Hero, About, Experience, Projects, Contact), fetch data lewat `supabasePublic` (anon key, read-only).
- `src/app/admin/**` — panel admin, dilindungi `src/middleware.ts` (cek cookie session admin). Semua perubahan data lewat Server Action yang memakai `supabaseAdmin` (service role key, hanya jalan di server).
- `supabase/schema.sql` — DDL + RLS policy, dijalankan manual sekali di Supabase SQL Editor.

## Deploy

Deploy seperti project Next.js biasa (mis. [Vercel](https://vercel.com/new)) — pastikan environment variables di atas diisi juga di dashboard hosting.
