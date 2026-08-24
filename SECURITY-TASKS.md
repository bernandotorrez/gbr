# 🛡️ Security Hardening Tasks

Based on security audit from `security-audit.md`

---

## Sprint 1 — Critical (Before Production Deploy)

### T1: Move BenixCS Token to Environment Variables
- [ ] Add `BENIX_CS_TOKEN` to Vercel environment variables
- [ ] Update `src/layouts/MainLayout.astro` to use `import.meta.env.BENIX_CS_TOKEN`
- [ ] Rotate the current token on BenixCS dashboard
- [ ] Verify widget still works after change

### T2: Add Subresource Integrity (SRI) to External Scripts
- [ ] Generate SRI hash for `benix-cs-widget.js`
- [ ] Add `integrity` and `crossorigin` attributes to script tag
- [ ] Test that widget loads correctly

### T3: Add Security Headers via Vercel
- [ ] Create `vercel.json` in project root
- [ ] Add X-Frame-Options: DENY
- [ ] Add X-Content-Type-Options: nosniff
- [ ] Add X-XSS-Protection: 1; mode=block
- [ ] Add Referrer-Policy: strict-origin-when-cross-origin
- [ ] Add Permissions-Policy: camera=(), microphone=(), geolocation=()
- [ ] Add Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

### T4: Fix Missing rel="noopener noreferrer"
- [ ] `src/pages/tipe-rumah/[slug].astro` line 231 — add `rel="noopener noreferrer"`
- [ ] Audit all other `target="_blank"` links

---

## Sprint 2 — Medium Priority

### T5: Add Content Security Policy (CSP)
- [ ] Create CSP meta tag in MainLayout.astro `<head>`
- [ ] Whitelist: self, benixai.web.id, fonts.googleapis.com, fonts.gstatic.com, supabase.co
- [ ] Test that all features work with CSP enabled
- [ ] Consider moving to report-only mode first

### T6: Fix npm Vulnerabilities
- [ ] Run `npm audit fix --force` to update `@astrojs/vercel`
- [ ] Verify build still works
- [ ] Test Vercel deployment

### T7: Refactor Inline Event Handlers
- [ ] `src/pages/tipe-rumah/[slug].astro` — move onclick handlers to `<script>` block
- [ ] This allows CSP without 'unsafe-inline'

---

## Sprint 3 — Hardening

### T8: Audit Supabase Security
- [ ] Review all storage bucket RLS policies
- [ ] Ensure no private data is in public buckets
- [ ] Consider custom domain for storage URLs

### T9: Add Rate Limiting (When Backend Ready)
- [ ] Implement server-side rate limiting on form endpoint
- [ ] Max 5 submissions per IP per hour
- [ ] Add CAPTCHA or honeypot field

### T10: Self-Host Google Fonts
- [ ] Download fonts from Google Fonts
- [ ] Place in `public/fonts/`
- [ ] Update CSS to use local font files
- [ ] Remove external Google Fonts links
