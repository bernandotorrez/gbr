import { createClient } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      tipe_rumah: {
        Row: {
          id: string;
          nama_tipe: string;
          slug: string;
          tagline: string | null;
          ukuran_tanah: number;
          ukuran_bangunan: number;
          jumlah_kamar_tidur: number;
          jumlah_kamar_mandi: number;
          jumlah_carport: number;
          jumlah_lantai: number;
          daya_listrik: string | null;
          sumber_air: string | null;
          harga: number;
          cicilan_mulai: string | null;
          deskripsi: string;
          deskripsi_lengkap: string[] | null;
          foto_url: string;
          galeri: string[] | null;
          denah_url: string | null;
          fitur: string[] | null;
          spesifikasi: Record<string, string> | null;
          urutan_tampil: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tipe_rumah']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tipe_rumah']['Insert']>;
      };
      promosi: {
        Row: {
          id: string;
          judul: string;
          deskripsi: string;
          gambar_url: string;
          tanggal_mulai: string | null;
          tanggal_selesai: string | null;
          status: 'aktif' | 'nonaktif';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['promosi']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['promosi']['Insert']>;
      };
      artikel: {
        Row: {
          id: string;
          judul: string;
          slug: string;
          excerpt: string | null;
          isi_konten: string;
          gambar_utama_url: string;
          kata_kunci_seo: string | null;
          status: 'draft' | 'publish';
          tanggal_publish: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artikel']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['artikel']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          nama: string;
          no_hp: string;
          email: string | null;
          tipe_rumah_diminati: string | null;
          pesan: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          device_type: 'mobile' | 'desktop' | 'tablet';
          browser: string | null;
          event_type: 'pageview' | 'whatsapp_click' | 'kpr_simulasi' | 'maps_click' | 'lead_form';
          event_data: Record<string, any> | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_views']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['page_views']['Insert']>;
      };
    };
  };
}

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://xlbxjeieoznucclltjco.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
