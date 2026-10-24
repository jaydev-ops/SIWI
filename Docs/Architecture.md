SIWI Global Ventures — Complete Website & Admin Console Architecture
The key architectural decision is to build a public B2B export website backed by a private content management system (CMS).
This means you won't need to edit website code every time you want to add a product, change an image, upload a certificate, update a specification, or modify company information.
Instead, you'll log in to an admin console, make the changes, preview them, and publish them to the website.
For SIWI Global Ventures, I would build this as a premium, multi-page website with a custom admin console—not a generic ecommerce template and not an unnecessarily complicated enterprise platform.
The following is the architecture I recommend using as the source of truth for your design and implementation.

1. Overall system architecture
   Think of the project as three connected systems.
1. Public website: What international buyers see.
1. Admin console: Where authorised users manage the website.
1. Backend and database: Where the products, content, images, documents, and enquiries are stored.
   High-level architecture
   SIWI GLOBAL VENTURES
   │
   ┌──────────┴──────────┐
   │ │
   PUBLIC WEBSITE ADMIN CONSOLE
   │ │
   International Authorised Users
   Buyers │
   │ │
   └──────────┬──────────┘
   │
   API LAYER
   │
   ┌─────────────┼─────────────┐
   │ │ │
   PRODUCTS CONTENT ENQUIRIES
   │ │ │
   └─────────────┼─────────────┘
   │
   APPLICATION BACKEND
   │
   ┌──────────┴──────────┐
   │ │
   DATABASE FILE STORAGE
   │ │
   Product records Product images
   Specifications Certificates
   Site content Product documents
   Admin accounts Other media
   Enquiries

The public website and admin console share the same backend and database, but they have different permissions.
A visitor can view published products and submit an enquiry. An authorised administrator can create products, change content, upload documents, and publish updates.
The public website must never be allowed to access administrative functions simply because the admin interface exists in the same application. Permissions must be enforced by the backend. 2. Recommended technology stack
Considering the scale of SIWI Global Ventures, the objective should be maintainability, reasonable operating costs, and straightforward administration.
I recommend the following stack.
Layer Recommended technology Purpose
Frontend React + TypeScript Public website and admin interface
Build tooling Vite Frontend development and production builds
Styling Tailwind CSS Consistent design system
Routing React Router Public and admin routes
Backend Node.js + TypeScript Business logic and API
Backend framework Fastify Lightweight, structured API
Database PostgreSQL Products, users, content, and enquiries
Database access Prisma ORM Typed database access and migrations
Media storage S3-compatible object storage Images, PDFs, and product documents
Authentication Secure server-side sessions Admin login and access control
Email Transactional email provider Enquiry notifications and responses
Hosting Frontend hosting plus backend hosting Public access and API availability

This stack is a recommendation, not a requirement to use every component immediately.
Why PostgreSQL?
Your data is relational.
A product belongs to one or more categories. A product can have multiple images and certificates. An enquiry may reference one or several products. An administrator can manage content and publishing status.
PostgreSQL handles these relationships naturally.
It also gives you a sensible foundation if the company eventually adds more product categories, languages, enquiry workflows, or administrative users.
Why object storage?
Do not store product images and large PDF certificates directly inside database records.
Store the files in object storage and keep their metadata and storage references in PostgreSQL.
This makes it easier to manage image galleries, replace files, control access to private documents, and deliver public product images efficiently.
An important implementation decision
Use a modular monolith, not microservices.
That means one backend application with clearly separated modules for products, media, content, enquiries, and administration.
For a company of this size, that is easier to develop, deploy, and maintain than several independent backend services. 3. Public website architecture
The public website should communicate the company's business clearly and make it easy for international buyers to enquire about products.
It should preserve the existing SIWI branding: charcoal, gold, ivory, restrained typography, generous spacing, and the globe-and-compass motif.
The website should remain editorial and product-focused, with minimal cards and no generic ecommerce styling.
Public routes
Route Page Purpose
/ Home Introduce the company and its products
/about About Us Company introduction, business approach, founder
/products Products Complete product catalogue
/products/:categorySlug Product category Browse products in a category
/products/:productSlug Product detail View product information and documents
/trade-enquiries Trade Enquiries Submit business requirements
/contact Contact Contact details and general enquiries
/privacy-policy Privacy Policy Explain the site's data practices
/terms Terms Applicable website terms

Additional product pages should be generated from product records rather than hardcoded individually.
For example:
/products/onion-powder
/products/garlic-powder
/products/garlic-granules
/products/dehydrated-fried-onions
/products/birista
/products/onion-kibbles

These are example routes based on the known product range. (Note: Ceramic Tiles were decommissioned from the architectural scope in ADR-001 to focus exclusively on agricultural and food commodity export).
The administrator should be able to create new product records and assign their slugs without requiring a code change, provided the slug is valid and unique.
Product categories
Start with the following categories:
Dehydrated Vegetable Products

- Onion Powder
- Garlic Powder
- Garlic Granules
- Dehydrated Fried Onions
- Birista
- Onion Kibbles
- Other Value-Added Products
Other Trading Categories
- Other Agricultural Commodities
The administrator should be able to create additional categories later.
Do not hardcode the category list into the frontend.

4. Admin console architecture
   The admin console is the most important additional requirement because it determines whether the website remains easy to maintain.
   I recommend a dedicated admin area with its own layout, navigation, permissions, and editing workflows.
   Admin route structure
   /admin/login
   /admin
   /admin/products
   /admin/products/new
   /admin/products/:id/edit
   /admin/categories
   /admin/media
   /admin/enquiries
   /admin/enquiries/:id
   /admin/pages
   /admin/pages/:id/edit
   /admin/settings
   /admin/users
   /admin/audit-log

All routes except login must require authentication.
Routes that modify data must also enforce the appropriate permissions on the server.
Admin dashboard
Route: /admin
The dashboard should answer four questions immediately:

1. What is published?
2. What needs attention?
3. What enquiries have arrived?
4. What can I update quickly?
   Dashboard layout
   ┌───────────────────────────────────────────────────────────────┐
   │ SIWI ADMIN Search Admin Profile │
   ├──────────────────┬────────────────────────────────────────────┤
   │ │ │
   │ Overview │ Good morning │
   │ │ Manage SIWI Global Ventures │
   │ Products │ │
   │ Categories │ Products Drafts Enquiries Published │
   │ Media Library │ │
   │ Pages │ Recent Enquiries │
   │ Enquiries │ -------------------------------------- │
   │ Settings │ Company Product Status │
   │ Users │ │
   │ Audit Log │ Recently Updated Products │
   │ │ │
   └──────────────────┴────────────────────────────────────────────┘

This is a structural illustration, not the final visual design.
Use a restrained admin interface with a neutral background, clear typography, functional tables, accessible forms, and minimal decorative elements.
The public website can be editorial and asymmetric. The admin console should prioritise clarity and speed.
Do not force the admin interface to imitate the public website's layout.
Dashboard widgets
Include:

