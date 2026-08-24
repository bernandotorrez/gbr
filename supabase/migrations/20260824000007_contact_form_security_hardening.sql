-- ============================================================================
-- CONTACT FORM SECURITY HARDENING: DATABASE-LEVEL INPUT SANITIZATION
-- ============================================================================

-- Function: Sanitize leads input before insert to prevent XSS & SQLi injection
CREATE OR REPLACE FUNCTION public.sanitize_lead_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Trim whitespace
  NEW.nama := trim(NEW.nama);
  NEW.no_hp := trim(NEW.no_hp);
  NEW.pesan := trim(NEW.pesan);

  -- Strip all HTML and script tags using regex
  NEW.nama := regexp_replace(NEW.nama, '<[^>]*>', '', 'g');
  NEW.pesan := regexp_replace(NEW.pesan, '<[^>]*>', '', 'g');

  IF NEW.tipe_rumah_diminati IS NOT NULL THEN
    NEW.tipe_rumah_diminati := regexp_replace(trim(NEW.tipe_rumah_diminati), '<[^>]*>', '', 'g');
  END IF;

  IF NEW.email IS NOT NULL THEN
    NEW.email := lower(trim(NEW.email));
  END IF;

  -- Clean non-numeric characters from phone except '+'
  NEW.no_hp := regexp_replace(NEW.no_hp, '[^0-9+]', '', 'g');

  RETURN NEW;
END;
$$;

-- Trigger: Execute sanitize_lead_input before INSERT on leads
DROP TRIGGER IF EXISTS trg_sanitize_lead_input ON public.leads;
CREATE TRIGGER trg_sanitize_lead_input
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_lead_input();
