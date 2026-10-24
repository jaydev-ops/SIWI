# LEVEL 06 — RESPONSIVENESS AND QUALITY REQUIREMENTS
## SIWI Global Ventures — Reference System

---

## 1. RESPONSIVE DESIGN STANDARDS & BREAKPOINTS

The website must deliver an uncompromising, art-directed experience across all screen sizes.

### Responsive Breakpoint Framework
```css
/* Standard Breakpoints */
--breakpoint-mobile: 480px;
--breakpoint-tablet-sm: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-desktop-lg: 1280px;
--breakpoint-wide: 1440px;
```

### Layout Adaptation Guidelines by Viewport

#### Mobile (< 640px)
- **Grid Stacking:** Multi-column asymmetric splits collapse into single-column vertical flows.
- **Visual Stacking Order:** Headline and context appear first; imagery follows; primary CTA remains in immediate view.
- **Horizontal Margins:** 20px–24px padding to prevent edge crowding while maximizing readable area.
- **Touch Ergonomics:** All interactive buttons, navigation links, and inputs must have minimum touch targets of **44px × 44px**.
- **No Pinch-to-Zoom Degradation:** Use `viewport` meta tag `width=device-width, initial-scale=1.0` without disabling user zoom.
- **Zero Horizontal Overflow:** Strict containment of tables and images (`max-width: 100%`, `overflow-x: auto` for data tables).

#### Tablet (640px–1023px)
- **Moderate Asymmetry:** 2-column layouts adapt to 50/50 or 60/40 splits with reduced column gutters.
- **Horizontal Margins:** 28px–40px padding.
- **Navigation:** Transition to compact hamburger drawer below 1024px to prevent link wrapping.

#### Desktop & Wide (>= 1024px)
- **Full Editorial Expression:** Unconstrained asymmetric splits, generous whitespace (96px–144px vertical section padding).
- **Measure Control:** Text reading columns constrained to 640px–740px to prevent fatigue.
- **Content Max Width:** Bounded between 1120px and 1320px for optimal visual balance on ultra-wide monitors.

---

## 2. ACCESSIBILITY COMPLIANCE (WCAG 2.1 AA)

SIWI Global Ventures adheres to strict accessibility standards to ensure global accessibility for all buyers and partners.

### Core Accessibility Standards
1. **Color Contrast Ratios:**
   - Normal text (body copy, links, inputs): Minimum contrast ratio of **4.5:1** against underlying backgrounds.
   - Large text (headings >= 24px regular or >= 18px bold): Minimum contrast ratio of **3.0:1**.
   - Essential UI components and icons: Minimum contrast ratio of **3.0:1**.
2. **Keyboard Navigation:**
   - Logical tab index flow mirroring visual hierarchy across all pages and modals.
   - Visible, high-contrast `:focus-visible` outline rings (e.g. `2px solid var(--brand-gold)` with `2px offset`).
   - Focus traps within mobile navigation drawers and enquiry dialogs, releasing focus upon closure.
3. **Semantic HTML5 Architecture:**
   - Strictly one `<h1>` per page.
   - Logical heading hierarchy (`<h1>` → `<h2>` → `<h3>` without skipping levels).
   - Use landmark elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
4. **Forms & Labels:**
   - Explicit `<label>` elements linked to inputs via matching `for` and `id` attributes.
   - Never rely exclusively on placeholder text for form field identification.
   - Error messages announced cleanly to assistive technology (`aria-describedby`, `aria-live="polite"`).
5. **Image Descriptions:**
   - Descriptive `alt` attributes for all product photography (e.g. `alt="Fine dehydrated golden onion powder on neutral slate"`).
   - Decorative compass linework and decorative dividers marked with `alt=""` or `aria-hidden="true"`.
6. **Motion Sensitivity:**
   - Complete support for `prefers-reduced-motion` media queries disabling non-essential transitions and animations.

---

## 3. SEO FOUNDATIONS & PERFORMANCE TARGETS

