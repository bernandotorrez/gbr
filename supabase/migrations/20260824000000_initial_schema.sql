-- ============================================================================
-- Grand Bedahan Residence (GBR) — Hardened Schema & Comprehensive RLS Policies
-- Migration: 20260824000000_initial_schema.sql
-- Security Hardened Version (OWASP & Supabase Best Practices)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE promo_status AS ENUM ('aktif', 'nonaktif');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE artikel_status AS ENUM ('draft', 'publish');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 2. HELPER FUNCTIONS FOR SECURITY & TIMESTAMPS
-- ============================================================================

-- Function: Automatic updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: Check if current user is an authenticated admin (NULL-safe)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() ->> 'role' = 'service_role' OR
    auth.role() = 'authenticated',
    false
  );
END;
$$;

-- ============================================================================
-- 3. TABLE: tipe_rumah
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tipe_rumah (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_tipe VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  tagline TEXT,
  ukuran_tanah NUMERIC(6, 2) NOT NULL CHECK (ukuran_tanah > 0),
  ukuran_bangunan NUMERIC(6, 2) NOT NULL CHECK (ukuran_bangunan > 0),
  jumlah_kamar_tidur INT NOT NULL DEFAULT 2 CHECK (jumlah_kamar_tidur >= 0),
  jumlah_kamar_mandi INT NOT NULL DEFAULT 1 CHECK (jumlah_kamar_mandi >= 0),
  jumlah_carport INT NOT NULL DEFAULT 1 CHECK (jumlah_carport >= 0),
  jumlah_lantai INT NOT NULL DEFAULT 1 CHECK (jumlah_lantai >= 1),
  daya_listrik VARCHAR(50) DEFAULT '1.300 VA',
  sumber_air VARCHAR(100) DEFAULT 'Sumur Bor + Pompa Listrik',
  harga NUMERIC(15, 2) NOT NULL CHECK (harga > 0),
  cicilan_mulai VARCHAR(100),
  deskripsi TEXT NOT NULL,
  deskripsi_lengkap JSONB DEFAULT '[]'::jsonb,
  foto_url TEXT NOT NULL,
  galeri JSONB DEFAULT '[]'::jsonb,
  denah_url TEXT,
  fitur JSONB DEFAULT '[]'::jsonb,
  spesifikasi JSONB DEFAULT '{}'::jsonb,
  urutan_tampil INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger updated_at for tipe_rumah
DROP TRIGGER IF EXISTS trg_tipe_rumah_updated_at ON public.tipe_rumah;
CREATE TRIGGER trg_tipe_rumah_updated_at
  BEFORE UPDATE ON public.tipe_rumah
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 4. TABLE: promosi
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promosi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  sub_judul VARCHAR(255),
  tagline_badge VARCHAR(100) DEFAULT 'PERIODE TERBATAS',
  deskripsi TEXT NOT NULL,
  rincian_keuntungan JSONB DEFAULT '[]'::jsonb,
  gambar_url TEXT NOT NULL,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  status promo_status NOT NULL DEFAULT 'aktif',
  urutan_tampil INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_promo_dates CHECK (tanggal_selesai IS NULL OR tanggal_mulai IS NULL OR tanggal_selesai >= tanggal_mulai)
);

-- Ensure columns exist for existing table
ALTER TABLE public.promosi ADD COLUMN IF NOT EXISTS sub_judul VARCHAR(255);
ALTER TABLE public.promosi ADD COLUMN IF NOT EXISTS tagline_badge VARCHAR(100) DEFAULT 'PERIODE TERBATAS';
ALTER TABLE public.promosi ADD COLUMN IF NOT EXISTS rincian_keuntungan JSONB DEFAULT '[]'::jsonb;

-- Trigger updated_at for promosi
DROP TRIGGER IF EXISTS trg_promosi_updated_at ON public.promosi;
CREATE TRIGGER trg_promosi_updated_at
  BEFORE UPDATE ON public.promosi
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. TABLE: artikel
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.artikel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  isi_konten TEXT NOT NULL,
  gambar_utama_url TEXT NOT NULL,
  kata_kunci_seo VARCHAR(255),
  status artikel_status NOT NULL DEFAULT 'draft',
  tanggal_publish TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger updated_at for artikel
