# 🚀 Guntur Lailam Yuro — Personal Portfolio

Portofolio pribadi **dinamis** yang dibangun dengan **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, dan **Supabase** (PostgreSQL + Auth + Storage). Seluruh konten (projek, sertifikat, pengalaman, pendidikan, pesan) dikelola lewat **Dashboard Admin** — tanpa menyentuh kode.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

## ✨ Fitur

- 🎨 Desain modern: hero 2 kolom, gradient ungu-cyan, dark/light mode
- 🧭 Navbar sticky + backdrop blur + toggle tema
- 🗂️ Project Grid: filter kategori, load more, skeleton, empty state
- 🔗 Halaman detail proyek berbasis **slug** (`/projek/[slug]`)
- 🏆 Section sertifikat (4 terbaru) + halaman semua sertifikat
- 📬 Form kontak → tersimpan ke tabel `pesan` + toast notification
- 🛡️ Dashboard Admin (`/admin`) dengan proteksi middleware:
  - CRUD projek / sertifikat / pengalaman / pendidikan / inbox pesan
  - Upload gambar ke Supabase Storage (bucket `portofolio`)
  - Generate **slug unik** otomatis dari judul
- ❌ Custom 404 page bertema
- 🔍 SEO Open Graph + Twitter Card

## 🧰 Tech Stack

Next.js · TypeScript · Tailwind CSS · Framer Motion · next-themes · lucide-react · Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## 🚦 Mulai Cepat

```bash
# 1. Clone & install
git clone <repo-lu>
cd portofolio-saya
npm install

# 2. Siapkan env
cp .env.local.example .env.local   # lalu isi nilainya (lihat bawah)

# 3. Jalankan
npm run dev
```

### Environment Variables (`.env.local`)

| Variabel                                                                 | Isi                                      |
| ------------------------------------------------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                                               | Project URL Supabase                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key                   |
| `SUPABASE_SERVICE_ROLE_KEY`                                              | Service role key (opsional, server-side) |

## 🗄️ Database (Supabase)

Jalankan SQL berikut di **SQL Editor** (tabel + RLS + bucket):

```sql
CREATE TABLE projek (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, judul TEXT NOT NULL, deskripsi TEXT NOT NULL, gambar TEXT, link_github TEXT, tanggal_selesai DATE, kategori TEXT NOT NULL, slug TEXT UNIQUE NOT NULL);
CREATE TABLE sertifikat (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, nama_sertifikat TEXT NOT NULL, penerbit TEXT NOT NULL, tanggal_terbit DATE NOT NULL, file_gambar TEXT);
CREATE TABLE pengalaman (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, judul TEXT NOT NULL, deskripsi TEXT NOT NULL, tipe TEXT NOT NULL, tanggal_mulai DATE NOT NULL, tanggal_selesai DATE);
CREATE TABLE pendidikan (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, universitas TEXT NOT NULL, jurusan TEXT NOT NULL, tahun_mulai INT NOT NULL, tahun_selesai INT NOT NULL);
CREATE TABLE pesan (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, nama TEXT NOT NULL, email TEXT NOT NULL, pesan TEXT NOT NULL, dibuat_pada TIMESTAMPTZ DEFAULT NOW());

-- RLS: baca publik, tulis hanya admin (authenticated)
DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['projek','sertifikat','pengalaman','pendidikan','pesan'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR SELECT TO public USING (true)', t||'_read', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (true)', t||'_ins', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (true)', t||'_upd', t);
    EXECUTE format('CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (true)', t||'_del', t);
  END LOOP;
END $$;

-- Storage bucket publik
INSERT INTO storage.buckets (id, name, public) VALUES ('portofolio','portofolio',true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "portofolio read" ON storage.objects FOR SELECT TO public USING (bucket_id='portofolio');
CREATE POLICY "portofolio write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='portofolio');
```

### Akun Admin

Supabase → **Authentication → Users → Add user** (centang _auto-confirm_), lalu login di `/admin/login`.

## 📁 Struktur

```
src/
├─ app/            # routes (/, /projek, /sertifikat, /admin, /api)
├─ components/     # Navbar, Hero, About, Skills, ProjectGrid, dll
└─ lib/            # supabaseClient
```

## ▲ Deploy ke Vercel

1. Push ke GitHub, lalu **Import Project** di Vercel.
2. Set env `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy. Update `SITE_URL` di `layout.tsx` dengan URL hasil deploy.

## 📄 Lisensi

MIT — bebas dipakai untuk keperluan pribadi & belajar.

---

Dibuat dengan ❤️ oleh **Guntur Lailam Yuro**
