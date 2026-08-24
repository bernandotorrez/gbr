import { supabase, isSupabaseConfigured, type Database } from './supabase';
import { daftarTipeRumah, type TipeRumah } from '../data/tipeRumah';

export interface ArtikelItem {
  id: string | number;
  judul: string;
  slug: string;
  excerpt: string;
  isi_konten: string;
  gambar_utama_url: string;
  kata_kunci_seo?: string;
  tanggal_publish: string;
  kategori?: string;
}

export interface PromoBenefit {
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface PromosiItem {
  id: string | number;
  judul: string;
  sub_judul?: string;
  tagline_badge?: string;
  deskripsi: string;
  rincian_keuntungan?: PromoBenefit[];
  gambar_url: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status: 'aktif' | 'nonaktif';
  urutan_tampil?: number;
}

const defaultPromoBenefits: PromoBenefit[] = [
  {
    title: "Subsidi Cicilan KPR selama 2 TAHUN",
    desc: "Meringankan cicilan bulanan Anda (promo sebelumnya hanya 1 tahun).",
    highlight: true,
  },
  {
    title: "Free Exhaust Fan",
    desc: "Sirkulasi udara dapur & ruangan tetap bersih, nyaman, dan sejuk.",
    highlight: false,
  },
  {
    title: "Free Lampu Taman",
    desc: "Pencahayaan luar rumah yang asri, estetik, dan elegan.",
    highlight: false,
  },
  {
    title: "Free Mesin Air & Toren 500 Liter",
    desc: "Suplai air bersih siap pakai langsung dari hari pertama Anda menempati rumah.",
    highlight: false,
  },
  {
    title: "Free Instalasi AC di 2 Kamar Tidur",
    desc: "Jalur instalasi pipa & kelistrikan AC siap pasang tanpa perlu membobok dinding.",
    highlight: false,
  },
];

const fallbackPromosiList: PromosiItem[] = [
  {
    id: 1,
    judul: 'Promo Eksklusif Grand Bedahan',
    sub_judul: 'Paket Berkah Hunian Idaman',
    tagline_badge: 'PERIODE TERBATAS',
    deskripsi: 'Dapatkan paket penawaran terbatas dan berbagai bonus istimewa langsung saat Anda booking unit impian hari ini.',
    rincian_keuntungan: defaultPromoBenefits,
    gambar_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
    status: 'aktif'
  }
];

/**
 * Fetch all active house types (from Supabase if configured, or static fallback)
 */
export async function getTipeRumahList(): Promise<TipeRumah[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('tipe_rumah')
        .select('*')
        .eq('is_active', true)
        .order('urutan_tampil', { ascending: true });

      if (error) {
        console.warn('Error fetching house types from Supabase:', error);
      } else if (data) {
        return data.map((item, index) => {
          // Parse galeri
          let parsedGaleri: string[] = [];
          if (Array.isArray(item.galeri)) {
            parsedGaleri = item.galeri.filter((g: any) => typeof g === 'string' && g.trim());
          } else if (typeof item.galeri === 'string') {
            try {
              const parsed = JSON.parse(item.galeri);
              if (Array.isArray(parsed)) {
                parsedGaleri = parsed.filter((g: any) => typeof g === 'string' && g.trim());
              }
            } catch {
              if (item.galeri.trim()) parsedGaleri = [item.galeri.trim()];
            }
          }

          // Ensure foto_url is the first image in gallery if not already present
          const allPhotos = [...parsedGaleri];
          if (item.foto_url && !allPhotos.includes(item.foto_url)) {
            allPhotos.unshift(item.foto_url);
          }

          // Parse deskripsi_lengkap
          let parsedDeskripsiLengkap: string[] = [];
          if (Array.isArray(item.deskripsi_lengkap)) {
            parsedDeskripsiLengkap = item.deskripsi_lengkap.filter((d: any) => typeof d === 'string' && d.trim());
          } else if (typeof item.deskripsi_lengkap === 'string') {
            try {
              const parsed = JSON.parse(item.deskripsi_lengkap);
              if (Array.isArray(parsed)) parsedDeskripsiLengkap = parsed;
            } catch {
              if (item.deskripsi_lengkap.trim()) parsedDeskripsiLengkap = [item.deskripsi_lengkap.trim()];
            }
          }

          // Parse fitur
          let parsedFitur: string[] = [];
          if (Array.isArray(item.fitur)) {
            parsedFitur = item.fitur.filter((f: any) => typeof f === 'string' && f.trim());
          } else if (typeof item.fitur === 'string') {
            try {
              const parsed = JSON.parse(item.fitur);
              if (Array.isArray(parsed)) parsedFitur = parsed;
            } catch {
              if (item.fitur.trim()) {
                parsedFitur = item.fitur.split('\n').map((s: string) => s.trim()).filter(Boolean);
              }
            }
          }

          // Parse spesifikasi
          let parsedSpesifikasi: any = item.spesifikasi;
          if (typeof parsedSpesifikasi === 'string') {
            try {
              parsedSpesifikasi = JSON.parse(parsedSpesifikasi);
            } catch {}
          }
          if (!parsedSpesifikasi || typeof parsedSpesifikasi !== 'object') {
            parsedSpesifikasi = {};
          }

          return {
            id: index + 1,
            slug: item.slug,
            nama_tipe: item.nama_tipe,
            tagline: item.tagline || '',
            ukuran_tanah: Number(item.ukuran_tanah),
            ukuran_bangunan: Number(item.ukuran_bangunan),
            jumlah_kamar_tidur: item.jumlah_kamar_tidur,
            jumlah_kamar_mandi: item.jumlah_kamar_mandi,
            jumlah_carport: item.jumlah_carport,
            jumlah_lantai: item.jumlah_lantai,
            daya_listrik: item.daya_listrik || '1.300 VA',
            sumber_air: item.sumber_air || 'Sumur Bor + Pompa Listrik',
            harga: Number(item.harga),
            cicilan_mulai: item.cicilan_mulai || '',
            deskripsi: item.deskripsi,
            deskripsi_lengkap: parsedDeskripsiLengkap.length > 0 ? parsedDeskripsiLengkap : [item.deskripsi],
            foto_url: item.foto_url,
            galeri: allPhotos,
            denah_url: item.denah_url || '',
            fitur: parsedFitur,
            spesifikasi: parsedSpesifikasi
          };
        });
      }
    } catch (err) {
      console.warn('Fallback to static data for house types:', err);
    }
  }
  return daftarTipeRumah;
}

