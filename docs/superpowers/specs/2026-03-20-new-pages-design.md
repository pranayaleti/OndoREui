# New Pages Design — OndoREui
**Date:** 2026-03-20
**Status:** Approved

## Overview

Add 12 new marketing and informational pages to OndoREui, inspired by PitchBook and Preqin site structures but adapted for a real estate management SaaS. Pages are organized into 3 build waves for parallel execution.

No pricing page. No new dependencies. All pages use existing components only.

---

## Technical Constraints

- Next.js 15 App Router — each page is `app/<route>/page.tsx`
- Pattern: `SEO` component + `metadata` export + `PageBanner` hero + content sections + CTA
- **SEO component:** import from `@/components/seo` — props: `title: string`, `description: string`, `pathname?: string`, `image?: string`, `jsonLd?: object | object[] | null`
- Components: `PageBanner` (`@/components/page-banner`), `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Button` from `@/components/ui/*`
- Icons: Lucide (`lucide-react`)
- Dark-mode: use only semantic Tailwind tokens — `bg-background`, `bg-muted`, `text-foreground`, `text-foreground/70`, `border-border`. No hardcoded `bg-white` or `text-black`.
- No new npm dependencies
- Pages that need client-side interactivity (e.g., tab state) must extract the interactive part into a separate child component marked `"use client"`. The `page.tsx` itself remains a Server Component so `metadata` can be exported.

---

## Wave 1 — Solutions Hub + Audience Pages (5 pages)

### `/solutions` — Hub
**File:** `app/solutions/page.tsx`
**Purpose:** Overview page that segments visitors by role and routes them to the right solution sub-page.

**Sections:**
1. **PageBanner** — title: "The platform built for every role in real estate" · subtitle: "One platform. Every stakeholder. Zero fragmentation."
2. **Audience grid** — 4 cards in a 2×2 grid. Each card: Lucide icon + role title + 2-line description + `Button` linking to sub-page:
   - Investors (icon: `TrendingUp`) → "Grow your portfolio with AI-powered analytics" → `/solutions/investors`
   - Landlords (icon: `Home`) → "Full-service management without the headaches" → `/solutions/landlords`
   - Property Managers (icon: `Building2`) → "Scale your operation with automation" → `/solutions/property-managers`
   - Tenants (icon: `Key`) → "Your home. Your portal. Zero friction." → `/solutions/tenants`
3. **Why Ondo** — 3 items in a row: AI assistant · One unified platform · Utah expertise. Each: icon + heading + 1-sentence description.
4. **CTA** — "Get Started" → `/contact`

---

### `/solutions/investors`
**File:** `app/solutions/investors/page.tsx`
**Purpose:** Speak directly to real estate investors about portfolio management, analytics, and deal access.

**Sections:**
1. **PageBanner** — title: "Grow your portfolio. Maximize returns." · subtitle: "AI-powered insights, cashflow modeling, and deal access — all in one platform."
2. **Features** — 4-card grid:
   - `BarChart3` — "Portfolio analytics & risk scoring" — "Track performance across every property with real-time risk scores."
   - `AlertTriangle` — "At-risk tenant detection" — "AI identifies payment risk before it becomes a problem."
   - `Calculator` — "Cashflow modeling" — "Model returns, NOI, and cap rates across your portfolio."
   - `Building2` — "Deal access" — "Browse fractional and commercial investment opportunities in Utah."
3. **How it works** — 3 numbered steps: 1. Connect your properties · 2. Get AI insights · 3. Act on recommendations
4. **CTA** — Two buttons: "Browse Opportunities" → `/investments` · "Talk to an Expert" → `/contact`

---

### `/solutions/landlords`
**File:** `app/solutions/landlords/page.tsx`
**Purpose:** Convince individual property owners (1–20 units) that Ondo handles everything.

**Sections:**
1. **PageBanner** — title: "Manage your properties. Stress-free." · subtitle: "From tenant screening to rent collection — Ondo runs your rentals so you don't have to."
2. **Features** — 4-card grid:
   - `LayoutDashboard` — "Owner dashboard & rent tracking" — "See every payment, lease, and maintenance request in one place."
   - `UserCheck` — "Tenant screening & lease management" — "Background checks, credit reports, and digital leases."
   - `Wrench` — "Maintenance coordination" — "Submit, track, and resolve requests with your vendor network."
   - `FileText` — "Document storage & reporting" — "Store leases, inspections, and tax docs securely."
3. **Portal callout** — A highlighted `bg-muted` box with border: heading "Your owner portal, ready now" + 1 sentence: "Log in to see your properties, tenants, and financials in real time." + Button "Go to Owner Portal" → `/owner`
4. **CTA** — "Get Started" → `/contact`

---

### `/solutions/property-managers`
**File:** `app/solutions/property-managers/page.tsx`
**Purpose:** Target professional property management companies managing 20+ units.

