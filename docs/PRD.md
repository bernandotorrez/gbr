```
# PROJECT BRIEF: Website Landing Page — Grand Bedahan Residence

## 1. RINGKASAN PROJECT
Bangun website landing page untuk perumahan bernama "Grand Bedahan Residence".
Tujuan: menjadi etalase online perumahan agar calon pembeli mendapat informasi
lengkap (tipe rumah, harga, lokasi, promo) dan mudah menghubungi tim marketing,
sekaligus memberi tim marketing (non-teknis) halaman admin untuk mengelola
promosi & artikel sendiri tanpa bantuan developer.

## 2. TECH STACK (WAJIB DIIKUTI)
- Front-End: Astro (output statis/SSG agar SEO maksimal), styling dengan Tailwind CSS
- Komponen interaktif (form kontak, chatbot widget, kalkulator KPR) dibuat sebagai
  Astro Island — gunakan React atau Vue untuk komponen tersebut, sisanya tetap
  Astro murni (jangan render seluruh halaman jadi SPA)
- Back-End & Database: Supabase (PostgreSQL) — gunakan Supabase JS Client
  - Auth: Supabase Auth untuk login admin (email & password)
  - Storage: Supabase Storage untuk upload gambar (tipe rumah, promo, artikel)
  - Row Level Security (RLS) WAJIB diaktifkan di semua tabel
- Hosting Front-End target: Vercel / Netlify / Cloudflare Pages (static output Astro)
- Domain produksi: grandbedahanresidence.com

## 3. IDENTITAS VISUAL / DESIGN SYSTEM (WAJIB DIIKUTI)
Tema: go-green — perumahan yang asri & ramah lingkungan. Latar didominasi putih,
hijau emerald dipakai secukupnya sebagai aksen (bukan memenuhi layar).

Palet warna:
- Warna utama       : #046A38 (hijau emerald) — tombol, navbar, ikon, garis section
- Warna aksen/hover  : #10B981 (hijau emerald muda) — hover, badge promo, highlight harga
- Background utama   : #FFFFFF (putih bersih)
- Background alternatif (selang-seling section) : #F7FAF9
- Teks utama         : #262626
- Teks sekunder      : #595959

Tipografi: font sans-serif modern (Inter / Poppins / Plus Jakarta Sans).
Komponen: tombol rounded, card dengan shadow tipis + sudut membulat,
ikon gaya outline, floating WhatsApp button berwarna hijau emerald (bukan hijau
default WhatsApp), chatbot widget dengan header hijau emerald.

Terapkan konfigurasi warna ini di tailwind.config sejak awal:
```js
theme: {
  extend: {
    colors: {
      primary: "#046A38",
      "primary-light": "#10B981",
      background: "#FFFFFF",
      "background-alt": "#F7FAF9",
    },
  },
}
```

## 4. STRUKTUR DATABASE SUPABASE (BUAT SEBAGAI MIGRATION SQL)
Buat tabel berikut lengkap dengan RLS policy:

- `tipe_rumah`: id (uuid, pk), nama_tipe, ukuran_tanah, ukuran_bangunan,
  jumlah_kamar_tidur, jumlah_kamar_mandi, harga (numeric), deskripsi,
  foto_url, urutan_tampil (int), created_at (timestamptz default now())
- `promosi`: id (uuid, pk), judul, deskripsi, gambar_url, tanggal_mulai (date),
  tanggal_selesai (date), status (enum: aktif/nonaktif), created_at
- `artikel`: id (uuid, pk), judul, slug (unique), isi_konten (text),
  gambar_utama_url, kata_kunci_seo, status (enum: draft/publish),
  tanggal_publish (timestamptz), created_at
- `leads`: id (uuid, pk), nama, no_hp, tipe_rumah_diminati, pesan, created_at

Policy RLS:
- Pengunjung umum (anon): hanya boleh SELECT pada `tipe_rumah`,
  `promosi` (status = 'aktif'), dan `artikel` (status = 'publish')
- Pengunjung umum: boleh INSERT ke tabel `leads` (submit form kontak) TAPI
  tidak boleh SELECT/UPDATE/DELETE tabel `leads`
- Admin (authenticated, role admin): full access (SELECT/INSERT/UPDATE/DELETE)
  ke semua tabel

## 5. HALAMAN 1 — LANDING PAGE (route: /)
Single page scroll dengan section berurutan:
1. Navbar sticky — logo/nama, menu (Beranda, Tipe Rumah, Promo, Artikel, Kontak),
   tombol CTA "Hubungi Kami"
2. Hero — judul, tagline, gambar banner, CTA "Lihat Tipe Rumah" & "Hubungi Sales"
3. Tipe Rumah & Harga — grid card dari data Supabase (foto, nama tipe, ukuran,
   kamar, harga, tombol "Tanya via WhatsApp")
4. Lokasi — embed Google Maps + alamat lengkap
5. Video — embed YouTube (profil/tur perumahan)
6. Promosi — card promo aktif dari Supabase (judul, gambar, deskripsi, tanggal)
7. Artikel — 3–6 artikel terbaru dari Supabase (status publish), link ke
   halaman detail /artikel/[slug] (statis, generate via getStaticPaths Astro)
8. Testimoni — carousel/grid testimoni pembeli
9. FAQ — accordion tanya-jawab
10. Kontak — form (nama, no HP, tipe rumah diminati, pesan) yang insert ke
    tabel `leads`, plus info kontak & nomor WhatsApp langsung
11. Floating WhatsApp Button — selalu tampil, warna sesuai design system
12. AI Chatbot Widget — floating widget yang menjawab pertanyaan umum
    (tipe rumah, harga, cara booking, lokasi); jika tidak bisa menjawab,
    arahkan ke tombol lanjut chat WhatsApp sales
13. Footer — logo, alamat singkat, menu, sosial media, copyright

## 6. HALAMAN 2 — ADMIN PANEL (route: /admin, dilindungi Supabase Auth)
1. Login admin (email & password)
2. Dashboard — ringkasan jumlah leads, promo aktif, artikel published
3. Kelola Promosi — tabel + CRUD (tambah/edit/hapus), form dengan upload gambar
4. Kelola Artikel — tabel + CRUD, slug otomatis dari judul, rich text editor,
   upload gambar utama, status draft/publish
5. Kelola Tipe Rumah — tabel + CRUD, upload foto
6. Data Leads — tabel daftar calon pembeli, urut dari terbaru

## 7. SEO (WAJIB DITERAPKAN)
- Meta title & description dinamis per halaman (termasuk per artikel)
- Sitemap.xml otomatis (@astrojs/sitemap)
- robots.txt yang mengizinkan indexing
- Structured data schema.org (RealEstateListing untuk tipe rumah, Article
  untuk artikel)
- Semua gambar wajib punya alt text deskriptif, lazy-load
- URL/slug artikel rapi dan mengandung kata kunci (contoh:
  /artikel/tips-membeli-rumah-pertama)
- Heading terstruktur H1 → H3, hanya satu H1 per halaman

## 8. AI CHATBOT
Integrasikan chatbot sebagai Astro Island (komponen interaktif terpisah),
dengan basis pengetahuan seputar: daftar tipe rumah & harga (ambil dari
Supabase), cara booking, lokasi, dan jam operasional. Sediakan fallback
untuk mengarahkan ke WhatsApp sales bila pertanyaan di luar cakupan.
Kuota awal: 1.000 chat (catat penggunaan/counter bila memungkinkan agar
bisa dipantau sisa kuotanya).

## 9. STRUKTUR FOLDER YANG DIHARAPKAN
```
src/
├── pages/
│   ├── index.astro
│   ├── artikel/[slug].astro
│   └── admin/
│       ├── index.astro
│       ├── promosi.astro
│       ├── artikel.astro
│       ├── tipe-rumah.astro
│       └── leads.astro
├── components/
│   ├── sections/          (HeroSection, TipeRumahSection, dst — Astro murni)
│   ├── islands/           (FormKontak, ChatbotWidget, FloatingWhatsApp — React/Vue)
│   └── ui/                (Button, Card, Badge — reusable)
├── layouts/
│   └── MainLayout.astro   (termasuk meta tag SEO global)
├── lib/
│   └── supabase.ts        (init Supabase client)
└── styles/
    └── global.css
