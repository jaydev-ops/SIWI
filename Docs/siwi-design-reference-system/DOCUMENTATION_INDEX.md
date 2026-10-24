# DOCUMENTATION INDEX & SOURCE-TO-LEVEL MAPPING
## SIWI Global Ventures — Reference System

---

## 1. OVERVIEW & METHODOLOGY

This index provides a complete, transparent, and bidirectional mapping of all 27 original Markdown source documents into the consolidated 7-level hierarchical reference system for SIWI Global Ventures.

Every original requirement, token, layout rule, negative constraint, and business detail has been rigorously preserved and categorized by functional responsibility.

---

## 2. MASTER SOURCE-TO-LEVEL MAPPING TABLE

| # | Original Source Filename | Original Title & Scope | Primary Destination Level | Status | Consolidated Content Summary | Notes on Resolution & Nuance |
|---|---|---|---|---|---|---|
| 01 | `01_role_and_overview.md` | Role and Project Intent | `LEVEL_01_BRAND_FOUNDATION.md` | Consolidated | Art director role, audience definition, Apple-inspired restraint, project scope | Sets the foundational professional standard for all design generation. |
| 02 | `02_company_information.md` | Company Information & Identity | `LEVEL_01_BRAND_FOUNDATION.md` | Consolidated | Official name, Mumbai location, founder Harshvardhan Patil, contact data, confirmed products, brand assets | Absolute authority for corporate facts. Contact links mapped to `tel:` and `mailto:`. |
| 03 | `03_core_design_philosophy.md` | Core Design Philosophy | `LEVEL_01_BRAND_FOUNDATION.md` | Consolidated | 5 pillars (Trust, Clarity, Quality, Global Reach, Reliability), subtraction over decoration | Non-negotiable philosophical baseline for every page. |
| 04 | `04_typography.md` | Typography System | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | System sans-serif stack, editorial serif, complete typographic scale, line-height, measures | Exact desktop, tablet, and mobile font sizes preserved. |
| 05 | `05_spacing.md` | Spacing & Whitespace | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | 8px spacing scale tokens (`--space-1` to `--space-11`), viewport margins, whitespace principle | Spacing scale codified into CSS custom properties. |
| 06 | `06_colour_system.md` | Colour System & Themes | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | Hex tokens (`#111318`, `#191C21`, `#C69A45`, `#F5F2EB`), light/dark themes, gold rules | Strict prohibition of green as brand color preserved. |
| 07 | `07_signature_design_element.md`| The Global Compass Motif | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | Compass-and-globe visual language, vector linework, section placements, banned 3D globes | Placements specified across Hero, Products, About, Contact, and Footer. |
| 08 | `08_hero_section.md` | Hero Section Art Direction | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | Asymmetric 45/55 desktop split, headline typography, copy, primary/secondary CTAs, mobile stack | Cross-referenced in Level 04 for Homepage Section B. |
| 09 | `09_product_presentation.md` | Product Presentation | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | B2B presentation, specification sheets, confirmed product descriptions, B2B CTAs | Strict ban on consumer e-commerce shopping carts reinforced. |
| 10 | `10_use_fewer_cards.md` | Use Fewer Cards | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | Elimination of generic card grids, editorial alternatives, narrow exceptions for cards | Prevents generic AI template generation. |
| 11 | `11_deliberate_asymmetry.md` | Deliberate Asymmetry | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | Asymmetric grid layouts, 60/40 splits, visual rhythm, mobile responsiveness rules | Guarantees an editorial, human art-directed aesthetic. |
| 12 | `12_website_architecture.md` | Complete Website Architecture | `LEVEL_04_WEBSITE_ARCHITECTURE_AND_PAGES.md` | Consolidated | Full sitemap, 16 dedicated routes, multi-page principle, URL hierarchy | Explicit prohibition of single-page scroll hacks. |
| 13 | `13_page_specifications.md` | Detailed Page Specifications | `LEVEL_04_WEBSITE_ARCHITECTURE_AND_PAGES.md` | Consolidated | Section-by-section breakdown for all 10 page types (Home, About, Catalogue, Detail, Enquiries, Contact, etc.) | Complete 16-route specifications fully detailed without omission. |
| 14 | `14_navigation.md` | Navigation & IA | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | Desktop navigation, products dropdown, mobile drawer, breadcrumbs, keyboard focus | Cross-referenced in Level 04 Section A. |
| 15 | `15_footer_design.md` | Footer Design | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | 3-column asymmetric layout, brand statement, directory, official contact, legal links | Cross-referenced in Level 04 Section G. |
| 16 | `16_animations.md` | Animations — Premium, Not Flashy | `LEVEL_03_LAYOUT_AND_COMPONENTS.md` | Consolidated | Cubic-bezier curves, duration scales (120–280ms), hover limits (1.02), prefers-reduced-motion | Prohibits distracting parallax and spinning icons. |
| 17 | `17_image_art_direction.md` | Image Art Direction | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | Macro ingredient photography, natural lighting, neutral surfaces, banned stock clichés | Aligned directly with Hero and Product presentation. |
| 18 | `18_copywriting.md` | Copywriting — Human & Precise | `LEVEL_05_CONTENT_AND_INTERACTIONS.md` | Consolidated | Direct B2B tone of voice, forbidden jargon comparison table, active voice | Establishes the authoritative voice of SIWI. |
| 19 | `19_product_enquiry_experience.md`| Product Enquiry Experience | `LEVEL_05_CONTENT_AND_INTERACTIONS.md` | Consolidated | 7-step buyer journey, URL parameter pre-filling (`?product=`), validation states, backend honesty | Seamless link between product detail pages and the enquiry portal. |
| 20 | `20_responsive_design.md` | Responsive Design | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | Breakpoint framework (<640px, 640–1023px, >=1024px), 44px touch targets, mobile stacking | Technical responsive rules codified. |
| 21 | `21_accessibility.md` | Accessibility Standards | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | WCAG 2.1 AA, 4.5:1 / 3.0:1 contrast ratios, keyboard navigation, focus rings, semantic tags | Essential compliance guidelines. |
| 22 | `22_seo_and_performance.md` | SEO and Performance | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | Page titles, meta descriptions, OpenGraph, JSON-LD schema, Core Web Vitals targets | Structured schema standards defined for B2B discovery. |
| 23 | `23_technical_implementation.md`| Technical Implementation | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | Modular HTML/CSS/JS, custom properties, form handling, route separation, security rules | Production-readiness criteria codified. |
| 24 | `24_design_system.md` | Design System Tokens | `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` | Consolidated | Radii tokens (`--radius-small`, `--radius-medium`, `--radius-large`), borders, shadow restraint | Integrated into the core design system tokens. |
| 25 | `25_what_must_not_appear.md` | Prohibited Design Patterns | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | Strict negative constraints: no purple/blue gradients, no green, no blobs, no handshakes, no carts | Preserved verbatim as mandatory quality gates. |
| 26 | `26_final_art_direction_standard.md`| Final Art Direction Standard | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | 6-pillar evaluation checklist (Identity, Typography, Layout, Content, Functionality, Impression) | Used as the exit criteria for all design stages. |
| 27 | `27_required_deliverables.md` | Required Deliverables | `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md` | Consolidated | 12 mandatory project deliverables, recommended visual direction (charcoal/ivory/gold, macro photo) | Informs the 15-stage workflow in Level 07. |

