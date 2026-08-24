-- ============================================================================
-- Grand Bedahan Residence (GBR) — Initial Seed Data
-- Migration: 20260824000001_seed_data.sql
-- ============================================================================

-- 1. SEED: tipe_rumah
INSERT INTO public.tipe_rumah (
  nama_tipe,
  slug,
  tagline,
  ukuran_tanah,
  ukuran_bangunan,
  jumlah_kamar_tidur,
  jumlah_kamar_mandi,
  jumlah_carport,
  jumlah_lantai,
  daya_listrik,
  sumber_air,
  harga,
  cicilan_mulai,
  deskripsi,
  deskripsi_lengkap,
  foto_url,
  galeri,
  denah_url,
  fitur,
  spesifikasi,
  urutan_tampil,
  is_active
) VALUES 
(
  'Tipe 36/72',
  'tipe-36-72',
  'Hunian Modern Kompak & Efisien untuk Keluarga Muda',
  72,
  36,
  2,
  1,
  1,
  1,
  '1.300 VA',
  'Sumur Bor + Pompa Listrik',
  544000000,
  'Rp 3,4 Juta / bulan',
  'Desain minimalis modern cocok untuk keluarga muda dengan 2 kamar tidur, 1 kamar mandi, luas tanah 72 m², dan carport 1 mobil.',
  '[
    "Tipe 36/72 dirancang khusus untuk memenuhi kebutuhan pasangan muda atau keluarga baru yang mendambakan kepemilikan rumah pertama yang nyaman, fungsional, dan bernilai investasi tinggi.",
    "Memiliki konsep open-space pada ruang tamu dan ruang keluarga yang menyatu dengan area makan, menciptakan kesan lapang dan sirkulasi udara yang sejuk.",
    "Dilengkapi dengan sisa lahan di bagian belakang seluas 18 m² yang dapat dimanfaatkan sebagai taman hijau pribadi, area cuci jemur, atau pengembangan ruang tambahan di masa depan."
  ]'::jsonb,
  'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
  '[
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp",
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp",
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp"
  ]'::jsonb,
  'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp',
  '[
    "Luas Tanah 72 m²",
    "2 Kamar Tidur & 1 Kamar Mandi",
    "Carport 1 Mobil",
    "High Ceiling (Tinggi Plafon 3.8 Meter)",
    "Cross Ventilation System (Hemat Energi)",
    "One Gate System & Keamanan 24 Jam"
  ]'::jsonb,
  '{
    "pondasi": "Batu Kali & Beton Bertulang",
    "dinding": "Bata Ringan (Hebel) diplester, aci, dan finishing cat Jotun / setara",
    "struktur": "Beton Bertulang Standard SNI",
    "lantai": "Granite Tile 60x60 cm",
    "atap": "Rangka Baja Ringan dengan Genteng Beton Flat",
    "kusen_pintu": "Kusen Aluminium Powder Coating, Pintu Utama Solid Wood Engineering",
    "sanitair": "Kloset Duduk Toto/American Standard + Shower Set",
    "listrik_air": "PLN 1.300 Watt, Sumur Bor Jetpump + Toren Air 500L"
  }'::jsonb,
  1,
  true
),
(
  'Tipe 45/72',
  'tipe-45-72',
  'Ruang Lebih Lega & Fungsional untuk Kenyamanan Keluarga Berkembang',
  72,
  45,
  2,
  1,
  1,
  1,
  '2.200 VA',
  'Sumur Bor + Pompa Listrik',
  613000000,
  'Rp 3,8 Juta / bulan',
  'Bangunan lebih luas 45 m² di atas tanah 72 m² dengan 2 kamar tidur nyaman, 1 kamar mandi, dan carport 1 mobil.',
  '[
    "Tipe 45/72 memberikan kenyamanan superior dengan konfigurasi 2 kamar tidur yang lebih lapang, ideal untuk keluarga yang menginginkan ruang gerak optimal di dalam rumah.",
    "Luas bangunan 45 m² di atas lahan 72 m² menghadirkan keseimbangan sempurna antara area keluarga, ruang tamu, dapur, serta carport mobil yang leluasa.",
    "Tata letak kamar tidur dirancang menjaga privasi setiap anggota keluarga, dilengkapi bukaan jendela besar di setiap ruangan untuk pencahayaan alami yang menyehatkan."
  ]'::jsonb,
  'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
  '[
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp",
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp",
    "https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp"
  ]'::jsonb,
  'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denah_type_45.webp',
  '[
    "Luas Bangunan 45 m² Lebih Lapang",
    "Luas Tanah 72 m²",
    "2 Kamar Tidur & 1 Kamar Mandi",
    "Carport 1 Mobil",
    "Plafon Tinggi 4 Meter (Sejuk Alami)",
    "Smart Home Ready & CCTV Kawasan"
  ]'::jsonb,
  '{
    "pondasi": "Batu Kali & Footplate Beton Bertulang",
    "dinding": "Bata Merah / Hebel diplester & diaci, cat Weatherbond",
    "struktur": "Beton Bertulang Standard SNI K-225",
    "lantai": "Homogeneous Tile 60x60 cm Motif Marmer",
    "atap": "Rangka Baja Ringan Zincalume, Genteng Keramik Glazur",
    "kusen_pintu": "Aluminium Alexindo 4 inch, Daun Pintu Panel Kayu Kamper",
    "sanitair": "Kloset Duduk Eco-Washer Toto + Hand Shower & Wastafel",
    "listrik_air": "PLN 2.200 Watt, Sumur Bor 30m + Pompa Jetpump + Toren Air 650L"
  }'::jsonb,
  2,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED: promosi
