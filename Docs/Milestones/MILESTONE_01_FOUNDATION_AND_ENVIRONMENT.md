# MILESTONE 01 — FOUNDATION, DATABASE & INFRASTRUCTURE
## SIWI Global Ventures Technical Implementation

---

## 1. OBJECTIVE & ARCHITECTURAL SCOPE

Establish the enterprise development foundation for SIWI Global Ventures:
1. Initialize the monorepo workspace for public web, admin console, and backend services.
2. Configure the Node.js + TypeScript Fastify API server with modular routing and error handling.
3. Scaffold PostgreSQL with Prisma ORM and apply the complete 16-table relational schema.
4. Establish an S3-compatible object storage client for local development (MinIO) and production (AWS S3/Cloudflare R2).
5. Provide a deterministic local development setup via Docker Compose.

---

## 2. ARCHITECTURAL REFERENCES
- `Architecture.md` Section 1: Overall system architecture (Three connected systems, modular monolith).
- `Architecture.md` Section 2: Recommended technology stack.
- `Architecture.md` Section 11: Database architecture (Core entities & table definitions).
- `Architecture.md` Section 17: Deployment architecture & environment isolation.

---

## 3. PREREQUISITES & ENVIRONMENT SETUP
- Node.js >= 20.x LTS & npm / pnpm / yarn.
- Docker & Docker Compose (for local PostgreSQL and MinIO services).
- Git repository configured with `.gitignore` guarding secrets and build artifacts.

---

## 4. DETAILED ENGINEERING DELIVERABLES

### 4.1 Monorepo & Project Scaffolding
Create the following directory layout:
```
SIWI/
├── apps/
│   ├── web/               # Public B2B React client
│   └── admin/             # Admin CMS React client
├── packages/
│   ├── server/            # Fastify backend application
│   ├── database/          # Prisma schema, migrations, client
│   └── shared-types/      # Shared TypeScript DTOs and interfaces
├── docker-compose.yml     # Local services
└── package.json           # Workspace configuration
```

### 4.2 Database Schema Architecture (`packages/database/prisma/schema.prisma`)
Codify all 16 relational tables defined in `Architecture.md` Section 11:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  CONTENT_EDITOR
  ENQUIRY_MANAGER
  VIEWER
}

enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum EnquiryStatus {
  NEW
  REVIEWED
  IN_PROGRESS
  AWAITING_CUSTOMER
  CONVERTED
  CLOSED
}

enum DocumentType {
  SPECIFICATION_SHEET
  CERTIFICATE_OF_ANALYSIS
  SAFETY_DATA_SHEET
  QUALITY_CERTIFICATE
  PRODUCT_BROCHURE
  PACKAGING_INFORMATION
  OTHER
}

model AdminUser {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String      @map("password_hash")
  firstName    String      @map("first_name")
  lastName     String      @map("last_name")
  role         Role        @default(CONTENT_EDITOR)
  isActive     Boolean     @default(true) @map("is_active")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  createdProducts  Product[]       @relation("ProductCreatedBy")
  updatedProducts  Product[]       @relation("ProductUpdatedBy")
  uploadedDocs     Document[]      @relation("DocumentUploadedBy")
  enquiryNotes     EnquiryNote[]
  enquiryActivities EnquiryActivity[]
  auditLogs        AuditLog[]
  assignedEnquiries Enquiry[]      @relation("EnquiryAssignedTo")

  @@map("admin_users")
}

model Product {
  id               String         @id @default(uuid())
  name             String
  slug             String         @unique
  shortDescription String         @map("short_description")
  description      String?        @db.Text
  status           ProductStatus  @default(DRAFT)
  featured         Boolean        @default(false)
  displayOrder     Int            @default(0) @map("display_order")
  seoTitle         String?        @map("seo_title")
  seoDescription   String?        @map("seo_description")
  publishedAt      DateTime?      @map("published_at")
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")
  createdById      String?        @map("created_by")
  updatedById      String?        @map("updated_by")

  createdBy        AdminUser?     @relation("ProductCreatedBy", fields: [createdById], references: [id])
  updatedBy        AdminUser?     @relation("ProductUpdatedBy", fields: [updatedById], references: [id])

  categories       ProductCategory[]
  images           ProductImage[]
  specifications   ProductSpecification[]
  documents        ProductDocument[]
  enquiries        EnquiryProduct[]

  @@map("products")
}