### Technical SEO Requirements
- **Descriptive Page Titles:** Unique, keyword-accurate `<title>` tags for each route (e.g., `<title>Onion Powder Export | Dehydrated Vegetables | SIWI Global Ventures</title>`).
- **Compelling Meta Descriptions:** 140–160 character descriptions summarizing verified capabilities and inviting B2B enquiry.
- **OpenGraph & Twitter Cards:** Full metadata markup enabling rich social and messaging previews with verified branding.
- **Structured Data (JSON-LD):**
  - `Organization` schema on Homepage and About pages with official contact details, Mumbai location, and founder Harshvardhan Patil.
  - `Product` schema on each individual product page with verified product names, categories, and supply enquiry triggers.
  - `BreadcrumbList` schema mirroring the page hierarchy.

### Performance & Core Web Vitals Targets
- **Largest Contentful Paint (LCP):** < 2.5 seconds on mobile and desktop.
- **First Input Delay (FID) / Interaction to Next Paint (INP):** < 200 milliseconds.
- **Cumulative Layout Shift (CLS):** < 0.1 (strict image aspect-ratio reservations, zero unstyled font shifts).
- **Asset Optimization:** Next-generation WebP or AVIF image compression with responsive `srcset` resolutions.
- **Lazy Loading:** Native `loading="lazy"` on all below-the-fold product imagery.

---

## 4. TECHNICAL FRONTEND IMPLEMENTATION STANDARDS

### Architectural Principles
- **Modern Semantic Stack:** Clean HTML5, vanilla CSS with custom properties, and modular JavaScript.
- **CSS Architecture:** Scoped design tokens, fluid typography utilizing `clamp()`, and utility classes mapped to the 8px spacing rhythm.
- **Zero Heavy Dependencies:** Avoid monolithic UI frameworks that inject generic styles and slow bundle times.
- **Code Security:** Zero hardcoded API secrets, SMTP passwords, or private tokens in frontend files.

---

## 5. STRICT PROHIBITIONS: WHAT MUST NOT APPEAR

To prevent AI generation drift and maintain elite commercial credibility, the following design anti-patterns are strictly forbidden:

### A. Generic AI & SaaS Aesthetic Clichés
- NO purple-to-blue or cyan gradients.
- NO random green accents (Green is NOT the SIWI brand color).
- NO blurry gradient blobs or ambient colored fog.
- NO glowing neon orbs or radiant halos.
- NO pervasive frosted glass / glassmorphism cards.
- NO floating 3D clay or cartoon objects.
- NO SaaS-style dashboard mockups or floating UI widgets.
- NO repetitive 3-column card grids repeated across every section.

### B. Generic Stock Imagery Clichés
- NO stock business handshakes or executive agreements.
- NO smiling people in business suits around glass conference tables.
- NO random generic skyscrapers or corporate office towers.
- NO decorative container ships or cargo airplanes with no relevance to content.
- NO AI-generated human portraits posing as fake employees.

### C. Overdesigned Interface Clichés
- NO excessive pill-shaped buttons with massive padding.
- NO thick colored borders framing every block of text.
- NO large, fuzzy drop shadows simulating artificial elevation.
- NO competing, flashing CTA buttons.
- NO decorative, fake statistic counters (e.g. counters ticking up to 99%).
- NO fake customer ratings (e.g. "4.9 / 5 Stars on Trustpilot").

### D. Poor Typographic Practices
- NO heavy bold fonts applied across all headings.
- NO excessively loose tracking applied to long-form body copy.
- NO tiny, unreadable body copy (< 15px).
- NO random combinations of multiple competing decorative fonts.

### E. Disruptive Interactive Patterns
- NO custom cursor followers or trailing dots.
- NO scroll hijacking or altered wheel inertia.
- NO pervasive parallax on background elements.
- NO autoplay background video loops with audio.
- NO artificial pre-loader screens blocking initial page render.

### F. Misleading Business Content
- NO fabricated ISO, FSSAI, or HACCP certification badges.
- NO invented export volumes, turnover numbers, or factory floor sizes.
- NO fabricated client testimonials or unverified customer logos.

---

## 6. FINAL ART-DIRECTION QUALITY CHECKLIST

Before approving any page design or template, rigorously evaluate against these 6 pillars:

