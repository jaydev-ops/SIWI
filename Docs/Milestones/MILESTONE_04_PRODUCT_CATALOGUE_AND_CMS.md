# MILESTONE 04 — PRODUCT CATALOGUE CMS & PUBLISHING WORKFLOW
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement the operational core of the SIWI Global Ventures Admin Console:
1. Product management listing table with search, category filters, publication status filtering, and sorting.
2. Structured 7-Tab Product Editor avoiding chaotic single-page forms.
3. Flexible, administrator-defined specification attributes (EAV pattern) preventing rigid database lock-in.
4. Comprehensive publishing lifecycle: Save Draft → Preview → Publish Checklist → Public Website Live.
5. Public product APIs serving published data, excluding drafts and internal metadata.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 3: Public website architecture (Product categories & routes).
- `Architecture.md` Section 5: Product management — the core of the admin console.
- `Architecture.md` Section 10 (Publishing): Complete publishing workflow.
- `Architecture.md` Section 12: API architecture (Product endpoints).

---

## 3. PREREQUISITES
- Milestone 01, 02, and 03 complete (Database, Auth, Categories, and Media Library active).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Product Management Table Interface (`/admin/products`)
Build a high-density, functional data table (avoiding card clutter as required by `Architecture.md` Section 5):
- **Columns:** Thumbnail & Product Name, Category Badge, Publication Status (Draft: yellow, Published: green, Archived: slate), Last Updated, Updated By, Actions (`Edit`, `Preview`, `Publish/Unpublish`, `Archive`).
- **Toolbar:** Real-time text search, category dropdown filter, status filter, and primary `+ Add Product` button.
- **Bulk Actions:** Publish selected, unpublish selected, archive selected.
- **Empty States:** Helpful guidance when no products match filters.

### 4.2 7-Tab Product Editor Architecture
When creating or editing a product, present a clean tabbed workspace:

#### Tab 1: General Information
- Product Name (Text, required).
- URL Slug (Text, required, auto-generated from name with uniqueness check).
- Short Description (Textarea, required, 140–200 characters).
- Full Narrative Description (Rich-text editor with clean HTML/Markdown output).
- Primary Category (Dropdown, required) & Additional Categories (Multi-select, optional).
- Featured Product toggle & Numeric Display Order.

#### Tab 2: Product Images
- Integrated Media Library selector & direct drag-and-drop file uploader.
- Featured Hero Image selector (primary image for hero and catalogue cards).
- Gallery image list with drag-and-drop reordering.
- Per-image alt text and optional caption.
- Image crop and responsive variant preview.

#### Tab 3: Flexible Technical Specifications
Implement an extensible key-value attribute builder:
- Add / remove specification rows dynamically without database migrations.
- Fields per row: Attribute Name (e.g., *Particle Size, Moisture Content, Form*), Value (*Fine Powder, Max 5.0%*), Unit (*% / mesh*), Public Visibility toggle, Display Order, Internal Notes.
- Mandatory Rule: Never generate fake default values. If unverified by laboratory test, leave blank.

#### Tab 4: Packaging and Commercial Supply
- Packaging Type (e.g., *Multi-wall paper bag with inner liner, Corrugated carton*).
- Available Pack Sizes (e.g., *10 kg, 20 kg, 25 kg, Custom bulk*).
- Minimum Order Quantity (MOQ) — optional field, left empty if unconfirmed.
- Supply Capacity & Seasonality notes.

#### Tab 5: Certificates and Technical Documents
- Attach uploaded documents from the Document Library (Specification Sheets, Certificates of Analysis, Product Brochures).
- Assign public vs. private visibility per document attachment.

#### Tab 6: SEO and URL Management
- Custom SEO Title and Meta Description (auto-defaults to product name and short description).
- OpenGraph social share image selector.
- Canonical URL override.
- **Redirect Protection:** If a published product slug is altered (e.g. `onion-powder` → `pure-onion-powder`), automatically generate a 301 redirect entry to prevent broken external links.

#### Tab 7: Publishing Controls & Pre-Flight Checklist
- Status options: `Draft`, `Published`, `Archived`.
- Actions: `Save Draft`, `Preview Product Page`, `Publish Now`, `Archive Product`.
- **Pre-Flight Publication Checklist:**
  - [x] Product Name provided
  - [x] Unique URL slug verified
  - [x] Category assigned
  - [x] Short description provided
  - [x] Featured image selected
  - [ ] Technical specifications reviewed (optional)
  - [ ] Documents and certificates verified (optional)
  - [ ] SEO metadata reviewed (optional)

### 4.3 Backend API Endpoints (`packages/server`)
- `POST /api/admin/products`: Create product draft.
- `GET /api/admin/products`: List products with pagination, search, category, and status filters.
- `GET /api/admin/products/:id`: Full product detail including draft content and internal notes.
- `PATCH /api/admin/products/:id`: Update product attributes.
- `POST /api/admin/products/:id/publish`: Verify checklist, set status to `PUBLISHED`, set `publishedAt`.
- `POST /api/admin/products/:id/unpublish`: Revert status to `DRAFT`.
- `POST /api/admin/products/:id/archive`: Soft-archive product (preserves enquiry foreign keys).
- `GET /api/public/products`: Public catalogue endpoint. **Strict rule:** Only returns products where `status === 'PUBLISHED'`. Excludes internal notes, private docs, and draft text.
- `GET /api/public/products/:slug`: Public product detail by slug. Rejects draft slugs with `404 Not Found`.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Admin user creates a new product (*Onion Powder*), uploads imagery, adds 4 specifications, and saves as `DRAFT`.
- [ ] Direct call to `GET /api/public/products/onion-powder` returns `404 Not Found` while in draft.
- [ ] Admin clicks `Publish Now`; checklist validates; status changes to `PUBLISHED`.
- [ ] Immediate call to `GET /api/public/products` returns the newly published product with all public specifications.
- [ ] Changing a published slug automatically records a URL redirect.
- [ ] Deletion is prevented if enquiries reference this product; archiving works cleanly.