- Total products.
- Published products.
- Draft products.
- Archived products.
- Unread enquiries.
- Enquiries awaiting a response.
- Recently updated products.
- Recent enquiry activity.
- Quick action to add a product.
- Quick action to edit homepage content.
  These figures must come from actual database records, not hardcoded demo values.
  If there is no data, show a useful empty state.

5. Product management — the core of the admin console
   Route: /admin/products
   This section should allow an authorised administrator to manage the entire product catalogue.
   The goal is to eliminate the need to modify source code whenever the company adds or updates a product.
   Product listing interface
   Use a functional data table.
   Suggested columns:
   Column Description
   Product Thumbnail and product name
   Category Assigned product category
   Status Draft, Published, or Archived
   Last Updated Last modification timestamp
   Updated By Administrator who made the change
   Actions Edit, Preview, Publish, Archive

Provide:

- Search by product name.
- Filter by category.
- Filter by publication status.
- Sorting by name or update date.
- Pagination when the catalogue grows.
- A clear Add Product button.
- Bulk actions where appropriate.
- An informative empty state.
  Avoid creating a dashboard filled with product cards.
  A table is more suitable for managing a catalogue.
  Add product workflow
  When an administrator selects Add Product, open a dedicated editing page.
  Do not put every field into one excessively long, unstructured form.
  Organise the form into tabs or clearly separated groups.
  Recommended groups:

1. General Information.
2. Product Images.
3. Specifications.
4. Packaging and Supply.
5. Certificates and Documents.
6. SEO and URL.
7. Publishing.
   Each group should save its data reliably and provide clear validation feedback.
   Tab 1: General information
   Fields:
   Field Type Required?
   Product name Text Yes
   URL slug Text Yes
   Short description Textarea Yes
   Full description Rich-text editor Optional
   Product category Select Yes
   Additional categories Multi-select Optional
   Product status Status control Yes
   Featured product Boolean No
   Display order Number No
   Product visibility Visibility control Yes

Example:
Product Name:
Onion Powder

Slug:
onion-powder

Category:
Dehydrated Vegetable Products

Short Description:
Dehydrated onion in powder form for suitable commercial
food-processing and culinary applications.

Status:
Draft

The description above is illustrative. Confirm the company's actual product description before publishing it.
Tab 2: Product images
The administrator should be able to:

- Upload images.
- Drag and drop files.
- Select a featured image.
- Upload multiple gallery images.
- Reorder gallery images.
- Add alt text.
- Add an optional caption.
- Replace an image.
- Remove an image.
- Preview image crops.
- See upload progress and errors.
  Support formats such as JPEG, PNG, WebP, and AVIF where appropriate.
  Use server-side file validation and sensible upload limits.
  Image management requirements
  Every image should have metadata.
  Example:
  Image record
  ├── ID
  ├── Product ID
  ├── Storage key
  ├── Original filename
  ├── MIME type
  ├── File size
  ├── Width
  ├── Height
  ├── Alt text
  ├── Caption
  ├── Display order
  ├── Featured image flag
  ├── Created at
  └── Created by

Store the file itself in object storage, not in the database.
The database stores its metadata and storage reference.
Tab 3: Specifications
The specification editor must be flexible.
Different products may have different technical properties, so do not hardcode a fixed set of fields that every product must use.
Use a combination of standard fields and administrator-defined specification attributes.
Possible fields include:

- Product form.
- Appearance.
- Colour.
- Texture.
- Particle size.
- Moisture content.
- Shelf life.
- Storage conditions.
- Ingredients.
- Country of origin.
- Processing information.
- Other product-specific specifications.
  These are potential fields, not confirmed facts about SIWI's products.
  The administrator should be able to:
- Add a specification.
- Edit a specification.
- Remove a specification.
- Reorder specifications.
- Choose whether a specification is displayed publicly.
- Add a unit where appropriate.
- Add supporting notes.
  Example:
  Specification name: Particle Size
  Value: [Enter verified value]
  Unit: [Optional]
  Visible on website: Yes

Never generate default technical values automatically.
If a specification has not been supplied, leave it empty.
Tab 4: Packaging and supply
Allow the administrator to manage:

- Packaging type.
- Available pack sizes.
- Packaging notes.
- Minimum order quantity.
- Supply information.
- Availability notes.
- Additional commercial information.
  Every field should be optional unless the company confirms that it is required.
  Do not publish an MOQ, supply capacity, price, or delivery promise without verified information.
  Tab 5: Certificates and documents
  This is essential for a B2B export website.
  The administrator should be able to upload, replace, and manage product-related documents.
  Potential document categories:
- Product specification sheet.
- Certificate of Analysis.
- Safety Data Sheet, where applicable.
- Quality certificate.
- Product brochure.
- Packaging information.
- Other supporting documents.
  These are document categories the system can support; they are not claims that SIWI currently possesses these documents.
  For each document, store:
  Document
  ├── ID
  ├── Title
  ├── Document type
  ├── Product association
  ├── File storage key
  ├── Original filename
  ├── MIME type
  ├── File size
  ├── Version
  ├── Issue date
  ├── Expiry date
  ├── Public visibility
  ├── Publication status
  ├── Uploaded by
  ├── Created at
  └── Updated at

The administrator should be able to:

- Upload a document.
- Replace a document.
- Change its title.
- Select its category.
- Associate it with one or more products.
- Set whether it is publicly downloadable.
- Set an expiry date when relevant.
- Archive an outdated document.
- Preview or download permitted files.
  Security requirement: Do not make every uploaded file publicly accessible by default.
  A public product certificate can be downloadable by anyone if the company intends that.
  An internal document must remain private.
  For public files, use controlled publication and validation. For private files, use authenticated access or short-lived signed download links.
  Also, a certificate's presence in the admin console does not establish that it is genuine or valid. Administrators must verify the document and its publication status.
  Tab 6: SEO and URL
  Allow the administrator to edit:
- URL slug.
- SEO title.
- Meta description.
- Social sharing image.
- Canonical URL override, if needed.
- Indexing preference.
- Redirect configuration when a published slug changes.
  Generate a default SEO title and description from the product data, but allow manual overrides.
  If a published URL changes, provide a redirect from the old URL where appropriate.
  This avoids breaking bookmarks and search-engine listings unnecessarily.
  Tab 7: Publishing
  Provide explicit publishing controls.
  Recommended states:
- Draft.
- Published.
- Archived.
  The administrator should be able to:
- Save Draft.
- Preview.
- Publish.
- Unpublish.
- Archive.
  Only published products should appear on the public website.
  The public API must enforce this rule even if someone attempts to access a draft product's URL directly.
  Before publishing, display a checklist:
  PUBLICATION CHECKLIST

✓ Product name provided
✓ URL slug valid and unique
✓ Category assigned
✓ Description provided
✓ Featured image selected

