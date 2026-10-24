# LEVEL 02 — VISUAL DESIGN SYSTEM
## SIWI Global Ventures — Reference System

---

## 1. SHARED VISUAL PHILOSOPHY

The visual design system establishes a cohesive, disciplined aesthetic language applied uniformly across all pages. The aesthetic balances Apple-like typographic precision with the material richness of agricultural trade, grounded in a refined charcoal, gold, and ivory palette.

### Proportional Palette Allocation
- **65–75% Neutral Backgrounds:** Charcoal/ink in dark mode; warm ivory/off-white in light mode.
- **15–25% Secondary Neutral Tones:** Subtle elevated surfaces, borders, and structured content columns.
- **5–10% Gold & Brand Accents:** Deliberate punctuation for brand recognition and interaction focal points.

---

## 2. TYPOGRAPHY SYSTEM

The typography relies on clean modern sans-serif fonts for operational precision, paired with a restrained editorial serif for the SIWI wordmark and select headline flourishes.

### Font Stacks
**Primary Sans-Serif Stack (Interface, Body, Headings, Metadata):**
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
```
*Platform note:* Use system-native fallbacks across Windows and Android. If web fonts like Inter or Plus Jakarta Sans are used, ensure fallback parity.

**Editorial Serif Stack (Brand Wordmark, Selected Major Display Headings):**
```css
font-family: "Cormorant Garamond", "Libre Baskerville", Georgia, serif;
```
*Usage rule:* Use serif sparingly. Do not turn the website into an antique hotel brochure; preserve modern commercial authority.

### Typographic Hierarchy & Scale

| Element | Desktop Size | Tablet Size | Mobile Size | Weight | Line-Height | Treatment |
|---|---|---|---|---|---|---|
| Main Hero Headline | 64–88px | 48–64px | 38–48px | Regular (400) to Medium (500) | 0.98–1.05 | Tight, deliberate line breaks |
| Page Headline | 52–72px | 40–52px | 32–40px | Regular (400) | 1.02–1.08 | Editorial, spacious |
| Major Section Heading | 36–48px | 28–36px | 24–30px | Regular (400) | 1.10–1.18 | Clear, confident |
| Secondary Heading | 24–32px | 20–26px | 18–22px | Medium (500) | 1.20–1.28 | Compact, readable |
| Product Name | 20–26px | 18–22px | 17–20px | Medium (500) | 1.25–1.30 | Clean, direct |
| Body Text | 16–18px | 15–16px | 15–16px | Regular (400) | 1.50–1.75 | Comfortable line spacing |
| Supporting Description | 14–16px | 13–15px | 13–14px | Regular (400) | 1.45–1.55 | Muted, legible |
| Eyebrow Label | 11–13px | 11–12px | 10–12px | Medium (500) | 1.20–1.30 | Restrained uppercase, letter-spacing +0.08em |
| Navigation Links | 13–15px | 13–14px | 14–16px | Medium (500) | 1.20–1.30 | Crisp, uncluttered |
| Metadata & Data Tables | 12–14px | 12–13px | 11–12px | Regular (400) | 1.35–1.45 | High contrast, tabular numerals |

### Core Typographic Rules
- Prefer Regular (400) and Medium (500) weights. Reserve Bold (700) strictly for critical data hierarchy.
- Restrict body copy measure to 55–75 characters per line for optimal reading ergonomics.
- Use natural sentence case for headlines. Never shout in full uppercase across body copy or long titles.
- Use typographic size contrast and generous whitespace rather than coloured boxes to establish hierarchy.

---

## 3. SPACING & LAYOUT SYSTEM

Spacing is the primary visual differentiator between an amateur template and an art-directed international platform.

### Base 8px Spacing Scale
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;
  --space-11: 160px;
}
```

### Layout Constraints & Containers
- **Spacious Desktop Container:** 1120px–1320px maximum content width.
- **Editorial Long-Form Container:** 640px–740px maximum measure for narrative readability.
- **Full-Bleed Media Rows:** Up to 1440px or edge-to-edge for macro photography and thematic banners.