/**
 * Fetch a single house type by slug
 */
export async function getTipeRumahBySlug(slug: string): Promise<TipeRumah | null> {
  const list = await getTipeRumahList();
  return list.find((item) => item.slug === slug) || null;
}

/**
 * Fetch published articles
 */
export async function getPublishedArtikelList(): Promise<ArtikelItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .eq('status', 'publish')
        .order('tanggal_publish', { ascending: false });

      if (error) {
        console.warn('Error fetching articles from Supabase:', error);
      } else if (data) {
        return data.map((item) => ({
          id: item.id,
          judul: item.judul,
          slug: item.slug,
          excerpt: item.excerpt || '',
          isi_konten: item.isi_konten,
          gambar_utama_url: item.gambar_utama_url,
          kata_kunci_seo: item.kata_kunci_seo || '',
          tanggal_publish: item.tanggal_publish || item.created_at,
          kategori: 'Artikel Properti'
        }));
      }
    } catch (err) {
      console.warn('Fallback to static data for articles:', err);
    }
  }
  return fallbackArtikelList;
}

/**
 * Fetch article by slug
 */
export async function getArtikelBySlug(slug: string): Promise<ArtikelItem | null> {
  const list = await getPublishedArtikelList();
  return list.find((item) => item.slug === slug) || null;
}

/**
 * Fetch active promotions
 */
export async function getActivePromosiList(): Promise<PromosiItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('promosi')
        .select('*')
        .eq('status', 'aktif')
        .order('urutan_tampil', { ascending: true });

      if (error) {
        console.warn('Error fetching promotions from Supabase:', error);
      } else if (data) {
        return data.map((item) => {
          let parsedBenefits: PromoBenefit[] = [];
          if (Array.isArray(item.rincian_keuntungan) && item.rincian_keuntungan.length > 0) {
            parsedBenefits = item.rincian_keuntungan;
          } else if (typeof item.rincian_keuntungan === 'string') {
            try {
              const parsed = JSON.parse(item.rincian_keuntungan);
              if (Array.isArray(parsed) && parsed.length > 0) parsedBenefits = parsed;
            } catch {}
          }

          return {
            id: item.id,
            judul: item.judul,
            sub_judul: item.sub_judul || 'Paket Berkah Hunian Idaman',
            tagline_badge: item.tagline_badge || 'PERIODE TERBATAS',
            deskripsi: item.deskripsi,
            rincian_keuntungan: parsedBenefits.length > 0 ? parsedBenefits : defaultPromoBenefits,
            gambar_url: item.gambar_url,
            tanggal_mulai: item.tanggal_mulai || undefined,
            tanggal_selesai: item.tanggal_selesai || undefined,
            status: item.status,
            urutan_tampil: item.urutan_tampil
          };
        });
      }
    } catch (err) {
      console.warn('Fallback to static data for promotions:', err);
    }
  }
  return fallbackPromosiList;
}

import { sanitizeText, sanitizePhoneNumber, sanitizeEmail } from './sanitize';

/**
 * Submit contact lead into Supabase with strict input sanitization
 */
export async function submitLead(lead: {
  nama: string;
  no_hp: string;
  email?: string;
  tipe_rumah_diminati?: string;
  pesan: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // When Supabase keys are not set yet, simulate successful submission
    return { success: true };
  }

  // Deep sanitization against XSS & script injection
  const cleanNama = sanitizeText(lead.nama).slice(0, 100);
  const cleanNoHp = sanitizePhoneNumber(lead.no_hp).slice(0, 20);
  const cleanEmail = lead.email ? sanitizeEmail(lead.email) : null;
  const cleanTipe = lead.tipe_rumah_diminati ? sanitizeText(lead.tipe_rumah_diminati).slice(0, 80) : null;
  const cleanPesan = sanitizeText(lead.pesan).slice(0, 1000);

  if (cleanNama.length < 3) {
    return { success: false, error: 'Nama minimal 3 karakter' };
  }
  if (cleanNoHp.length < 10) {
    return { success: false, error: 'Nomor WhatsApp minimal 10 digit' };
  }
  if (cleanPesan.length < 5) {
    return { success: false, error: 'Pesan minimal 5 karakter' };
  }

  try {
    const { error } = await supabase.from('leads').insert([
      {
        nama: cleanNama,
        no_hp: cleanNoHp,
        email: cleanEmail,
        tipe_rumah_diminati: cleanTipe,
        pesan: cleanPesan
      }
    ]);

    if (error) {
      console.error('Error submitting lead to Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception submitting lead:', err);
    return { success: false, error: err.message || 'Gagal mengirim pesan' };
  }
}
