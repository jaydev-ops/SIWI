# SIWI Global Ventures — Implementation Milestones & Roadmap
## Architectural Execution Plan for Public Website & Admin Console

---

## 1. EXECUTIVE SUMMARY & SYSTEM GOALS

This milestone documentation system translates the complete technical and operational specification in `Docs/Architecture.md` into **9 workable, sequential, and testable implementation milestones**.

The core system goal is to build a high-performance, international B2B agricultural export website backed by a private, custom Content Management System (CMS). This architecture empowers authorized administrators to:
1. Manage the entire product catalogue (onion & garlic products, tiles, and future traded goods)
2. Upload, organize, and serve optimized product imagery and technical documents
3. Edit public website content (Homepage, About, Contact, Footer, Site Settings)
4. Receive, triage, and track international buyer trade enquiries
5. Control publishing states (Draft, Preview, Publish, Archive) without touching source code or triggering manual redeployments

---

## 2. SYSTEM ARCHITECTURE & 3-TIER MODEL

The platform consists of three connected, decoupled tiers sharing a single modular backend and relational database:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SIWI GLOBAL VENTURES                            │
├───────────────────────────────────┬────────────────────────────────────┤
│           PUBLIC WEBSITE          │            ADMIN CONSOLE           │
│   (International Procurement)     │       (Authorised Operators)       │
│  - Editorial, Apple-like design   │  - Functional data tables & forms  │
│  - Dynamic product catalog        │  - 7-tab product editor            │
│  - B2B trade enquiry workflow     │  - Central media & document hub    │
│  - Dark / Light theme parity      │  - Structured page content editor  │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  │ HTTPS (Public API)                 │ HTTPS (Admin API / Sessions)
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MODULAR APPLICATION BACKEND                        │
│                         (Node.js + Fastify)                            │
│  ┌───────────────┬───────────────┬────────────────┬─────────────────┐  │
│  │ Auth & RBAC   │ Products CMS  │ Media & S3     │ Enquiry Pipeline│  │
│  └───────────────┴───────────────┴────────────────┴─────────────────┘  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│       POSTGRESQL DATABASE        │ │     S3-COMPATIBLE STORAGE        │
│          (via Prisma ORM)        │ │  - Public product image variants │
│  - Product & category records    │ │  - Technical specification sheets│
│  - Structured page content (JSON)│ │  - Certificates of Analysis (CoA)│
│  - User accounts & audit logs    │ │  - Private commercial documents  │
│  - Buyer trade enquiries & notes │ │  - Secure presigned download URLs│
└──────────────────────────────────┘ └──────────────────────────────────┘
```

---

## 3. ARCHITECTURAL PHASES VS. WORKABLE MILESTONES

Section 19 of `Architecture.md` outlines four overarching phases. These map directly into our 9 engineering milestones:

| Architectural Phase | Milestone Number & Title | Primary Deliverable & Business Value |
|---|---|---|
| **Phase 1: Core Website & Product CMS** | [MILESTONE_01_FOUNDATION_AND_ENVIRONMENT.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_01_FOUNDATION_AND_ENVIRONMENT.md) | Monorepo scaffolding, Fastify server, PostgreSQL + Prisma ORM schema, S3 client. |
| | [MILESTONE_02_AUTH_AND_ADMIN_FRAMEWORK.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_02_AUTH_AND_ADMIN_FRAMEWORK.md) | Secure session auth, RBAC permissions, Admin UI shell, operational KPI dashboard. |
| | [MILESTONE_03_CATEGORY_AND_MEDIA_MANAGEMENT.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_03_CATEGORY_AND_MEDIA_MANAGEMENT.md) | Dynamic categories, S3 asset upload pipeline, image variant generation, media browser. |
| | [MILESTONE_04_PRODUCT_CATALOGUE_AND_CMS.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_04_PRODUCT_CATALOGUE_AND_CMS.md) | 7-tab product editor, flexible EAV specs, draft/preview/publish workflow, product APIs. |
| | [MILESTONE_05_PUBLIC_WEBSITE_FRONTEND.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_05_PUBLIC_WEBSITE_FRONTEND.md) | Public React/Vite site, Apple-inspired design system, 16 routes, dark/light themes. |
| **Phase 2: Documents & Enquiries** | [MILESTONE_06_ENQUIRY_SYSTEM_AND_COMMUNICATION.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_06_ENQUIRY_SYSTEM_AND_COMMUNICATION.md) | B2B trade enquiry portal, contextual pre-filling (`?product=`), admin triage, email alerts. |
| | [MILESTONE_08_DOCUMENT_AND_CERTIFICATE_SECURITY.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_08_DOCUMENT_AND_CERTIFICATE_SECURITY.md) | Product certificates & CoAs, public vs. private access, short-lived presigned URLs. |
| **Phase 3: Content CMS & Governance** | [MILESTONE_07_STRUCTURED_CONTENT_AND_PAGE_CMS.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_07_STRUCTURED_CONTENT_AND_PAGE_CMS.md) | Page editor (Home, About, Contact, Footer), global settings, revision history, preview. |
| **Phase 4: Refinement & Optimisation** | [MILESTONE_09_SECURITY_PERFORMANCE_AND_PRODUCTION.md](file:///Users/jayeshyadav/Projects/SIWI/Docs/Milestones/MILESTONE_09_SECURITY_PERFORMANCE_AND_PRODUCTION.md) | Rate limiting, CSRF, security headers, database backups, caching, deployment pipeline. |

---

## 4. COMPLETE TECHNOLOGY STACK SPECIFICATION

As mandated in `Architecture.md` Section 2:

- **Public Frontend:** React 18+ with TypeScript, Vite build tooling, Tailwind CSS for tokenized styling, React Router v6.
- **Admin Frontend:** React 18+ with TypeScript, Vite, Tailwind CSS (functional neutral theme), Lucide icons, Headless UI / Radix primitives for accessibility.
- **Backend API:** Node.js 20+ LTS, TypeScript, Fastify framework (lightweight, high-throughput, structured plugin architecture).
- **Database & ORM:** PostgreSQL 15+ relational database, Prisma ORM for typed migrations and type-safe query generation.
- **Media & File Storage:** S3-compatible object storage (AWS S3, Cloudflare R2, or MinIO for local development) paired with Sharp for automated image variant resizing.
- **Authentication:** Server-side sessions stored securely in database/memory, delivered via encrypted `HTTP-only`, `SameSite=Lax`, `Secure` cookies. Passwords hashed using Argon2id or bcrypt.
- **Email Service:** Transactional email provider (Resend, AWS SES, or SendGrid) for immediate enquiry alerts and buyer acknowledgments.
- **Hosting & Infrastructure:** Single modular monorepo, containerized deployment (Docker), environment-isolated configurations.

---

## 5. REPOSITORY DIRECTORY LAYOUT

```
SIWI/
├── apps/
│   ├── web/               # Public B2B website (React + Vite + Tailwind)
│   └── admin/             # Private CMS Admin Console (React + Vite + Tailwind)
├── packages/
│   ├── server/            # Fastify backend API & business logic
│   ├── database/          # Prisma schema, migrations, and seed scripts
│   └── shared-types/      # Shared TypeScript interfaces & API schemas
├── Docs/
│   ├── Architecture.md    # Source technical architecture document
│   ├── Design.md          # Visual art direction & design rules
│   ├── Milestones/        # This 9-part milestone execution system
│   └── siwi-design-reference-system/ # Stitch AI design packs
└── docker-compose.yml     # Local PostgreSQL & MinIO development environment
```

---

## 6. MILESTONE PROGRESSION & DEPENDENCY GRAPH

```
[Milestone 01: Foundation & DB]
           │
           ▼
