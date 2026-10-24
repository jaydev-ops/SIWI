# MILESTONE 02 — AUTHENTICATION, RBAC & ADMIN CONSOLE SHELL
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Implement the secure administrative framework for SIWI Global Ventures:
1. Server-side session authentication with encrypted, HTTP-only cookies.
2. Role-Based Access Control (RBAC) with four distinct permission tiers.
3. Fastify security hooks enforcing authentication and authorization on `/api/admin/*`.
4. Admin console UI shell (`apps/admin`) with responsive sidebar, top bar, and theme styling.
5. Operational dashboard (`/admin`) displaying live KPI widgets answering the 4 core business questions.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 4: Admin console architecture & route structure.
- `Architecture.md` Section 10: Admin users and permissions (Roles & security requirements).
- `Architecture.md` Section 15: Public website design system vs. Admin console design system.

---

## 3. PREREQUISITES
- Milestone 01 complete (Database active, `admin_users` table created, Fastify server running).

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Authentication & Password Security
- Implement password hashing using **Argon2id** (memory: 64MB, iterations: 3, parallelism: 4).
- Session mechanism: Secure random 64-byte session token stored in PostgreSQL or signed session cookie.
- Cookie parameters: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`, `maxAge: 7 * 24 * 60 * 60` (7 days).
- Brute-force protection: Rate limit login attempts to max 5 failed attempts per 15 minutes per IP address.

### 4.2 Role-Based Access Control (RBAC) Matrix
Enforce four hierarchical roles defined in `Architecture.md` Section 10:

| Role | Products & Categories | Media & Documents | Page Content | Enquiries | Users & Settings | Audit Logs |
|---|---|---|---|---|---|---|
| **SUPER_ADMIN** | Full (CRUD + Publish) | Full (Upload + Delete) | Full | Full | Full | Full Read |
| **CONTENT_EDITOR**| Full (CRUD + Publish) | Full (Upload + Delete) | Full | No Access | No Access | No Access |
| **ENQUIRY_MANAGER**| View Only | View Only | View Only | Full (Manage + Note) | No Access | No Access |
| **VIEWER** | View Only | View Only | View Only | View Only | No Access | No Access |

### 4.3 Auth API Endpoints
- `POST /api/admin/auth/login`: Validates credentials, sets session cookie, returns sanitized user object.
- `POST /api/admin/auth/logout`: Invalidates session, clears cookie.
- `GET /api/admin/auth/me`: Returns current authenticated user and permission payload.
- `GET /api/admin/users`: (Super Admin only) List admin users.
- `POST /api/admin/users`: (Super Admin only) Invite / create admin user.
- `PATCH /api/admin/users/:id`: (Super Admin only) Update role or active status.

### 4.4 Admin Frontend Shell (`apps/admin`)
- **Route Guard:** Unauthenticated access to any `/admin/*` route redirects immediately to `/admin/login`.
- **Layout Architecture:**
  - **Left Sidebar:** SIWI Admin wordmark, navigation links (Dashboard, Products, Categories, Media Library, Enquiries, Pages, Settings, Users, Audit Log).
  - **Top Bar:** Current page title, global search bar, admin user name, role badge, quick logout button.
  - **Design Styling:** Clean, neutral, high-density interface prioritizing readability, data tables, and rapid task completion (distinguished from the editorial public website).

### 4.5 Admin Dashboard (`/admin`) Live Operational Widgets
Build the dashboard around the four operational questions in `Architecture.md` Section 4:
1. **What is published?**
   - KPI Card: Total Products, Published Count, Draft Count, Archived Count.
2. **What needs attention?**
   - KPI Card: Enquiries awaiting response (>24h), Expiring Certificates.
3. **What enquiries have arrived?**
   - Real-time table: 5 most recent buyer enquiries (Company, Contact, Product, Received Date, Status).
4. **What can I update quickly?**
   - Quick action buttons: `+ Add Product`, `Edit Homepage Content`, `View Unread Enquiries`.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Admin login successfully authenticates seeded Super Admin and sets secure cookie.
- [ ] Direct unauthenticated `GET /api/admin/products` returns `401 Unauthorized`.
- [ ] Fastify hook rejects `CONTENT_EDITOR` attempting to access `/api/admin/users` with `403 Forbidden`.
- [ ] Admin React console renders full layout with responsive sidebar and active link indicators.
- [ ] Dashboard displays accurate live counts queried from PostgreSQL (no hardcoded mockup figures).
- [ ] Logout invalidates the session and redirects to `/admin/login`.