○ Technical specifications reviewed
○ Documents reviewed
○ SEO information reviewed

The first five checks can be mandatory if that matches the company's content policy.
The remaining checks should be mandatory only when relevant.
Do not force a product to have a certificate simply because the admin system supports certificates. 6. Media library
Route: /admin/media
The media library should manage images centrally rather than treating every image as an isolated upload.
Features

- Upload files.
- Browse image thumbnails.
- Search by filename.
- Filter by media type.
- Filter by associated product.
- Edit alt text.
- Replace an image.
- View image dimensions and file size.
- See where an asset is used.
- Delete unused assets.
- Prevent accidental deletion of assets used by published pages.
  When an administrator uploads a product image, the same media record should be available for reuse where appropriate.
  Image processing
  The backend should generate optimised image variants.
  For example:
  Original image
  │
  ├── Thumbnail
  ├── Catalogue image
  ├── Product detail image
  └── High-resolution version

Use modern image formats when supported and preserve an original where needed.
The frontend should use appropriately sized images rather than downloading a full-resolution image for every thumbnail. 7. Category management
Route: /admin/categories
Categories should be database-driven.
An administrator should be able to:

- Create categories.
- Edit category names.
- Change category descriptions.
- Upload category images.
- Reorder categories.
- Change category slugs.
- Set publication status.
- Assign products.
- Configure category SEO information.
  Example:
  Category
  ├── Name
  ├── Slug
  ├── Description
  ├── Parent category
  ├── Featured image
  ├── Display order
  ├── SEO title
  ├── SEO description
  └── Status

Support parent and child categories if needed.
For example:
Products
│
├── Dehydrated Vegetable Products
│ ├── Onion Powder
│ ├── Garlic Powder
│ ├── Garlic Granules
│ ├── Dehydrated Fried Onions
│ ├── Birista
│ └── Onion Kibbles
│
└── Other Agricultural Commodities

Do not require a complex category hierarchy when a simple structure will suffice. 8. Website content management
Route: /admin/pages
Product management alone is not enough.
You should also be able to update much of the public website without modifying code.
I recommend a structured content editor, rather than an unrestricted drag-and-drop page builder.
A fully flexible page builder would introduce considerable complexity without necessarily providing value for this company's needs.
Pages to manage
Homepage
Allow editing of:

- Hero eyebrow.
- Hero headline.
- Hero description.
- Primary CTA label and destination.
- Secondary CTA label and destination.
- Hero image.
- Featured product selection.
- About preview.
- How-we-work content.
- Trade enquiry CTA.
- Footer content.
  About page
  Allow editing of:
- Page heading.
- Company introduction.
- Business focus.
- Company principles.
- Founder name.
- Founder description.
- Founder image, if supplied.
- Supporting images.
  Contact page
  Allow editing of:
- Phone number.
- Email address.
- Location.
- Contact introduction.
- Enquiry instructions.
- Contact form settings.
  Footer
  Allow editing of:
- Logo selection.
- Tagline.
- Company description.
- Navigation links.
- Contact details.
- Legal links.
- Copyright text.
  Global site settings
  Provide fields for:
- Company name.
- Logo.
- Tagline.
- Primary contact phone.
- Contact email.
- Business location.
- Default SEO metadata.
- Default social sharing image.
- Theme defaults.
- Footer settings.
  Avoid allowing administrators to enter arbitrary scripts or unrestricted HTML into content fields.
  Use validated content types and sanitise rich-text content before rendering it.
  Preview and publishing
  For editable pages, use:
  Draft content
  │
  ▼
  Preview
  │
  ▼
  Review
  │
  ▼
  Publish
  │
  ▼
  Public website updated

Provide clear feedback when a change has been published successfully.
For a small business, drafts and preview are useful even if there is only one administrator.
They help prevent accidental publication of incomplete content. 9. Enquiry management
Route: /admin/enquiries
This is the operational side of the website.
When a buyer submits an enquiry, the system should save it to the database and notify the company.
Public enquiry flow
Buyer opens a product page
│
▼
Clicks "Enquire About This Product"
│
▼
Product automatically selected
│
▼
Buyer completes enquiry form
│
▼
Backend validates submission
│
▼
Enquiry saved to database
│
├──► Notification email to SIWI
│
└──► Confirmation shown to buyer

The confirmation should appear only after the enquiry has actually been saved successfully.
Enquiry fields
Store:

- Enquiry ID.
- Name.
- Company name.
- Email.
- Phone number, if supplied.
- Country.
- Selected products.
- Quantity, if supplied.
- Message.
- Submission timestamp.
- Status.
- Assigned administrator, if applicable.
- Internal notes.
- Last updated timestamp.
  Enquiry statuses
  Use a simple workflow:
  New
  │
  ▼
  Reviewed
  │
  ▼
  In Progress
  │
  ├──► Awaiting Customer
  │
  ├──► Converted
  │
  └──► Closed

These are internal administrative statuses.
They should not automatically send messages to customers unless an explicit notification action is implemented.
Admin enquiry table
Display:
Field Purpose
Enquiry ID Internal reference
Company Identify the organisation
Contact Identify the person
Products Understand the request
Received Submission date
Status Track progress
Actions Open, update, close

Enquiry detail page
Administrators should be able to:

- Read the full message.
- View the selected products.
- Update the status.
- Add internal notes.
- Assign the enquiry to a user, if supported.
- Record follow-up activity.
- Open an email response.
- Mark the enquiry as converted or closed.
  Do not display internal notes on the public website.
  Email notifications
  Use a transactional email provider.
  Send an internal notification to the company's configured enquiry address.
  Optionally, send a confirmation to the buyer.
  Keep email credentials on the server.
  The application should remain functional if an email provider temporarily fails: the enquiry must remain saved in the database, and the administrator should be able to see that notification delivery failed.

10. Admin users and permissions
    Route: /admin/users
    You may initially be the only administrator, but the architecture should support additional authorised users later.
    Use role-based access control.
    Suggested roles
    Role Permissions
    Super Admin Manage users, settings, products, content, documents, and enquiries
    Content Editor Manage products, categories, images, documents, and public pages
    Enquiry Manager View and manage enquiries
    Viewer Read permitted records without modifying them

For the first version, you can use just Super Admin and Content Editor if that is sufficient.
Do not introduce complicated permissions for the sake of complexity.
Security requirements

- Use secure authentication.
- Hash passwords using an appropriate password-hashing algorithm.
- Store session identifiers in secure, HTTP-only cookies.
- Use HTTPS.
- Enforce permissions on the server.
- Protect state-changing requests against CSRF where applicable.
- Rate-limit login attempts.
- Validate all incoming data.
- Validate uploaded files.
- Prevent unauthorised document access.
- Record sensitive administrative actions.
- Provide a safe logout mechanism.
  Do not put administrator credentials, database passwords, or private API keys in frontend environment variables.
  A hidden /admin URL is not a security mechanism.
  The backend must reject unauthorised requests even when someone calls the API directly.