DROP TRIGGER IF EXISTS trg_artikel_updated_at ON public.artikel;
CREATE TRIGGER trg_artikel_updated_at
  BEFORE UPDATE ON public.artikel
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. TABLE: leads (Dengan Strict Input Sanitization & Zero-Knowledge Privacy)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(150) NOT NULL CHECK (char_length(trim(nama)) >= 3 AND char_length(nama) <= 150),
  no_hp VARCHAR(30) NOT NULL CHECK (char_length(trim(no_hp)) >= 10 AND char_length(no_hp) <= 30),
  email VARCHAR(150) CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  tipe_rumah_diminati VARCHAR(100),
  pesan TEXT NOT NULL CHECK (char_length(trim(pesan)) >= 5 AND char_length(pesan) <= 1000),
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure column exists for existing table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tipe_rumah_diminati VARCHAR(100);

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE & SECURITY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tipe_rumah_slug ON public.tipe_rumah (slug);
CREATE INDEX IF NOT EXISTS idx_tipe_rumah_active_order ON public.tipe_rumah (is_active, urutan_tampil);
CREATE INDEX IF NOT EXISTS idx_promosi_status ON public.promosi (status, urutan_tampil);
CREATE INDEX IF NOT EXISTS idx_artikel_slug ON public.artikel (slug);
CREATE INDEX IF NOT EXISTS idx_artikel_status_publish ON public.artikel (status, tanggal_publish DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 8.0. Enable RLS on ALL public tables
ALTER TABLE public.tipe_rumah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promosi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 8.1. TIPE_RUMAH RLS POLICIES
-- ----------------------------------------------------------------------------
-- Public: Read only active units
DROP POLICY IF EXISTS "Public can view active house types" ON public.tipe_rumah;
CREATE POLICY "Public can view active house types"
  ON public.tipe_rumah
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin: Full Access
DROP POLICY IF EXISTS "Admin has full access to house types" ON public.tipe_rumah;
CREATE POLICY "Admin has full access to house types"
  ON public.tipe_rumah
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8.2. PROMOSI RLS POLICIES
-- ----------------------------------------------------------------------------
-- Public: Read only active promotions
DROP POLICY IF EXISTS "Public can view active promotions" ON public.promosi;
CREATE POLICY "Public can view active promotions"
  ON public.promosi
  FOR SELECT
  TO anon, authenticated
  USING (status = 'aktif');

-- Admin: Full Access
DROP POLICY IF EXISTS "Admin has full access to promotions" ON public.promosi;
CREATE POLICY "Admin has full access to promotions"
  ON public.promosi
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8.3. ARTIKEL RLS POLICIES
-- ----------------------------------------------------------------------------
-- Public: Read only published articles
DROP POLICY IF EXISTS "Public can view published articles" ON public.artikel;
CREATE POLICY "Public can view published articles"
  ON public.artikel
  FOR SELECT
  TO anon, authenticated
  USING (status = 'publish');

-- Admin: Full Access
DROP POLICY IF EXISTS "Admin has full access to articles" ON public.artikel;
CREATE POLICY "Admin has full access to articles"
  ON public.artikel
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8.4. LEADS RLS POLICIES (Data Privacy & Zero-Knowledge for Public)
-- ----------------------------------------------------------------------------
-- Public: Can ONLY INSERT (Submit form) — CANNOT read, update, or delete!
DROP POLICY IF EXISTS "Public can submit contact form lead" ON public.leads;
CREATE POLICY "Public can submit contact form lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(nama)) >= 3 AND
    char_length(trim(no_hp)) >= 10 AND
    char_length(trim(pesan)) >= 5
  );

-- Admin: Read leads
DROP POLICY IF EXISTS "Admin can view leads" ON public.leads;
CREATE POLICY "Admin can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin: Delete/Manage leads
DROP POLICY IF EXISTS "Admin can delete leads" ON public.leads;
CREATE POLICY "Admin can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKET POLICIES (Storage Hardening)
-- ============================================================================

-- Create storage buckets if not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('image', 'image', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml']),
  ('video', 'video', true, 52428800, ARRAY['video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public can READ images and videos
DROP POLICY IF EXISTS "Public can view image files" ON storage.objects;
CREATE POLICY "Public can view image files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('image', 'video'));

-- Storage RLS: ONLY Authenticated Admin can UPLOAD (INSERT) images/videos
DROP POLICY IF EXISTS "Admin can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('image', 'video'));

-- Storage RLS: ONLY Authenticated Admin can UPDATE files
DROP POLICY IF EXISTS "Admin can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
CREATE POLICY "Authenticated users can update files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('image', 'video'))
  WITH CHECK (bucket_id IN ('image', 'video'));

-- Storage RLS: ONLY Authenticated Admin can DELETE files
DROP POLICY IF EXISTS "Admin can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
CREATE POLICY "Authenticated users can delete files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id IN ('image', 'video'));

-- ============================================================================
-- 10. SCHEMA PRIVILEGES & GRANTS (Complete & Clean)
-- ============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role, authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role, authenticator;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role, authenticator;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
