# LEVEL 04 — WEBSITE ARCHITECTURE AND PAGE SPECIFICATIONS
## SIWI Global Ventures — Reference System

---

## 1. ARCHITECTURAL PRINCIPLE: TRUE MULTI-PAGE EXPERIENCE

The SIWI Global Ventures website must be designed and built as a true, connected multi-page web platform.

### Non-Negotiable Architectural Rules
1. **No Single-Page Scrolling Hacks:** Never compress the website into a single long page where navigation links merely scroll to sections. Every primary page and product detail page must exist as a standalone route.
2. **Dedicated Purpose per Route:** Each route must have its own unique layout, tailored editorial composition, and specific conversion purpose.
3. **Template Reusability with Content Distinction:** While product detail pages share an underlying structural framework, each individual product page must present tailored imagery, verified product attributes, and contextual procurement details.
4. **Clean URLs:** Routes must follow clean, hierarchical paths without hash fragments or messy query strings for primary routing.

---

## 2. COMPLETE SITEMAP & ROUTE TABLE

The website architecture encompasses 16 dedicated routes across four functional tiers:

| Route | Page Name | Primary Objective & Purpose |
|---|---|---|
| `/` | Homepage | Establish corporate credibility, introduce core dehydrated categories, guide buyers to products and enquiry |
| `/about` | About Us | Present company narrative, trade approach, Mumbai operational base, and founder Harshvardhan Patil |
| `/products` | Products Catalogue | Comprehensive B2B product overview and category navigation |
| `/products/dehydrated-vegetables` | Dehydrated Vegetables | Dedicated category showcase highlighting the full onion and garlic value chain |
| `/products/onion-powder` | Onion Powder Detail | Product specifications, commercial applications, export packaging, and enquiry CTA |
| `/products/garlic-powder` | Garlic Powder Detail | Product specifications, commercial applications, export packaging, and enquiry CTA |
| `/products/garlic-granules` | Garlic Granules Detail | Granule particle sizes, industrial applications, packaging, and enquiry CTA |
| `/products/dehydrated-fried-onions`| Dehydrated Fried Onions | Commercial food service specifications, moisture control, and enquiry CTA |
| `/products/birista` | Birista (Crispy Fried Onions) | Traditional crispy fried onions for culinary formulation and catering trade |
| `/products/onion-kibbles` | Onion Kibbles Detail | Kibble flake dimensions, industrial processing applications, and enquiry CTA |
| `/products/tiles` | Tiles (Secondary Category) | Present ceramic and porcelain tile trading offerings for domestic and international markets |
| `/products/other-products` | Other Products | Accommodate verified future traded offerings without inventing fake specs |
| `/trade-enquiries` | Trade Enquiries | Structured B2B procurement portal capturing volume, packaging, and destination details |
| `/contact` | Contact | Direct corporate communication, verified Mumbai location, official email and phone |
| `/privacy-policy` | Privacy Policy | Authoritative corporate data privacy and form handling practices |
| `/terms` | Terms & Conditions | Commercial website usage terms, product disclaimer, and intellectual property |

---

## 3. DETAILED PER-PAGE SPECIFICATIONS

### Page 1 — Homepage (`/`)

The homepage serves as the primary gateway for international buyers, establishing trust within 5 seconds.

#### Section A: Main Navigation Bar
- SIWI wordmark and compass logo in gold (`#C69A45`).
- Links: Home, About Us, Products (with dropdown), Trade Enquiries, Contact.
- Dark/Light mode theme toggle.
- Primary CTA button: `Enquire Now` linking to `/trade-enquiries`.
- Sticky behavior on scroll with background opacity and backdrop-filter blur.

#### Section B: Hero Section
- **Eyebrow:** `INDIA · INTERNATIONAL TRADE`
- **Headline:** `Indian products. Global possibilities.`
- **Supporting Narrative:** `"SIWI Global Ventures connects quality Indian products with international markets through dependable trade partnerships and a focus on quality."`
- **Primary CTA:** `Explore Our Products` (Links to `/products`)
- **Secondary CTA:** `Discuss Your Requirements` (Links to `/trade-enquiries`)
- **Microcopy:** `"Based in Mumbai, India."`
- **Visual Composition:** Asymmetric desktop layout with macro product photography (dehydrated onion/garlic ingredients) and fine-line compass geometry.