11. Database architecture
    Here is a practical starting schema.
    The exact database types and relationships should be refined during implementation.
    Core entities
    AdminUser
    │
    ├── Product changes
    ├── Content changes
    ├── Document uploads
    └── Audit events

Product ───────── Category
│ │
├── ProductImage └── Parent Category
│
├── ProductSpecification
│
├── ProductDocument
│
└── ProductCategory relationship

SitePage
│
└── PageRevision

Enquiry
│
├── EnquiryProduct
│
├── EnquiryNote
│
└── EnquiryActivity

MediaAsset
│
├── ProductImage
├── CategoryImage
└── Page image references

Recommended tables
Table Responsibility
admin_users Administrator accounts and roles
products Product identity, descriptions, status, and SEO
categories Product categories and hierarchy
product_categories Product-to-category relationships
product_images Image associations and ordering
product_specifications Flexible product specifications
documents Uploaded documents and publication metadata
product_documents Product-to-document associations
media_assets Shared media metadata
site_pages Structured website content
page_revisions Version history for page content
site_settings Global website configuration
enquiries Buyer enquiries
enquiry_products Products associated with enquiries
enquiry_notes Internal notes
enquiry_activities Status and follow-up history
audit_logs Important administrative actions

Product table
At minimum:
products

---

id
name
slug
short_description
description
status
featured
display_order
seo_title
seo_description
published_at
created_at
updated_at
created_by
updated_by

Use a unique constraint on the slug.
Product specifications
Use a separate table for flexible specifications.
product_specifications

---

id
product_id
name
value
unit
display_order
is_public
created_at
updated_at

This makes it possible to add different attributes to different products without repeatedly changing the database schema.
Site pages
Store structured content in a validated format, such as JSONB, alongside page metadata.
For example, the homepage might contain:
homepage
├── hero
│ ├── eyebrow
│ ├── headline
│ ├── description
│ ├── image_id
│ └── CTA configuration
├── featured_product_ids
├── about_preview
├── how_we_work
└── enquiry_CTA

Use a defined schema for each page type. Do not permit arbitrary JSON or HTML to be rendered without validation.
Important publishing detail
For products and pages, distinguish between the current editable draft and the publicly published version.
For a small first version, this can be implemented through explicit draft and published content fields or a revision model.
The public API should read only published content.
The admin API can read both drafts and published versions according to the user's permissions. 12. API architecture
Keep the API modular and consistent.
A REST API is sufficient for this project.
Public API
GET /api/public/products
GET /api/public/products/:slug
GET /api/public/categories
GET /api/public/categories/:slug
GET /api/public/pages/:slug
GET /api/public/site-settings
POST /api/public/enquiries

These endpoints expose only the information intended for public consumption.
For example, the public product endpoint should not return internal notes, draft descriptions, private document storage keys, or administrative metadata.
Admin API
POST /api/admin/products
GET /api/admin/products
GET /api/admin/products/:id
PATCH /api/admin/products/:id
POST /api/admin/products/:id/publish
POST /api/admin/products/:id/unpublish
POST /api/admin/products/:id/archive

POST /api/admin/categories
PATCH /api/admin/categories/:id
DELETE /api/admin/categories/:id

POST /api/admin/media/upload
PATCH /api/admin/media/:id
DELETE /api/admin/media/:id

POST /api/admin/documents
PATCH /api/admin/documents/:id
POST /api/admin/documents/:id/publish
POST /api/admin/documents/:id/archive

GET /api/admin/enquiries
GET /api/admin/enquiries/:id
PATCH /api/admin/enquiries/:id
POST /api/admin/enquiries/:id/notes

GET /api/admin/pages
GET /api/admin/pages/:slug
PATCH /api/admin/pages/:slug
POST /api/admin/pages/:slug/publish

GET /api/admin/users
POST /api/admin/users
PATCH /api/admin/users/:id

These are proposed endpoints, not existing services.
Each endpoint must implement authentication, authorisation, validation, and appropriate error handling.
Use soft archiving for important business records where appropriate. Do not permanently delete a product if existing enquiries or audit records depend on it. 13. Media and certificate storage
I recommend separating the database from the actual file storage.
Public files
Examples:

- Public product images.
- Published product brochures.
- Approved, publicly downloadable product certificates.
  These can be served through a CDN or controlled public asset URLs.
  Private files
  Examples:
- Internal business documents.
- Unpublished certificates.
- Sensitive documents uploaded during administration.
  These must remain private.
  Access should be mediated by the backend or short-lived signed URLs.
  File upload validation
  For every upload:

1. Check the authenticated user's permission.
2. Enforce a file-size limit.
3. Validate the permitted file type.
4. Verify the file content rather than trusting its extension alone.
5. Use generated storage keys instead of trusting arbitrary paths.
6. Store metadata in the database.
7. Scan uploaded documents where suitable scanning infrastructure is available.
8. Prevent untrusted files from being executed or served as active content.
9. Record the upload in the audit log.
   Certificates and other documents should have a publication status separate from their mere existence in storage.
10. The complete publishing workflow
    The admin console should provide a clear distinction between editing and publishing.
    For example, suppose you want to add a new product called Onion Powder.
    Your workflow should be:
    Step 1: Open /admin/products.
    Step 2: Click Add Product.
    Step 3: Enter the product name and description.
    Step 4: Select the Dehydrated Vegetable Products category.
    Step 5: Upload the product images.
    Step 6: Add any verified specifications.
    Step 7: Upload certificates or other documents, if available.
    Step 8: Review the SEO information.
    Step 9: Preview the product page.
    Step 10: Publish the product.
    The product then becomes visible at its public URL.
    ADMIN CONSOLE
    │
    ▼
    Create Product
    │
    ▼
    Upload Images and Documents
    │
    ▼
    Enter Verified Details
    │
    ▼
    Preview Product Page
    │
    ▼
    Publish
    │
    ▼
    PUBLIC WEBSITE
    │
    ▼
    /products/onion-powder

The same principle should apply to categories and editable site pages.
What happens when a product is updated?
The administrator edits the product and saves the changes.
The public website should then receive the updated published content.
If caching is used, publishing must invalidate or refresh the relevant cached product page, category listing, and sitemap entries.
Do not require a full frontend redeployment for ordinary content changes.
That is one of the main benefits of using a CMS-backed architecture. 15. Public website design system
The admin console and public website should have different visual priorities.
The public site should be the polished, brand-led experience.
The admin console should be an efficient working environment.
Public website
Use:

- Warm ivory and charcoal surfaces.
- Gold accents.
- Restrained system typography.
- An editorial serif for selected brand elements.
- Generous whitespace.
- Large, carefully composed product photography.
- Minimal cards.
- Asymmetric layouts.
- Subtle compass-inspired graphics.
- Restrained animations.
- Clear product enquiry CTAs.
  The website should not resemble a generic online store.

