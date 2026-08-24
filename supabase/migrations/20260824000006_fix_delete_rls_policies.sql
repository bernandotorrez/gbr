-- ============================================================================
-- FIX DELETE & FULL ACCESS POLICIES FOR AUTHENTICATED ADMINS
-- ============================================================================

-- 1. Tipe Rumah
DROP POLICY IF EXISTS "Admin has full access to house types" ON public.tipe_rumah;
DROP POLICY IF EXISTS "Authenticated users full access to house types" ON public.tipe_rumah;
CREATE POLICY "Authenticated users full access to house types"
  ON public.tipe_rumah
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Promosi
DROP POLICY IF EXISTS "Admin has full access to promotions" ON public.promosi;
DROP POLICY IF EXISTS "Authenticated users full access to promotions" ON public.promosi;
CREATE POLICY "Authenticated users full access to promotions"
  ON public.promosi
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Artikel
DROP POLICY IF EXISTS "Admin has full access to articles" ON public.artikel;
DROP POLICY IF EXISTS "Authenticated users full access to articles" ON public.artikel;
CREATE POLICY "Authenticated users full access to articles"
  ON public.artikel
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Leads
DROP POLICY IF EXISTS "Admin can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admin can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users full access to leads" ON public.leads;
CREATE POLICY "Authenticated users full access to leads"
  ON public.leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure all privileges are granted
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
