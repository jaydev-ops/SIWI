# MILESTONE 08 — DOCUMENT & CERTIFICATE MANAGEMENT WITH SECURE STORAGE
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement enterprise-grade technical document and certificate management for SIWI Global Ventures:
1. Centralized document management (`/admin/documents`) for Product Specification Sheets, Certificates of Analysis (CoAs), Safety Data Sheets (SDS), and quality certificates.
2. Controlled access separation: Public downloadable documents vs. Private authenticated documents.
3. Secure document delivery via short-lived pre-signed S3 download URLs.
4. Expiration monitoring and audit logging for sensitive international compliance files.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 5 (Tab 5): Certificates and documents.
- `Architecture.md` Section 13: Media and certificate storage (Public vs. private files, upload validation).
- `Docs/siwi-design-reference-system/LEVEL_01_BRAND_FOUNDATION.md`: Content accuracy & certification verification boundaries.

---

## 3. PREREQUISITES
- Milestone 01, 02, and 04 complete (Prisma `documents` model, Auth active, S3 storage connected).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Document Classification & Metadata
Support official international B2B document categories in `documents` table:
- `SPECIFICATION_SHEET` — Official technical product data sheets.
- `CERTIFICATE_OF_ANALYSIS` — Lot-specific or grade laboratory test results.
- `SAFETY_DATA_SHEET` — Handling and safety guidelines.
- `QUALITY_CERTIFICATE` — Verified quality and processing accreditations.
- `PRODUCT_BROCHURE` — Commercial product line brochures.
- `PACKAGING_INFORMATION` — Palletization, container stuffing, and bulk packaging specs.

### 4.2 Document Administration UI (`/admin/documents`)
- **Document Repository View:**
  - Data table: Document Title, Category Badge, Associated Products, File Size, Issue Date, Expiration Date, Public Visibility toggle, Actions (`Download`, `Replace`, `Archive`).
- **Upload Document Modal:**
  - File uploader (PDF format only, max 25MB).
  - Title, Document Type, Associated Products (multi-select).
  - Version number (e.g. `v1.2`).
  - Issue Date & Optional Expiration Date.
  - **Public Visibility Flag (`isPublic: boolean`):**
    - Checked: Downloadable directly on public product detail page.
    - Unchecked: Internal/private, requires administrator authentication or buyer qualification.
- **Expiration Alert Widget:**
  - Flags documents reaching expiration within 60 days on the main admin dashboard.

### 4.3 Secure Download Architecture & Short-Lived Pre-signed URLs
- **Public Documents:**
  - Endpoint: `GET /api/public/documents/:id/download`
  - Verifies `isPublic === true` and `status === 'PUBLISHED'`.
  - Redirects to public CDN URL or streams directly with `Content-Disposition: attachment; filename="[originalName]"`.
- **Private / Sensitive Documents:**
  - Endpoint: `GET /api/admin/documents/:id/download`
  - Enforces session authentication and user permission check.
  - Generates a **short-lived S3 pre-signed URL** expiring in 15 minutes:
  ```typescript
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: document.storageKey,
    ResponseContentDisposition: `attachment; filename="${document.originalName}"`
  });
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  ```
  - Redirects authenticated client to the secure temporary link.
  - Records download event in `audit_logs` (`action: "DOCUMENT_DOWNLOADED"`).

### 4.4 Verification Protocol Against Hallucination
- Enforce the non-negotiable rule from `00_MASTER_BRIEF.md`: The presence of a certificate upload interface does **not** imply that SIWI claims certifications it does not hold.
- Documents displayed on the public site must be backed by genuine, verified files uploaded by authorized staff.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Admin uploads a technical PDF specification sheet and links it to *"Garlic Powder"*.
- [ ] If marked `isPublic: false`, an unauthenticated request to download returns `401 Unauthorized`.
- [ ] If marked `isPublic: true`, the file appears on the public Garlic Powder page and downloads cleanly with its original filename.
- [ ] Admin download generates a secure 15-minute presigned S3 URL; direct tampering with the storage key is blocked.
- [ ] All document uploads and downloads are captured in `audit_logs`.
