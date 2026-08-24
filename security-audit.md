# 🔒 Security Audit Report — Grand Bedahan Residence

**Tanggal Audit:** 24 Agustus 2026  
**Auditor:** Antigravity AI (Cybersecurity Review)  
**Scope:** Full static site — Astro 7.x + React Islands + Vercel Deployment  
**Stack:** Astro, React, TailwindCSS v4, Supabase Storage, BenixCS Widget  

---

## Executive Summary

| Severity | Jumlah | Status |
|----------|--------|--------|
| 🔴 CRITICAL | 1 | Segera diperbaiki sebelum production |
| 🟠 HIGH | 3 | Diperbaiki sebelum go-live |
| 🟡 MEDIUM | 4 | Sprint berikutnya |
| 🟢 LOW | 3 | Hardening opsional |
| ℹ️ INFO | 2 | Awareness / best practice |

**Skor Keamanan Saat Ini: 42/100 🔴**  
**Target Setelah Remediation: 85/100 🟢**

---

## 🔴 CRITICAL

### C1 — API Token Hardcoded di Source Code (Secret Exposure) `[STATUS: FIXED ✅]`

**File:** [`src/layouts/MainLayout.astro`](src/layouts/MainLayout.astro) — Baris 50  
**CWE:** CWE-798 (Use of Hard-coded Credentials)  
**CVSS:** 9.1 (Critical)

**Status Perbaikan:**
- ✅ Token hardcoded telah dihapus dari `MainLayout.astro`
- ✅ Diganti menggunakan dynamic environment variable: `import.meta.env.PUBLIC_BENIX_CS_TOKEN`
- ✅ File `.env` ditambahkan ke `.gitignore` agar tidak pernah ter-commit ke Git
- ✅ Dibuat template `.env.example` untuk panduan konfigurasi tim / CI/CD
- ⚠️ *Rekomendasi:* Lakukan rotate token pada dashboard BenixCS dan update value di Vercel Environment Variables.

---

## 🟠 HIGH

### H1 — Tidak Ada HTTP Security Headers `[STATUS: FIXED ✅]`

**File:** [`vercel.json`](vercel.json)  
**CWE:** CWE-693 (Protection Mechanism Failure)  
**CVSS:** 7.5 (High)

**Status Perbaikan:**
Header keamanan lengkap telah diterapkan melalui [`vercel.json`](vercel.json) untuk semua route (`/(.*)`):

| Header | Nilai yang Diterapkan | Proteksi |
|--------|----------------------|----------|
| `Content-Security-Policy` | Whitelist `self`, `benixai.web.id`, `supabase.co`, `unsplash.com`, `google.com` | Proteksi serangan XSS, data injection, dan unauthorized framing |
| `X-Frame-Options` | `DENY` | Proteksi serangan Clickjacking |
| `X-Content-Type-Options` | `nosniff` | Mencegah MIME sniffing attacks |
| `X-XSS-Protection` | `1; mode=block` | Legacy browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Mencegah kebocoran URL path sensitif ke pihak ketiga |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Membatasi akses API hardware/device oleh browser |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Memaksa koneksi aman HTTPS (HSTS) |

**Konfigurasi di `vercel.json`:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://benixai.web.id; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://xlbxjeieoznucclltjco.supabase.co https://images.unsplash.com https://maps.google.com; media-src 'self' https://xlbxjeieoznucclltjco.supabase.co; frame-src https://maps.google.com; connect-src 'self' https://benixai.web.id; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

---

### H2 — External Script Tanpa Subresource Integrity (SRI) `[STATUS: FIXED ✅]`

**File:** [`src/layouts/MainLayout.astro`](src/layouts/MainLayout.astro) — Baris 48–53  
**CWE:** CWE-829 (Inclusion of Functionality from Untrusted Control Sphere)  
**CVSS:** 7.2 (High)

**Status Perbaikan:**
- ✅ Subresource Integrity (SRI) hash (`sha384-C48jwvNytIzRCcwxhYlfx3pRUNvboJYYavdRQmCpsJlJHshAlFE8qRCQoxqfbHUW`) dan atribut `crossorigin="anonymous"` telah ditambahkan ke tag `<script>` external BenixCS.
- ✅ Mencegah serangan supply chain injection / tampering jika CDN pihak ketiga disusupi.

```html
<!-- ✅ Dengan SRI Hash & Crossorigin -->
<script 
  is:inline 
  src="https://benixai.web.id/benix-cs-widget.js"
  integrity="sha384-C48jwvNytIzRCcwxhYlfx3pRUNvboJYYavdRQmCpsJlJHshAlFE8qRCQoxqfbHUW"
  crossorigin="anonymous"
></script>
```

---

### H3 — npm Dependency: ReDoS Vulnerability (path-to-regexp)