### Viewport Padding Standards
- **Desktop (>= 1024px):** Horizontal padding: 48–72px; Section vertical spacing: 96–144px.
- **Tablet (640px–1023px):** Horizontal padding: 28–40px; Section vertical spacing: 72–96px.
- **Mobile (< 640px):** Horizontal padding: 20–24px; Section vertical spacing: 56–80px.

### The Whitespace Standard
- Group related content tightly; separate distinct content blocks with generous whitespace.
- Structure layouts with alignment, negative space, and fine hairline rules rather than enclosing every paragraph in a rounded box.

---

## 4. COLOUR SYSTEM & THEMES

Green is explicitly NOT the primary brand color. The identity is built upon charcoal, gold, and ivory.

### Design Tokens
```css
:root {
  /* Brand Core */
  --brand-ink: #111318;
  --brand-charcoal: #191C21;
  --brand-gold: #C69A45;
  --brand-gold-light: #D9B66C;
  --brand-ivory: #F5F2EB;
  --brand-white: #FFFFFF;

  /* Neutral Grey Ramp */
  --brand-grey-100: #F2F2F0;
  --brand-grey-300: #D8D7D2;
  --brand-grey-500: #858585;
  --brand-grey-700: #45474B;
  --brand-grey-900: #24262A;
}
```

### Dark Mode (Primary Brand Ambience)
- **Base Background:** Deep near-black (`--brand-ink: #111318`).
- **Elevated Surfaces:** Muted charcoal (`--brand-charcoal: #191C21`).
- **Primary Typography:** Warm ivory (`--brand-ivory: #F5F2EB`).
- **Secondary Typography:** Muted neutral grey (`--brand-grey-500: #858585`).
- **Borders & Dividers:** Fine low-contrast rule `rgba(245, 242, 235, 0.12)`.
- **Accents:** Restrained gold (`--brand-gold: #C69A45`).

### Light Mode (Editorial Trade Journal Ambience)
- **Base Background:** Warm ivory (`#FAF8F5` / `#F5F2EB`).
- **Elevated Surfaces:** Pure white (`#FFFFFF`) or pale stone (`#F2EFEB`).
- **Primary Typography:** Near-black (`--brand-ink: #111318`).
- **Secondary Typography:** Dark grey (`--brand-grey-700: #45474B`).
- **Borders & Dividers:** Subtle grey rule `rgba(17, 19, 24, 0.10)`.
- **Accents:** Deep burnished gold (`#B88B35`).
- *Important:* Light mode must NOT be a sterile plain white box; it must retain warm ivory paper-like sophistication.

### Gold Usage Boundaries
**Permitted Gold Applications:**
- Brand wordmark ("SIWI") and compass linework
- Active navigation indicators and subtle underline rules
- Key CTA button borders or subtle hover transitions
- Fine technical crosshair / coordinate markers
- Occasional high-priority metadata tags (e.g. "Export Grade")

**Strictly Prohibited Gold Applications:**
- Heavy solid gold backgrounds on every button
- Thick gold borders around every card or image
- Glowing neon gold drop shadows or halos
- Skeuomorphic fake chrome or metallic gradient fills

### Theme Toggle Requirements
- Prominently placed in the main navigation.
- Persists user selection in `localStorage`.
- Respects system `prefers-color-scheme` on first visit.
- Zero Flash of Unstyled Content (FOUC) during page load.

---

## 5. SIGNATURE DESIGN ELEMENT: THE GLOBAL COMPASS

The signature motif is derived directly from SIWI's official compass-and-globe logo emblem. It represents navigation, precision, direction, and trade connection between Indian origin and global destinations.

### Graphic Treatment
- Fine hairline vector strokes (1px to 1.5px stroke width).
- Rendered in gold (`#C69A45`) or ivory (`#F5F2EB`).
- Geometric, restrained linework featuring subtle degree ticks or crosshairs.
- Generous negative space surrounding the motif.