#### Section C: Primary Product Focus
- **Heading:** `Products for global supply requirements.`
- **Supporting Copy:** `"Explore our range of dehydrated vegetable products and other traded goods."`
- **Composition:** Asymmetric editorial showcase highlighting the dehydrated vegetable range (Onion Powder, Garlic Powder, Garlic Granules, Fried Onions, Birista, Kibbles). Secondary pathways to Tiles and Other Products.

#### Section D: How SIWI Operates (Trade Process)
Numbered horizontal sequence:
- `01 — Understand the Requirement:` Meticulous review of buyer specifications, volumes, and destination compliance.
- `02 — Discuss the Supply:` Transparent alignment on product grade, packaging options, and commercial timelines.
- `03 — Build the Partnership:` Long-term collaboration built on reliable fulfillment, consistency, and integrity.

#### Section E: About Preview
- **Heading:** `Rooted in India. Focused on global trade.`
- **Narrative:** Two-column editorial composition highlighting Mumbai headquarters, founder leadership, and international trade bridges.
- **CTA:** `Discover SIWI Global Ventures` (Links to `/about`).

#### Section F: Trade Enquiries Banner
- **Heading:** `Looking for a dependable product sourcing partner?`
- **Supporting Copy:** `"Tell us what you are looking for. We will use your enquiry to understand your requirements and discuss the next steps."`
- **CTA:** `Start a Trade Enquiry` (Links to `/trade-enquiries`).

#### Section G: Authoritative Footer
Full 3-column asymmetric footer with contact details, links, copyright, and legal disclaimers.

---

### Page 2 — About Us (`/about`)

Presents the corporate identity with human dignity, commercial seriousness, and zero marketing fluff.

#### Hero Section
- **Eyebrow:** `ABOUT SIWI GLOBAL VENTURES`
- **Headline:** `Connecting Indian products with global opportunity.`
- **Supporting Paragraph:** `"SIWI Global Ventures is an India-based import-export company focused on dependable trade partnerships, quality products, competitive pricing, and service that puts business relationships first."`

#### Company Narrative Section
Structured multi-paragraph text using the official corporate introduction:
- Background on Indian agricultural sourcing and value addition.
- Primary export specialisation in dehydrated vegetables.
- Secondary trade division in tiles and commercial products.

#### Core Operating Principles
Three distinct columns separated by fine rules:
1. **Quality-Focused Sourcing:** Rigorous inspection of product consistency, moisture levels, and culinary aroma.
2. **Dependable Communication:** Direct, transparent commercial dialogue with buyers across time zones.
3. **Sustainable Partnerships:** Building recurring, multi-season trade relationships based on integrity.

#### Founder Leadership Section
- **Heading:** `A business built around trust.`
- **Narrative:** Introduce founder Harshvardhan Patil:
  > "Founder Harshvardhan Patil leads SIWI Global Ventures with a focus on connecting Indian products with international markets and developing dependable business relationships."
- Authentic portrait or restrained typographic composition with the compass motif.
- Strict prohibition: Do NOT invent fake degrees, awards, or historical claims.

#### Closing Call-to-Action
- **Text:** `Let's discuss your sourcing requirements.`
- **CTA Button:** `Contact SIWI` (Links to `/contact`).

---

### Page 3 — Products Catalogue (`/products`)

The master directory designed for commercial B2B product evaluation.

#### Hero Section
- **Eyebrow:** `OUR PRODUCTS`
- **Headline:** `A considered range of products for global trade.`
- **Supporting Copy:** `"Explore our dehydrated vegetable products and other traded categories. For product specifications, availability, and commercial requirements, contact our team."`

#### Category Navigation & Anchors
Clean, understated filter bar:
- `All Products`
- `Dehydrated Vegetables`
- `Tiles & Other Categories`

