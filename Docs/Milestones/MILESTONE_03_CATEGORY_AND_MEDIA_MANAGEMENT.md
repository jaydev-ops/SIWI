# MILESTONE 03 — CATEGORY MANAGEMENT & CENTRALIZED MEDIA LIBRARY
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement the foundational asset and taxonomy subsystems for SIWI Global Ventures:
1. Dynamic, database-driven category management (replacing hardcoded category arrays).
2. S3-compatible media upload pipeline featuring strict 9-step file validation and Sharp image optimization.
3. Centralized Media Library interface (`/admin/media`) supporting asset reuse, metadata editing, and deletion safeguards.
4. Public and administrative category APIs.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 6: Media library & image processing.
- `Architecture.md` Section 7: Category management & hierarchy.
- `Architecture.md` Section 13: Media and certificate storage (9-step validation pipeline).

---

## 3. PREREQUISITES
- Milestone 01 & 02 complete (Database connected, S3 client configured, Admin shell active).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Database-Driven Category Management
- **Initial Category Seeding (`packages/database/prisma/seed.ts`):**
  - Category 1: `Dehydrated Vegetable Products` (slug: `dehydrated-vegetables`)
    - Child items: Onion Powder, Garlic Powder, Garlic Granules, Dehydrated Fried Onions, Birista, Onion Kibbles, Other Value-Added Products.
  - Category 2: `Other Trading Categories` (slug: `other-categories`)
    - Child items: Tiles (`tiles`), Other Products (`other-products`).
- **Category API Endpoints:**
  - `GET /api/public/categories`: Returns published categories and active product counts.
  - `GET /api/public/categories/:slug`: Returns single category with nested published products.
  - `GET /api/admin/categories`: Admin listing with draft/published status and ordering.
  - `POST /api/admin/categories`: Create category (validates slug uniqueness).
  - `PATCH /api/admin/categories/:id`: Update category title, slug, SEO, display order.
  - `DELETE /api/admin/categories/:id`: Soft-delete or archive category (blocked if active products are assigned).
- **Admin Category UI (`/admin/categories`):**
  - List view with drag-and-drop reordering.
  - Add/Edit Category modal with real-time slug generation, description, and featured image selector.

### 4.2 S3-Compatible Media Upload Pipeline & 9-Step Validation
Implement `POST /api/admin/media/upload` enforcing the 9 verification steps from `Architecture.md` Section 13:
1. **Permission Check:** Verify user has `SUPER_ADMIN` or `CONTENT_EDITOR` role.
2. **File Size Limit:** Reject files exceeding 15MB for images.
3. **MIME Type Validation:** Whitelist `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
4. **Magic Bytes Content Verification:** Inspect file buffer header (using `file-type`) to ensure extension matches actual byte content.
5. **Deterministic Storage Keys:** Generate storage keys: `media/images/{YYYY}/{MM}/{uuid}.{ext}` (never trust client filename).
6. **Metadata Record Storage:** Write metadata record into `media_assets` table.
7. **Execution Prevention:** Upload with `Content-Disposition: inline` and strict `Content-Type` headers; prevent executable serving.
8. **Automated Variant Resizing (Sharp Pipeline):**
   - Thumbnail: `200px` max dimension (WebP, quality 80)
   - Catalogue Card: `600px` max dimension (WebP, quality 85)
   - Product Detail: `1200px` max dimension (WebP, quality 90)
   - High-Res Original: Retained in storage
9. **Audit Logging:** Record upload event in `audit_logs`.

### 4.3 Centralized Media Library Interface (`/admin/media`)
- **Asset Grid & Table Views:** Display thumbnails, filenames, file sizes, and MIME types.
- **Filtering & Search:** Search by original filename; filter by MIME type or date range.
- **Metadata Drawer:** Edit alt text (crucial for accessibility/SEO) and caption.
- **Usage Tracking ("Used By"):** Display exactly where an asset is referenced (e.g., *"Used in 2 Products: Onion Powder, Garlic Powder"*).
- **Deletion Safeguard:** Prevent deletion of any media asset currently linked to active products or published pages.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Categories are fully database-driven; adding a category in `/admin/categories` immediately updates the public API.
- [ ] Image upload endpoint rejects spoofed files (e.g. `.exe` renamed to `.jpg`) with `400 Bad Request`.
- [ ] Uploading a 5MB JPEG generates WebP thumbnail, catalogue, and detail variants in S3/MinIO.
- [ ] Media Library displays uploaded assets, allows alt-text editing, and updates metadata in PostgreSQL.
- [ ] Deletion of an image referenced by a product is safely blocked with a descriptive error message.