### Site Placements
1. **Homepage Hero:** Asymmetric backdrop linework framing the primary headline.
2. **Product Pages:** Small directional category markers and section break coordinates.
3. **About Page:** Restrained graphic depicting trade connectivity between India and international ports.
4. **Contact Page:** Subtle directional line directing visual flow into the enquiry form.
5. **Footer:** Discreet compass emblem accompanying the SIWI wordmark and copyright.

### Prohibited Motifs
- NO spinning 3D globes or animated rotating spheres.
- NO stock graphics of airplanes, shipping containers, or cargo ships floating in space.
- NO generic dotted world maps.

---

## 6. HERO SECTION ART DIRECTION

The homepage hero must immediately set the tone of an established, confident international enterprise.

### Composition (Asymmetric Split)
- **Desktop (>= 1024px):**
  - Left column (45–55% width): Bold, spacious headline, concise body copy, paired CTAs, and origin tag.
  - Right column (45–55% width): Art-directed product macro photograph or refined compass line composition.
  - Asymmetric vertical offset to prevent rigid Bootstrap-like symmetry.
- **Mobile (< 640px):**
  - Stacked vertically with headline first, supporting copy, primary CTA immediately visible.
  - Cropped macro image with crisp focal point placed below or behind.
  - Zero text overlap over unreadable image areas.

### Hero Copy & Typography
- **Eyebrow:** `INDIA · INTERNATIONAL TRADE`
- **Primary Headline:** `Indian products. Global possibilities.`
- **Supporting Paragraph:** `"SIWI Global Ventures connects quality Indian products with international markets through dependable trade partnerships and a focus on quality."`
- **Primary CTA:** `Explore Our Products` (Links to `/products`)
- **Secondary CTA:** `Discuss Your Requirements` (Links to `/trade-enquiries`)
- **Microcopy:** `"Based in Mumbai, India."`

---

## 7. IMAGE ART DIRECTION

Images are factual representations of commercial agricultural and traded products, not generic advertising filler.

### Preferred Imagery
- Macro photography of dehydrated onion powder, garlic powder, and garlic granules showing genuine texture, color, and particle size.
- Real dehydrated fried onions and crispy birista showing crispness and natural golden tones.
- Neutral, matte stone, slate, or stainless steel surfaces.
- Soft, directional natural lighting with realistic physical shadows.

### Strictly Prohibited Imagery
- Generic business handshakes or people smiling in suits around conference tables.
- Random container ships or logistics yards used as decorative wallpaper.
- AI-generated food with surreal glossy textures or unnatural saturation.
- Fabricated packaging boxes with fake certification logos.

---

## 8. DESIGN SYSTEM TOKENS & SURFACES

### Corner Radii
```css
:root {
  --radius-small: 4px;   /* Badges, micro buttons, inputs */
  --radius-medium: 8px;  /* Product cards, modal windows */
  --radius-large: 12px;  /* Hero visual containers, major panels */
}
```
*Rule:* Avoid excessive bubbly rounding. Preserve architectural, crisp edges.

### Borders & Dividers
```css
:root {
  --border-subtle-dark: 1px solid rgba(245, 242, 235, 0.12);
  --border-subtle-light: 1px solid rgba(17, 19, 24, 0.10);
  --border-gold-accent: 1px solid rgba(198, 154, 69, 0.35);
}
```

### Elevation & Shadows
Derive depth primarily from spatial contrast, surface value differences, and hairline dividers. Avoid large fuzzy drop shadows.

---

## 9. SOURCE MAPPING & TRACEABILITY

This document consolidates and formalises:
- `SOURCE/04_typography.md` (Type scale, system font stacks, line heights)
- `SOURCE/05_spacing.md` (8px grid, container widths, whitespace rules)
- `SOURCE/06_colour_system.md` (Hex tokens, dark/light mode balance, gold rules)
- `SOURCE/07_signature_design_element.md` (Compass and globe motif rules)
- `SOURCE/08_hero_section.md` (Hero composition, copy, layout)
- `SOURCE/17_image_art_direction.md` (Photography style, lighting, banned imagery)
- `SOURCE/24_design_system.md` (Tokens, radii, borders, shadows)
