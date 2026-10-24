# MILESTONE 05 — PUBLIC WEBSITE & DESIGN SYSTEM IMPLEMENTATION
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement the complete public B2B website (`apps/web`) consuming the public API:
1. Translate the Apple-inspired design rules (`Docs/DesignRules/` & `LEVEL_02`) into tokenized React components.
2. Build all 16 dedicated routes across the website hierarchy (strictly avoiding single-page scroll hacks).
3. Connect dynamic catalogue and product detail views to the backend API.
4. Implement the dual Light and Dark theme system with persistent toggle and system auto-detection.
5. Enforce responsive layout discipline across Desktop, Tablet, and Mobile viewports with 44px touch targets.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 3: Public website architecture & route table.
- `Architecture.md` Section 15: Public website design system (Charcoal, gold, ivory, typography, macro photography).
- `Docs/siwi-design-reference-system/LEVEL_02_VISUAL_DESIGN_SYSTEM.md`: Concrete design tokens, typography scale, spacing.
- `Docs/siwi-design-reference-system/LEVEL_04_WEBSITE_ARCHITECTURE_AND_PAGES.md`: 16-route specifications.

---

## 3. PREREQUISITES
- Milestone 03 and 04 complete (Public Category and Product APIs live with published data).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Design System & Token Configuration (`apps/web`)
Implement the CSS custom properties from `LEVEL_02_VISUAL_DESIGN_SYSTEM.md`:
```css
:root {
  --brand-ink: #111318;
  --brand-charcoal: #191C21;
  --brand-gold: #C69A45;
  --brand-gold-light: #D9B66C;
  --brand-ivory: #F5F2EB;
  --brand-white: #FFFFFF;

  --brand-grey-100: #F2F2F0;
  --brand-grey-300: #D8D7D2;
  --brand-grey-500: #858585;
  --brand-grey-700: #45474B;
  --brand-grey-900: #24262A;

  /* 8px Spacing Scale */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 24px;  --space-6: 32px;
  --space-7: 48px;  --space-8: 64px;  --space-9: 96px;
  --space-10: 128px; --space-11: 160px;

  /* Radii */
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
}
```

### 4.2 Light & Dark Theme Controller
- **Dark Mode (Default Brand Ambience):** Ink background (`#111318`), charcoal surfaces (`#191C21`), ivory text (`#F5F2EB`), gold accents (`#C69A45`).
- **Light Mode (Editorial Journal):** Warm ivory background (`#FAF8F5` / `#F5F2EB`), white/stone surfaces, ink text (`#111318`), burnished gold accents (`#B88B35`).
- **Theme Persistence:** Store choice in `localStorage`; detect `prefers-color-scheme`; inject theme class before initial DOM render to prevent FOUC.

### 4.3 Navigation & Header (`<SiteHeader />`)
- Brand wordmark with serif typography and gold compass mark.
- Navigation links: `Home`, `About Us`, `Products` (dropdown with categories), `Trade Enquiries`, `Contact`.
- Action zone: Theme toggle icon button + primary CTA `Request Quote` (links to `/trade-enquiries`).
- Sticky scroll transition with backdrop blur (`backdrop-blur-md`).
- Mobile Menu Drawer (<1024px) with focus trap and 44px touch targets.

### 4.4 16 Public Routes Implementation
1. `/` (Homepage): Asymmetric hero split (45/55), headline `"Indian products. Global possibilities."`, Dehydrated Vegetables showcase, 3-step trade process, About preview, Trade enquiry banner, 3-column footer.
2. `/about` (About Us): Company introduction, agricultural sourcing focus, core principles, founder Harshvardhan Patil profile.
3. `/products` (Products Catalogue): Master index fetching published categories and products from `GET /api/public/products`, category filter pills.
4. `/products/dehydrated-vegetables` (Category Showcase): Dedicated portal for onion and garlic value chain.
5. `/products/:productSlug` (Dynamic Product Detail):
   - Breadcrumb navigation (`Home → Products → Dehydrated Vegetables → [Name]`).
   - Macro ingredient imagery hero with image modal zoom.
   - Verified specifications table.
   - Export packaging and handling notes.
   - Downloadable public specification sheets / CoAs.
   - Related products carousel/grid.
   - Contextual CTA button linking to `/trade-enquiries?product=[slug]`.
6. `/products/tiles`: Secondary trading category presentation.
7. `/products/other-products`: Future commodity offerings portal.
8. `/trade-enquiries`: Primary B2B inquiry capture page.
9. `/contact`: Corporate communication channels with verified Mumbai address, clickable phone (`tel:+918369635619`) and email (`mailto:siwiglobalventure@gmail.com`).
10. `/privacy-policy` & `/terms`: Legal terms rendered with editorial typography.

### 4.5 Responsive Layout Discipline
- Mobile (<640px): Stacked single-column flows, headline before visual, 20–24px horizontal padding, zero horizontal scroll.
- Tablet (640–1023px): Balanced 2-column grids with 28–40px padding.
- Desktop (>=1024px): Spacious asymmetric compositions, 48–72px padding, 96–144px section spacing.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] All 16 routes exist as distinct accessible URLs (zero single-page anchor jumping).
- [ ] Product detail page dynamically renders data from `GET /api/public/products/:slug`.
- [ ] Theme toggle seamlessly switches between Dark Mode and Warm Ivory Light Mode without flashing unstyled content.
- [ ] Touch targets across mobile navigation and buttons meet or exceed 44px × 44px.
- [ ] Clicking `Discuss This Product` navigates to `/trade-enquiries?product=[slug]` with the product parameter in the URL.
