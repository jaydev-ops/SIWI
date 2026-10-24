# LEVEL 07 — STITCH EXECUTION PLAYBOOK
## SIWI Global Ventures — Reference System

---

## 1. OPERATING PHILOSOPHY FOR GOOGLE STITCH AI

Google Stitch AI operates with maximum precision when tasks are structured into bounded, iterative, single-purpose design stages.

### Foundational Prompting Rules
1. **Never Attempt a "One-Shot" Full Website Generation:** Instructing Stitch to create all 16 pages simultaneously guarantees generic AI templates, repetitive cards, hallucinated statistics, and ignored constraints.
2. **Sequential, Approval-Based Workflow:** Execute one design stage at a time. Review output against LEVEL 06 quality checklists before proceeding.
3. **Reference Inheritance Model:** Every prompt must explicitly inherit:
   - `00_MASTER_BRIEF.md` (Master control & rules)
   - `LEVEL_01_BRAND_FOUNDATION.md` (Corporate facts & identity)
   - `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` (Tokens, typography, colors, spacing)
   Plus the specific levels relevant to that stage.
4. **Self-Contained Context Injection:** Because Stitch may not have direct file system access, each prompt must contain an executive distillation of mandatory rules alongside the file references.
5. **Zero Hallucination Enforcement:** Remind Stitch in every single generation that certifications, client logos, testimonials, and specifications must never be fabricated.

---

## 2. THE 15-STAGE STITCH EXECUTION WORKFLOW

The end-to-end design process is divided into 15 structured stages:

```
[Stage 01: Brand Direction] → [Stage 02: 3 Visual Directions] → [Stage 03: Direction Selection]
         ↓
[Stage 04: Homepage Generation] → [Stage 05: Homepage Refinement]
         ↓
[Stage 06: Products Catalogue] → [Stage 07: Product Detail Template]
         ↓
[Stage 08: 6 Product Pages] → [Stage 09: Secondary Category Pages]
         ↓
[Stage 10: About Us Page] → [Stage 11: Trade Enquiries Portal] → [Stage 12: Contact Page]
         ↓
[Stage 13: Light & Dark Theme Review] → [Stage 14: Mobile Responsive Review]
         ↓
[Stage 15: Final Quality Audit & Handover]
```

---

## 3. STAGE-BY-STAGE EXECUTION SPECIFICATIONS

### STAGE 01 — Brand Direction & Moodboard
- **Objective:** Establish the core aesthetic balance between Apple-inspired typographic restraint and international agricultural trade.
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`.
- **Expected Deliverables:** High-level moodboard layout demonstrating charcoal/gold/ivory palette harmony, editorial serif and sans-serif type pairing, and authentic macro ingredient photography.
- **Review Criteria:** Ensure green is excluded as a primary brand tone; verify gold is restrained; confirm compass motif subtlety.
- **Exit Condition:** Visual mood approved as aligned with SIWI brand character.

### STAGE 02 — Three Visual Directions Exploration
- **Objective:** Generate 3 distinct design explorations for the core brand interface:
  - *Direction A (Ultra-Minimalist Editorial):* Spacious ivory layout, expansive whitespace, high-contrast typography, hairline gold accents.
  - *Direction B (Deep Commodity Authority):* Charcoal-grounded atmosphere, rich macro ingredient photography, industrial grid precision.
  - *Direction C (Hybrid Contemporary B2B):* Warm stone surfaces, asymmetric geometric splits, fine-line compass linework, prominent data tables.
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`, `LEVEL 03`.
- **Expected Deliverables:** Side-by-side hero and feature section concepts for all 3 directions.
- **Review Criteria:** No generic SaaS templates; no card clutter; distinct character between all three.
- **Exit Condition:** Team selection of one definitive visual direction.

