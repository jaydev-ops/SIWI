# REFERENCE DEPENDENCY MATRIX
## SIWI Global Ventures — Reference System

---

## 1. PURPOSE & INHERITANCE MODEL

Google Stitch AI and human design engineers must consume focused, task-specific documentation rather than monolithic files.

### Baseline Inheritance Rule
**Every design task must inherit:**
- `00_MASTER_BRIEF.md` (Master context and overarching rules)
- `LEVEL_01_BRAND_FOUNDATION.md` (Corporate identity, facts, and boundaries)
- `LEVEL_02_VISUAL_DESIGN_SYSTEM.md` (Typography, colors, spacing, tokens, motifs)

Additional levels are added conditionally depending on the page or component being crafted.

---

## 2. TASK-TO-LEVEL DEPENDENCY MATRIX

| Major Design Task | L00 Master Brief | L01 Brand Foundation | L02 Visual Design System | L03 Layout & Components | L04 Architecture & Pages | L05 Content & Interactions | L06 Quality & Standards | L07 Stitch Playbook |
|---|---|---|---|---|---|---|---|---|
| **01. Brand Direction & Moodboard** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | NOT REQ | NOT REQ | CONDITIONAL | **REQUIRED** |
| **02. Homepage (`/`)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **03. Products Catalogue (`/products`)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **04. Product Detail Master Template** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **05. 6 Core Dehydrated Product Pages** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **06. Secondary Category (Tiles & Other)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **07. About Us Page (`/about`)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **08. Trade Enquiries Portal (`/trade-enquiries`)**| **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL |
| **09. Contact Page (`/contact`)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL |
| **10. Legal Pages (Privacy & Terms)** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | **REQUIRED** | CONDITIONAL | CONDITIONAL | CONDITIONAL |
| **11. Header & Navigation System** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL | **REQUIRED** | CONDITIONAL |
| **12. Footer Architecture** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | CONDITIONAL | CONDITIONAL | CONDITIONAL | CONDITIONAL |
| **13. Dark & Light Theme Audit** | **REQUIRED** | CONDITIONAL | **REQUIRED** | CONDITIONAL | NOT REQ | NOT REQ | **REQUIRED** | **REQUIRED** |
| **14. Responsive Layout Review** | **REQUIRED** | CONDITIONAL | **REQUIRED** | **REQUIRED** | CONDITIONAL | NOT REQ | **REQUIRED** | **REQUIRED** |
| **15. Final Art-Direction Audit** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** | **REQUIRED** |

### Legend:
- **REQUIRED:** Must be provided in the prompt context or uploaded as active reference material.
- **CONDITIONAL:** Consult specific sections if component complexity requires it.
- **NOT REQ:** Omit to conserve prompt window capacity and prevent AI distraction.
