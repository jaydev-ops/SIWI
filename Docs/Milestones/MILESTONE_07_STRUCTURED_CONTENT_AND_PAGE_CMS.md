# MILESTONE 07 — STRUCTURED PAGE CONTENT CMS & GLOBAL SETTINGS
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Empower authorized administrators to manage corporate text, imagery, and global configuration without code edits:
1. Structured page content editors (`/admin/pages`) for Homepage, About Us, Contact, and Footer.
2. Validated JSON content schemas preventing malformed markup or unescaped scripts.
3. Revision tracking (`page_revisions` table) enabling draft saving, visual preview, and reliable publication.
4. Global Site Settings console (`/admin/settings`) governing corporate phone, email, location, and SEO defaults.
5. Strict adherence to the "What should be editable without code?" governance boundary (`Architecture.md` Section 18).

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 8: Website content management (Pages to manage, preview & publishing).
- `Architecture.md` Section 11: Database architecture (`site_pages`, `page_revisions`, `site_settings`).
- `Architecture.md` Section 18: What should be editable without code? (Strict boundary matrix).

---

## 3. PREREQUISITES
- Milestone 01, 02, and 05 complete (Fastify API, Database, and Public Website live).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Structured Content Schema Architecture
Instead of a fragile drag-and-drop page builder, implement validated, structured JSON schemas for each manageable page:

#### Homepage Schema (`slug: "homepage"`)
```typescript
interface HomepageContent {
  hero: {
    eyebrow: string;              // "INDIA · INTERNATIONAL TRADE"
    headline: string;             // "Indian products. Global possibilities."
    description: string;          // Supporting narrative
    primaryCtaLabel: string;      // "Explore Our Products"
    primaryCtaUrl: string;        // "/products"
    secondaryCtaLabel: string;    // "Discuss Your Requirements"
    secondaryCtaUrl: string;      // "/trade-enquiries"
    heroImageId: string;          // MediaAsset ID
  };
  productFocus: {
    heading: string;
    subheading: string;
    featuredProductIds: string[]; // Product UUIDs
  };
  howSiwiWorks: {
    heading: string;
    steps: Array<{ number: string; title: string; description: string }>;
  };
  aboutPreview: {
    heading: string;
    narrative: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  tradeEnquiryCta: {
    heading: string;
    description: string;
    buttonLabel: string;
  };
}
```

#### About Page Schema (`slug: "about"`)
- Hero headline, supporting narrative, company introduction text blocks.
- Core trade principles (Quality Sourcing, Dependable Communication, Sustainable Partnerships).
- Founder section: Harshvardhan Patil title, leadership narrative, portrait image selector.

#### Contact Page Schema (`slug: "contact"`)
- Introduction text, instructions for buyers, verified Mumbai address details.

#### Footer Schema (`slug: "footer"`)
- SIWI tagline (*"Serving with trust, delivering with quality"*), corporate mission narrative, copyright text.

### 4.2 Revision, Preview & Publishing Workflow
```
[Admin Edits Page in /admin/pages/:id]
                 │
                 ▼
          [Save Draft] ──► Writes new record to `page_revisions`
                 │
                 ▼
        [Click Preview] ──► Opens `/preview?page=[slug]&rev=[revId]` in modal/tab
                 │
                 ▼
        [Review & Approve]
                 │
                 ▼
         [Click Publish] ──► Atomically updates `site_pages.content` & sets `publishedAt`
                 │
                 ▼
[Public Website Updated] ──► Fastify clears page cache; public API serves new version
```

### 4.3 Global Site Settings (`/admin/settings`)
Provide unified controls for enterprise-wide variables:
- **Corporate Identity:** Business Name (`SIWI Global Ventures`), Tagline, Primary Logo selector.
- **Official Contact Channels:** Phone (`+91 83696 35619`), Email (`siwiglobalventure@gmail.com`), Physical Location (`Mumbai, Maharashtra, India`).
- **Default SEO & Social:** Default meta title, default meta description, OpenGraph fallback share image.
- **Theme Defaults:** System default theme (Dark / Light).

### 4.4 Admin-Editable vs. Code-Only Governance
Enforce the boundary matrix defined in `Architecture.md` Section 18:
- **Editable in Admin:** Products, Categories, Product Images, Specifications, Certificates, SEO metadata, Homepage text/images, About copy, Contact information, Footer content, Enquiry statuses, Admin user roles.
- **Strictly Code-Only (Development Tasks):** Visual design system tokens, CSS styling, application architecture, database schemas, deployment scripts.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Admin edits Homepage hero headline in `/admin/pages/homepage` and clicks `Save Draft`.
- [ ] Public homepage at `/` remains unchanged with previously published content.
- [ ] Admin clicks `Preview` and inspects the draft changes within the visual preview layout.
- [ ] Admin clicks `Publish`; public homepage immediately reflects the new headline.
- [ ] Updating the phone number in `/admin/settings` automatically updates the phone link across the public header, contact page, and footer.
