# LEVEL 03 — LAYOUT AND COMPONENT PRINCIPLES
## SIWI Global Ventures — Reference System

---

## 1. PRODUCT PRESENTATION PRINCIPLES

The product experience must be built for commercial B2B procurement, not retail consumer e-commerce.

### Procurement-Centric Presentation
- **Factual, high-clarity descriptions:** Focus on physical format, moisture control, grade, particle consistency, and culinary/industrial applications.
- **Specification Tables:** Display verified technical attributes cleanly in tabular form. If unverified, provide an enquiry trigger: *"Contact our technical trade team for batch specifications, mesh sizes, and certificates of analysis."*
- **Action Triggers:** Use B2B CTAs such as `Enquire About This Product`, `Request Commercial Sample`, or `Discuss Supply Volumes`. Never use "Add to Cart" or "Buy Now".

### Layout Configurations for Products
1. **Asymmetric 2-Column Split:** Large product macro image (55–60% width) paired with a structured product specification and enquiry column.
2. **Editorial Specification Sheet:** Typographic product details, format list, and packaging notes separated by clean horizontal rules.
3. **Alternating Feature Rows:** Alternating visual-and-text rows for distinct product families, preventing repetitive card grids.

---

## 2. "USE FEWER CARDS" DIRECTIVE

The default user interface must NEVER be a repetitive grid of rounded rectangle cards.

### When Cards Are Strictly Prohibited
- Do NOT place three identical cards under every section heading.
- Do NOT wrap every single paragraph or bullet point inside a card container.
- Do NOT enclose founder quotes, mission statements, or company introductions in cards.
- Do NOT create floating dashboard cards with excessive drop shadows.

### Permitted Card Applications
Cards are permitted ONLY where grouping physically aids modular interaction:
- Interactive product family selection tiles on the catalogue index.
- Grouped fieldsets within complex trade enquiry forms.
- Structured technical data sheets where clean bounding improves data scanning.

### Preferred Layout Alternatives
- **Editorial Columns:** Text grouped by hierarchy and separated by whitespace.
- **Hairline Rules:** Subtle 1px borders dividing sequential concepts.
- **Asymmetric Composition:** Large headline aligned left with offset narrative on the right.
- **Numbered Sequences:** Minimalist numbered steps (`01`, `02`, `03`) for processes.

---

## 3. DELIBERATE ASYMMETRY

Asymmetry imparts art-directed intentionality, distinguishing SIWI from algorithmic templates.

### Applied Asymmetric Patterns
- **Homepage:** Large left-aligned headline with a vertically staggered product hero visual on the right.
- **Products Index:** Lead product category presented with prominent 60% visual weight, followed by an editorial list for secondary categories.
- **About Page:** Spacious narrative column on the left balanced by a discreet compass graphic and key corporate details on the right.
- **Trade Process:** Left column introducing the partnership philosophy; right column displaying a sequential numbered flow (`01 Understand`, `02 Discuss`, `03 Deliver`).

### Rules for Asymmetry
- Always maintain an underlying mathematical grid (8px spacing rhythm).
- Preserve clear top-to-bottom, left-to-right reading order.
- Ensure asymmetric desktop layouts collapse gracefully into clean vertical stacks on mobile.

---

## 4. NAVIGATION & HEADER ARCHITECTURE

The header must provide frictionless navigation across the multi-page structure.

### Desktop Navigation (>= 1024px)
- **Left Zone:** Official SIWI Global Ventures logo (Serif wordmark + compass mark).
- **Center/Right Zone:** Primary links:
  - `Home` (`/`)
  - `About Us` (`/about`)
  - `Products` (`/products` — with accessible dropdown)
  - `Trade Enquiries` (`/trade-enquiries`)
  - `Contact` (`/contact`)
- **Far Right Zone:**
  - Dark / Light Theme Toggle button.
  - Primary Enquiry CTA: `Request Quote` or `Enquire Now` (leads to `/trade-enquiries`).

### Products Dropdown Architecture
Grouped logically under two distinct headers:
1. **Dehydrated Vegetables:**
   - Onion Powder
   - Garlic Powder
   - Garlic Granules
   - Dehydrated Fried Onions
   - Birista
   - Onion Kibbles
   - Other Value-Added Products
2. **Other Categories:**
   - Tiles
   - Other Products