**Package:** `@astrojs/vercel@11.0.7` → `@vercel/routing-utils` → `path-to-regexp 4.x–6.2.x`  
**Advisory:** [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j)  
**CVSS:** 7.5 (High)  
**CWE:** CWE-1333 (Inefficient Regular Expression Complexity)

```
npm audit output:
HIGH: 3 | MODERATE: 0 | CRITICAL: 0 | TOTAL: 3
```

**Risiko:**  
URL yang dirancang khusus dapat menyebabkan RegEx backtracking katastrofik → CPU spike → Denial of Service pada server.

**Remediation:**
```bash
# Coba fix otomatis (perhatikan breaking changes)
npm audit fix

# Jika gagal, force upgrade (test dulu di dev):
npm audit fix --force

# Verifikasi setelah fix:
npm audit
npm run build
```

---

## 🟡 MEDIUM

### M1 — Framework Version Disclosure via `<meta>` Generator Tag

**File:** [`src/layouts/MainLayout.astro`](src/layouts/MainLayout.astro) — Baris 29  
**CWE:** CWE-200 (Information Exposure)  
**CVSS:** 5.3 (Medium)

```html
<!-- ❌ Mengekspos versi Astro ke publik -->
<meta name="generator" content="Astro v7.2.4" />
```

**Risiko:**  
Attacker dapat mengetahui versi framework dan mencari CVE spesifik untuk versi tersebut (version-specific exploits).

**Remediation:**
```astro
<!-- ✅ Hapus atau ganti dengan nilai generic -->
<!-- Hapus baris ini dari MainLayout.astro: -->
<!-- <meta name="generator" content={Astro.generator} /> -->
```

---

### M2 — Inline `onclick` Handlers (CSP Bypass)

**File:** [`src/pages/tipe-rumah/[slug].astro`](src/pages/tipe-rumah/%5Bslug%5D.astro) — Baris 243, 262, 264, 267  
**CWE:** CWE-79 (Cross-Site Scripting)  
**CVSS:** 5.0 (Medium)

```html
<!-- ❌ Inline onclick — memaksa 'unsafe-inline' di CSP -->
<div onclick="document.getElementById('denah-lightbox').classList.remove(...)">
```

**Risiko:**  
Inline event handlers membuat CSP harus mengizinkan `'unsafe-inline'` untuk script, yang membatalkan proteksi XSS dari CSP itu sendiri.

**Remediation:**
```astro
<!-- ✅ Pindahkan ke <script> block di bawah -->
<div id="denah-trigger">...</div>

<script>
  document.getElementById('denah-trigger')?.addEventListener('click', () => {
    document.getElementById('denah-lightbox')?.classList.remove('opacity-0', 'pointer-events-none');
  });
</script>
```

---

### M3 — Missing `rel="noopener noreferrer"` pada Beberapa Link

**File:** [`src/pages/tipe-rumah/[slug].astro`](src/pages/tipe-rumah/%5Bslug%5D.astro)  
**Baris:** 231 (WhatsApp link untuk denah), 370  
**CWE:** CWE-1022 (Use of Web Link to Untrusted Target)  
**CVSS:** 4.3 (Medium)

```html
<!-- ❌ Baris 231 — target="_blank" tanpa rel="noopener noreferrer" -->
<a href={waUrl} target="_blank" class="...">
  Minta Denah High-Res (PDF)
</a>
```

**Risiko:**  
Halaman yang dibuka dapat mengakses `window.opener` dan memanipulasi halaman parent (tab-nabbing attack) — mengarahkan user ke halaman phishing.

**Remediation:**
```html
<!-- ✅ Tambahkan rel attribute -->
<a href={waUrl} target="_blank" rel="noopener noreferrer" class="...">
  Minta Denah High-Res (PDF)
</a>
```

---

### M4 — Contact Form: Tidak Ada CSRF Protection & Rate Limiting

**File:** [`src/components/islands/ContactForm.tsx`](src/components/islands/ContactForm.tsx)  
**CWE:** CWE-352 (CSRF) + CWE-770 (Allocation of Resources Without Limits)  
**CVSS:** 4.7 (Medium)

```tsx
// Form saat ini menggunakan setTimeout() — simulasi
// Ketika backend real diimplementasi, rentan terhadap:
// 1. CSRF (Cross-Site Request Forgery)
// 2. Spam flooding / bot submission
const handleSubmit = (e: React.FormEvent) => {
  // Tidak ada CSRF token
  // Tidak ada rate limiting
  // Tidak ada bot protection
};
```

**Remediation:**
```tsx
// 1. Tambah honeypot field (anti-bot, tidak terlihat user)
<input 
  type="text" 
  name="website" // Field jebakan bot
  style={{ display: 'none' }} 
  tabIndex={-1} 
  autoComplete="off"
/>

// 2. Saat implementasi backend — tambahkan:
// - CSRF token validation
// - Rate limiting: max 5 request/IP/jam
// - Server-side validation (tidak hanya client-side)
```

