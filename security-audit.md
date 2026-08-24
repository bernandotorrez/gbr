# 🔒 Security Audit Report — Grand Bedahan Residence

**Date:** August 24, 2026  
**Scope:** Full static site (Astro + React islands)  
**Auditor:** Buffy (Codebuff AI Security Review)

---

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 HIGH | 2 | Requires immediate action |
| 🟠 MEDIUM | 4 | Should be addressed before production |
| 🟡 LOW | 3 | Recommended hardening |
| ℹ️ INFO | 2 | Awareness |

---

## 🔴 HIGH Severity

### H1 — Hardcoded BenixCS Widget Token in Source Code

**File:** `src/layouts/MainLayout.astro`  
**Line:** 50

```javascript
token: 'bkn_cs_widget_84299a911fae45dbb27e5d7d6717c1e3c5613000957f450dbae60e2be33fdeb3'
```

**Risk:** The BenixCS API token is hardcoded directly in source code committed to a public repository. Anyone with access to the repo can extract this token and potentially misuse the chatbot service (abuse API quota, send malicious messages, access conversation data).

**Remediation:**
- [ ] Move the token to Vercel environment variable (`BENIX_CS_TOKEN`)
- [ ] Reference via `import.meta.env.BENIX_CS_TOKEN`
- [ ] Add `.env` to `.gitignore` (already done) and ensure `.env.production` is also ignored
- [ ] Rotate the current token after moving to env vars

---

### H2 — Cross-Site Scripting (XSS) via External Script Injection

**File:** `src/layouts/MainLayout.astro`  
**Lines:** 47-49

```html
<script is:inline src="https://benixai.web.id/benix-cs-widget.js"></script>
<script is:inline>
  BenixCSWidget.init({ ... });
</script>
```

**Risk:** External script is loaded without Subresource Integrity (SRI) hash. If `benixai.web.id` is compromised (DNS hijack, supply chain attack), the attacker can inject arbitrary JavaScript into every page on the site, stealing user data or defacing the site.

**Remediation:**
- [ ] Add `integrity` and `crossorigin` attributes to the external script tag
- [ ] Obtain the SRI hash: `curl -s https://benixai.web.id/benix-cs-widget.js | openssl dgst -sha384 -binary | openssl base64 -A`
- [ ] Example: `<script is:inline src="..." integrity="sha384-..." crossorigin="anonymous"></script>`

---

## 🟠 MEDIUM Severity

### M1 — Missing Content Security Policy (CSP) Headers

**File:** `src/layouts/MainLayout.astro` (no CSP meta tag)  
**Missing:** No CSP configured anywhere in the project

**Risk:** Without CSP, the site is vulnerable to XSS attacks. An attacker can inject inline scripts, load scripts from malicious domains, or exfiltrate data to external servers.

**Remediation:**
- [ ] Add CSP meta tag in `<head>` of `MainLayout.astro`:
  ```html
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://benixai.web.id;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://xlbxjeieoznucclltjco.supabase.co;
    media-src 'self' https://xlbxjeieoznucclltjco.supabase.co;
    connect-src 'self' https://benixai.web.id https://xlbxjeieoznucclltjco.supabase.co;
    frame-src https://benixai.web.id;
    frame-ancestors 'none';
  ">
  ```
- [ ] Alternatively, configure CSP via Vercel headers in `vercel.json`

---

### M2 — Missing Security Headers (X-Frame-Options, X-Content-Type-Options, etc.)

**File:** Project-wide (no security headers configured)

**Risk:** Clickjacking attacks (no X-Frame-Options), MIME-type sniffing attacks (no X-Content-Type-Options), and other browser-level exploits.

