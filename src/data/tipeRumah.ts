export interface TipeRumah {
  id: number;
  slug: string;
  nama_tipe: string;
  tagline: string;
  ukuran_tanah: number;
  ukuran_bangunan: number;
  jumlah_kamar_tidur: number;
  jumlah_kamar_mandi: number;
  jumlah_carport: number;
  jumlah_lantai: number;
  daya_listrik: string;
  sumber_air: string;
  harga: number;
  cicilan_mulai: string;
  deskripsi: string;
  deskripsi_lengkap: string[];
  foto_url: string;
  galeri: string[];
  denah_url: string;
  fitur: string[];
  spesifikasi: {
    pondasi: string;
    dinding: string;
    struktur: string;
    lantai: string;
    atap: string;
    kusen_pintu: string;
    sanitair: string;
    listrik_air: string;
  };
}

export const daftarTipeRumah: TipeRumah[] = [
  {
    id: 1,
    slug: 'tipe-36-72',
    nama_tipe: 'Tipe 36/72',
    tagline: 'Hunian Modern Kompak & Efisien untuk Keluarga Muda',
    ukuran_tanah: 72,
    ukuran_bangunan: 36,
    jumlah_kamar_tidur: 2,
    jumlah_kamar_mandi: 1,
    jumlah_carport: 1,
    jumlah_lantai: 1,
    daya_listrik: '1.300 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 544000000,
    cicilan_mulai: 'Rp 3,4 Juta / bulan',
    deskripsi: 'Desain minimalis modern cocok untuk keluarga muda dengan 2 kamar tidur, 1 kamar mandi, luas tanah 72 m², dan carport 1 mobil.',
    deskripsi_lengkap: [
      'Tipe 36/72 dirancang khusus untuk memenuhi kebutuhan pasangan muda atau keluarga baru yang mendambakan kepemilikan rumah pertama yang nyaman, fungsional, dan bernilai investasi tinggi.',
      'Memiliki konsep open-space pada ruang tamu dan ruang keluarga yang menyatu dengan area makan, menciptakan kesan lapang dan sirkulasi udara yang sejuk.',
      'Dilengkapi dengan sisa lahan di bagian belakang seluas 18 m² yang dapat dimanfaatkan sebagai taman hijau pribadi, area cuci jemur, atau pengembangan ruang tambahan di masa depan.'
    ],
    foto_url: 'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
    galeri: [
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp'
    ],
    denah_url: 'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp',
    fitur: [
      'Luas Tanah 72 m²',
      '2 Kamar Tidur & 1 Kamar Mandi',
      'Carport 1 Mobil',
      'High Ceiling (Tinggi Plafon 3.8 Meter)',
      'Cross Ventilation System (Hemat Energi)',
      'One Gate System & Keamanan 24 Jam'
    ],
    spesifikasi: {
      pondasi: 'Batu Kali & Beton Bertulang',
      dinding: 'Bata Ringan (Hebel) diplester, aci, dan finishing cat Jotun / setara',
      struktur: 'Beton Bertulang Standard SNI',
      lantai: 'Granite Tile 60x60 cm',
      atap: 'Rangka Baja Ringan dengan Genteng Beton Flat',
      kusen_pintu: 'Kusen Aluminium Powder Coating, Pintu Utama Solid Wood Engineering',
      sanitair: 'Kloset Duduk Toto/American Standard + Shower Set',
      listrik_air: 'PLN 1.300 Watt, Sumur Bor Jetpump + Toren Air 500L'
    }
  },
  {
    id: 2,
    slug: 'tipe-45-72',
    nama_tipe: 'Tipe 45/72',
    tagline: 'Ruang Lebih Lega & Fungsional untuk Kenyamanan Keluarga Berkembang',
    ukuran_tanah: 72,
    ukuran_bangunan: 45,
    jumlah_kamar_tidur: 2,
    jumlah_kamar_mandi: 1,
    jumlah_carport: 1,
    jumlah_lantai: 1,
    daya_listrik: '2.200 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 613000000,
    cicilan_mulai: 'Rp 3,8 Juta / bulan',
    deskripsi: 'Bangunan lebih luas 45 m² di atas tanah 72 m² dengan 2 kamar tidur nyaman, 1 kamar mandi, dan carport 1 mobil.',
    deskripsi_lengkap: [
      'Tipe 45/72 memberikan kenyamanan superior dengan konfigurasi 2 kamar tidur yang lebih lapang, ideal untuk keluarga yang menginginkan ruang gerak optimal di dalam rumah.',
      'Luas bangunan 45 m² di atas lahan 72 m² menghadirkan keseimbangan sempurna antara area keluarga, ruang tamu, dapur, serta carport mobil yang leluasa.',
      'Tata letak kamar tidur dirancang menjaga privasi setiap anggota keluarga, dilengkapi bukaan jendela besar di setiap ruangan untuk pencahayaan alami yang menyehatkan.'
    ],
    foto_url: 'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
    galeri: [
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/thumbnail_rumah.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denh_type_36.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp',
      'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/detail_interior.webp'
    ],
    denah_url: 'https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/image/denah_type_45.webp',
    fitur: [
      'Luas Bangunan 45 m² Lebih Lapang',
      'Luas Tanah 72 m²',
      '2 Kamar Tidur & 1 Kamar Mandi',
      'Carport 1 Mobil',
      'Plafon Tinggi 4 Meter (Sejuk Alami)',
      'Smart Home Ready & CCTV Kawasan'
    ],
    spesifikasi: {
      pondasi: 'Batu Kali & Footplate Beton Bertulang',
      dinding: 'Bata Merah / Hebel diplester & diaci, cat Weatherbond',
      struktur: 'Beton Bertulang Standard SNI K-225',
      lantai: 'Homogeneous Tile 60x60 cm Motif Marmer',
      atap: 'Rangka Baja Ringan Zincalume, Genteng Keramik Glazur',
      kusen_pintu: 'Aluminium Alexindo 4 inch, Daun Pintu Panel Kayu Kamper',
      sanitair: 'Kloset Duduk Eco-Washer Toto + Hand Shower & Wastafel',
      listrik_air: 'PLN 2.200 Watt, Sumur Bor 30m + Pompa Jetpump + Toren Air 650L'
    }
  }
];

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};
