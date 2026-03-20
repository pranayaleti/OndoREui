# Sitemap Expansion — Design Spec
**Date:** 2026-03-20
**Status:** Approved
**Repo:** OndoREui (Next.js 15 App Router)

---

## Goal

Expand the OndoREui public site with 14 new pages inspired by HouseCall Pro's sitemap depth, mapped to Ondo's real estate context. Every page must be SEO-optimised and AI-agent discoverable (JSON-LD, canonical URLs, `site-index.ts` registration → `sitemap.xml` + `llms.txt`).

---

## Scope

### Group 1 — Blog posts upgrade from stub → full content (5 pages)

These 5 slugs are already referenced in `lib/site-index.ts` `BLOG_POSTS` and are currently served by `app/blog/[slug]/page.tsx` with stub "coming soon" content. The task is to create full static `page.tsx` files for each.

**Routing note:** Next.js prefers a static directory (`app/blog/<slug>/`) over the `[slug]` dynamic route when the directory exists. Therefore:
1. Create `app/blog/<slug>/page.tsx` for each of the 5 slugs with full content.
2. Remove those 5 slug keys from the `POSTS` record in `app/blog/[slug]/page.tsx` to keep it clean (the comment on line 10–12 of that file already instructs this: "we only list what's missing").

The `[slug]/page.tsx` already has all metadata (title, description, author, published, image) for each slug — reuse these values.

| Slug | Image (from `[slug]/page.tsx`) |
|------|------|
| `first-time-home-buyer-guide` | `/suburban-house-garden.png` |
| `property-management-tips-utah-landlords` | `/property-manager-meeting.png` |
| `mortgage-rate-trends-2025` | `/modern-townhouse-garage.png` |
| `home-staging-tips-that-work` | `/modern-apartment-balcony.png` |
| `understanding-property-taxes-utah` | `/placeholder.jpg` |

### Group 2 — Loan product pages (4 pages)

New pages under `/loans/`, parallel to existing `/loans/conventional/`:

| Path | Product |
|------|---------|
| `/loans/fha` | FHA Loans — 3.5 % down, credit-flexible |
| `/loans/va` | VA Loans — zero down for veterans/active duty |
| `/loans/usda` | USDA Rural Loans |
| `/loans/jumbo` | Jumbo Loans — higher-value Utah properties |

### Group 3 — Property management feature pages (3 pages)

New pages under `/property-management/`, breaking down the PM service:

| Path | Feature |
|------|---------|
| `/property-management/tenant-screening` | Tenant Screening |
| `/property-management/maintenance-coordination` | Maintenance Coordination |
| `/property-management/owner-reporting` | Owner Reporting |

### Group 4 — Resources templates page (1 page)

| Path | Description |
|------|-------------|
| `/resources/templates` | Downloadable/viewable templates: lease agreement, move-in checklist, maintenance request form, landlord onboarding playbook |

### Group 5 — Case studies page (1 page)

| Path | Description |
|------|-------------|
| `/about/case-studies` | 3–4 owner/investor success stories with schema markup |

### Group 6 — site-index.ts update

Add **9 new entries** to `lib/site-index.ts` (the 5 blog slugs are already present in `BLOG_POSTS`):
- 4 loan product pages → add to `buy-finance` section
- 3 PM feature pages → add to `rent-manage` section
- `/resources/templates` → add to `rent-manage` section
- `/about/case-studies` → add to `about` section

This automatically propagates to:
- `/sitemap.xml` (XML sitemap for crawlers)
- `/llms.txt` (AI agent brief)
- `/sitemap` (HTML sitemap)

---

## Architecture

### File pattern

Every page is a **static standalone `page.tsx`** — no new dynamic routes. This matches the entire existing codebase (e.g. `loans/conventional`, `buy/first-time`, all blog posts).

### Component conventions (must match existing pages)

**Non-blog pages** (loan products, PM features, resources, case studies):
```tsx
// 1. Next.js metadata export
export const metadata: Metadata = {
  title: "...",
  description: "...",
  alternates: { canonical: `${SITE_URL}/path/` },
  openGraph: { title: "...", description: "..." },
  twitter: { card: "summary_large_image", title: "...", description: "..." },
}

// 2. SEO component with BreadcrumbList JSON-LD
<SEO
  title="..."
  description="..."
  pathname="/path"
  image={`${SITE_URL}/image.png`}
  jsonLd={generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Section", url: `${SITE_URL}/section` },
    { name: "Page", url: `${SITE_URL}/section/page` },
  ])}
/>

// 3. PageBanner — always include backgroundImage
<PageBanner title="..." subtitle="..." backgroundImage="/image.png" />
```