**Remediation:**
- [ ] Create `vercel.json` with security headers:
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
          { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
        ]
      }
    ]
  }
  ```

---

### M3 — Open Redirect Risk via Unvalidated External Links

**Files:** Multiple (`Footer.astro`, `KontakSection.astro`, `FloatingWhatsApp.tsx`, etc.)

All external links use `target="_blank"` with hardcoded WhatsApp/Instagram URLs. While currently hardcoded (safe), the pattern lacks a centralized link validation mechanism.

**Risk:** If any link is later made dynamic (e.g., from CMS), it could become an open redirect vector.

**Remediation:**
- [ ] Create a centralized links utility (`src/utils/links.ts`) that validates external URLs against an allowlist
- [ ] Enforce that all external links use `rel="noopener noreferrer"` (some are currently missing — see L1)

---

### M4 — npm Dependency Vulnerabilities (path-to-regexp ReDoS)

**Package:** `@astrojs/vercel@11.0.7` → `@vercel/routing-utils` → `path-to-regexp@6.x`

**Risk:** High severity ReDoS (Regular Expression Denial of Service) vulnerability. A crafted URL could cause catastrophic backtracking, leading to DoS on server-side rendering.

**Advisory:** [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j)

**Remediation:**
- [ ] Run `npm audit fix --force` to update `@astrojs/vercel` to patched version
- [ ] Or wait for upstream fix and monitor: `npm audit` periodically

---

## 🟡 LOW Severity

### L1 — Missing `rel="noopener noreferrer"` on External Links

**File:** `src/pages/tipe-rumah/[slug].astro` (line 231)

```html
<a href={waUrl} target="_blank" ...>
```

**Risk:** Without `rel="noopener"`, the opened page can access `window.opener` and redirect the parent page (tab-nabbing attack).

**Remediation:**
- [ ] Add `rel="noopener noreferrer"` to all `target="_blank"` links:
  - `src/pages/tipe-rumah/[slug].astro` line 231 (Denah PDF link)
  - Any future external links

---

### L2 — Supabase Project ID Exposed in Public URLs

**File:** `src/data/tipeRumah.ts`, `src/components/sections/HeroSection.astro`, `src/components/sections/VideoSection.astro`

```
https://xlbxjeieoznucclltjco.supabase.co/storage/v1/object/public/...
```

**Risk:** The Supabase project ID (`xlbxjeieoznucclltjco`) is publicly visible. An attacker can use this to enumerate storage buckets, check for misconfigured RLS policies, or launch targeted attacks against the Supabase project.

**Remediation:**
- [ ] Ensure all Supabase storage buckets have proper RLS policies
- [ ] Consider using a custom domain or CDN proxy to mask the Supabase project ID
- [ ] Audit Supabase dashboard for any exposed non-public buckets

---

### L3 — No Rate Limiting on Contact Form

**File:** `src/components/islands/ContactForm.tsx`

The contact form currently simulates an API call with `setTimeout()`. When a real backend is implemented:

**Risk:** Without rate limiting, the form could be abused for spam or DoS attacks.

**Remediation:**
- [ ] Implement server-side rate limiting (e.g., max 5 submissions per IP per hour)
- [ ] Add CAPTCHA or honeypot field for bot prevention
- [ ] Implement CSRF token validation

---

## ℹ️ INFO

### I1 — Google Fonts Loaded Without Preconnect Optimization

**File:** `src/layouts/MainLayout.astro`

Preconnect is configured but font CSS is loaded render-blocking via `<link>`.

**Recommendation:**
- [ ] Consider self-hosting fonts for better privacy and performance
- [ ] Or use `font-display: swap` (already configured in Google Fonts URL)

---

### I2 — Inline Event Handlers Used for Lightbox

**File:** `src/pages/tipe-rumah/[slug].astro`

```html
onclick="document.getElementById('denah-lightbox').classList.remove(...)"
```

**Risk:** Inline event handlers bypass CSP `script-src` policy unless `'unsafe-inline'` is allowed.

**Recommendation:**
- [ ] Refactor to use `addEventListener` in a `<script>` block instead of inline `onclick`
- [ ] This allows CSP to work without `'unsafe-inline'` for scripts

---

## Remediation Priority Matrix

| Priority | Task | Severity | Effort |
|----------|------|----------|--------|
| 1 | Move BenixCS token to env vars | 🔴 HIGH | 15 min |
| 2 | Add SRI to external scripts | 🔴 HIGH | 30 min |
| 3 | Add security headers via `vercel.json` | 🟠 MEDIUM | 20 min |
| 4 | Add CSP meta tag | 🟠 MEDIUM | 30 min |
| 5 | Fix missing `rel="noopener"` | 🟡 LOW | 10 min |
| 6 | Run `npm audit fix` | 🟠 MEDIUM | 10 min |
| 7 | Refactor inline onclick handlers | ℹ️ INFO | 30 min |
| 8 | Add rate limiting to form (when backend ready) | 🟡 LOW | 1 hr |
| 9 | Audit Supabase RLS policies | 🟡 LOW | 1 hr |