#### Category 01: Dehydrated Vegetable Products (Primary Focus)
Prominent editorial display featuring all 7 confirmed items:
1. **Onion Powder** — High-grade dehydrated onion powder.
2. **Garlic Powder** — Fine aromatic dehydrated garlic powder.
3. **Garlic Granules** — Granular texture for specialized food processing.
4. **Dehydrated Fried Onions** — Crispy golden processed onions.
5. **Birista** — Authentic fried onion flakes for commercial foodservice.
6. **Onion Kibbles** — Dehydrated onion pieces for soups and dry formulations.
7. **Other Value-Added Products** — Custom dehydrated vegetable blends.

Each item features high-resolution macro photography, format summary, and a direct button to `View Product Details`.

#### Category 02: Other Trading Categories
Secondary section presenting:
- **Tiles:** Commercial ceramic and porcelain tiles for export and domestic distribution.
- **Other Products:** Flexible framework accommodating future verified commodity lines.

#### Catalogue Action Trigger
Direct link to contextual enquiry: selecting any product can initiate prefilled trade enquiries.

---

### Page 4 — Category Showcase: Dehydrated Vegetables (`/products/dehydrated-vegetables`)

A deep-dive category portal emphasizing Indian agricultural richness and dehydrated vegetable export quality.

- **Hero:** Detailed overview of the dehydration value chain (preserving natural flavor, extending shelf stability, reducing transport bulk).
- **Product Grid:** In-depth feature cards for the 6 core products with direct links to individual detail pages.
- **Export Standards Notice:** Guidance on export packaging, palletization, container loading, and custom requirements.
- **Direct Category Enquiry CTA:** `Enquire About Vegetable Exports`.

---

### Page 5 — Product Detail Template (6 Core Product Pages)

Applied across:
- `/products/onion-powder`
- `/products/garlic-powder`
- `/products/garlic-granules`
- `/products/dehydrated-fried-onions`
- `/products/birista`
- `/products/onion-kibbles`

#### Layout Structure
1. **Breadcrumbs:** `Home → Products → Dehydrated Vegetables → [Product Name]`
2. **Product Hero Split:**
   - Left: Macro ingredient photography showcasing genuine texture and color.
   - Right: Product title, subtitle, commercial description, origin tag (`Origin: India`), and immediate CTA `Discuss This Product`.
3. **Product Formats & Processing:** Verified descriptions of particle size (e.g. powder vs granules vs kibbles) and dehydration process.
4. **Industrial & Food Applications:** Food manufacturing, spice blends, dry seasoning, soups, sauces, culinary service.
5. **Technical Specifications Section:**
   - Display verified parameters cleanly.
   - Mandatory fallback for unconfirmed specs: *"Contact our technical sourcing team for comprehensive specification sheets, microbiological parameters, and certificates of analysis."*
6. **Packaging & Export Handling:** Bulk bag packaging, export corrugated cartons, customized labeling options upon agreement.
7. **Related Products Strip:** Cross-links to 2–3 complementary items (e.g. Onion Powder links to Garlic Powder and Onion Kibbles).
8. **Enquiry Conversion CTA:** Prominent button linking to `/trade-enquiries?product=[product-slug]` with the product automatically prefilled.

---

### Page 6 — Trade Enquiries (`/trade-enquiries`)

The commercial heart of the website. Must inspire total confidence and provide seamless form completion.

#### Hero Section
- **Eyebrow:** `TRADE ENQUIRIES`
- **Headline:** `Tell us what your business needs.`
- **Supporting Narrative:** `"Share your product requirements with SIWI Global Ventures. Our team can then review your enquiry and discuss the relevant details with you."`

#### B2B Procurement Form Architecture
Single-column layout with a side panel of verified company credentials on desktop:

**Required Form Fields:**
1. `Full Name` (text)
2. `Company Name` (text)
3. `Business Email` (email)
4. `Country / Region` (text / dropdown)
5. `Product of Interest` (dropdown pre-populated with confirmed products)
6. `Enquiry Details & Specifications` (textarea — volume, grade, delivery terms)