### STAGE 03 — Direction Selection & Design System Lock
- **Objective:** Formalize the winning direction into locked design system variables (colors, typography scales, spacing tokens, border treatments).
- **Required Reference Levels:** `LEVEL 02`, `LEVEL 03`.
- **Expected Deliverables:** Documented design tokens and primitive UI component specimens (buttons, inputs, headers, badges).
- **Review Criteria:** Perfect match with token values in `LEVEL_02_VISUAL_DESIGN_SYSTEM.md`.
- **Exit Condition:** Approved token specifications ready for page generation.

### STAGE 04 — Homepage Desktop Generation
- **Objective:** Generate the complete desktop layout of the Homepage (`/`).
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`, `LEVEL 03`, `LEVEL 04` (Page 1 specs), `LEVEL 05`.
- **Expected Deliverables:** High-fidelity desktop homepage featuring Sections A through G: Navigation, Hero, Product Focus, How SIWI Operates, About Preview, Trade Enquiries banner, and Footer.
- **Review Criteria:** Asymmetric 45/55 hero split; verified copy; zero generic cards; no fake client logos or statistics.
- **Exit Condition:** Homepage layout fully articulated.

### STAGE 05 — Homepage Review & Polish
- **Objective:** Scrutinize and refine typography, contrast, spacing rhythm, and interactive states on the Homepage.
- **Required Reference Levels:** `LEVEL 02`, `LEVEL 03`, `LEVEL 06`.
- **Expected Deliverables:** Refined homepage with pixel-perfect alignments, hover feedback states, and micro-interactions.
- **Review Criteria:** Spacing adheres to 8px scale; WCAG contrast compliance; negative constraints strictly respected.
- **Exit Condition:** Homepage locked as the benchmark for subsequent pages.

### STAGE 06 — Products Catalogue Index
- **Objective:** Design the master Products Catalogue (`/products`).
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`, `LEVEL 03`, `LEVEL 04` (Page 3 specs).
- **Expected Deliverables:** Catalogue layout featuring category filters, prominent Dehydrated Vegetables showcase (7 items), and secondary category pathways (Tiles, Other Products).
- **Review Criteria:** B2B procurement focus; no consumer e-commerce cart elements; clear pathways to individual product detail pages.
- **Exit Condition:** Catalogue index approved.

### STAGE 07 — Product Detail Page Master Template
- **Objective:** Design the reusable master template for individual product detail routes.
- **Required Reference Levels:** `LEVEL 02`, `LEVEL 03`, `LEVEL 04` (Page 5 specs), `LEVEL 05`.
- **Expected Deliverables:** Complete layout framework featuring breadcrumbs, macro product imagery, verified descriptions, processing notes, specification sheet fallback, packaging notes, related products, and prefilled inquiry CTA.
- **Review Criteria:** Honest handling of unconfirmed specs; clear B2B inquiry trigger; zero shopping cart buttons.
- **Exit Condition:** Product detail master framework locked.

### STAGE 08 — Six Individual Dehydrated Product Pages
- **Objective:** Populate the master template with individual content and imagery for all 6 confirmed dehydrated vegetable products:
  - `/products/onion-powder`
  - `/products/garlic-powder`
  - `/products/garlic-granules`
  - `/products/dehydrated-fried-onions`
  - `/products/birista`
  - `/products/onion-kibbles`
- **Required Reference Levels:** `LEVEL 01`, `LEVEL 04` (Page 5 specs), `LEVEL 05`.
- **Expected Deliverables:** 6 distinct, content-accurate product detail pages.
- **Review Criteria:** Individual product photography; accurate format descriptions; proper contextual enquiry URL parameters.
- **Exit Condition:** All 6 primary product pages verified.

### STAGE 09 — Secondary Category Pages (Tiles & Other Products)
- **Objective:** Design dedicated pages for secondary trading categories:
  - `/products/tiles`
  - `/products/other-products`
- **Required Reference Levels:** `LEVEL 01`, `LEVEL 04` (Pages 8 & 9 specs).
- **Expected Deliverables:** Visual continuity with primary site while clearly categorizing tiles as non-agricultural traded goods; open, future-proof structure for other products.
- **Review Criteria:** Zero fabricated tile catalogues or fake specifications; direct inquiry triggers.
- **Exit Condition:** Secondary category pages approved.

