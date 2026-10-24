# 32. TECHNICAL IMPLEMENTATION

If the design tool supports website generation, create a working multi-page website rather than a collection of disconnected mockups.

## Preferred stack

- React.
- TypeScript.
- Tailwind CSS or an equally maintainable styling system.
- React Router or another appropriate routing solution.
- Reusable layout and navigation components.
- SVG for the compass motif and other scalable graphics.

Use the stack supported by the target environment if it differs.

## Component architecture

Build reusable components for:
- Main navigation.
- Mobile navigation.
- Footer.
- Theme toggle.
- Primary and secondary buttons.
- Product enquiry CTA.
- Product detail template.
- Breadcrumbs.
- Enquiry form.
- Contact form.
- Page headings.
- Editorial image-and-text layouts.
- Section dividers.

Do not create a single enormous component containing the entire website.

## Suggested structure

```
src/
├── components/
│   ├── Navigation
│   ├── MobileMenu
│   ├── Footer
│   ├── ThemeToggle
│   ├── Button
│   ├── Breadcrumbs
│   ├── ProductEnquiryCTA
│   ├── EnquiryForm
│   └── EditorialSection
│
├── pages/
│   ├── Home
│   ├── About
│   ├── Products
│   ├── ProductDetail
│   ├── Tiles
│   ├── OtherProducts
│   ├── TradeEnquiries
│   ├── Contact
│   ├── PrivacyPolicy
│   └── Terms
│
├── data/
│   └── products
│
├── styles/
│   └── design-system
│
├── assets/
│   ├── logo
│   ├── products
│   └── illustrations
│
└── App.tsx
```

Adapt the structure as needed.

## Product data

Store product information in a central data structure.

Each product may contain:
- Name.
- Slug.
- Category.
- Description.
- Image.
- Verified specifications.
- Available formats.
- Related products.
- Enquiry CTA label.

Keep missing information empty rather than fabricating content.

## Functional requirements

- All navigation links must work.
- All defined routes must render correctly.
- Direct navigation to a product URL must work.
- Product enquiry links must prefill the selected product.
- The theme toggle must function.
- The selected theme must persist.
- Forms must validate inputs.
- Form submission must be genuinely integrated or clearly identified as requiring an integration.
- The website must not display false submission success.
- No buttons should lead to `#` placeholders.
- No dead-end navigation paths.
- No broken images.
- No unnecessary console errors.
