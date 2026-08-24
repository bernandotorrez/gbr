# Roadmap & Task List: Grand Bedahan Residence (GBR)

Dokumen ini melacak status pengerjaan fitur dan sistem untuk website Grand Bedahan Residence sesuai dengan spesifikasi [docs/PRD.md](PRD.md).

---

## 📊 Status Ringkas Pengerjaan

| Fase | Deskripsi | Status |
| :--- | :--- | :--- |
| **Fase 1** | Frontend MVP & Landing Page UI/UX | ✅ **Selesai (100%)** |
| **Fase 2** | Backend & Database Supabase (Migration + RLS) | ⏳ **Belum Dikerjakan** |
| **Fase 3** | AI Chatbot Integration (LLM Knowledge Base) | ⏳ **Belum Dikerjakan** |
| **Fase 4** | Dashboard Admin Panel (CRUD Content & Leads) | ⏳ **Belum Dikerjakan** |
| **Fase 5** | SEO Teknis, Schema Data, & Deployment | ⏳ **Belum Dikerjakan** |

---

## ✅ FASE 1: Frontend MVP & UI/UX (Selesai)

### 1.1. Pondasi & Desain Sistem
- [x] Inisialisasi proyek Astro v5 + Tailwind CSS v4 + React Islands.
- [x] Konfigurasi warna identitas brand: **Hijau Emerald (`#047857`)** dan **Off-White Warm (`#FAF9F6`)**.
- [x] Integrasi tipografi: **Cormorant Garamond** (Heading editorial) & **Manrope** (Body).
- [x] Integrasi paket ikon standar **`lucide-react`** di seluruh komponen.
- [x] Pemasangan lengkap asset Favicon dan Web Manifest di `public/` & `MainLayout.astro`.

### 1.2. Landing Page (`/`) - Pixel-Perfect Sesuai Referensi Desain
- [x] **Sticky Navbar (Forest Green `#0B2E24`):** Brand logo gold leaf, 9 menu tautan (`Beranda`, `Tentang Kami`, `Rumah`, `Fasilitas`, `Promo`, `Kabar`, `Testimoni`, `FAQ`, `Kontak`), dan CTA Button Sand Gold (*Hubungi Kami*).
- [x] **Hero Section (Full-Bleed Dusk Atmosphere):** Headline editorial serif *("Hunian Asri & Nyaman di Pusat Kota Bedahan")*, Glass Pill Badge *("HUNIAN NYAMAN, INVESTASI AMAN")*, CTA Button *Lihat Rumah* & *Hubungi Kami*.
- [x] **Tipe Rumah Section:** Header dengan top tag *PILIHAN TERBAIK UNTUK ANDA*, grid 3 unit (*Tipe 36/60*, *Tipe 45/72*, *Tipe 70/84*), badge pill top-right foto, spesifikasi 1 baris (KT, KM, Carport), tombol full-width *Lihat Detail*, dan pagination dots.
- [x] **Lokasi & Fasilitas Section:** Top tag *LOKASI STRATEGIS*, 4 kartu akses ikonik (5 Menit Stasiun Citayam, 10 Menit Pusat Belanja, 10 Menit Faskes, 15 Menit Pendidikan), tombol *Lihat Rute di Peta*, dan container peta interaktif dengan pin point Grand Bedahan Residence.
- [x] **Tur Virtual 360 Section:** Banner landscape arsitektur mewah dengan badge ikonik `360°` beranimasi, headline *Melihat Lebih Dekat*, tombol *Tonton Virtual Tour* yang memutar native HTML5 video langsung dari **Supabase Storage Bucket**.
- [x] **Promo & Kabar Terbaru Section:** Header *PROMO & BERITA TERKINI*, 2 kartu horizontal berdampingan (Promo DP 0% dengan badge warm sand & Kabar Progres Pembangunan dengan badge emerald).
- [x] **Testimoni Section:** Header *TESTIMONI*, 3 kartu ulasan penghuni dengan 5 bintang emas dan profil pembeli/investor.
- [x] **FAQ Section (2 Kolom):** Kolom kiri foto interior ruang keluarga mewah + kolom kanan 5 akordion interaktif (Legalitas SHM, Cara Pembayaran, KPR, Biaya Tambahan, Booking Unit).
- [x] **Kontak Section:** Kolom kiri informasi kontak resmi dengan 3 ikon melingkar (Lokasi, WhatsApp `0812-1577-6218`, Jam Layanan) + kolom kanan form *Tinggalkan Pesan* dengan tombol submit hijau.
- [x] **Footer (Forest Green `#0B281F`):** 4 Kolom terstruktur (Brand & Sosmed SVGs, Navigasi, Tipe Rumah, Hubungi Kami) dan bottom copyright bar.

### 1.3. Floating Action Buttons
- [x] **Floating WhatsApp Button:** Tombol melayang di pojok kanan bawah terhubung langsung ke `https://wa.me/6281215776218`.
- [x] **AI Chatbot Widget:** Tombol melayang di sebelah kiri tombol WhatsApp dengan jendela percakapan interaktif (*React Island*).

