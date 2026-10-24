# STITCH TASK PROMPT 06 — TRADE ENQUIRIES PORTAL
## SIWI Global Ventures Design Execution

---

## 1. TASK ASSIGNMENT
Design the dedicated B2B Trade Enquiries portal (`/trade-enquiries`) for SIWI Global Ventures.

This is the primary conversion hub of the entire website. The design must inspire trust, make complex procurement input simple, and handle contextual product pre-selection cleanly.

---

## 2. REQUIRED REFERENCE DOCUMENTS
Provide the following documents to Stitch:
- `00_MASTER_BRIEF.md`
- `LEVEL_01_BRAND_FOUNDATION.md`
- `LEVEL_02_VISUAL_DESIGN_SYSTEM.md`
- `LEVEL_04_WEBSITE_ARCHITECTURE_AND_PAGES.md` (Page 6 Specs)
- `LEVEL_05_CONTENT_AND_INTERACTIONS.md`
- `LEVEL_06_RESPONSIVENESS_AND_QUALITY.md`

---

## 3. SELF-CONTAINED TASK BRIEF (FOR DIRECT PASTE)
> **Page Route:** `/trade-enquiries`  
> **Headline:** `Tell us what your business needs.`  
> **Supporting Narrative:** *"Share your product requirements with SIWI Global Ventures. Our team can then review your enquiry and discuss the relevant details with you."*  
> **Form Fields Structure (Desktop Single Column with Side Credential Panel):**  
> - **Required Fields:** Full Name, Company Name, Business Email, Country/Region, Product of Interest (dropdown), Enquiry Details (textarea).  
> - **Optional Commercial Fields:** Phone/WhatsApp Number, Estimated Order Volume (MT / kg), Preferred Packaging (bulk bag, carton, custom), Destination Port.  
> - **Product Selector Values:** Onion Powder, Garlic Powder, Garlic Granules, Dehydrated Fried Onions, Birista, Onion Kibbles, Tiles, Other Products, Multiple Products, General Trade Discussion.  
> - **Side Panel:** Verified credentials: Phone `+91 83696 35619`, Email `siwiglobalventure@gmail.com`, Mumbai base.  
> - **Interactive States:** Real-time accessible validation, loading state, and reassuring confirmation feedback.

---

## 4. CONSTRAINTS & NEGATIVE RULES
- Do NOT make the form look like a marketing SaaS lead capture form.
- Form inputs must have explicit, visible `<label>` tags (not placeholder-only).
- Do NOT simulate a fake submission screen without transparent handling (mailto fallback or real API).

---

## 5. EXPECTED DELIVERABLES
1. Desktop Trade Enquiries layout with form and side credential panel.
2. Form field specifications including focus, error, and success states.
3. Mobile layout demonstrating touch-friendly inputs and vertical layout.

---

## 6. REVIEW & APPROVAL CHECKLIST
- [ ] Are all required and optional commercial fields properly integrated?
- [ ] Does the product dropdown accommodate all confirmed products?
- [ ] Are contact details clickable (`tel:` and `mailto:`) in the side panel?
- [ ] Is keyboard navigation and focus contrast compliant with WCAG AA?