**Sections:**
1. **PageBanner** — title: "Operate at scale. Deliver results." · subtitle: "Built for property management companies that need automation, not more spreadsheets."
2. **Features** — 4-card grid:
   - `LayoutDashboard` — "Multi-property dashboard" — "Manage every unit, tenant, and vendor from a single view."
   - `Zap` — "Automated maintenance routing" — "Requests auto-assign to the right vendor, every time."
   - `ShieldCheck` — "Vendor & compliance management" — "Track certifications, insurance, and work orders."
   - `FileBarChart` — "Owner reporting automation" — "Generate and send owner reports without manual work."
3. **Scale callout** — `bg-muted` box: "Built for portfolios of any size — from 20 units to 500+."
4. **CTA** — "Schedule a Demo" → `/demo`

---

### `/solutions/tenants`
**File:** `app/solutions/tenants/page.tsx`
**Purpose:** Show prospective and current tenants what the Ondo tenant portal offers.

**Sections:**
1. **PageBanner** — title: "Your home. Your portal. Zero friction." · subtitle: "Pay rent, submit requests, and talk to your landlord — all in one app."
2. **Features** — 4-card grid:
   - `CreditCard` — "Online rent payment" — "Pay securely online, get receipts instantly, never miss a due date."
   - `ClipboardList` — "Maintenance request tracking" — "Submit a request in seconds, track its status in real time."
   - `FolderOpen` — "Document access" — "View your lease, inspections, and notices anytime."
   - `MessageSquare` — "Direct messaging" — "Message your property manager without phone tag."
3. **Reassurance** — `bg-muted` box: "Secure, simple, always on — your data is encrypted and your portal is available 24/7."
4. **CTA** — Two buttons: "Log in to your portal" → `/tenant` · "Find a rental" → `/properties`

---

## Wave 2 — Conversion + Trust Pages (3 pages)

### `/demo`
**File:** `app/demo/page.tsx`
**Purpose:** Primary lead generation page — dedicated demo booking page.

**Sections:**
1. **PageBanner** — title: "See Ondo in action" · subtitle: "Book a free 15-minute walkthrough. No pressure, no commitment."
2. **Value props** — 3 inline items: `Clock` "15-minute call" · `Monitor` "Live platform walkthrough" · `Lightbulb` "Custom recommendations"
3. **Demo request form** — Extract into `app/demo/demo-form.tsx` (client component, `"use client"`). Fields:
   - First name (required), Last name (required), Email (required), Phone (optional)
   - Role dropdown: Owner · Investor · Property Manager · Tenant
   - Number of units (text input, optional)
   - Preferred time (text input, e.g. "Weekday mornings", optional)
   - On submit: POST to `https://api.ondore.com/api/leads/contact` (use `NEXT_PUBLIC_BACKEND_URL` env var + `/api/leads/contact`). Request body: `{ name: "${firstName} ${lastName}", email, phone, source: "website", message: "Demo request — Role: ${role}, Units: ${units}, Preferred time: ${time}" }`.
   - On success (2xx): show inline green success message: "Thanks! We'll be in touch within 1 business day to confirm your demo time."
   - On error: show inline red error message: "Something went wrong. Please email us at `${SITE_EMAILS.primary}` or try again." — import `SITE_EMAILS` from `@/lib/site`.
4. **What to expect** — 3 numbered steps: 1. "Fill out the form above" · 2. "We confirm via email within 1 business day" · 3. "Join your live walkthrough — no install needed"
5. **Layout:** Two-column on desktop — form on left, value props + "what to expect" on right. Single column on mobile.

---

### `/tour`
**File:** `app/tour/page.tsx`
**Purpose:** Self-serve platform walkthrough for visitors not ready to book a demo.

**Sections:**
1. **PageBanner** — title: "Take a guided tour of the Ondo platform" · subtitle: "Explore every feature — owner dashboard, tenant portal, AI assistant, and more."
2. **4-step tour** — Vertical numbered list. Each step: number badge + heading + description + screenshot placeholder (`<div className="w-full aspect-video bg-muted rounded-lg border border-border flex items-center justify-center text-foreground/40 text-sm">`):
   - Step 1: "Owner Dashboard" — "See every property, tenant, and payment at a glance."
   - Step 2: "Tenant Portal" — "Tenants pay rent, submit requests, and message you in one place."
   - Step 3: "AI Assistant" — "Ask questions, get insights, and take action — all in natural language."
   - Step 4: "Vendor Tools" — "Coordinate maintenance and manage your vendor network."
3. **CTA** — Two buttons: "Try it yourself" → `/auth` · "Book a demo" → `/demo`

---

### `/partners`
**File:** `app/partners/page.tsx`
**Purpose:** Establish credibility through integration partners and invite new partnerships.