**Optional Commercial Fields:**
7. `Phone / WhatsApp Number` (tel)
8. `Estimated Order Volume` (e.g., Metric Tons / Kilograms)
9. `Preferred Packaging Format` (bulk bag, carton, custom)
10. `Destination Port` (for CIF/FOB discussions)

#### Product Dropdown Selector Values
- Onion Powder
- Garlic Powder
- Garlic Granules
- Dehydrated Fried Onions
- Birista
- Onion Kibbles
- Tiles
- Other Products
- Multiple Products
- General Trade Discussion

#### Form States & Validation
- Real-time accessible error handling for invalid emails or blank required fields.
- Interactive loading state during submission.
- Clear confirmation message upon success: *"Thank you for contacting SIWI Global Ventures. Your enquiry has been received. Our trade team will review your requirements and respond promptly."*
- Integration rule: Connect to real backend/email service or provide transparent mailto alternative. Never simulate false success.

---

### Page 7 — Contact (`/contact`)

Clean, direct, and completely accessible corporate communications hub.

#### Hero Section
- **Headline:** `Let's start a conversation.`
- **Supporting Copy:** `"For product enquiries, sourcing discussions, and business opportunities, get in touch with SIWI Global Ventures."`

#### Editorial Contact Directory
- **Official Telephone:** `+91 83696 35619` (clickable `tel:`)
- **Official Email:** `siwiglobalventure@gmail.com` (clickable `mailto:`)
- **Headquarters Location:** Mumbai, Maharashtra, India.
- **Company Leadership:** Harshvardhan Patil, Founder.

#### General Contact Form
- Name, Email, Subject selector (`Product Sourcing`, `Trade Partnership`, `Tiles`, `General Enquiry`), Message textarea.
- Submit button with clear hover and loading states.

#### Verified Location Visual
- Understated Mumbai reference map or graphic.
- Strict prohibition: Do NOT invent a fake street address or place an unverified map pin.

---

### Page 8 — Tiles (`/products/tiles`)

Secondary trading offering, maintaining visual continuity while remaining distinct from agricultural goods.

- **Hero:** `Tiles for your trading requirements.`
- **Narrative:** `"SIWI Global Ventures also deals in tiles, supporting relevant domestic and international trade requirements."`
- **Catalogue Guidance:** Present confirmed tile categories (ceramic, porcelain, wall/floor) only as verified.
- **CTA:** `Discuss Tile Requirements` (links to `/trade-enquiries?product=tiles`).

---

### Page 9 — Other Products (`/products/other-products`)

Future-proof landing page for secondary commodity trade.

- **Hero:** `More opportunities in global trade.`
- **Narrative:** `"Beyond our core dehydrated vegetable range, SIWI Global Ventures also deals in other products according to business and market requirements."`
- **Structure:** Open, maintainable editorial layout inviting commercial enquiries.
- **CTA:** `Submit a Sourcing Enquiry` (links to `/trade-enquiries?product=other-products`).

---

### Page 10 — Privacy Policy (`/privacy-policy`)

Clean legal document formatted with editorial typography.
- Covers data collection via trade enquiry and contact forms.
- Data protection principles, commercial communication policy, and user privacy rights.
- Contact email for privacy matters (`siwiglobalventure@gmail.com`).
- Prohibition: No boilerplate claims of irrelevant compliance certifications.

---

### Page 11 — Terms & Conditions (`/terms`)

Clean legal terms formatted for readability.
- Website usage terms, product specification disclaimers, intellectual property of SIWI Global Ventures.
- Commercial quotation notice: final specifications and terms determined in bilateral trade contracts.

---

## 4. SOURCE MAPPING & TRACEABILITY

This document consolidates and formalises:
- `SOURCE/12_website_architecture.md` (Complete sitemap, routes, structural principles)
- `SOURCE/13_page_specifications.md` (Detailed section-by-section requirements for all 10 page types)