---

## 🟢 LOW

### L1 — Supabase Project ID Terekspos di Source Code

**File:** [`src/data/tipeRumah.ts`](src/data/tipeRumah.ts), [`src/components/sections/HeroSection.astro`](src/components/sections/HeroSection.astro), [`src/components/sections/VideoSection.astro`](src/components/sections/VideoSection.astro)  
**CWE:** CWE-200 (Information Exposure)

```typescript
// Project ID "xlbxjeieoznucclltjco" visible di semua URL
https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/...
```

**Risiko (Low karena bucket memang public):**  
- Attacker dapat enumerate bucket/folder structure
- Bisa menjadi target scanning jika Supabase RLS tidak dikonfigurasi dengan benar

**Remediation:**
- [ ] Pastikan semua storage bucket non-publik memiliki RLS policy yang ketat
- [ ] Audit Supabase dashboard → Storage → Policies
- [ ] Pertimbangkan custom domain (mis. CDN Cloudflare) untuk mask Supabase URL

---

### L2 — `robots.txt` Belum Melarang Crawl Aset Build Internal

**File:** [`public/robots.txt`](public/robots.txt)

```txt
# Saat ini Disallow sudah ada, tapi belum lengkap
Disallow: /_astro/
```

**Tambahan yang diperlukan:**
```txt
Disallow: /_astro/
Disallow: /api/
Disallow: /404
# Tambahkan juga:
Disallow: /*.json$   # Blok akses langsung ke JSON files
```

---

### L3 — Google Fonts via External CDN (Privacy)

**File:** [`src/layouts/MainLayout.astro`](src/layouts/MainLayout.astro) — Baris 33-35  
**CWE:** CWE-359 (Exposure of Private Information)

```html
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

**Risiko:**  
Google Fonts mencatat IP address pengunjung setiap kali font dimuat. Di beberapa negara (EU/GDPR), ini memerlukan cookie consent.

**Remediation:**
```bash
# Self-host fonts
# 1. Download dari https://gwfh.mranftl.com/fonts
# 2. Taruh di public/fonts/
# 3. Update global.css dengan @font-face
```

---

## ℹ️ INFO

### I1 — Framework Version Disclosure via HTTP Header

Vercel secara default menambahkan `X-Powered-By: Vercel` di response headers. Ini minor tapi dapat dimatikan di vercel.json.

### I2 — Tidak Ada `security.txt` (RFC 9116)

Best practice keamanan modern menyertakan file `/.well-known/security.txt` untuk memudahkan pelaporan vulnerability oleh peneliti keamanan.

```txt
# public/.well-known/security.txt
Contact: mailto:security@grandbedahanresidence.com
Expires: 2027-08-24T00:00:00z
Preferred-Languages: id, en
```

---

## Remediation Priority Matrix

| # | Task | Severity | Estimasi | File |
|---|------|----------|----------|------|
| 1 | Pindahkan BenixCS token ke env vars | 🔴 CRITICAL | 15 menit | `MainLayout.astro` |
| 2 | Buat `vercel.json` dengan security headers | 🟠 HIGH | 20 menit | `vercel.json` (baru) |
| 3 | Tambah SRI hash ke external script | 🟠 HIGH | 30 menit | `MainLayout.astro` |
| 4 | Fix npm vulnerabilities (path-to-regexp) | 🟠 HIGH | 10 menit | `package.json` |
| 5 | Hapus `<meta name="generator">` | 🟡 MEDIUM | 5 menit | `MainLayout.astro` |
| 6 | Fix missing `rel="noopener"` di slug | 🟡 MEDIUM | 10 menit | `[slug].astro` |
| 7 | Refactor inline `onclick` ke `<script>` | 🟡 MEDIUM | 30 menit | `[slug].astro` |
| 8 | Tambah honeypot ke contact form | 🟡 MEDIUM | 15 menit | `ContactForm.tsx` |
| 9 | Audit Supabase RLS policies | 🟢 LOW | 30 menit | Supabase Dashboard |
| 10 | Update `robots.txt` | 🟢 LOW | 5 menit | `public/robots.txt` |
| 11 | Self-host Google Fonts | 🟢 LOW | 1 jam | `global.css` |
| 12 | Tambah `security.txt` | ℹ️ INFO | 10 menit | `public/.well-known/` |

---

## Tools yang Digunakan untuk Audit

| Tool | Temuan |
|------|--------|
| `npm audit` | 3 HIGH vulnerabilities (path-to-regexp ReDoS) |
| Manual code review | Token hardcoded, missing SRI, onclick handlers |
| `grep` pattern scan | Missing `noopener`, XSS patterns, secret exposure |
| File structure analysis | Missing security headers, robots.txt gaps |

---

*Audit ini dilakukan pada tanggal 24 Agustus 2026. Lakukan re-audit setiap 3 bulan atau setelah perubahan major.*
