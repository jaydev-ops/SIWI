# Admin Console Change Log & System Documentation

**Repository:** SIWI Global Ventures  
**Directory:** `Docs/ADMIN_CONSOLE_CHANGELOG.md`  
**Last Updated:** October 2026  

---

## 1. Overview of Recent Architectural Revisions

This document maintains an accurate, persistent record of refinements, removals, and security hardening performed within the SIWI Global Ventures Admin Console.

---

## 2. Navigation Module Removal

### 2.1 Context & Rationale
The `/admin/navigation` page was originally conceived as a placeholder for editing public header menus. However:
1. The public site navigation hierarchy is static, core to the brand architecture, and defined directly in `src/components/PublicLayout.tsx` and `src/App.tsx`.
2. The page displayed only an uneditable mockup table without active backend CRUD operations or database backing.
3. Keeping it created UI clutter and operational confusion for administrators.

### 2.2 Changes Implemented
- **Route Removal (`src/App.tsx`)**:
  - Removed `<Route path="navigation" element={<AdminNavigationPage />} />`.
  - Removed `import { AdminNavigationPage } from "./pages/admin/AdminNavigationPage"`.
- **Sidebar Menu Cleanup (`src/components/AdminLayout.tsx`)**:
  - Removed `{ name: 'Navigation', path: '/admin/navigation', icon: Compass }` from `navItems`.
  - Removed unused `Compass` icon import from `lucide-react`.
- **File Removal**:
  - Deleted obsolete file: `src/pages/admin/AdminNavigationPage.tsx`.
- **Documentation Updates**:
  - Replaced stale routes in `Docs/Architecture.md` and `Docs/Milestones/MILESTONE_02_AUTH_AND_ADMIN_FRAMEWORK.md`.

---

## 3. Administrator User Management & Security Hardening

### 3.1 Operator Provisioning & Tracking
- **Multi-Admin Support (`server/index.ts` & `src/pages/admin/AdminUsersPage.tsx`)**:
  - Added ability for Super Admins to register secondary admin users with distinct roles:
    - `SUPER_ADMIN`: Full administrative and security controls.
    - `CONTENT_EDITOR`: Catalog, category, and CMS management.
    - `ENQUIRY_MANAGER`: Trade enquiry triage and customer communications.
    - `VIEWER`: Read-only operational oversight.
  - Live operator directory displaying initials avatar, email, name, role badge, account status (`Active` / `Suspended`), and creation timestamp.

### 3.2 Master Admin Credential & Email Update
- **Self-Service Credential Management**:
  - Integrated "Update Administrator Credentials & Login Security" panel inside the Admin Users section.
  - Allows the active administrator to change their master login Email / ID, display name, and password.
  - **Mandatory Re-authentication**: Requires validation of `current_password` on the server before applying any changes.
  - **Frontend Safeguards**: Email regex validation, minimum 6-character length check, password confirmation matching, and visibility toggles (`Eye` / `EyeOff`).
  - **Session Sync**: Updates `localStorage.getItem('siwi_admin_user')` immediately upon success so topbar headers and profile indicators reflect new credentials without requiring logout.

### 3.3 Security & Anti-Lockout Protections
- **Zero Credential Exposure**: `GET /api/admin/users` explicitly queries only `id, email, first_name, last_name, role, is_active, created_at`. `password_hash` is strictly excluded from responses.
- **Root Admin Immunity**: The primary system admin (`usr_admin_1`) cannot be deleted or deactivated via API or UI.
- **Anti-Self-Lockout**: Administrators cannot deactivate or delete their own currently authenticated session.
- **Sole Super Admin Guard**: The system prevents deactivating or deleting the last active `SUPER_ADMIN`.
- **Audit Logging**: Every account creation, credential update, status change, and deletion is recorded in the `audit_logs` SQLite table.

---

## 4. Previously Deprecated Modules

### 4.1 Documents Module Removal
- Deprecated `/admin/documents` in favor of centralized asset management via the Media Library (`/admin/media`) and direct attachment of certificates and technical data sheets to products.

### 4.2 Closed Enquiry Purging
- Added single and batch deletion capability (`DELETE /api/admin/enquiries/:id`) allowing operators to permanently clean up resolved, closed, or spam trade enquiries from the system.

---

## 5. Current Active Admin Navigation Architecture

The refined, streamlined admin sidebar navigation comprises:

| Item | Route | Purpose |
|---|---|---|
| **Dashboard** | `/admin` | Live operational overview, pending enquiry counts, quick actions |
| **Products** | `/admin/products` | Commodity catalog, draft/published status, specifications |
| **Categories** | `/admin/categories` | Commodity classifications (Spices, Grains, Dehydrated, etc.) |
| **Media Library** | `/admin/media` | Image and document uploads, CDN/local storage references |
| **Enquiries** | `/admin/enquiries` | Inbound B2B buyer trade leads, RFQs, status workflow |
| **Page CMS** | `/admin/pages` | Editorial content management for static and informational pages |
| **Site Settings** | `/admin/settings` | Company contact details, legal entity info, global metadata |
| **Admin Users** | `/admin/users` | Operator user directory, credential updates, role provisioning |
| **Audit Log** | `/admin/audit-log` | Immutable timestamped audit trails of all system mutations |