[Milestone 02: Auth & Admin Shell]
           │
     ┌─────┴────────────────────────┐
     ▼                              ▼
[Milestone 03: Categories & Media]  [Milestone 07: Page CMS & Settings]
     │                              │
     ▼                              │
[Milestone 04: Product Catalogue]   │
     │                              │
     ├──────────────────────────────┘
     ▼
[Milestone 05: Public Website Frontend]
     │
     ▼
[Milestone 06: B2B Enquiry Engine]
     │
     ▼
[Milestone 08: Document & Certificate Security]
     │
     ▼
[Milestone 09: Security, Performance & Production]
```

---

## 7. MASTER EXECUTION CHECKLIST

- [ ] **Milestone 01:** Monorepo initialized, Fastify server running, Prisma schema applied to PostgreSQL, S3 client tested.
- [ ] **Milestone 02:** Admin session login working, RBAC roles active, admin layout loaded with live metric cards.
- [ ] **Milestone 03:** Dynamic categories CRUD active, S3 upload pipeline with 9-step validation, media browser active.
- [ ] **Milestone 04:** 7-tab product editor functional, flexible specs EAV working, Draft/Publish workflow verified.
- [ ] **Milestone 05:** Public site rendering 16 routes, dark/light themes active, dynamic products rendered from API.
- [ ] **Milestone 06:** Public trade enquiry pre-filling functional, admin triage workflow active, email notifications sending.
- [ ] **Milestone 07:** Homepage, About, Contact, Footer editable via admin console without modifying code.
- [ ] **Milestone 08:** Certificate management active, public vs private flags enforced, presigned URLs expiring correctly.
- [ ] **Milestone 09:** Rate limiting active, CSRF protection enabled, DB backup script verified, production deployment live.