supabase/
└── migrations/            (SQL schema & RLS policy)
```

## 10. URUTAN PENGERJAAN (KERJAKAN BERTAHAP, JANGAN LOMPAT TAHAP)
1. Setup project Astro + Tailwind + koneksi Supabase, terapkan design system
   (warna, font) di tailwind.config
2. Buat migration SQL untuk semua tabel + RLS policy di Supabase
3. Bangun Landing Page (index.astro) section demi section sesuai urutan di
   poin 5, pakai data dummy dulu jika data Supabase belum ada
3.a Hubungkan section Tipe Rumah, Promosi, Artikel ke data asli dari Supabase
4. Bangun halaman detail artikel (/artikel/[slug])
5. Bangun Floating WhatsApp Button & AI Chatbot Widget
6. Bangun halaman Admin (login → dashboard → CRUD promosi → CRUD artikel →
   CRUD tipe rumah → data leads)
7. Terapkan SEO (meta tag, sitemap, robots.txt, structured data)
8. Uji responsivitas di mobile/tablet/desktop, dan uji RLS (pastikan
   pengunjung umum tidak bisa mengakses data yang seharusnya terlindungi)

## 11. DEFINITION OF DONE
- Semua section landing page tampil dan terhubung ke data Supabase (bukan
  hardcode statis)
- Admin bisa login dan melakukan CRUD penuh untuk promosi, artikel, tipe rumah
- Form kontak berhasil menyimpan data ke tabel leads dan muncul di halaman
  admin
- Warna, font, dan gaya komponen konsisten dengan design system di poin 3
- Meta tag SEO, sitemap, dan robots.txt sudah aktif
- Tidak ada data sensitif (leads, draft artikel) yang bisa diakses tanpa login

Mohon konfirmasi rencana struktur project terlebih dahulu sebelum mulai
generate kode, lalu kerjakan tahap 1 (setup project & migration database).
```

---

### Catatan
- Prompt ini sengaja ditutup dengan instruksi "konfirmasi dulu sebelum generate kode" karena Antigravity adalah agent yang bisa mengeksekusi banyak langkah sekaligus — meminta konfirmasi rencana di awal membantu memastikan struktur project sesuai sebelum agent lanjut menulis banyak file.
- Jika skill di `.antigravity/skill` Anda sudah mengatur konvensi tertentu (misalnya struktur folder atau format commit), boleh sebutkan di awal prompt: *"Ikuti juga konvensi pada skill project yang sudah tersedia."* — agent Antigravity akan menggabungkannya dengan skill yang sudah dikenali.
- Tahapan di poin 10 bisa dijadikan checklist terpisah bila Anda ingin memantau progres per tahap.