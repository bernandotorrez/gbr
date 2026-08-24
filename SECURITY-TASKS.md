# 🛡️ Security Hardening Tasks — Grand Bedahan Residence

> Berdasarkan Security Audit: `security-audit.md`  
> Tanggal: 24 Agustus 2026

---

## Sprint 1 — CRITICAL & HIGH (Before Production)

### T1: Pindahkan BenixCS Token ke Env Vars 🔴 CRITICAL
- [x] Tambah `BENIX_CS_TOKEN` ke Vercel Environment Variables  
- [x] Update `src/layouts/MainLayout.astro` — gunakan `import.meta.env.PUBLIC_BENIX_CS_TOKEN`
- [ ] Rotate token lama di BenixCS dashboard setelah deploy
- [x] Verifikasi widget masih berfungsi

### T2: Buat `vercel.json` dengan Security Headers 🟠 HIGH
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection: 1; mode=block
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera=(), microphone=(), geolocation=()
- [x] Strict-Transport-Security: max-age=63072000
- [x] Content-Security-Policy

### T3: Tambah SRI Hash ke External Script 🟠 HIGH
- [x] Generate SRI hash untuk benix-cs-widget.js
- [x] Tambah `integrity` + `crossorigin` attributes
- [x] Verifikasi widget masih load

### T4: Fix npm Vulnerabilities 🟠 HIGH
- [ ] Run `npm audit fix`
- [ ] Verifikasi build tidak rusak

---

## Sprint 2 — MEDIUM

### T5: Hapus `<meta name="generator">` 🟡 MEDIUM
- [x] Hapus dari `MainLayout.astro`
- [x] Hapus dari `Layout.astro`

### T6: Fix Missing `rel="noopener noreferrer"` 🟡 MEDIUM
- [x] `[slug].astro` baris 231 — WhatsApp denah link
- [x] `[slug].astro` baris 370 — link lainnya

### T7: Refactor Inline `onclick` ke Event Listener 🟡 MEDIUM
- [x] `[slug].astro` — pindahkan 4x onclick ke `<script>` block

### T8: Tambah Honeypot ke Contact Form 🟡 MEDIUM
- [x] Honeypot field tersembunyi di `ContactForm.tsx`
- [x] Validasi honeypot di handleSubmit

---

## Sprint 3 — LOW & INFO

### T9: Update `robots.txt` 🟢 LOW
- [x] Tambah `Disallow: /*.json$`

### T10: Tambah `security.txt` ℹ️ INFO
- [x] Buat `public/.well-known/security.txt`

### T11: Audit Supabase RLS Policies 🟢 LOW
- [ ] Review storage bucket policies di Supabase Dashboard
- [ ] Pastikan hanya bucket public yang memang boleh diakses publik

### T12: Self-Host Google Fonts 🟢 LOW
- [ ] Download font files
- [ ] Update CSS @font-face
- [ ] Remove external Google Fonts link

---

## Status Ringkasan

| Sprint | Task | Status |
|--------|------|--------|
| 1 | T1 — Move token ke env | ✅ Done |
| 1 | T2 — Security headers | ✅ Done |
| 1 | T3 — SRI hash | ✅ Done |
| 1 | T4 — npm audit fix | ⏳ Manual |
| 2 | T5 — Remove generator meta | ✅ Done |
| 2 | T6 — noopener noreferrer | ✅ Done |
| 2 | T7 — Refactor onclick | ✅ Done |
| 2 | T8 — Honeypot form | ✅ Done |
| 3 | T9 — robots.txt update | ✅ Done |
| 3 | T10 — security.txt | ✅ Done |
| 3 | T11 — Supabase audit | ⏳ Manual |
| 3 | T12 — Self-host fonts | ⏳ Opsional |
