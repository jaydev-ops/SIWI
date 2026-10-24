# MILESTONE 06 — B2B TRADE ENQUIRY ENGINE & COMMUNICATION
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement the complete commercial enquiry pipeline for SIWI Global Ventures:
1. Public trade enquiry form with contextual URL parameter pre-selection (`/trade-enquiries?product=[slug]`).
2. Robust backend validation, anti-spam protection, and database persistence.
3. Transactional email notifications alerting SIWI commercial operations and acknowledging buyer inquiries.
4. Admin enquiry management console (`/admin/enquiries` and `/admin/enquiries/:id`) with status workflows, internal team notes, and follow-up tracking.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 9: Enquiry management (Public enquiry flow, statuses, admin table).
- `Architecture.md` Section 12: API architecture (Public and admin enquiry endpoints).
- `Docs/siwi-design-reference-system/LEVEL_05_CONTENT_AND_INTERACTIONS.md`: 7-step buyer journey & contextual linking.

---

## 3. PREREQUISITES
- Milestone 01, 02, and 05 complete (Database models active, Auth/Admin ready, Public web frontend live).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Public B2B Enquiry Experience (`apps/web`)
- **Route:** `/trade-enquiries`
- **Contextual URL Parameter Pre-selection:**
  - Inspect `window.location.search` for `?product=[slug]`.
  - Automatically match the slug against confirmed products (e.g. `onion-powder` → *"Onion Powder"*).
  - Pre-select the corresponding item in the product dropdown.
- **Form Architecture:**
  - Required Fields: Full Name, Company Name, Business Email, Country/Region, Product of Interest, Enquiry Details.
  - Optional Commercial Fields: Phone / WhatsApp Number, Estimated Order Volume (e.g. Metric Tons / Kilograms), Preferred Packaging, Destination Port.
  - Product Dropdown Options: *Onion Powder, Garlic Powder, Garlic Granules, Dehydrated Fried Onions, Birista, Onion Kibbles, Tiles, Other Products, Multiple Products, General Trade Discussion*.
- **Interactive States:**
  - Accessible inline error validation.
  - Loading spinner state during transmission.
  - Reassuring confirmation message upon success: *"Thank you for contacting SIWI Global Ventures. Your enquiry has been received. Our trade team will review your requirements and respond promptly."*

### 4.2 Backend API & Database Persistence (`packages/server`)
- **Endpoint:** `POST /api/public/enquiries`
- **Security & Validation:**
  - Fastify JSON Schema validation verifying email structure and required strings.
  - Rate limiting: Max 5 submissions per IP per 10 minutes.
  - Honeypot hidden input field to reject automated spam bots.
- **Database Transaction:**
  - Write record to `enquiries` table.
  - Write associated product references to `enquiry_products` table.
  - Create initial entry in `enquiry_activities` table (*"Enquiry received via public website"*).

### 4.3 Transactional Email Integration
- Configure transactional email service (Resend / SendGrid / AWS SES).
- **Internal Alert Email:** Dispatched immediately to `siwiglobalventure@gmail.com` with complete buyer details, company name, destination port, and volume specifications.
- **Buyer Acknowledgment Email:** Dispatched to the buyer's business email with official SIWI branding and confirmation.
- **Fault-Tolerant Execution:** Wrap email delivery in a non-blocking `try/catch`. If the email provider fails, the enquiry remains safely committed to PostgreSQL, and the admin dashboard flags the delivery status as `FAILED_DELIVERY`.

### 4.4 Admin Enquiry Management Console (`apps/admin`)
- **Enquiry Listing (`/admin/enquiries`):**
  - Table: Enquiry ID, Company, Contact Person, Product Requested, Received Date, Status Badge, Quick Actions.
  - Filter by Status: `All`, `New`, `Reviewed`, `In Progress`, `Awaiting Customer`, `Converted`, `Closed`.
  - Filter by Date Range or Product Category.
- **Enquiry Detail View (`/admin/enquiries/:id`):**
  - Full commercial message, order volume, packaging preferences, and destination port.
  - **Status Controller:** Smooth dropdown transition updating status and recording the timestamp in `enquiry_activities`.
  - **Internal Team Notes Thread:** Private notes added by administrators (`enquiry_notes` table) with author badge and timestamp (strictly hidden from public view).
  - Quick action: `Reply via Email` (opens `mailto:` link with pre-filled subject and reference ID).

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Visiting `/trade-enquiries?product=garlic-granules` loads the page with *"Garlic Granules"* pre-selected.
- [ ] Submitting the form with invalid email displays accessible inline error messaging.
- [ ] Valid submission commits to PostgreSQL, triggers internal email alert to SIWI, and displays confirmation message.
- [ ] Admin logs into `/admin/enquiries`, sees the new enquiry with status `NEW`, changes status to `IN_PROGRESS`, and adds an internal note.
- [ ] Public API never leaks internal notes or administrative statuses.