model Category {
  id             String      @id @default(uuid())
  name           String
  slug           String      @unique
  description    String?     @db.Text
  parentId       String?     @map("parent_id")
  featuredImageId String?    @map("featured_image_id")
  displayOrder   Int         @default(0) @map("display_order")
  seoTitle       String?     @map("seo_title")
  seoDescription String?     @map("seo_description")
  status         ProductStatus @default(PUBLISHED)
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")

  parent         Category?   @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children       Category[]  @relation("CategoryHierarchy")
  products       ProductCategory[]

  @@map("categories")
}

model ProductCategory {
  productId   String  @map("product_id")
  categoryId  String  @map("category_id")
  isPrimary   Boolean @default(false) @map("is_primary")

  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([productId, categoryId])
  @@map("product_categories")
}

model MediaAsset {
  id           String      @id @default(uuid())
  storageKey   String      @unique @map("storage_key")
  originalName String      @map("original_name")
  mimeType     String      @map("mime_type")
  fileSize     Int         @map("file_size")
  width        Int?
  height       Int?
  altText      String?     @map("alt_text")
  caption      String?
  uploadedById String?     @map("uploaded_by")
  createdAt    DateTime    @default(now()) @map("created_at")

  productImages ProductImage[]

  @@map("media_assets")
}

