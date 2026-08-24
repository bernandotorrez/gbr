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
    slug: 'tipe-emerald-36-72',
    nama_tipe: 'Tipe Emerald (36/72)',
    tagline: 'Hunian Modern Kompak & Efisien untuk Keluarga Muda',
    ukuran_tanah: 72,
    ukuran_bangunan: 36,
    jumlah_kamar_tidur: 2,
    jumlah_kamar_mandi: 1,
    jumlah_carport: 1,
    jumlah_lantai: 1,
    daya_listrik: '1.300 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 450000000,
    cicilan_mulai: 'Rp 2,8 Juta / bulan',
    deskripsi: 'Desain minimalis modern cocok untuk keluarga muda dengan tata ruang efisien dan pencahayaan alami maksimal.',
    deskripsi_lengkap: [
      'Tipe Emerald (36/72) dirancang khusus untuk memenuhi kebutuhan pasangan muda atau keluarga baru yang mendambakan kepemilikan rumah pertama yang nyaman, fungsional, dan bernilai investasi tinggi.',
      'Memiliki konsep open-space pada ruang tamu dan ruang keluarga yang menyatu dengan area makan, menciptakan kesan lapang dan sirkulasi udara yang sejuk.',
      'Dilengkapi dengan sisa lahan di bagian belakang seluas 18 m² yang dapat dimanfaatkan sebagai taman hijau pribadi, area cuci jemur, atau pengembangan ruang tambahan di masa depan.'
    ],
    foto_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    galeri: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    denah_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    fitur: [
      'High Ceiling (Tinggi Plafon 3.8 Meter)',
      'Cross Ventilation System (Hemat Energi)',
      'Taman Depan & Belakang Terbuka',
      'Carport 1 Mobil + 1 Motor',
      'Smart Door Lock Digital',
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
    slug: 'tipe-sapphire-45-90',
    nama_tipe: 'Tipe Sapphire (45/90)',
    tagline: 'Ruang Lebih Lega dengan Halaman Luas untuk Keluarga Berkembang',
    ukuran_tanah: 90,
    ukuran_bangunan: 45,
    jumlah_kamar_tidur: 3,
    jumlah_kamar_mandi: 1,
    jumlah_carport: 1,
    jumlah_lantai: 1,
    daya_listrik: '2.200 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 600000000,
    cicilan_mulai: 'Rp 3,7 Juta / bulan',
    deskripsi: 'Ruang ekstra dengan 3 kamar tidur dan taman belakang luas untuk keluarga yang sedang tumbuh dinamis.',
    deskripsi_lengkap: [
      'Tipe Sapphire (45/90) memberikan kenyamanan superior dengan konfigurasi 3 kamar tidur yang ideal untuk keluarga dengan 2 anak atau kebutuhan ruang kerja/studio pribadi di rumah.',
      'Luas tanah 90 m² memberikan fleksibilitas luar biasa bagi Anda yang menyukai taman asri atau berencana melakukan renovasi bertahap di masa mendatang.',
      'Tata letak kamar tidur dirancang menjaga privasi setiap anggota keluarga, dilengkapi bukaan jendela besar di setiap ruangan untuk pencahayaan alami yang menyehatkan.'
    ],
    foto_url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    galeri: [
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    denah_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    fitur: [
      '3 Kamar Tidur Nyaman',
      'Halaman Belakang Luas (Bisa untuk Kolam/Gazebo)',
      'Plafon Tinggi 4 Meter (Sejuk Alami)',
      'Carport Luas & Kanopi Elegan',
      'Instalasi AC di Setiap Kamar',
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
  },
  {
    id: 3,
    slug: 'tipe-diamond-60-120',
    nama_tipe: 'Tipe Diamond (60/120)',
    tagline: 'Kemewahan Eksklusif dengan Carport Ganda & Fasad Kontemporer',
    ukuran_tanah: 120,
    ukuran_bangunan: 60,
    jumlah_kamar_tidur: 3,
    jumlah_kamar_mandi: 2,
    jumlah_carport: 2,
    jumlah_lantai: 1,
    daya_listrik: '3.500 VA',
    sumber_air: 'Sumur Bor + Pompa Listrik',
    harga: 850000000,
    cicilan_mulai: 'Rp 5,2 Juta / bulan',
    deskripsi: 'Hunian premium dengan carport 2 mobil, master bedroom dengan kamar mandi dalam, dan aksen fasad batu alam mewah.',
    deskripsi_lengkap: [
      'Tipe Diamond (60/120) merupakan tipe termewah dan paling eksklusif di Grand Bedahan Residence, menghadirkan standar gaya hidup elegan berkelas bagi keluarga mapan.',
      'Dilengkapi dengan Carport Ganda yang sanggup menampung 2 mobil keluarga berdampingan, serta fasad modern dengan perpaduan aksen kayu dan batu alam alami.',
      'Master bedroom luas dilengkapi dengan kamar mandi en-suite (kamar mandi dalam), memberikan privasi dan kemewahan maksimal layaknya hotel bintang lima setiap hari.'
    ],
    foto_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    galeri: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    denah_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    fitur: [
      'Carport 2 Mobil Berdampingan',
      'Master Bedroom dengan Kamar Mandi Dalam',
      'Desain Fasad Mewah & Aksen Batu Alam',
      'Taman Depan, Samping, dan Belakang',
      'Smart Home Gateway + Smart Door Lock + CCTV',
      'Kawasan Paling Depan Dekat Gate Utama'
    ],
    spesifikasi: {
      pondasi: 'Batu Kali & Tiang Pancang Mini Pile / Footplate',
      dinding: 'Bata Merah Jumbo Finishing Plester Aci & Cat Dulux Weathershield',
      struktur: 'Beton Bertulang Standard SNI K-250',
      lantai: 'Granite Tile Premium 80x80 cm Glazed Polished',
      atap: 'Rangka Baja Ringan Bluescope, Genteng Keramik Kanmuri Full Flat',
      kusen_pintu: 'Kusen Aluminium YKK Finishing Anodized, Pintu Solid Merbau Oven',
      sanitair: 'Kloset Duduk Toto Premium Eco Washer, Rain Shower Set, Wastafel Meja Marmer',
      listrik_air: 'PLN 3.500 Watt, Sumur Bor 40m + Pompa Otomatis Grundfos + Toren 1.000L'
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