**Blog post pages** (use `publishedTime`/`author`/`section` props — NOT `jsonLd`):
```tsx
// 1. Next.js metadata (include openGraph.type: "article" + publishedTime/authors)
export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo Real Estate`,
    description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified,
    authors: [author],
  },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

// 2. SEO component — publishedTime/author/section trigger Article JSON-LD internally
<SEO
  title={title}
  description={description}
  pathname={slug}
  image={`${SITE_URL}${image}`}
  publishedTime={published}
  modifiedTime={modified}
  author={author}
  section={category}
  tags={keywords}
/>

// 3. PageBanner with backgroundImage matching the image const
<PageBanner title={title} subtitle={description} backgroundImage={image} />
```

**Background images per page type:**
- Blog posts: use image from `[slug]/page.tsx` POSTS record (see Group 1 table)
- Loan pages: `/modern-office-building.png` (matches `/loans/conventional`)
- PM feature pages: `/property-manager-meeting.png`
- Resources/templates: `/modern-apartment-balcony.png`
- Case studies: `/modern-office-building.png`

**Other shared conventions:**
- shadcn primitives: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `Button`
- Lucide icons
- `Link` from `"next/link"` for internal CTAs
- `APP_PORTAL_URL` imported from `"@/lib/site"` for portal CTAs

### JSON-LD per page type

| Type | Schema |
|------|--------|
| Blog posts | `Article` with `datePublished`, `author`, `headline`, `description` |
| Loan products | `BreadcrumbList` |
| PM feature pages | `BreadcrumbList` |
| Resources/templates | `BreadcrumbList` |
| Case studies | `BreadcrumbList` + inline `Article` per story |

---

## Page-level design

### Blog posts

Each static blog post must be a **full prose article** matching the depth of `renting-vs-owning-hidden-math/page.tsx` — not a stub. Minimum: 4 content sections with real paragraphs (not placeholder text). Reuse `title`, `description`, `author`, `published`, `image` from the `POSTS` record in `app/blog/[slug]/page.tsx` for consistency.

Structure:
```
- Frontmatter constants: slug, title, description, published, modified, author, category, image, keywords[]
- export const metadata (Next.js) — with openGraph.type: "article"
- SEO component (blog variant — publishedTime/author/section props, no jsonLd prop)
- PageBanner with backgroundImage={image}
- <article> wrapper with:
  - Badge (category)
  - Back to blog button
  - .prose .prose-lg wrapper containing:
    - Lead paragraph (summary)
    - 4–5 h2 sections with real paragraph content
    - Numbered steps or comparison tables where appropriate
    - Utah-specific data/context in each section
    - Closing CTA (Button + Link to relevant service)