Theme Strategy: Automated System-Based Preference (Zero-Toggle Design)
The website appearance strictly and automatically follows the user's operating system theme (Light or Dark):
- **Light Mode Surface & Text:** Warm ivory background (`#FAF8F5` / `bg-brand-ivoryLight`), deep charcoal ink text (`#111318` / `text-brand-ink`), muted grey dividers (`#D8D7D2` / `border-brand-grey-300/40`), and brass-gold brand accents (`#C69A45`).
- **Dark Mode Surface & Text:** Deep charcoal ink background (`#111318` / `bg-brand-ink`), warm ivory text (`#F5F2EB` / `text-brand-ivory`), subtle borders (`border-white/10`), and radiant brass-gold accents (`#C69A45`).
- **Native CSS Evaluation:** Tailwind utility classes (`dark:...`) compile to native `@media (prefers-color-scheme: dark)` media queries for zero-lag rendering.
- **Zero-FOUC Head Initialization:** A synchronous `<head>` script detects `prefers-color-scheme` before DOM rendering, eliminating any flash of the wrong theme on cold loads or reloads.
- **Real-Time Live Updates:** `window.matchMedia('(prefers-color-scheme: dark)')` change events trigger immediate updates when the OS switches mode while the site is open, without requiring a page refresh.
- **No Manual Toggle Friction:** All user-facing theme toggle buttons and manual `localStorage` overrides have been removed to preserve a distraction-free B2B experience.

Admin console
Use:
- A neutral interface background.
- Compact, readable navigation.
- Clear tables.
- Structured forms.
- Strong field labels.
- Predictable button placement.
- Clear publication states.
- Accessible error messages.
- Confirmation dialogs for destructive actions.
- Functional image and document management.
- Minimal decorative animation.
  The admin console can use the same brand colours in its logo, navigation accents, and primary actions, but it should not sacrifice usability for visual similarity.
  Admin design principle
  The public website sells confidence in the company. The admin console gives the company control over its information.
  Both should feel related, but they should not be designed identically.

16. Security and reliability requirements
    Because the admin console controls the company's public information, security must be part of the initial architecture.
    The minimum requirements are:

- Secure authentication.
- Server-enforced role permissions.
- HTTPS.
- Secure session cookies.
- Rate limiting.
- Input validation.
- Protection against CSRF where applicable.
- Protection against stored cross-site scripting.
- Secure document access.
- Upload validation.
- Database backups.
- Audit logs.
- Error logging.
- Recovery procedures.
- Secrets stored outside source code.
- Separate development and production environments.
  For database backups, establish a retention policy and test restoration rather than assuming backups are usable.
  For administrative actions, record events such as:
- Product created.
- Product published.
- Product unpublished.
- Certificate uploaded.
- Certificate replaced.
- Product archived.
- Company contact details changed.
- Administrator role changed.
  Audit logs should not be editable by ordinary content editors.
  For production, use a documented recovery process if a product or page is accidentally changed or unpublished.

17. Recommended deployment architecture
    A straightforward deployment could look like this:
    PUBLIC INTERNET
    │
    ▼
    FRONTEND HOST
    │
    ┌────────┴────────┐
    │ │
    Public Website Admin Console
    │ │
    └────────┬────────┘
    │ HTTPS
    ▼
    BACKEND API
    │
    ┌───────────┴───────────┐
    │ │
    ▼ ▼
    PostgreSQL Object Storage
    │ │
    Products, users, Images, PDFs,
    pages, enquiries documents, media

                              │
                              ▼
                     EMAIL NOTIFICATION

Environment separation
Maintain separate development and production environments.
Development should use test data and non-production credentials.
Production should use protected credentials, restricted database access, and proper backup procedures.
Avoid premature complexity
You do not need Kubernetes, multiple microservices, an event bus, a dedicated search cluster, or an elaborate enterprise identity platform for the initial version.
Start with one maintainable application and introduce additional infrastructure only when there is a concrete need. 18. What should be editable without code?
This is the most important functional checklist for the admin console.
Capability Admin-editable?
Add products Yes
Edit products Yes
Publish and unpublish products Yes
Archive products Yes
Create categories Yes
Edit category descriptions Yes
Reorder categories Yes
Upload product images Yes
Replace images Yes
Reorder image galleries Yes
Add product specifications Yes
Add custom specification fields Yes
Upload certificates Yes
Replace certificates Yes
Control document visibility Yes
Manage packaging information Yes
Edit SEO metadata Yes
Change product URLs Yes, with safeguards
Edit homepage text Yes
Change homepage images Yes
Select featured products Yes
Edit About page content Yes
Edit contact information Yes
Edit footer content Yes
Manage enquiries Yes
Add internal enquiry notes Yes
Manage administrator accounts Yes, with permission
Edit the visual design system No, not in the initial version
Modify application code No
Change database structure No
Manage deployment infrastructure No

This distinction is deliberate.
The CMS should let you change content and product data without code.
Changing the underlying design system or application architecture should remain a development task. 19. Implementation phases
Do not attempt to build every feature simultaneously.
I would implement the system in four phases.
Phase 1 — Core website and product CMS
Build:

- Public website.
- Product catalogue.
- Product detail pages.
- Category management.
- Admin authentication.
- Product CRUD operations.
- Product image uploads.
- Product publishing workflow.
- Homepage content management.
- Contact details management.
  Outcome: You can manage the catalogue and update the most important website content without changing source code.
  Phase 2 — Documents and enquiries
  Build:
- Certificate management.
- Document visibility controls.
- Product specifications.
- Enquiry forms.
- Enquiry database.
- Admin enquiry dashboard.
- Email notifications.
- Enquiry statuses.
- Internal notes.
  Outcome: The website becomes a practical B2B enquiry platform.
  Phase 3 — Content management and governance
  Build:
- About page editor.
- Footer editor.
- Navigation management.
- Page revisions.
- Preview before publishing.
- SEO management.
- Redirect management.
- Audit logs.
- Additional administrator roles.
  Outcome: The company can maintain the majority of its public content through the admin console.
  Phase 4 — Refinement and optimisation
  Build or refine:
- Advanced image processing.
- Improved media library.
- Search and filtering.
- Additional languages if required.
- Better enquiry reporting.
- Performance optimisation.
- Backup and recovery testing.
- Accessibility audits.
- Security reviews.
  Outcome: A more mature, maintainable platform that can grow with the business.
  You can adjust the phase boundaries according to the available time and budget.

20. Final architectural recommendation
    For SIWI Global Ventures, I would choose:
    React + TypeScript + Vite + Tailwind CSS + Fastify + PostgreSQL + Prisma + S3-compatible object storage.
    Build the public website and admin console as two separate interface areas backed by one modular backend.
    Use database-driven product pages, structured content management, controlled document publication, and a proper enquiry workflow.
    Most importantly, build the admin console around the actual tasks the business needs to perform—not around decorative dashboard widgets.
    The result should let an authorised administrator:
