-- ============================================================================
-- Grand Bedahan Residence (GBR) — Visitor Analytics & Event Tracking Schema
-- Migration: 20260825000000_create_page_views.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path VARCHAR(255) NOT NULL,
  referrer TEXT,
  device_type VARCHAR(20) DEFAULT 'desktop',
  browser VARCHAR(50),
  os VARCHAR(50),
  event_type VARCHAR(50) DEFAULT 'pageview',
  event_data JSONB DEFAULT '{}'::jsonb,
  session_id VARCHAR(100),
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_event_type ON public.page_views (event_type);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views (session_id);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (public anon) can insert tracking events
CREATE POLICY "Public can insert page_views"
  ON public.page_views
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

-- 2. Only authenticated admins can read analytics data
CREATE POLICY "Only admins can select page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated, service_role
  USING (public.is_admin());