### 1. Visual Identity Alignment
- Does the layout undeniably belong to SIWI Global Ventures?
- Is the charcoal, gold, and ivory palette applied in correct proportions (65–75% neutral, 15–25% secondary, 5–10% gold)?
- Is the signature compass-and-globe motif used with graphic restraint?
- Is generic corporate green completely excluded?

### 2. Typographic Elegance
- Does typography demonstrate Apple-like discipline, spatial balance, and restraint?
- Are font weights predominantly Regular and Medium rather than heavy bold?
- Is body copy line measure constrained to 55–75 characters?
- Is display heading line-height tight (0.98–1.05)?

### 3. Spatial & Compositional Balance
- Is whitespace used intentionally as a foundational structural element?
- Are section margins spacious (96px–144px vertical padding on desktop)?
- Is deliberate asymmetry applied to create an editorial, human art-directed layout?
- Are unnecessary card containers eliminated?

### 4. Content Integrity & Authenticity
- Is the primary dehydrated vegetable export focus immediately evident?
- Are all product names and formats accurate to the confirmed catalogue?
- Is copy direct, human, concise, and free of corporate jargon?
- Are unconfirmed technical parameters handled honestly with enquiry triggers?

### 5. Interaction & Operational Integrity
- Do all 16 page routes exist as standalone accessible URLs?
- Are telephone (`tel:`) and email (`mailto:`) links fully functional?
- Do product enquiry buttons correctly pre-fill the trade enquiry form?
- Does the dark/light mode toggle work smoothly without FOUC?
- Does the mobile drawer operate cleanly without horizontal scroll?

### 6. Professional Market Impression
- Would an international procurement officer in Europe, North America, or the Middle East immediately perceive SIWI as a reliable, serious trading partner?
- Does the platform look custom-crafted rather than template-generated?

---

## 7. REQUIRED DELIVERABLES

The complete SIWI web design initiative encompasses 12 mandatory deliverables:

1. **Complete Multi-Page Website:** All 16 routes implemented as distinct pages with operational navigation.
2. **Light & Dark Themes:** Fully realized dual-theme system with manual toggle and system auto-detection.
3. **Responsive Viewport Support:** Art-directed layouts customized for Desktop (>=1024px), Tablet (640–1023px), and Mobile (<640px).
4. **Unified Design System:** Reusable tokens for typography, spacing, colors, borders, radii, and component primitives.
5. **Comprehensive Product Catalogue:** Master index presenting dehydrated vegetable lines and secondary traded goods.
6. **Individual Product Detail Pages:** 6 dedicated routes for confirmed dehydrated vegetable lines with contextual inquiry triggers.
7. **B2B Trade Enquiry Portal:** Multi-field commercial inquiry form with input validation, product preselection, and transparent submission.
8. **Brand Identity Preservation:** Official SIWI wordmark, gold-and-charcoal identity, and signature compass motif maintained.
9. **Production-Ready Frontend Architecture:** Clean, modular, standards-compliant HTML/CSS/JS with zero security vulnerabilities.
10. **Zero-Fabrication Content Standard:** 100% adherence to verified facts, confirmed products, and honest missing-data handling.
11. **Technical SEO Foundations:** Complete metadata tags, OpenGraph protocol, semantic HTML, and JSON-LD structured schema.
12. **Final Art-Direction Audit:** Exhaustive verification against the quality checklist and negative constraints.

---

## 8. SOURCE MAPPING & TRACEABILITY

This document consolidates and formalises:
- `SOURCE/20_responsive_design.md` (Breakpoints, mobile ergonomics, stacking rules)
- `SOURCE/21_accessibility.md` (WCAG 2.1 AA, contrast, keyboard, semantic markup)
- `SOURCE/22_seo_and_performance.md` (SEO metadata, Core Web Vitals, asset compression)
- `SOURCE/23_technical_implementation.md` (Frontend architecture, routing, form security)
- `SOURCE/25_what_must_not_appear.md` (Strict negative constraints, banned AI clichés)
- `SOURCE/26_final_art_direction_standard.md` (6-pillar quality evaluation checklist)
- `SOURCE/27_required_deliverables.md` (12 project deliverables, core visual direction)