INSERT INTO public.promosi (
  judul,
  deskripsi,
  gambar_url,
  tanggal_mulai,
  tanggal_selesai,
  status,
  urutan_tampil
) VALUES 
(
  'Promo Subsidi Cicilan KPR 2 Tahun',
  'Meringankan cicilan bulanan Anda selama 2 tahun pertama plus bonus toren air, mesin pompa, dan instalasi AC gratis.',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
  '2026-08-01',
  '2026-12-31',
  'aktif',
  1
)
ON CONFLICT DO NOTHING;

-- 3. SEED: artikel
INSERT INTO public.artikel (
  judul,
  slug,
  excerpt,
  isi_konten,
  gambar_utama_url,
  kata_kunci_seo,
  status,
  tanggal_publish
) VALUES 
(
  '5 Tips Memilih Rumah Pertama untuk Keluarga Muda',
  'tips-memilih-rumah-pertama',
  'Memilih rumah pertama bisa jadi tantangan tersendiri. Simak 5 hal penting yang harus Anda perhatikan sebelum membeli rumah idaman.',
  '<p>Membeli rumah pertama merupakan salah satu keputusan finansial terbesar dalam hidup seseorang, khususnya bagi pasangan atau keluarga muda. Banyak faktor yang perlu dipertimbangkan secara matang agar rumah yang dibeli tidak hanya menjadi tempat tinggal yang nyaman, tetapi juga aset investasi yang terus bertumbuh.</p><p>Berikut adalah 5 tips penting yang wajib Anda perhatikan sebelum memutuskan membeli rumah pertama:</p><h3>1. Tentukan Anggaran dan Skema Pembayaran yang Realistis</h3><p>Langkah awal yang paling krusial adalah menghitung kemampuan finansial secara objektif. Pastikan total cicilan KPR tidak melebihi 30-35% dari total penghasilan bulanan keluarga.</p><h3>2. Perhatikan Lokasi dan Aksesibilitas Transportasi</h3><p>Lokasi strategis dengan akses transportasi umum seperti stasiun KRL, halte TransJakarta, atau gerbang tol akan sangat menghemat waktu dan biaya perjalanan harian Anda.</p><h3>3. Periksa Legalitas Developer dan Sertifikat Tanah</h3><p>Pastikan sertifikat (SHM/HGB) dan IMB/PBG sudah berstatus pecah per kavling untuk menghindari sengketa di masa mendatang.</p><h3>4. Desain Rumah yang Memiliki Ruang Tumbuh</h3><p>Pilihlah rumah yang memiliki sisa tanah di bagian belakang atau tata ruang yang fleksibel untuk pengembangan di kemudian hari.</p><h3>5. Cek Fasilitas Lingkungan Sekitar</h3><p>Keberadaan fasilitas penunjang seperti sekolah, rumah sakit, dan pusat perbelanjaan terdekat akan sangat menunjang kenyamanan hidup jangka panjang.</p>',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
  'tips rumah pertama, panduan kpr, beli rumah depok',
  'publish',
  '2026-08-10 08:00:00+00'
),
(
  'Keuntungan Tinggal di Kawasan Bedahan Depok',
  'keuntungan-tinggal-di-bedahan-depok',
  'Bedahan semakin dilirik sebagai kawasan hunian favorit. Berikut adalah alasan mengapa investasi properti di Bedahan sangat menguntungkan.',
  '<p>Kecamatan Sawangan, khususnya kelurahan Bedahan, telah bertransformasi menjadi salah satu primadona properti di kawasan Kota Depok bagian barat. Kawasan ini menawarkan perpaduan ideal antara ketenangan suasana asri dengan kemudahan akses menuju pusat kota Jakarta dan Bogor.</p><p>Beberapa keunggulan utama tinggal di kawasan Bedahan antara lain:</p><ul><li><strong>Udara yang Relatif Bersih & Sejuk:</strong> Jauh dari polusi industri berat dengan banyak ruang terbuka hijau.</li><li><strong>Akses Tol Dekat:</strong> Tol Desari (Depok-Antasari) dan Tol Serpong-Cinere membuat mobilitas ke Jakarta Selatan semakin cepat.</li><li><strong>Fasilitas Lengkap:</strong> Dikelilingi pusat perbelanjaan modern seperti The Park Sawangan, mall, dan berbagai rumah sakit terkemuka.</li></ul>',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
  'keuntungan bedahan depok, perumahan sawangan, investasi properti depok',
  'publish',
  '2026-08-15 10:30:00+00'
),
(
  'Inspirasi Desain Interior Minimalis Modern',
  'inspirasi-desain-interior-minimalis',
  'Maksimalkan ruang di rumah Anda dengan gaya interior minimalis modern. Cantik, fungsional, dan mudah perawatannya.',
  '<p>Desain interior minimalis modern telah menjadi standar gaya hidup kekinian. Konsep ini tidak hanya menawarkan estetika yang rapi dan elegan, tetapi juga mengedepankan efisiensi fungsi di setiap sudut ruangan.</p><p>Penerapan konsep open-space, pemilihan palet warna netral, dan pencahayaan alami melalui bukaan jendela besar akan membuat rumah tipe 36 atau 45 terasa jauh lebih lega dan sejuk.</p>',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  'desain interior minimalis, dekorasi rumah compact, interior modern',
  'publish',
  '2026-08-20 09:15:00+00'
)
ON CONFLICT (slug) DO NOTHING;