### 1.4. Halaman Khusus & Detail
- [x] **Halaman Detail Tipe Rumah (`/tipe-rumah/[slug]`):**
  - `/tipe-rumah/tipe-emerald-36-72`
  - `/tipe-rumah/tipe-sapphire-45-90`
  - `/tipe-rumah/tipe-diamond-60-120`
  - *Fitur:* Galeri foto interaktif (*React Island*), ringkasan spesifikasi, denah arsitektur 2D, tabel rincian material teknis, sticky booking WhatsApp card, dan rekomendasi tipe rumah lainnya.
- [x] **Halaman Detail Artikel (`/artikel/[slug]`):** Halaman baca artikel statis dengan format typography artikel dan navigasi kembali.
- [x] **Halaman Index Artikel (`/artikel`):** Halaman listing katalog seluruh artikel properti.

---

## ⏳ FASE 2: Backend & Database Supabase (Pending)

- [ ] **Setup Client & Environment:**
  - [ ] Install `@supabase/supabase-js`.
  - [ ] Setup file koneksi `src/lib/supabase.ts`.
  - [ ] Konfigurasi `.env` (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- [ ] **Migration SQL Database (`supabase/migrations/`):**
  - [ ] Tabel `tipe_rumah` (`id`, `nama_tipe`, `slug`, `ukuran_tanah`, `ukuran_bangunan`, `jumlah_kamar_tidur`, `jumlah_kamar_mandi`, `harga`, `deskripsi`, `foto_url`, `galeri`, `denah_url`, `urutan_tampil`, `created_at`).
  - [ ] Tabel `promosi` (`id`, `judul`, `deskripsi`, `gambar_url`, `tanggal_mulai`, `tanggal_selesai`, `status: aktif/nonaktif`, `created_at`).
  - [ ] Tabel `artikel` (`id`, `judul`, `slug`, `isi_konten`, `gambar_utama_url`, `kata_kunci_seo`, `status: draft/publish`, `tanggal_publish`, `created_at`).
  - [ ] Tabel `leads` (`id`, `nama`, `no_hp`, `tipe_rumah_diminati`, `pesan`, `created_at`).
- [ ] **Row Level Security (RLS) Policies:**
  - [ ] Anon/Public: `SELECT` hanya untuk data bertanda aktif/publish.
  - [ ] Anon/Public: `INSERT` ke tabel `leads` (tanpa izin baca/ubah/hapus).
  - [ ] Authenticated Admin: Full `CRUD` pada semua tabel.
- [ ] **Integrasi Data Live ke Frontend:**
  - [ ] Hubungkan `ContactForm.tsx` untuk menyimpan data langsung ke tabel `leads`.
  - [ ] Pengambilan data live untuk tipe rumah, promo, dan artikel dari Supabase.

---

## ⏳ FASE 3: AI Chatbot Integration (Pending)

- [ ] **Backend Chat API Endpoint:**
  - [ ] Endpoint `/api/chat` di Astro (SSR/Hybrid endpoint).
  - [ ] Integrasi SDK LLM (DeepSeek V3 / OpenAI).
- [ ] **Knowledge Base Prompting:**
  - [ ] System prompt resmi Grand Bedahan Residence (lokasi di Sawangan Depok, keunggulan bebas banjir, tipe unit, kisaran harga, fasilitas, skema KPR).
  - [ ] Fallback handling otomatis untuk mengarahkan ke WhatsApp **`0812-1577-6218`**.
- [ ] **Monitoring & Rate Limiting:**
  - [ ] Proteksi abuse / rate limit per IP.
  - [ ] Pencatatan counter penggunaan (kuota awal 1.000 chat).

---

## ⏳ FASE 4: Dashboard Admin Panel (Pending)

- [ ] **Autentikasi Admin:**
  - [ ] Halaman Login Admin (`/admin/login`) menggunakan Supabase Auth.
  - [ ] Middleware Auth Guard untuk memproteksi seluruh rute `/admin/*`.
- [ ] **Menu Manajemen Konten (CMS):**
  - [ ] Dashboard Utama (`/admin`): Statistik ringkas total leads masuk, tipe unit, promo aktif.
  - [ ] Manajemen Tipe Rumah (`/admin/tipe-rumah`): Form tambah/edit/hapus tipe rumah & upload foto ke Supabase Storage.
  - [ ] Manajemen Promosi (`/admin/promosi`): Form tambah/edit promo, tanggal berlaku, dan toggle aktif/nonaktif.
  - [ ] Manajemen Artikel (`/admin/artikel`): Markdown / Rich Text editor untuk posting berita dan tips properti.
  - [ ] Manajemen Leads (`/admin/leads`): Tabel data calon pembeli masuk, filter tanggal, dan tombol cepat *Chat via WhatsApp*.

---

## ⏳ FASE 5: SEO Teknis, Schema Data, & Deployment (Pending)

- [ ] **SEO On-Page & Metadata:**
  - [ ] Open Graph & Twitter Card tags di setiap halaman.
  - [ ] Canonical URLs & Meta Description unik per tipe rumah dan artikel.
- [ ] **Search Engine Indexing:**
  - [ ] Setup `sitemap.xml` dinamis & `robots.txt`.
  - [ ] Structured Data JSON-LD (`Schema.org/RealEstateListing` & `Schema.org/SingleFamilyResidence`).
- [ ] **Produksi & Deployment:**
  - [ ] Konfigurasi deployment adapter (Cloudflare Pages / Vercel).
  - [ ] Audit performa Google Lighthouse (Target skor: 90+).
