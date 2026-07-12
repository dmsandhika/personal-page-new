# Personal Page

Next.js personal page dengan panel admin untuk edit konten secara dinamis, data disimpan di Supabase.

## Setup

### 1. Link project Supabase & apply migration

Schema database ada di [`supabase/migrations/`](supabase/migrations/) dan dikelola lewat Supabase CLI (`npx supabase`, sudah ter-init di `supabase/config.toml`).

```bash
# Login ke akun Supabase kamu (buka browser untuk auth)
npx supabase login

# Link ke project yang sudah dibuat di supabase.com — project ref ada di URL
# dashboard project kamu: https://supabase.com/dashboard/project/<project-ref>
npx supabase link --project-ref <project-ref>

# Apply migration (bikin tabel profile, projects, experience + RLS policy)
npx supabase db push
```

Setiap kali schema berubah, tambah file baru di `supabase/migrations/` (mis. lewat `npx supabase migration new <nama>`) lalu `npx supabase db push` lagi.

### 2. Isi environment variables

Copy `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi nilainya (dari Supabase Project Settings > API Keys):

- `NEXT_PUBLIC_SUPABASE_URL` — URL project.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key, aman dipakai di client/browser.
- `SUPABASE_SECRET_KEY` — secret key, **jangan pernah** expose ke client/browser, hanya dipakai di Server Action.
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

- `src/app/page.tsx` — halaman publik (Hero, About, Experience, Projects, Contact), fetch data lewat `supabasePublic` (publishable key, read-only).
- `src/app/admin/**` — panel admin, dilindungi `src/proxy.ts` (cek cookie session admin). Semua perubahan data lewat Server Action yang memakai `supabaseAdmin` (secret key, hanya jalan di server).
- `supabase/migrations/` — schema database, di-apply lewat `npx supabase db push`.

## Deploy

Deploy seperti project Next.js biasa (mis. [Vercel](https://vercel.com/new)) — pastikan environment variables di atas diisi juga di dashboard hosting.