**Sections:**
1. **PageBanner** — title: "Built to integrate with the tools you already use" · subtitle: "Ondo connects to the platforms your business already runs on."
2. **Partner grid** — 2×3 card grid. Each card: name + one-line description (no external logo images — use text name in large font + icon or colored initial):
   - Stripe — "Secure rent payments and billing"
   - Supabase — "Real-time database and file storage"
   - HubSpot — "CRM and lead pipeline management"
   - Resend — "Transactional email delivery"
   - Claude AI (Anthropic) — "AI assistant powering portfolio insights"
   - Leaflet — "Interactive property maps"
3. **Become a partner** — `bg-muted` box: heading "Partner with Ondo" + 1-sentence pitch + single `Button` "Contact us" with `href="mailto:hello@ondore.com"` (mailto link — no form).
4. **CTA** — "Learn more about Ondo" → `/about`

---

## Wave 3 — Knowledge & SEO Pages (4 pages)

### `/data`
**File:** `app/data/page.tsx`
**Purpose:** Utah real estate market data hub. SEO traffic for market research queries.
**Note:** Sub-routes `/data/market-reports`, `/data/benchmarks`, `/data/real-estate-trends` are **out of scope** for this build. Do not create stub files for them.

**Sections:**
1. **PageBanner** — title: "Utah Real Estate Market Data" · subtitle: "Quarterly insights on Utah's residential and rental markets."
2. **Stat cards** — 4 cards in a row. Static hardcoded figures (labeled "Updated Q1 2026"):
   - Median Rent: $1,650/mo
   - Vacancy Rate: 4.2%
   - Median Home Price: $485,000
   - YoY Price Change: +3.1%
3. **Sub-section link cards** — 3 cards linking to future pages (links point to `/contact` for now, with subtitle "Coming soon"):
   - "Market Reports" — "Quarterly Utah real estate research"
   - "Benchmarks" — "Compare rent and returns across Utah markets"
   - "Trends" — "Historical pricing and vacancy trends"
4. **CTA** — "Get a free market analysis" → `/contact`

---

### `/insights`
**File:** `app/insights/page.tsx`
**Purpose:** Research & content hub aggregating existing content into one discoverable entry point.

**Sections:**
1. **PageBanner** — title: "Research & Insights" · subtitle: "Market analysis, guides, and thought leadership from the Ondo team."
2. **Content type cards** — 5 cards:
   - Blog → `/blog`
   - News → `/news`
   - Reports → `/contact` (labeled "Request a report")
   - Webinars → `/contact` (labeled "Join upcoming webinars")
   - Events → `/contact` (labeled "See upcoming events")
3. **Featured blog posts** — 3 hardcoded cards (title + excerpt + link):
   1. "Why Utah Is the Best Real Estate Investment Market" — "Utah's growing population and job market make it one of the top states for real estate investors." — `/blog/why-utah-best-real-estate-investment`
   2. "New Landlord Mistakes and the Systems That Fix Them" — "Common pitfalls new landlords face and how automated systems eliminate them." — `/blog/new-landlord-mistakes-systems`
   3. "Vacancy Risk Playbook" — "How to reduce vacancy risk and keep your rentals consistently occupied." — `/blog/vacancy-risk-playbook`
4. **CTA** — "Subscribe for updates" → `/subscribe`

---

### `/video-library`
**File:** `app/video-library/page.tsx` (Server Component — exports `metadata`)
**Interactive component:** `app/video-library/video-tabs.tsx` (Client Component — `"use client"`, uses `useState` for tab switching)
**Purpose:** Tutorial video hub for onboarding owners, tenants, and investors.

**Sections:**
1. **PageBanner** — title: "Learn how to use Ondo" · subtitle: "Step-by-step walkthroughs for every role on the platform."
2. **`<VideoTabs />`** — Rendered inside `page.tsx`. Contains:
   - Tab bar: Owners · Tenants · Investors · Platform
   - Each tab shows a grid of 4 video cards. Video card shape: `{ title: string, duration: string, comingSoon: boolean }`. Cards where `comingSoon: true` show a gray "Coming Soon" badge and the button is disabled.
   - Hardcoded data (all `comingSoon: true` for now):
     - Owners: "Setting up your owner dashboard" 3:20 · "How to add a property" 2:10 · "Reading your financial report" 4:05 · "Managing maintenance requests" 3:45
     - Tenants: "How to pay rent online" 2:30 · "Submitting a maintenance request" 1:55 · "Accessing your documents" 1:40 · "Messaging your landlord" 1:20
     - Investors: "Understanding portfolio analytics" 5:10 · "Reading your risk score" 3:30 · "Browsing investment opportunities" 4:00 · "Using the AI assistant" 6:15
     - Platform: "Platform overview" 8:00 · "AI assistant deep dive" 7:30 · "Vendor management" 4:45 · "Setting up notifications" 2:50
   - Each video card thumbnail: `<div className="w-full aspect-video bg-muted rounded border border-border flex items-center justify-center">` with a `Play` Lucide icon