model ProductImage {
  id           String      @id @default(uuid())
  productId    String      @map("product_id")
  mediaAssetId String      @map("media_asset_id")
  displayOrder Int         @default(0) @map("display_order")
  isFeatured   Boolean     @default(false) @map("is_featured")

  product      Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  mediaAsset   MediaAsset  @relation(fields: [mediaAssetId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductSpecification {
  id           String      @id @default(uuid())
  productId    String      @map("product_id")
  name         String
  value        String
  unit         String?
  displayOrder Int         @default(0) @map("display_order")
  isPublic     Boolean     @default(true) @map("is_public")
  notes        String?
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  product      Product     @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_specifications")
}

model Document {
  id             String        @id @default(uuid())
  title          String
  documentType   DocumentType  @map("document_type")
  storageKey     String        @unique @map("storage_key")
  originalName   String        @map("original_name")
  mimeType       String        @map("mime_type")
  fileSize       Int           @map("file_size")
  version        String?       @default("1.0")
  issueDate      DateTime?     @map("issue_date")
  expiryDate     DateTime?     @map("expiry_date")
  isPublic       Boolean       @default(false) @map("is_public")
  status         ProductStatus @default(DRAFT)
  uploadedById   String?       @map("uploaded_by")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")

  uploadedBy     AdminUser?    @relation("DocumentUploadedBy", fields: [uploadedById], references: [id])
  products       ProductDocument[]

  @@map("documents")
}

model ProductDocument {
  productId   String    @map("product_id")
  documentId  String    @map("document_id")

  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  document    Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@id([productId, documentId])
  @@map("product_documents")
}

model SitePage {
  id           String      @id @default(uuid())
  slug         String      @unique
  title        String
  content      Json        // Validated structured JSON schema
  publishedAt  DateTime?   @map("published_at")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  revisions    PageRevision[]

  @@map("site_pages")
}

model PageRevision {
  id           String      @id @default(uuid())
  pageId       String      @map("page_id")
  content      Json
  version      Int         @default(1)
  createdById  String?     @map("created_by")
  createdAt    DateTime    @default(now()) @map("created_at")

  page         SitePage    @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@map("page_revisions")
}

model SiteSetting {
  id           String      @id @default(uuid())
  key          String      @unique
  value        Json
  updatedAt    DateTime    @updatedAt @map("updated_at")

  @@map("site_settings")
}

model Enquiry {
  id               String         @id @default(uuid())
  name             String
  companyName      String         @map("company_name")
  email            String
  phone            String?
  country          String
  quantity         String?
  packaging        String?
  destinationPort  String?        @map("destination_port")
  message          String         @db.Text
  status           EnquiryStatus  @default(NEW)
  assignedToId     String?        @map("assigned_to")
  createdAt        DateTime       @default(now()) @map("created_at")
  updatedAt        DateTime       @updatedAt @map("updated_at")

  assignedTo       AdminUser?     @relation("EnquiryAssignedTo", fields: [assignedToId], references: [id])
  products         EnquiryProduct[]
  notes            EnquiryNote[]
  activities       EnquiryActivity[]

  @@map("enquiries")
}

model EnquiryProduct {
  enquiryId  String   @map("enquiry_id")
  productId  String?  @map("product_id")
  productName String  @map("product_name")

  enquiry    Enquiry  @relation(fields: [enquiryId], references: [id], onDelete: Cascade)
  product    Product? @relation(fields: [productId], references: [id], onDelete: SetNull)

  @@id([enquiryId, productName])
  @@map("enquiry_products")
}

model EnquiryNote {
  id          String     @id @default(uuid())
  enquiryId   String     @map("enquiry_id")
  authorId    String     @map("author_id")
  note        String     @db.Text
  createdAt   DateTime   @default(now()) @map("created_at")

  enquiry     Enquiry    @relation(fields: [enquiryId], references: [id], onDelete: Cascade)
  author      AdminUser  @relation(fields: [authorId], references: [id])

  @@map("enquiry_notes")
}

model EnquiryActivity {
  id          String     @id @default(uuid())
  enquiryId   String     @map("enquiry_id")
  authorId    String?    @map("author_id")
  action      String
  details     Json?
  createdAt   DateTime   @default(now()) @map("created_at")

  enquiry     Enquiry    @relation(fields: [enquiryId], references: [id], onDelete: Cascade)
  author      AdminUser? @relation(fields: [authorId], references: [id])

  @@map("enquiry_activities")
}

model AuditLog {
  id          String     @id @default(uuid())
  userId      String?    @map("user_id")
  action      String
  entityType  String     @map("entity_type")
  entityId    String     @map("entity_id")
  details     Json?
  ipAddress   String?    @map("ip_address")
  userAgent   String?    @map("user_agent")
  createdAt   DateTime   @default(now()) @map("created_at")

  user        AdminUser? @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}
```

### 4.3 Fastify API Foundation (`packages/server`)
- Initialize Fastify instance with JSON schema validation.
- Register essential plugins: `@fastify/cors`, `@fastify/helmet`, `@fastify/cookie`, `@fastify/sensible`.
- Create structured routing hierarchy:
  - `/api/public/*` — Public unauthenticated consumer routes
  - `/api/admin/*` — Authenticated administration routes
- Implement centralized error handler mapping Prisma errors and validation failures to RFC 7807 problem details.
- Provide health-check endpoint: `GET /api/health` returning database and storage connectivity status.

### 4.4 Docker Development Services (`docker-compose.yml`)
Configure local PostgreSQL (port 5432) and MinIO object storage (ports 9000 & 9001) for deterministic local engineering without external cloud dependencies.

---

## 5. ACCEPTANCE CRITERIA & DEFINITION OF DONE
- [ ] Monorepo build tooling compiles `packages/shared-types`, `packages/database`, and `packages/server` with zero TypeScript errors.
- [ ] `docker compose up -d` starts PostgreSQL and MinIO successfully.
- [ ] `npx prisma migrate dev` creates all 16 tables in PostgreSQL without errors.
- [ ] Fastify server launches and responds to `GET /api/health` with `{"status": "ok", "database": "connected", "storage": "connected"}`.
- [ ] Initial database seed populates default Super Admin account and baseline categories.