```

Topics & Utah hooks:
- **First-Time Home Buyer Guide**: Pre-approval → search → offer → closing steps; Utah DPA programs; link to `/buy/first-time` and `/loans/fha`
- **Property Management Tips for Utah Landlords**: Vacancy, compliance (Utah Fit Premises Act), maintenance systems; link to `/property-management`
- **Mortgage Rate Trends**: Rate environment context, how to read rate quotes, when to lock; link to `/buy/rates` and `/loans`
- **Home Staging Tips That Work**: Curb appeal, declutter, lighting, ROI by room; link to `/sell`
- **Understanding Property Taxes in Utah**: Assessment cycles, Truth in Taxation notices, investor implications; link to `/calculators`

### Loan product pages

Structure (matches `/loans/conventional/page.tsx`):

```
- Metadata + SEO + BreadcrumbJsonLd (Home → Loans → [Product])
- PageBanner
- 4-card benefits grid (icons from lucide-react)
- Eligibility / requirements section
- Comparison callout vs conventional loan
- CTA: "Get Pre-Qualified" → /qualify + link back to /loans
```

Key differentiation per product:
- **FHA**: 3.5% down at 580+ FICO, 10% at 500–579; MIP explained; good for first-timers
- **VA**: Zero down, no PMI, funding fee; Certificate of Eligibility; Utah military communities (Hill AFB)
- **USDA**: Rural eligibility map context; zero down; income limits; Utah rural markets (Cache Valley, Sanpete)
- **Jumbo**: Loan limits above $766,550 (2024 Utah conforming); stricter credit/reserves; Utah high-value markets (Park City, Draper)

### Property management feature pages

Structure:
```
- Metadata + SEO + BreadcrumbJsonLd (Home → Property Management → [Feature])
- PageBanner
- Feature overview (who it's for, what problem it solves)
- How it works (3-step visual process)
- What's included (feature card grid)
- CTA: link to /property-management hub + APP_PORTAL_URL
```

Feature details:
- **Tenant Screening**: Credit, criminal, eviction, income verification; portal-driven workflow; compliance with Utah Fair Housing
- **Maintenance Coordination**: Request intake, vendor dispatch, owner approval thresholds, completion tracking; link to vendor management
- **Owner Reporting**: Monthly statements, NOI tracking, maintenance history, document vault; link to owner portal

### Resources / Templates page (`/resources/templates`)

```
- Metadata + SEO + BreadcrumbJsonLd (Home → Resources → Templates)
- PageBanner
- Intro paragraph (why these templates exist)
- Grid of 4 template cards:
  1. Residential Lease Agreement — Utah-compliant; what's included; "Request via contact"
  2. Move-In / Move-Out Checklist — room-by-room; photo log; "Download PDF"
  3. Maintenance Request Form — tenant-facing; urgency tiers; "Used in owner portal"
  4. Landlord Onboarding Playbook — first 90 days; systems checklist; "Request via contact"
- Bottom CTA: link to /resources and /contact
```

### Case Studies page (`/about/case-studies`)

```
- Metadata + SEO + BreadcrumbJsonLd (Home → About → Case Studies)
  — the page-level SEO uses jsonLd={generateBreadcrumbJsonLd([...])} (non-blog variant)
- PageBanner
- 3–4 story cards, each with:
  - Property type + location (Utah)
  - Challenge
  - Ondo solution (which services)
  - Outcome metrics (occupancy rate, time-to-lease, rent delta, etc.)
- CTA: link to /about/testimonials and /contact
```

**Case study JSON-LD:** After the SEO component, inject one `<script type="application/ld+json">` tag per story using a raw object (not `generateBlogPostingJsonLd`). Each object:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "datePublished": "2025-XX-XX",
  "author": { "@type": "Organization", "name": "Ondo Real Estate" }
}
```
Render via `<script dangerouslySetInnerHTML={{ __html: JSON.stringify(storyJsonLd) }} />`.

Stories:
1. Salt Lake owner — reduced vacancy from 45 → 12 days with PM + tenant screening
2. First-time buyer in Lehi — closed with FHA + DPA, $0 over asking
3. Investor — fractional deal, 7.2% projected yield, fully managed
4. Park City owner — jumbo refinance, saved $380/mo

---

## SEO / AI-agent requirements

- Every page: unique `<title>` (≤60 chars) + `<meta description>` (≤160 chars)
- Utah-specific keywords in every title/description where relevant
- `alternates.canonical` on every page
- `BreadcrumbList` JSON-LD on every page
- `Article` JSON-LD on all blog posts + case study stories
- All new paths added to `site-index.ts` → auto-propagated to sitemap.xml + llms.txt

---

## File list (14 new files + 2 edits)

```
# New files
app/blog/first-time-home-buyer-guide/page.tsx
app/blog/property-management-tips-utah-landlords/page.tsx
app/blog/mortgage-rate-trends-2025/page.tsx
app/blog/home-staging-tips-that-work/page.tsx
app/blog/understanding-property-taxes-utah/page.tsx
app/loans/fha/page.tsx
app/loans/va/page.tsx
app/loans/usda/page.tsx
app/loans/jumbo/page.tsx
app/property-management/tenant-screening/page.tsx
app/property-management/maintenance-coordination/page.tsx
app/property-management/owner-reporting/page.tsx
app/resources/templates/page.tsx
app/about/case-studies/page.tsx

# Edited files
app/blog/[slug]/page.tsx  ← remove 5 slug keys from POSTS record
lib/site-index.ts          ← add 9 new entries (not 14; 5 blog slugs already present)
```

---

## Out of scope

- Dynamic routing changes
- Backend / API changes
- Authenticated portal pages
- Actual PDF generation for templates (cards describe and link to contact)
- Real client data for case studies (illustrative/anonymised)