### Sticky Header Behavior
- Fixed or sticky header on scroll with subtle background opacity and backdrop-filter blur.
- Minimal border-bottom rule (`1px solid rgba(128, 128, 128, 0.15)`).
- Height constrained to 72px–80px on desktop; 60px–64px on mobile.

### Mobile Navigation Drawer (< 1024px)
- Accessible hamburger icon with clear touch target (minimum 44x44px).
- Slide-over or clean full-screen drawer displaying complete navigation hierarchy.
- Direct links to phone (`tel:+918369635619`) and email (`mailto:siwiglobalventure@gmail.com`).
- Prominent theme toggle switch.
- Complete keyboard accessibility: focus trap, `Esc` key to close, `aria-expanded` attributes.

### Breadcrumb Navigation
Mandatory on all individual product pages and sub-routes:
```
Home → Products → Dehydrated Vegetables → Onion Powder
```

---

## 5. FOOTER DESIGN

The footer serves as the authoritative anchor for corporate identity, navigation, and verified contact details.

### Visual Styling
- Dark charcoal background (`--brand-charcoal: #191C21` or `--brand-ink: #111318`) in both dark and light modes, creating a grounding visual anchor.
- Fine hairline dividing rules and generous internal padding (80–112px top/bottom).

### 3-Column Asymmetric Layout
1. **Left Column (Brand Anchor):**
   - SIWI Global Ventures logo with gold wordmark and compass emblem.
   - Tagline: *"Serving with trust, delivering with quality."*
   - Brief corporate mission: *"Connecting quality Indian products with international markets through dependable trade partnerships."*
2. **Middle Column (Directory):**
   - **Explore:** About Us, Products Catalogue, Dehydrated Vegetables, Tiles, Trade Enquiries, Contact.
3. **Right Column (Authoritative Contact):**
   - **Phone:** `+91 83696 35619` (clickable `tel:`)
   - **Email:** `siwiglobalventure@gmail.com` (clickable `mailto:`)
   - **Location:** Mumbai, Maharashtra, India.
   - **Founder:** Harshvardhan Patil.

### Bottom Bar
- Fine horizontal divider.
- Copyright: `© 2026 SIWI Global Ventures. All rights reserved.`
- Legal Links: `Privacy Policy` (`/privacy-policy`) | `Terms & Conditions` (`/terms`).
- Subtle compass graphic watermark.
- Strict prohibition: Do NOT invent or display fake social media links (LinkedIn, Twitter, Instagram) unless verified URLs exist.

---

## 6. ANIMATION PRINCIPLES

Animation must communicate status, direction, and refinement. It must never distract or cause fatigue.

### Timing & Easing Curves
```css
/* Micro-feedback (buttons, links, toggles) */
transition: all 150ms cubic-bezier(0.22, 1, 0.36, 1);

/* Structural transitions (dropdowns, drawers, tabs) */
transition: all 240ms cubic-bezier(0.22, 1, 0.36, 1);

/* Page reveals (fade-in, subtle vertical shift) */
transition: opacity 350ms ease, transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
```

### Permitted Animations
- **Product Image Hover:** Subtle scale from `1.0` to `1.02` max with smooth transition.
- **Scroll Reveals:** Gentle opacity and 12px upward slide for select headings and lead imagery.
- **Navigation Scroll:** Smooth backdrop blur and background transition on scroll.
- **Compass Reveal:** Subtle one-time fine-line vector draw in the hero section.

### Strictly Prohibited Animations
- Continuous spinning 3D globes or animated icons.
- Parallax scrolling applied across every section.
- Scroll hijacking or inertia manipulation.
- Floating background particles, glow blobs, or cursor followers.
- Full-screen loading spinners that delay content access.

### Motion Accessibility
All animations must respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. SOURCE MAPPING & TRACEABILITY

This document consolidates and formalises:
- `SOURCE/09_product_presentation.md` (Product presentation, layouts, specs sheets)
- `SOURCE/10_use_fewer_cards.md` (Card prohibition, open editorial layouts)
- `SOURCE/11_deliberate_asymmetry.md` (Asymmetric composition, offset grids)
- `SOURCE/14_navigation.md` (Desktop nav, dropdown, mobile drawer, breadcrumbs)
- `SOURCE/15_footer_design.md` (3-column footer, contact data, legal links)
- `SOURCE/16_animations.md` (Timing curves, permitted animations, reduced motion)