3. **CTA** — "Book a live walkthrough" → `/demo`

---

### `/academy`
**File:** `app/academy/page.tsx`
**Purpose:** Educational hub for real estate knowledge. SEO for "how to invest in Utah real estate" queries.

**Sections:**
1. **PageBanner** — title: "Ondo Academy" · subtitle: "Free guides, tools, and resources to help you make smarter real estate decisions."
2. **Topic cards** — 4 cards in a 2×2 grid. Each card: icon + category title + 3 hardcoded links:
   - `TrendingUp` — **Investing**
     - "Why Utah Is the Best Real Estate Investment Market" → `/blog/why-utah-best-real-estate-investment`
     - "Renting vs Owning: The Hidden Math" → `/blog/renting-vs-owning-hidden-math`
     - "Investment Opportunities" → `/investments`
   - `Wrench` — **Property Management**
     - "New Landlord Mistakes and the Systems That Fix Them" → `/blog/new-landlord-mistakes-systems`
     - "Property Management Automation Checklist" → `/blog/property-management-automation-checklist`
     - "Maintenance & CapEx Strategy" → `/blog/maintenance-capex-strategy`
   - `DollarSign` — **Loans & Financing**
     - "Mortgage Rate Trends 2025" → `/blog/mortgage-rate-trends-2025`
     - "Mortgage Calculators" → `/calculators`
     - "Loan Types Explained" → `/loans`
   - `MapPin` — **Utah Market**
     - "Utah Rent vs Buy: Wasatch Front" → `/blog/utah-rent-vs-buy-wasatch-front`
     - "Why Utah: Market Overview" → `/why-utah`
     - "Utah Real Estate Market Data" → `/data`
3. **Ask the AI callout** — `bg-muted` box: "Have a specific question? Ask the Ondo AI assistant." + Button "Ask AI" → `https://claude.ai/` (use `SITE_CLAUDE_ASK_ONDO_URL` constant from `@/lib/site`)
4. **CTA** — "Read the blog" → `/blog`

---

## Navigation Updates

**File:** `components/navigation.tsx`

Add two new dropdown items to the main nav (desktop) and the mobile menu (hamburger). Insert after existing nav items, before the auth/login button:

1. **"Solutions" dropdown:**
   - For Investors → `/solutions/investors`
   - For Landlords → `/solutions/landlords`
   - For Property Managers → `/solutions/property-managers`
   - For Tenants → `/solutions/tenants`

2. **"Learn" dropdown:**
   - Platform Tour → `/tour`
   - Video Library → `/video-library`
   - Academy → `/academy`
   - Insights → `/insights`
   - Partners → `/partners`

Mobile behavior: the mobile menu (`components/header.tsx`) uses a flat sheet with no accordion. For mobile, add both "Solutions" and "Learn" as inline expanded link lists — render a section heading (e.g., bold text "Solutions") followed by indented `Link` items for each sub-page. Do not use nested `DropdownMenu` inside the mobile sheet.

---

## Sitemap Updates

**File:** `lib/site-index.ts` — `getSiteIndexSections()` function

The human-readable sitemap page (`app/sitemap/page.tsx`) and the XML sitemap are both driven by `lib/site-index.ts`. Add all 12 new routes as `SiteIndexLink` entries inside appropriate sections in `getSiteIndexSections()`. Use the existing shape: `{ name: string, href: string, description: string }`. Add a new "Solutions" section and add the Wave 2/3 pages to the most relevant existing sections (e.g., "Learn" pages under a new "Resources" section).

Do not edit `app/sitemap/page.tsx` directly — it reads from `site-index.ts` automatically.

---

## Success Criteria

- All 12 `page.tsx` files exist and render without TypeScript or runtime errors
- Each page exports `metadata` and renders `<SEO>` component
- All `page.tsx` files are Server Components (no `"use client"` at the top level); client interactivity is in child components
- All background and text colors use semantic Tailwind tokens only — no hardcoded `bg-white`, `text-black`, `bg-gray-*`
- All CTAs link to routes confirmed to exist: `/contact`, `/auth`, `/tenant`, `/owner`, `/investments`, `/properties`, `/blog`, `/news`, `/subscribe`, `/demo`, `/data`, `/loans`, `/calculators`, `/why-utah`, `/about`
- `/demo` form POSTs to `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/contact` with correct body shape
- `/video-library` tab switching works client-side without page reload
- Navigation dropdowns appear on desktop and in the mobile hamburger menu
- `app/sitemap.xml` and `app/sitemap/page.tsx` include all 12 new routes