---

## 3. UNRESOLVED AMBIGUITIES & CONFLICT RESOLUTIONS

During restructuring, the following nuances were identified, audited, and resolved:

1. **Brand Color Harmony (Green vs. Gold/Charcoal):**
   - *Observation:* Agricultural export websites often default to generic leafy green.
   - *Resolution:* SOURCE/06 explicitly dictates that green is NOT the brand color. The official brand identity is charcoal, metallic gold, and ivory. Green is strictly prohibited as a brand accent across all levels.
2. **Product Page Structure (Provisional vs. Fabricated):**
   - *Observation:* Full specifications (e.g. moisture %, microbial limits, mesh size) are pending official laboratory analysis for some products.
   - *Resolution:* Never fabricate numbers. Product detail templates include a standard commercial inquiry fallback: *"Contact our technical sourcing team for comprehensive specification sheets, microbiological parameters, and certificates of analysis."*
3. **Multi-Page vs. Single-Page Navigation:**
   - *Observation:* Modern web generators frequently flatten multi-page architectures into one long landing page with anchor links (`#products`, `#contact`).
   - *Resolution:* Single-page scrolling hacks are strictly prohibited. All 16 routes are documented and enforced as distinct, accessible web pages.
4. **Form Submission Backend:**
   - *Observation:* Frontend prototypes often display misleading success screens without actually transmitting data.
   - *Resolution:* LEVEL 05 enforces backend honesty. If an API is unavailable, the form transparently generates a pre-filled client-side `mailto:` inquiry or connects to an authenticated serverless endpoint.