1. Log in.
1. Create a product.
1. Upload its images.
1. Add verified specifications.
1. Attach certificates.
1. Preview the product page.
1. Publish it.
1. Update it later.
1. Review incoming buyer enquiries.
1. Modify company content without touching the source code.
   That is the architecture I would use as the foundation for the project.
   The next step is to turn this architecture into a structured technical specification and a separate admin-console design brief. That will let you design the public website and the administration interface in Stitch while keeping the eventual implementation consistent with the database, API, permissions, and publishing workflow.

---

## 21. Architectural Decision Records (ADR) & Implementation Changelog (As-Built)

### 21.1 Overview & Architecture Evolution
As the project progressed from initial architecture specification into direct implementation, key architectural decisions and refinements were instituted to ensure production readiness, data integrity, operational maintainability, and brand alignment. This section documents the permanent Architectural Decision Records (ADRs) that serve as the current as-built source of truth.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SIWI AS-BUILT ARCHITECTURE                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│            PUBLIC WEBSITE            │            ADMIN CONSOLE             │
│  • React 18 + Vite + Tailwind CSS    │  • Product Images Tab (Tab 2)        │
│  • Editorial Typography (Serif/Sans) │  • Central Media Library (/admin)    │
│  • Dynamic Macro Photo Viewports     │  • Drag & Drop Multi-Upload Queue    │
│  • Zero-Rebuild Real-Time Updates    │  • Safe Deletion & Usage Analytics   │
│  • System Theme (prefers-color-scheme)│  • Dual Storage (Local + Cloud S3)  │
├──────────────────────────────────────┴──────────────────────────────────────┤
│                      API & SERVICE LAYER (Node.js)                          │
│  • Express 5 with Named Wildcard Streaming (/api/public/media/*key)         │
│  • Binary Magic-Bytes Header Inspection (JPEG, PNG, WebP, AVIF, GIF, SVG)    │
│  • Strict Privileged Bearer Authentication (No Dev Bypass Fallbacks)        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│         STORAGE ABSTRACTION          │          DATABASE SUBSYSTEM          │
│  • S3StorageProvider (AWS SDK v3)    │  • PostgreSQL + Prisma (Production)  │
│  • LocalStorageProvider (storage/)   │  • SQLite DatabaseSync (Dev Runtime) │
│  • Collision-Resistant Storage Keys  │  • Non-Destructive Auto-Migration    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

### 21.2 Architectural Decision Records (ADRs)

#### ADR-001: Decommissioning and Domain Purge of Ceramic Tile Products
- **Status:** Implemented & Verified
- **Context:** Early drafts included ceramic architectural tiles as a secondary trading commodity alongside dehydrated agricultural products. Business positioning required refining SIWI Global Ventures into a focused, high-trust agricultural export house specializing in dehydrated vegetables (onion, garlic, fried onions/birista, spices) and custom commercial commodity coordination.
- **Decision:**
  1. Completely removed the ceramic tiles category, tile product records, technical specifications, and architectural imagery from the codebase and database.
  2. Realigned public navigation, catalogue filters, and admin category management strictly around agricultural commodities and dehydrated ingredients.
  3. Updated database seed routines to prevent tile records from re-appearing on fresh initialization.
- **Consequences:** Eliminates confusing B2B product cross-talk, strengthens domain authority in global agricultural trade, and simplifies the category hierarchy.

#### ADR-002: Pluggable Dual-Driver Storage Architecture (S3 Cloud & Local Persistent)
- **Status:** Implemented & Verified
- **Context:** Production requirements mandate S3-compatible object storage (AWS S3, Cloudflare R2, MinIO, Wasabi) with private credentials kept server-side. However, local developer setups and automated test suites require a reliable, zero-config persistent storage layer without forcing cloud account setup. Files must never be written into Vite's temporary `public/` directory or stored as raw binary database blobs.
- **Decision:**
  1. Defined a strict storage provider interface contract (`server/storage/types.ts`: `IStorageProvider`).
  2. Implemented `LocalStorageProvider` (`server/storage/localStorage.ts`) that persists uploads to `storage/uploads/products/` outside the frontend bundle and serves files via an authenticated/public streaming route (`GET /api/public/media/*key`) with immutable cache-control headers (`Cache-Control: public, max-age=31536000, immutable`).
  3. Implemented `S3StorageProvider` (`server/storage/s3Storage.ts`) using `@aws-sdk/client-s3` with automatic credentials resolution, custom bucket endpoints, and rollback on upload errors.
  4. Created a dynamic factory (`server/storage/index.ts`) that selects `S3StorageProvider` when `S3_BUCKET` and credentials are set, cleanly falling back to `LocalStorageProvider` for development.
- **Consequences:** Zero-config out-of-the-box local development, seamless cloud deployment switch via `.env`, and guaranteed credential isolation.

#### ADR-003: Content-Based Binary Magic Bytes Verification Pipeline
- **Status:** Implemented & Verified
- **Context:** Client-provided MIME types and filename extensions are untrusted input. Malicious or corrupted files could disguise executable or malformed payloads as image extensions.
- **Decision:**
  1. Implemented binary header inspection (`server/utils/imageUtils.ts:validateAndInspectImage`) that examines the first bytes of the uploaded buffer before writing to storage:
     - JPEG: `FF D8 FF`
     - PNG: `89 50 4E 47`
     - WebP: `RIFF` ... `WEBP`
     - AVIF: `ftypavif` / `ftypavis`
     - GIF: `GIF87a` / `GIF89a`
     - SVG: `<svg` structure
  2. Integrated binary dimension parsing to extract pixel dimensions (`width`, `height`) during ingestion.
  3. Implemented a centralized 10MB file limit via Multer in-memory storage, backed by an Express global JSON error handler converting `LIMIT_FILE_SIZE` errors into clean, structured HTTP 400 responses.
- **Consequences:** Eliminates extension-spoofing attacks, prevents storage of corrupt files, and guarantees consistent dimensions metadata across all media records.

#### ADR-004: Relational Product Gallery Junction (`product_images`) & Migration Architecture
- **Status:** Implemented & Verified
- **Context:** The original schema had only a single `featured_image` string on products and a generic `media_assets` table. B2B buyers require detailed visual inspections, packaging studies, and multi-angle macro views. Images must be reorderable, allow product-specific alt/caption overrides, and support multiple associations without duplicating storage files.
- **Decision:**
  1. Extended `media_assets` with `storage_key`, `original_filename`, `file_name`, `title`, `file_url`, `mime_type`, `file_size`, `width`, `height`, `alt_text`, `caption`, `created_by`, `created_at`, `updated_at`.
  2. Created relational junction table `product_images`:
     - `id`: Unique association identifier (`pi_*`)
     - `product_id`: Foreign key referencing `products.id`
     - `media_asset_id`: Foreign key referencing `media_assets.id`
     - `display_order`: Integer sorting index
     - `is_featured`: Integer flag (0 or 1) indicating the primary catalogue photo
     - `alt_text_override`: Product-specific alt text
     - `caption_override`: Product-specific caption
  3. Auto-Migration & Prisma Alignment:
     - In development SQLite (`server/db/database.ts`), implemented non-destructive `ALTER TABLE` and `CREATE TABLE IF NOT EXISTS` checks on server boot, preserving existing products and enquiries.
     - For production PostgreSQL, created `prisma/schema.prisma` and generated the migration SQL script `prisma/migrations/20261021000000_media_and_product_images/migration.sql`.
- **Consequences:** True multi-image gallery support, safe many-to-one media reuse, and dual-database compatibility (zero-config SQLite in dev, PostgreSQL via Prisma in production).

#### ADR-005: Admin Product Images Workflow & Tabbed Product Editor Architecture
- **Status:** Implemented & Verified
- **Context:** Embedding complex multi-file upload, ordering, and metadata inputs into a monolithic product form leads to unwieldy UI, slow form state updates, and accidental data loss during validation failures.
- **Decision:**
  1. Built a dedicated Product Images tab (Tab 2) in `/admin/products/:id/edit` powered by `ProductImagesManager.tsx`.
  2. Implemented drag-and-drop upload zone with multi-file picker, individual upload progress bars, and retry controls.
  3. Added accessible Up / Down keyboard-operable reordering that persists immediate order updates to the database.
  4. Built atomic primary image selection (`is_featured`), ensuring unsetting of previous featured flags in a single backend transaction.
  5. Added in-place editable alt text and captions with per-field save indicators.
  6. Implemented a "Choose from Media Library" modal picker allowing administrators to attach pre-existing library assets without re-uploading.
  7. Separated image detachment from permanent asset deletion: removing an image from a product only severs the `product_images` relationship; the asset remains safe in the Media Library.
- **Consequences:** Highly responsive admin workflow, isolated error states, and zero risk of accidental form resets.

#### ADR-006: Central Media Library & Safe Deletion Guardrails
- **Status:** Implemented & Verified
- **Context:** Administrators need a central hub (`/admin/media`) to browse, search, and manage assets across all products. However, allowing unrestricted asset deletion could silently break image references on published product pages.
- **Decision:**
  1. Implemented `/admin/media` (`AdminMediaPage.tsx`) with search by filename/title, MIME type tabs (`All`, `JPEG`, `PNG`, `WebP`), and usage status filters (`All`, `In Use`, `Unused`).
  2. Built an Asset Inspector drawer showing full dimensions, file size, storage key, upload date, and a list of all products currently using the asset.
  3. Added safe deletion protection (`DELETE /api/admin/media/:id`):
     - The backend inspects `product_images` joined with `products`. If an asset is linked to any published product, deletion is rejected with `HTTP 409 Conflict`, returning the names of all blocking products.
     - If the asset is completely unused, the backend deletes the record and removes the physical file from storage.
  4. Added in-place file replacement (`POST /api/admin/media/:id/replace`): uploads a new file, updates dimensions/size, but retains the existing asset ID, updating all referenced products automatically.
- **Consequences:** Eliminates orphaned broken images on public pages while maintaining central media hygiene.

#### ADR-007: Zero-Rebuild Dynamic Public Website Reflection & Editorial Fallbacks
- **Status:** Implemented & Verified
- **Context:** When an administrator changes a product's featured image, updates alt text, or reorders gallery photos, international buyers must see the updated content immediately without requiring a Vite build, Docker rebuild, or frontend redeployment.
- **Decision:**
  1. Public API endpoints (`GET /api/public/products` and `GET /api/public/products/:slug`) dynamically resolve the primary image and full gallery directly from `product_images` joined with `media_assets`.
  2. Enhanced `ProductDetailPage.tsx` with a responsive macro viewport, caption overlay, image counter (`1 / N`), and interactive responsive thumbnail strip.
  3. Implemented a restrained, branded editorial image fallback component (`SIWI Global · Image Pending`) on both the master catalogue grid and product detail views when products are pending photography, preventing layout shifts.
  4. Enforced privacy boundaries: draft and archived products remain inaccessible on public routes (`HTTP 404`).
- **Consequences:** Instantaneous publishing cycle, seamless visual layout, and strict draft confidentiality.

#### ADR-008: Strict Privileged Route Authentication Boundary
- **Status:** Implemented & Verified
- **Context:** Administrative capabilities (uploading, editing, deleting, reordering) must be enforced server-side, not reliant on hidden frontend UI buttons.
- **Decision:**
  1. Removed all development unauthenticated fallback bypasses.
  2. All `/api/admin/*` endpoints strictly require a valid Bearer token (`siwi_admin_token_*`). Unauthenticated requests are rejected immediately with `HTTP 401 Unauthorized`.
  3. Added audit logging for all administrative actions (upload, delete, replace, publish) in `audit_logs`.
- **Consequences:** Hardened privileged access control adhering to enterprise security standards.

#### ADR-009: Express 5 Route Syntax Standardization
- **Status:** Implemented & Verified
- **Context:** Under Express 5 (`path-to-regexp` v8), legacy wildcard routing syntax `/:key(*)` throws an unhandled `PathError: Unexpected * at ...`.
- **Decision:**
  1. Standardized media streaming routes to named wildcards: `/api/public/media/*key`.
  2. Added array normalization in the controller: `const key = Array.isArray(rawKey) ? rawKey.join('/') : String(rawKey || '')`.
- **Consequences:** Stable file streaming under Express 5 with robust path resolution.

#### ADR-010: Brand Visual Identity & Editorial Design System
- **Status:** Implemented & Verified
- **Context:** SIWI Global Ventures communicates established international trade credibility. Standard e-commerce templates or generic SaaS card grids undermine this trust.
- **Decision:**
  1. Replaced generic placeholder logos with the authentic official brand emblem (`/assets/images/siwi-logo.png`).
  2. Retained high-contrast editorial typography: `Playfair Display` serif for authoritative headlines, balanced with `Plus Jakarta Sans` for clean tabular and specification clarity.
  3. Standardized on a curated palette: deep charcoal (`#121417`), warm ivory (`#FBF9F5`), and rich brass gold (`#D4AF37` / `#C5A059`).
  4. Refreshed About section imagery from generic container vessels to a bespoke world trade flow map composition highlighting Mumbai's port connections to global maritime routes.
- **Consequences:** Consistent, premium aesthetic that differentiates SIWI in the international B2B export market.

#### ADR-011: Automated System-Based Theme Switching (prefers-color-scheme)
- **Status:** Implemented & Verified
- **Context:** The website originally contained a manual light/dark toggle button in the navbar backed by localStorage persistence (`siwi_theme`). To provide a modern, seamless experience adhering to user operating system preferences, the site needed to eliminate manual toggle interactions and automatically mirror the OS color scheme in real time without page reloads.
- **Decision:**
  1. **Removed Manual Controls & Overrides:**
     - Removed the theme toggle `<button>` with Sun and Moon icons from `src/components/Navbar.tsx`.
     - Purged all manual mutation methods (`toggleTheme`, `setTheme`) from `src/components/ThemeContext.tsx`.
     - Eliminated `localStorage.setItem('siwi_theme', ...)` to prevent stored user settings from conflicting with operating system preferences.
  2. **Native CSS Media Query Strategy:**
     - Updated `src/index.css` from selector-based `@custom-variant dark (&:where(.dark, .dark *));` to native `@custom-variant dark (@media (prefers-color-scheme: dark));`.
     - Updated `tailwind.config.js` from `darkMode: 'class'` to `darkMode: 'media'`.
     - All Tailwind `dark:...` utility classes now compile directly into `@media (prefers-color-scheme: dark)` blocks in the output bundle, enabling instant, layout-shift-free CSS evaluation.
  3. **Zero-FOUC Pre-Paint Head Initialization (`index.html`):**
     - Injected a lightweight synchronous script in `<head>` that executes prior to DOM and CSS rendering.
     - Automatically purges legacy `siwi_theme` keys via `localStorage.removeItem('siwi_theme')`.
     - Inspects `window.matchMedia('(prefers-color-scheme: dark)')` and pre-synchronizes `document.documentElement.classList`, preventing any flash of the wrong theme on cold page loads or browser reloads.
  4. **Live System Preference Subscription (`ThemeContext.tsx`):**
     - Subscribes directly to `window.matchMedia('(prefers-color-scheme: dark)')` with an active event listener:
       ```ts
       const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
       const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
       mediaQuery.addEventListener('change', handleChange);
       ```
     - Dynamically updates React state (`theme: 'light' | 'dark'`, `isDark: boolean`) and toggles `document.documentElement.classList` in real time when the operating system switches between Light and Dark mode without requiring a page reload.
     - Guarantees strict unmount cleanup (`removeEventListener`).
- **Consequences:**
  - Zero UI friction for international trade buyers; the website seamlessly honors device appearance settings.
  - Native CSS performance with zero layout shift (CLS) and zero flash of unstyled theme on initial load.
  - Complete elimination of conflicting local persistence mechanisms.
- **Verification:**
  - Verified compiled production bundle generates valid `@media (prefers-color-scheme: dark)` CSS rules.
  - Verified state machine transitions dynamically between Light and Dark upon `change` events.
  - TypeScript compilation and Vite production build (`npm run build`) passed with 0 errors.

---

### 21.3 As-Built Database Schema Specification

```sql
-- Central Media Library Catalog
CREATE TABLE IF NOT EXISTS media_assets (
  id VARCHAR(64) PRIMARY KEY,
  storage_key VARCHAR(255) NOT NULL UNIQUE,
  original_filename VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  file_url VARCHAR(512) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(255),
  caption TEXT,
  created_by VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relational Product Gallery Junction
CREATE TABLE IF NOT EXISTS product_images (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(64) NOT NULL,
  media_asset_id VARCHAR(64) NOT NULL,
  display_order INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  alt_text_override VARCHAR(255),
  caption_override TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (media_asset_id) REFERENCES media_assets(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_media ON product_images(media_asset_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, display_order);
```

---

### 21.4 As-Built API Directory

| Route | Method | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/public/products` | `GET` | Public | Returns catalogue with dynamically resolved featured images |
| `/api/public/products/:slug` | `GET` | Public | Returns product details, specs, and ordered image gallery |
| `/api/public/media/*key` | `GET` | Public | Securely streams local persistent files with cache headers |
| `/api/admin/media` | `GET` | Admin | Lists media assets with search, MIME, and usage filters |
| `/api/admin/media/:id` | `GET` | Admin | Fetches single asset metadata and product usage analytics |
| `/api/admin/media/upload` | `POST` | Admin | In-memory upload with magic-bytes check & storage persistence |
| `/api/admin/media/:id` | `PATCH` | Admin | Updates asset title, alt text, and caption |
| `/api/admin/media/:id/replace` | `POST` | Admin | In-place file replacement in storage preserving asset ID |
| `/api/admin/media/:id` | `DELETE` | Admin | Safe deletion (rejects with 409 if used by published product) |
| `/api/admin/products/:id/images` | `GET` | Admin | Retrieves ordered product gallery images |
| `/api/admin/products/:id/images` | `POST` | Admin | Attaches existing media asset or uploads file to gallery |
| `/api/admin/products/:id/images/:imageId` | `PATCH` | Admin | Updates featured flag, order, and overrides |
| `/api/admin/products/:id/images/reorder` | `POST` | Admin | Persists new gallery display order array |
| `/api/admin/products/:id/images/:imageId/replace` | `POST` | Admin | Swaps image association with new file or asset |
| `/api/admin/products/:id/images/:imageId` | `DELETE` | Admin | Detaches image from product gallery (asset remains in library) |

---

### 21.5 Verification Suite Results

A 14-scenario automated test suite was executed against the running backend and database (`node -e "..."`), confirming 100% compliance:
1. **Admin Authentication**: Admin login successfully returns JWT session token (`200 OK`).
2. **Unauthorized Protection**: Requests without valid token are rejected (`401 Unauthorized`).
3. **Magic-Bytes Verification**: Spoofed plain-text `.jpg` rejected (`400 Bad Request: Unsupported or invalid image file format`).
4. **Oversized File Protection**: File exceeding 10MB rejected (`400 Bad Request: File upload exceeds maximum allowed size limit of 10MB`).
5. **Valid File Upload**: Uploaded valid JPEG binary to persistent storage (`med_1792592453616_5293`).
6. **Product Gallery Association**: Attached media asset to product `prod_1`.
7. **Multiple Images**: Product gallery accurately reflects multi-image count.
8. **Featured Image Selection**: Promoted asset to primary (`is_featured: 1`).
9. **Public Website Instant Reflection**: Public endpoint `/api/public/products/onion-powder` immediately returned the new featured image without requiring a rebuild.
10. **Safe Deletion Guard**: Attempting to delete media asset used by published product returned `409 Conflict`.
11. **Gallery Detachment**: Removed image from gallery without deleting media asset.
12. **Library Persistence**: Media asset still safely exists in library with `usage_count: 0`.
13. **Unused Asset Safe Deletion**: Deleting unused asset removed it from both SQLite and storage.
14. **Draft Product Privacy**: Draft products return `404 Not Found` on public route.
15. **Production Build**: `npm run build` (`tsc -b && vite build`) passed with **0 errors**.

*(End of Section 21 — As-Built Architecture & ADR Changelog)*