### STAGE 10 — About Us Page
- **Objective:** Design the comprehensive About Us page (`/about`).
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`, `LEVEL 03`, `LEVEL 04` (Page 2 specs).
- **Expected Deliverables:** Editorial company narrative, core trade principles, Mumbai operational headquarters highlight, founder Harshvardhan Patil section, and closing trade CTA.
- **Review Criteria:** Dignified, human tone; zero generic corporate cards; zero fabricated founder degrees or awards.
- **Exit Condition:** About Us page approved.

### STAGE 11 — Trade Enquiries Portal
- **Objective:** Design the dedicated commercial procurement portal (`/trade-enquiries`).
- **Required Reference Levels:** `LEVEL 00`, `LEVEL 01`, `LEVEL 02`, `LEVEL 04` (Page 6 specs), `LEVEL 05`.
- **Expected Deliverables:** High-trust B2B enquiry portal featuring required fields, commercial parameters (volume, packaging, port), product pre-fill selector, validation states, and transparent submission handling.
- **Review Criteria:** Accessible labels; keyboard navigation; zero simulated fake submission screens.
- **Exit Condition:** Trade enquiry portal validated.

### STAGE 12 — Contact & Legal Pages
- **Objective:** Design the Contact page (`/contact`), Privacy Policy (`/privacy-policy`), and Terms (`/terms`).
- **Required Reference Levels:** `LEVEL 01`, `LEVEL 04` (Pages 7, 10, 11 specs), `LEVEL 05`.
- **Expected Deliverables:** Contact directory with clickable phone/email and subject selector; clean typographic legal documents.
- **Review Criteria:** Verified Mumbai location; functional `tel:` and `mailto:` links; zero fake street addresses.
- **Exit Condition:** Communications and legal routes complete.

### STAGE 13 — Dark & Light Theme Audit
- **Objective:** Conduct side-by-side evaluation of every route across Dark Mode and Light Mode.
- **Required Reference Levels:** `LEVEL 02` (Colour system), `LEVEL 06`.
- **Expected Deliverables:** Side-by-side theme parity screenshots/mockups confirming correct surface values, high text contrast, and no simple CSS color inversion.
- **Review Criteria:** Light mode utilizes warm ivory (`#F5F2EB`); dark mode utilizes deep charcoal (`#191C21`); gold rules respected in both.
- **Exit Condition:** Both themes fully compliant with WCAG AA contrast standards.

### STAGE 14 — Mobile & Tablet Responsive Audit
- **Objective:** Review responsive layouts across mobile (<640px) and tablet (640–1023px) viewports.
- **Required Reference Levels:** `LEVEL 06` (Section 1).
- **Expected Deliverables:** Mobile layouts for Homepage, Catalogue, Product Detail, and Trade Enquiries.
- **Review Criteria:** Touch targets >= 44px; clean vertical stacking; mobile drawer functional; zero horizontal overflow.
- **Exit Condition:** Responsive adaptability verified across all 16 routes.

### STAGE 15 — Final Production & Quality Audit
- **Objective:** Comprehensive audit against all 27 original source documents and the 6-pillar art direction standard.
- **Required Reference Levels:** `LEVEL 00` through `LEVEL 06`, `DOCUMENTATION_VALIDATION.md`.
- **Expected Deliverables:** Completed validation checklist, audit log, and finalized code/design assets ready for deployment.
- **Review Criteria:** All 16 routes exist; zero broken links; zero content hallucinations; all negative constraints respected.
- **Exit Condition:** Official sign-off and delivery of the SIWI Global Ventures digital reference system.

---

## 4. SOURCE MAPPING & TRACEABILITY

This document synthesizes:
- `SOURCE/27_required_deliverables.md` (Workflow milestones, deliverables)
- Section 4, 8, and 9 of user specifications (Staged Stitch AI execution rules, reference inheritance, prompt isolation)
