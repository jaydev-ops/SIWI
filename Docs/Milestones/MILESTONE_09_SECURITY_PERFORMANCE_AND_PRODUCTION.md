# MILESTONE 09 — SECURITY HARDENING, PERFORMANCE & PRODUCTION READINESS
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Prepare the entire SIWI Global Ventures ecosystem for production deployment:
1. Complete security hardening: Rate limiting, CSRF protection, input sanitization, and security headers.
2. Automated database backup retention and disaster recovery procedures.
3. Performance optimization targeting Core Web Vitals (LCP < 2.5s, CLS < 0.1).
4. Production deployment architecture, environment isolation, and comprehensive operational loop sign-off.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 16: Security and reliability requirements.
- `Architecture.md` Section 17: Recommended deployment architecture.
- `Architecture.md` Section 20: Final architectural recommendation (10-step operational loop).

---

## 3. PREREQUISITES
- Milestones 01 through 08 complete (All core features, CMS, public site, and document storage functional).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Production Security Hardening
- **HTTP Security Headers (`@fastify/helmet`):**
  - Content Security Policy (CSP) restricting scripts, styles, and frames.
  - Strict-Transport-Security (`HSTS` max-age: 31536000, includeSubDomains).
  - `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.
- **Cross-Site Request Forgery (CSRF):**
  - Enforce `@fastify/csrf-protection` for all state-changing admin requests (`POST`, `PATCH`, `DELETE`).
- **Input Sanitization & Injection Prevention:**
  - Prisma ORM parameterized queries prevent SQL injection.
  - DOMPurify sanitization on rich-text narrative descriptions before saving and rendering.
  - Zod / JSON Schema validation on every incoming API payload.
- **Rate Limiting (`@fastify/rate-limit`):**
  - Public API: Max 100 requests per minute per IP.
  - Trade Enquiry submission: Max 5 submissions per 10 minutes per IP.
  - Admin login: Max 5 attempts per 15 minutes per IP.

### 4.2 Database Reliability & Automated Backups
- **Daily Automated Backup Script:**
  - Automated `pg_dump` compressed with gzip and encrypted with AES-256.
  - Shipped to dedicated, immutable secondary cloud storage bucket.
  - 30-day rolling retention policy.
- **Disaster Recovery Plan:**
  - Documented restore procedure: `scripts/restore-database.sh [backup-file.sql.gz]`.
  - Tested rollback mechanism verifying data integrity.

### 4.3 Performance Optimization & Core Web Vitals
- **Image Serving:** All product imagery served in next-gen formats (WebP/AVIF) with explicit width/height reservations to eliminate Cumulative Layout Shift (CLS).
- **Asset Caching:** Fastify static file cache-control headers (`Cache-Control: public, max-age=31536000, immutable` for hashed assets).
- **API Caching & Invalidation:** Fastify ETag support for `GET /api/public/products` and `GET /api/public/categories`. Automated cache invalidation whenever an admin publishes a product or page.
- **Bundle Optimization:** Code splitting with React Router lazy-loading, ensuring initial bundle size < 150KB gzipped.

### 4.4 Production Deployment Architecture
```
                         PUBLIC INTERNET
                                │
                                ▼
                        CLOUDFLARE / CDN
               (DDoS Protection, SSL, Static Assets)
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
         STATIC FRONTEND               NODE.JS BACKEND
        (apps/web & admin)             (Fastify API)
                                               │
                                ┌──────────────┴──────────────┐
                                ▼                             ▼
                       MANAGED POSTGRESQL             S3 OBJECT STORAGE
                        (Neon / Supabase / AWS)       (AWS S3 / Cloudflare R2)
```
- **Environment Isolation:**
  - Strictly separate `.env.development` and `.env.production`.
  - Production database passwords and S3 keys stored exclusively in cloud secret managers (never committed to repository).

### 4.5 The 10-Step Operational Verification Loop
Execute and sign off on the 10-step administrative operational loop from `Architecture.md` Section 20:
1. [ ] **Step 1:** Authorized administrator logs in via `/admin/login`.
2. [ ] **Step 2:** Creates a new product record (*Dehydrated Fried Onions*).
3. [ ] **Step 3:** Uploads high-res product photography to the media library.
4. [ ] **Step 4:** Adds verified specification attributes (particle size, moisture).
5. [ ] **Step 5:** Attaches a technical specification sheet PDF.
6. [ ] **Step 6:** Previews the product detail layout in draft mode.
7. [ ] **Step 7:** Executes the pre-flight checklist and publishes the product.
8. [ ] **Step 8:** Verifies the product appears immediately on the public website at `/products/dehydrated-fried-onions`.
9. [ ] **Step 9:** Simulates a buyer submitting a trade enquiry pre-filled with this product; verifies email notification arrives and record displays in admin triage.
10. [ ] **Step 10:** Modifies homepage hero text in the page CMS; verifies public site updates without code changes.

---

## 5. ACCEPTANCE CRITERIA & FINAL SIGN-OFF
- [ ] All security tests pass (rate limiting, CSRF, security headers, XSS sanitization).
- [ ] Database backup and restore verified successfully.
- [ ] Google Lighthouse score on Public Homepage: Performance >= 95, Accessibility >= 98, Best Practices = 100, SEO = 100.
- [ ] Complete 10-step operational loop executed with zero errors.
- [ ] Official production handover sign-off complete.
