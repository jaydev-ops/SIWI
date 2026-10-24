# LEVEL 05 — CONTENT AND BUSINESS INTERACTIONS
## SIWI Global Ventures — Reference System

---

## 1. TONE OF VOICE & EDITORIAL STYLE

All written copy on the website must reflect the voice of an experienced, trustworthy international trade house. The tone is understated, precise, human, and commercially credible.

### Foundational Copy Principles
- **Direct and Unembellished:** Speak clearly about products, specifications, and fulfillment capabilities.
- **Active Voice:** Prefer direct actions (*"We connect Indian producers with international buyers"*) over passive corporate phrasing (*"Facilitation is provided by our ecosystem"*).
- **Concise Headings:** Headings must immediately deliver meaning. Never use headline fluff.
- **Zero Marketing Exaggeration:** Avoid buzzwords, false superlatives, and unverified commercial bravado.

---

## 2. FORBIDDEN JARGON VS. APPROVED DIRECT COPY

The following comparative standard governs all copywriting across the platform:

| Forbidden AI & Corporate Clichés | Approved SIWI Direct Copy | Rationale & Context |
|---|---|---|
| *"Revolutionising the global export ecosystem."* | *"We export quality dehydrated vegetables from India to international markets."* | Grounded in real physical operations, not buzzwords. |
| *"Empowering businesses through cutting-edge solutions."* | *"We provide dependable trade partnerships, competitive pricing, and quality service."* | Transparent business commitments. |
| *"Your one-stop destination for excellence."* | *"Explore our confirmed range of dehydrated onion and garlic products."* | Concrete product focus. |
| *"Unlocking limitless possibilities."* | *"Tell us what products you need and what your business requires."* | Clear commercial call-to-action. |
| *"Delivering innovation at scale."* | *"Carefully processed dehydrated vegetables prepared for commercial and industrial supply."* | Factual processing description. |
| *"Where quality meets innovation."* | *"Serving with trust, delivering with quality."* | Preserves official brand tagline. |
| *"Your trusted partner in a rapidly evolving world."* | *"Dependable trade partnerships built around clear communication and long-term supply."* | Human, relational B2B tone. |
| *"Redefining the future of global commerce."* | *"Connecting quality Indian products with international trade opportunities."* | Realistic, credible mission. |

---

## 3. THE B2B BUYER JOURNEY

The user experience is engineered around the decision-making process of global procurement specialists:

1. **Discovery & Validation (Homepage):** The buyer lands, immediately recognizes an established Indian export firm, verifies the Mumbai base, and notes the core dehydrated vegetable specialization.
2. **Category Evaluation (Products Catalogue):** The buyer inspects the range of onion and garlic products, evaluating formats and commercial relevance.
3. **Technical Scrutiny (Product Detail Page):** The buyer reviews product photography, particle formats, packaging options, and specification guidelines.
4. **Contextual Enquiry Trigger:** The buyer clicks `Discuss This Product` or `Enquire About Supply`.
5. **Streamlined Data Capture (Trade Enquiries):** The product of interest is preselected automatically. The buyer specifies volume (MT), preferred packaging, and destination port.
6. **Confirmation & Follow-Up:** The buyer receives immediate confirmation that their inquiry is logged and will be addressed by SIWI's Mumbai commercial team.
7. **Direct Communication Options:** At any point, the buyer can initiate direct dialogue via clickable telephone (`tel:+918369635619`) or email (`mailto:siwiglobalventure@gmail.com`).

---

## 4. CONTEXTUAL ENQUIRY LINKING & PRE-FILLING

To eliminate friction, all product CTA buttons must pass the product slug to the enquiry form via clean URL parameters:

### Implementation Specification
```
/trade-enquiries?product=onion-powder
/trade-enquiries?product=garlic-powder
/trade-enquiries?product=garlic-granules
/trade-enquiries?product=dehydrated-fried-onions
/trade-enquiries?product=birista
/trade-enquiries?product=onion-kibbles
/trade-enquiries?product=tiles
/trade-enquiries?product=other-products
```

### Form Script Behavior
- When `/trade-enquiries` loads, inspect `window.location.search`.
- Extract and safely sanitize the `product` query parameter.
- Automatically set the `<select id="product-interest">` element's value to match the incoming parameter.
- If the parameter does not match a valid option, default gracefully to `"General Trade Discussion"`.

---

## 5. INTERACTIVE TOUCHPOINTS & FUNCTIONAL STATES

Every interactive element on the website must be fully functional. No dead ends or dummy components.

### Required Functional Touchpoints
1. **Direct Phone Links:**
   - Must use standard RFC 3966 `tel:` URI: `<a href="tel:+918369635619">+91 83696 35619</a>`.
2. **Direct Email Links:**
   - Must use standard `mailto:` URI: `<a href="mailto:siwiglobalventure@gmail.com">siwiglobalventure@gmail.com</a>`.
3. **Theme Toggle Button:**
   - Visible in desktop header and mobile drawer.
   - Smooth state transition with accessible `aria-label="Switch to dark theme"`.
   - Remembers preference across browser sessions.
4. **Form Validation Feedback:**
   - Inline visual validation on form submission attempt.
   - Required fields marked with clean indicators.
   - Error messages rendered in accessible text (red/amber with proper contrast, paired with icons).
5. **Submission Loading & Confirmation:**
   - Button text switches to *"Submitting Enquiry..."* with an animated spinner or opacity state.
   - Button is disabled during submission to prevent accidental duplicate entries.
   - Upon completion, display clear, reassuring success notification.

---

## 6. BACKEND INTEGRATION & TRANSPARENCY

### Honesty Rule Regarding Backend Services
- Do NOT simulate a fake successful database submission if no backend endpoint is configured.
- When deployed without an active API endpoint or serverless function:
  - Implement form submission via client-side `mailto:` generation pre-filling user input into their native email client:
  ```javascript
  const mailtoUrl = `mailto:siwiglobalventure@gmail.com?subject=Trade Enquiry: ${product}&body=${encodeURIComponent(details)}`;
  window.location.href = mailtoUrl;
  ```
  - Or connect to a verified, secure email delivery service (e.g. Formspree, Resend, SendGrid) without exposing API keys in public frontend code.

---

## 7. SOURCE MAPPING & TRACEABILITY

This document consolidates and formalises:
- `SOURCE/18_copywriting.md` (Tone of voice, forbidden fluff, direct copy rules)
- `SOURCE/19_product_enquiry_experience.md` (B2B user journey, pre-filling, functional links, backend honesty)
