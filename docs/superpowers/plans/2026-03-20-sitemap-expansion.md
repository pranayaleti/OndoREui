# Sitemap Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 14 new SEO-optimised public pages (5 blog posts, 4 loan products, 3 PM features, resources/templates, case studies) and update site-index.ts with 9 new entries.

**Architecture:** Every page is a static standalone `page.tsx` following the existing codebase pattern. Blog posts use the `publishedTime`/`author`/`section` SEO variant; all other pages use `jsonLd={generateBreadcrumbJsonLd(...)}`. No new dynamic routes.

**Tech Stack:** Next.js 15 App Router, TypeScript, shadcn/ui, Lucide icons, `@/lib/seo` (generateBreadcrumbJsonLd), `@/lib/site` (SITE_URL, APP_PORTAL_URL), `@/components/seo`, `@/components/page-banner`

---

## Task 1: Blog post — First-Time Home Buyer Guide

**Files:**
- Create: `app/blog/first-time-home-buyer-guide/page.tsx`

- [ ] Create the file with full content:

```tsx
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/first-time-home-buyer-guide"
const title = "First-Time Home Buyer Guide: Everything You Need to Know"
const description = "Complete guide to buying your first home in Utah, from pre-approval to closing day."
const published = "2024-12-10"
const modified = "2024-12-10"
const author = "Sarah Johnson"
const category = "Buying Guide"
const image = "/suburban-house-garden.png"
const keywords = ["first time home buyer Utah", "home buying guide", "pre-approval Utah", "FHA loan Utah", "down payment assistance Utah"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

export default function FirstTimeHomeBuyerGuide() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Step-by-step guidance from pre-approval to keys in hand." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Buying your first home is one of the biggest financial decisions you will make. This guide walks you through every stage of the process — from getting pre-approved to handing over the keys — so you can move forward with confidence.
            </p>

            <h2>Step 1: Know Your Numbers Before You Shop</h2>
            <p>Before you fall in love with a listing, understand what you can actually afford. Pull your credit reports from all three bureaus (Equifax, Experian, TransUnion) and check for errors. A score of 620+ qualifies for conventional financing; 580+ for FHA. In Utah, the median home price in the Salt Lake metro exceeds $500,000, so most buyers need a plan for the down payment and closing costs (typically 2–5% of purchase price).</p>
            <ul>
              <li>Target a housing payment (PITI + HOA) at or below 28–31% of gross monthly income</li>
              <li>Total debt-to-income (all obligations) should stay under 43–45%</li>
              <li>Have 2–3 months of reserves after closing for peace of mind</li>
            </ul>

            <h2>Step 2: Get Pre-Approved — Not Just Pre-Qualified</h2>
            <p>A pre-qualification is a quick estimate. A pre-approval is a lender reviewing your actual tax returns, W-2s, pay stubs, and bank statements and issuing a conditional commitment. In Utah's competitive market, sellers often reject offers without a solid pre-approval letter. Use a local lender who understands Utah title, HOA, and county-specific quirks — national online lenders can cause delays at closing.</p>
            <p>Utah first-time buyer programs to ask about:</p>
            <ul>
              <li><strong>Utah Housing Corporation (UHC) FirstHome Loan</strong> — below-market rate + optional DPA second mortgage</li>
              <li><strong>UHC Score Loan</strong> — for buyers with lower credit scores who need more flexibility</li>
              <li><strong>FHA loans</strong> — 3.5% down at 580+ FICO; works well with UHC DPA</li>
              <li><strong>USDA Rural Development</strong> — zero down in eligible rural areas (Cache Valley, parts of Utah County)</li>
            </ul>

            <h2>Step 3: Find the Right Agent and Search Smart</h2>
            <p>A buyer's agent costs you nothing (seller pays both commissions in most transactions) and gives you negotiation expertise, contract knowledge, and access to off-market listings. Look for someone who specialises in your target corridor — Wasatch Front dynamics differ dramatically from Park City or St. George.</p>
            <p>Search tips for Utah:</p>
            <ul>
              <li>Watch days-on-market. Anything under 7 days in the Salt Lake metro usually means multiple offers.</li>
              <li>Check flood zone maps — FEMA-designated zones affect insurance cost significantly.</li>
              <li>Verify HOA documents: budget, reserve study, and meeting minutes before going under contract.</li>
            </ul>

            <h2>Step 4: Make a Strong Offer</h2>
            <p>Price is not the only lever. In a competitive market, escalation clauses, waived minor contingencies, and a flexible close date can win over a marginally higher offer. That said, never waive an inspection entirely on your first home — the inspection contingency protects you from discovering major structural or mechanical defects after you own the property.</p>
            <p>Utah-specific contract items to understand:</p>
            <ul>
              <li>REPC (Real Estate Purchase Contract) — Utah's standard contract is thorough; know the deadlines</li>
              <li>Earnest money is typically 1–2% of purchase price and goes hard (non-refundable) after the due-diligence period</li>
              <li>Seller disclosures are required by Utah law; review them carefully</li>
            </ul>

            <h2>Step 5: Navigate Inspection, Appraisal, and Closing</h2>
            <p>After an accepted offer, the clock starts. You typically have 10–14 days for inspections. Hire a licensed Utah home inspector and, for older homes, add a sewer scope and radon test (Utah has elevated radon in many areas). If issues arise, you can negotiate repairs, a price reduction, or a seller credit.</p>
            <p>The lender orders an appraisal to confirm the home is worth the purchase price. If it appraises low, you can renegotiate, pay the gap in cash, or walk away. Final underwriting then clears any remaining conditions. Closing day involves signing a stack of documents at title — in Utah, closings are typically handled by a title company, not an attorney.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/loans/fha">Explore FHA Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/qualify">Get Pre-Approved</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
```

- [ ] Verify it renders: `pnpm dev` → open `http://localhost:3000/blog/first-time-home-buyer-guide`

---

## Task 2: Blog post — Property Management Tips for Utah Landlords

**Files:**
- Create: `app/blog/property-management-tips-utah-landlords/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/property-management-tips-utah-landlords"
const title = "Property Management Tips for Utah Landlords"
const description = "Essential tips for managing rental properties in Utah's competitive market."
const published = "2024-12-05"
const modified = "2024-12-05"
const author = "Michael Chen"
const category = "Property Management"
const image = "/property-manager-meeting.png"
const keywords = ["Utah landlord tips", "property management Utah", "Utah rental laws", "tenant screening Utah", "Utah Fit Premises Act"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

export default function PropertyManagementTipsUtahLandlords() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Reduce vacancy, protect your asset, and keep tenants happy." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah's rental market moves fast. Whether you own a single-family rental in Lehi or a multi-unit building in Salt Lake City, these proven tactics help you reduce vacancy, protect your asset, and keep tenants happy.
            </p>

            <h2>Know Utah Landlord-Tenant Law</h2>
            <p>Utah's Fit Premises Act (Utah Code § 57-22) requires landlords to maintain habitable conditions including adequate heating, plumbing, and structural integrity. Violations can allow tenants to withhold rent or terminate their lease. The state also requires a minimum 3-day notice for non-payment of rent before filing an eviction, and 15-day notice for lease violations. Security deposits must be returned within 30 days of move-out with an itemised deduction list.</p>
            <ul>
              <li>Use Utah-specific lease agreements that reference state code — generic templates from other states may be unenforceable</li>
              <li>Document all move-in and move-out conditions with timestamped photos</li>
              <li>Never deduct normal wear and tear from a security deposit</li>
            </ul>

            <h2>Screen Tenants Systematically</h2>
            <p>A poor tenant selection costs more than a month of vacancy. Run a full report: credit (aim for 650+), criminal background, prior eviction history, and income verification (3× monthly rent is a common minimum). Utah Fair Housing laws prohibit discrimination based on race, colour, national origin, sex, religion, disability, and familial status. Apply the same criteria to every applicant.</p>
            <ul>
              <li>Use a written rental application and keep records for at least 3 years</li>
              <li>Call previous landlords — not just the current one (who may be motivated to give a glowing reference to move a problem tenant)</li>
              <li>Verify employment with a pay stub and a direct call to HR</li>
            </ul>

            <h2>Reduce Vacancy with Smart Leasing Timing</h2>
            <p>Utah rental demand peaks in May–August, driven by the academic calendar (BYU, UVU, U of U) and corporate relocation cycles tied to Silicon Slopes hiring. Structuring leases to expire in spring or early summer maximises your applicant pool. If you have a December expiry, consider a short-term renewal to shift it to spring rather than listing in the slow winter window.</p>

            <h2>Maintain Proactively — Not Reactively</h2>
            <p>Utah's climate creates specific maintenance cycles: freeze-thaw cycles stress foundations and pipes; the hot, dry summers accelerate HVAC wear; and dust from inversions clogs filters faster than the national average. Build a maintenance calendar:</p>
            <ul>
              <li><strong>Spring:</strong> HVAC service, irrigation activation, roof inspection after snow load</li>
              <li><strong>Summer:</strong> Exterior paint, fence, landscaping, gutter cleaning</li>
              <li><strong>Fall:</strong> Furnace tune-up, pipe insulation, weatherstripping, dryer vent cleaning</li>
              <li><strong>Winter:</strong> Ice dam prevention, monitor for frozen pipes in crawl spaces</li>
            </ul>
            <p>Budget 1–1.5% of property value annually for maintenance on homes built after 2000; 1.5–2% for older stock.</p>

            <h2>Use a Property Management Platform</h2>
            <p>Manual rent collection, maintenance tracking, and owner reporting is a time sink that grows nonlinearly with every unit you add. Modern PM software automates rent reminders, late fees, maintenance dispatch, and monthly statements. Owners who use a platform typically see 10–15% lower maintenance costs (faster response = smaller repairs) and significantly faster lease-up times from better prospective tenant communication.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Explore Full-Service PM</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/property-management/tenant-screening">How We Screen Tenants</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
```

---

## Task 3: Blog post — Mortgage Rate Trends

**Files:**
- Create: `app/blog/mortgage-rate-trends-2025/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/mortgage-rate-trends-2025"
const title = "Mortgage Rate Trends: What to Expect in 2025"
const description = "Analysis of current mortgage rate trends and predictions for the coming year."
const published = "2024-11-28"
const modified = "2024-11-28"
const author = "Jennifer Martinez"
const category = "Mortgage"
const image = "/modern-townhouse-garage.png"
const keywords = ["mortgage rate trends 2025", "Utah mortgage rates", "when to lock mortgage rate", "Fed rate cuts 2025", "refinance timing Utah"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

export default function MortgageRateTrends2025() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="What buyers and refinancers should watch in the current rate environment." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              After a volatile 2023–2024, buyers and refinancers are watching rates carefully. Here is what the data, Fed signals, and Utah-specific demand suggest for the mortgage market.
            </p>

            <h2>How Mortgage Rates Are Set</h2>
            <p>The 30-year fixed mortgage rate is not directly set by the Federal Reserve — it tracks the 10-year Treasury yield with a spread. That spread (typically 150–200 basis points in normal conditions) widens when secondary market risk appetite falls. The Fed's federal funds rate influences the short end of the yield curve; longer-term rates are driven more by inflation expectations and investor demand for bonds.</p>
            <p>Key inputs to watch:</p>
            <ul>
              <li><strong>10-year Treasury yield</strong> — the single best leading indicator for 30-year fixed rates</li>
              <li><strong>PCE inflation (Personal Consumption Expenditures)</strong> — the Fed's preferred inflation gauge</li>
              <li><strong>Jobs data</strong> — strong employment keeps inflation sticky and rates elevated</li>
              <li><strong>MBS spreads</strong> — mortgage-backed securities spreads over Treasuries reflect lender risk appetite</li>
            </ul>

            <h2>What Happened in 2023–2024</h2>
            <p>The fastest rate hiking cycle in four decades pushed the 30-year fixed from sub-3% (2021) to above 8% (late 2023). Utah buyers saw purchasing power compressed by over 40% from peak to trough. The Fed began cutting its benchmark rate in late 2024, but 30-year mortgage rates did not fall proportionally — the 10-year yield remained elevated due to persistent inflation and large Treasury supply.</p>

            <h2>Reading a Rate Quote Correctly</h2>
            <p>When a lender quotes you a rate, understand the full cost picture:</p>
            <ul>
              <li><strong>Rate vs. APR</strong>: APR includes origination fees, discount points, and other costs — always compare APRs</li>
              <li><strong>Discount points</strong>: 1 point = 1% of loan amount paid upfront to buy down the rate. Break-even is typically 3–5 years; only worth it if you plan to stay</li>
              <li><strong>Rate lock period</strong>: Standard locks are 30–45 days; longer locks cost more. Know your close timeline before locking</li>
              <li><strong>Float-down options</strong>: Some lenders offer a one-time float-down if rates drop after you lock — worth asking about</li>
            </ul>

            <h2>When to Lock vs. Float</h2>
            <p>Trying to time rates perfectly is futile — even professional bond traders cannot do it consistently. A practical framework:</p>
            <ul>
              <li>If current rates make the purchase pencil and you are within 30–45 days of closing, lock</li>
              <li>If rates drop significantly (0.25%+ below your lock) before closing, ask about float-down provisions</li>
              <li>If you are 60–90 days out and rates are trending down, a float strategy with a predetermined trigger (e.g., "I lock when the 10-year hits X") is more systematic than daily monitoring</li>
            </ul>

            <h2>Utah-Specific Demand Context</h2>
            <p>Utah's population growth (top 3 nationally for the past decade) creates a structural demand floor for housing that softens rate-driven price corrections relative to slower-growth markets. Silicon Slopes tech employment concentration in Utah County and Salt Lake County creates income resilience. This means buyers should model purchase decisions on long-hold (7+ year) scenarios rather than trying to time the market bottom.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/buy/rates">See Rate Context</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/qualify">Get Pre-Approved</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
```

---

## Task 4: Blog post — Home Staging Tips That Work

**Files:**
- Create: `app/blog/home-staging-tips-that-work/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/home-staging-tips-that-work"
const title = "Home Staging Tips That Actually Work"
const description = "Professional staging tips to help your home sell faster and for more money."
const published = "2024-11-15"
const modified = "2024-11-15"
const author = "Lisa Park"
const category = "Selling"
const image = "/modern-apartment-balcony.png"
const keywords = ["home staging tips", "sell home faster Utah", "staging ROI", "curb appeal Utah", "listing preparation"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

export default function HomeStagingTipsThatWork() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="The moves that actually move buyers — from curb to close." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Staged homes sell faster and typically for more money. These are the moves that actually matter — from decluttering and lighting to the small details buyers notice on first walk-through.
            </p>

            <h2>Start Outside: Curb Appeal Sets First Impressions</h2>
            <p>Buyers form an opinion within 8 seconds of pulling up. In Utah, the exterior work that pays most reliably is:</p>
            <ul>
              <li><strong>Fresh paint on the front door and shutters</strong> — $100–300, consistently cited as top ROI improvement</li>
              <li><strong>Clean, edged lawn and trimmed shrubs</strong> — dried-out or overgrown landscaping is the #1 visual negative</li>
              <li><strong>Power-wash the driveway and walkway</strong> — Utah's red rock dust and inversion grime builds up fast</li>
              <li><strong>Replace or clean outdoor light fixtures</strong> — buyers tour in evenings; light fixtures signal maintenance habits</li>
            </ul>

            <h2>Declutter Ruthlessly Before Photos</h2>
            <p>Listing photos are your first showing — most buyers filter before ever scheduling a visit. The goal is to make every room look larger and allow buyers to mentally place their own furniture. Remove 30–40% of belongings: pack personal photos, excess furniture, countertop appliances, and anything that signals the home is lived-in rather than move-in ready. Rent a storage unit for 4–6 weeks if needed.</p>
            <p>Room-specific priorities:</p>
            <ul>
              <li><strong>Kitchen:</strong> Clear all countertops except one decorative item. Deep clean appliances inside and out.</li>
              <li><strong>Primary bedroom:</strong> Hotel-style bedding, minimal nightstand items, no laundry visible.</li>
              <li><strong>Bathrooms:</strong> Remove all personal care products. Add matching white towels and a new shower curtain.</li>
              <li><strong>Garage:</strong> Buyers tour it; organise and sweep. A messy garage reads as "no storage."</li>
            </ul>

            <h2>Light Is the Single Biggest Lever Inside</h2>
            <p>Dark rooms feel smaller and less inviting. Before every showing: open all blinds, turn on every light in the house including closets and range hoods. Replace any burned-out bulbs with matching colour temperature (2700–3000K for warm, inviting light). Add a floor lamp or table lamp to any room that feels dark even with overhead lighting. Professional photos should be taken with all lights on and on an overcast or early morning shoot for even natural light.</p>

            <h2>Neutral, Clean, and Smell-Neutral</h2>
            <p>Buyers who are sensitive to odours (pets, cooking, must) will walk out and not come back. A professional carpet cleaning, fresh air for 24–48 hours, and a light neutral scent (clean linen, not heavy fragrance) resets the olfactory experience. Repaint any rooms with bold colours in a soft neutral — Benjamin Moore Accessible Beige, Sherwin-Williams Agreeable Gray, or similar. Buyers pay a premium to not repaint.</p>

            <h2>The Walk-Through Test</h2>
            <p>Walk every room as a buyer would: stand in the doorway and evaluate the first 3 seconds. Check: does it feel open? Is the focal point (fireplace, view, built-in) highlighted? Is the furniture arrangement making the room feel smaller? A common staging move is to pull furniture 6–12 inches away from walls — counterintuitively, this makes rooms feel larger. Remove extra chairs and side tables that create traffic flow obstacles.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/sell">List With Ondo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Request a Listing Consult</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
```

---

## Task 5: Blog post — Understanding Property Taxes in Utah

**Files:**
- Create: `app/blog/understanding-property-taxes-utah/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/understanding-property-taxes-utah"
const title = "Understanding Property Taxes in Utah"
const description = "Complete breakdown of Utah property taxes and how they affect your investment."
const published = "2024-11-08"
const modified = "2024-11-08"
const author = "Robert Wilson"
const category = "Taxes"
const image = "/placeholder.jpg"
const keywords = ["Utah property taxes", "Truth in Taxation Utah", "property tax assessment Utah", "Utah county tax rate", "investor property tax"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
}

export default function UnderstandingPropertyTaxesUtah() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Assessments, Truth in Taxation, and what every Utah investor must know." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Investing</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah property taxes are calculated differently than most states. Understanding assessment ratios, Truth in Taxation notices, and exemptions is essential for accurate underwriting — especially after a sale.
            </p>

            <h2>How Utah Assesses Property Value</h2>
            <p>The Utah County Assessor determines the fair market value (FMV) of every property annually. The taxable value for most residential properties is 55% of FMV (the "assessment ratio"). This means a home with a $500,000 FMV has an assessed value of $275,000 for tax calculation purposes. The total tax owed is: assessed value × the combined tax rate (all overlapping taxing entities — county, city, school district, water district, etc.).</p>
            <ul>
              <li>Utah County effective rate: approximately 0.52–0.65% of FMV (varies by city)</li>
              <li>Salt Lake County: approximately 0.58–0.72% of FMV</li>
              <li>Davis and Weber counties: similar range</li>
            </ul>

            <h2>What Is Truth in Taxation?</h2>
            <p>Utah's Truth in Taxation law (Utah Code § 59-2-919) requires any taxing entity that plans to collect more revenue than the prior year to hold a public hearing and explicitly notify property owners. You may receive a "Truth in Taxation" notice in August/September. This is not your tax bill — it is a notice that your taxing entities are considering a rate increase and that you have the right to attend a public hearing and comment.</p>
            <p>Why this matters for investors: even if your property value holds flat, your tax bill can increase if the school district or city votes to raise their levy. Underwrite with a 3–5% annual property tax escalator in your cash flow models.</p>

            <h2>The Primary Residential Exemption</h2>
            <p>Utah offers a primary residential exemption that reduces the assessed value to 55% of FMV (versus 100% for non-primary). If you purchase a rental property, you lose this exemption — the property is taxed at 100% of the county's assessed FMV. This is a significant underwriting factor: a rental property will carry a higher effective tax rate than the same home used as a primary residence. Always verify the current year's tax bill in the county assessor's database before closing on any investment property.</p>

            <h2>Appealing Your Assessment</h2>
            <p>If you believe your property is over-assessed, you can file a petition with the County Board of Equalization (BOE) typically by September 15 of the tax year. Bring comparable sales (not listing prices), and present evidence that the assessor's FMV exceeds actual market value. In rapidly appreciating markets, assessments can lag — but in correcting markets, they can overshoot. Most counties have informal review processes before a formal BOE appeal.</p>

            <h2>Investor Underwriting Checklist</h2>
            <ul>
              <li>Pull the current year tax bill from the county assessor's site before making an offer</li>
              <li>Confirm whether the property has the primary residential exemption — it will be removed in the year of sale if you are buying as an investment</li>
              <li>Model a 3–5% annual tax escalator in your NOI projections</li>
              <li>Check if the property is in a special assessment district (Mello-Roos equivalent) for infrastructure improvements</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/calculators">Use Our Investment Calculators</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/investments">Browse Investment Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
```

---

## Task 6: Clean up [slug]/page.tsx

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

- [ ] Remove all 5 entries from the `POSTS` record. The file comment on lines 10–12 already says: "we only list what's missing." After this edit, `POSTS` should be an empty object `{}` and `generateStaticParams` will return `[]`.

Replace:
```ts
const POSTS: Record<string, { ... }> = {
  "first-time-home-buyer-guide": { ... },
  "property-management-tips-utah-landlords": { ... },
  "mortgage-rate-trends-2025": { ... },
  "home-staging-tips-that-work": { ... },
  "understanding-property-taxes-utah": { ... },
}
```

With:
```ts
const POSTS: Record<string, {
  title: string
  description: string
  author: string
  published: string
  modified: string
  category: string
  image: string
  excerpt: string
}> = {
  // All blog posts now have dedicated static directories.
  // Add entries here only for slugs without their own app/blog/<slug>/page.tsx.
}
```

- [ ] Verify: `pnpm build` should succeed with no duplicate static params warnings.

---

## Task 7: Loan page — FHA

**Files:**
- Create: `app/loans/fha/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Users, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate",
  description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score. Learn requirements, MIP costs, and how FHA compares to conventional.",
  alternates: { canonical: `${SITE_URL}/loans/fha/` },
  openGraph: { title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
  twitter: { card: "summary_large_image", title: "FHA Loans in Utah | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
}

const benefits = [
  { title: "3.5% Down Payment", description: "As low as 3.5% down with a 580+ credit score — one of the lowest available", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Flexible Credit Standards", description: "Scores as low as 500 accepted (with 10% down); ideal for buyers rebuilding credit", icon: <Shield className="h-6 w-6" /> },
  { title: "Gift Funds Allowed", description: "100% of the down payment can come from family gifts — no seasoning required", icon: <Users className="h-6 w-6" /> },
  { title: "Higher DTI Tolerance", description: "Debt-to-income up to 57% with compensating factors vs 43–45% for conventional", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function FHALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="FHA Loans in Utah"
        description="FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score."
        pathname="/loans/fha"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "FHA Loans", url: `${SITE_URL}/loans/fha` },
        ])}
      />
      <PageBanner title="FHA Loans" subtitle="Government-backed financing with low down payments and flexible credit requirements" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is an FHA Loan?</h2>
              <p className="text-lg text-foreground/70">
                FHA loans are mortgages insured by the Federal Housing Administration. Because the government backs the lender against default, lenders can offer lower down payment requirements and more flexible qualification standards — making homeownership accessible to more Utah buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">FHA Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Credit Score</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• 580+ → 3.5% minimum down payment</li>
                    <li>• 500–579 → 10% minimum down payment</li>
                    <li>• Below 500 → not eligible for FHA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Mortgage Insurance Premium (MIP)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront MIP: 1.75% of loan amount (can be financed)</li>
                    <li>• Annual MIP: 0.55–1.05% depending on term and LTV</li>
                    <li>• MIP stays for life of loan if down payment &lt; 10%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Loan Limits (2024, Utah)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Salt Lake, Utah, Davis counties: $524,225 (1-unit)</li>
                    <li>• Summit County (Park City area): $1,149,825 (high-cost)</li>
                    <li>• Verify current limits at HUD.gov</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property Requirements</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Must be primary residence</li>
                    <li>• FHA appraisal required (stricter than conventional)</li>
                    <li>• Property must meet HUD minimum property standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">FHA vs. Conventional: When FHA Wins</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">FHA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower credit score threshold</li>
                    <li>• Higher DTI tolerance</li>
                    <li>• Pairs well with Utah DPA programs</li>
                    <li>• Gift funds for full down payment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Conventional Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• No upfront MIP</li>
                    <li>• PMI removable at 80% LTV</li>
                    <li>• Higher loan limits</li>
                    <li>• Faster FHA appraisal turnaround without overlays</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Pre-Approved?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 8: Loan page — VA

**Files:**
- Create: `app/loans/va/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Star, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate",
  description: "VA loans offer zero down payment and no PMI for eligible veterans and active-duty service members in Utah. Learn about the funding fee, COE, and Hill AFB area lenders.",
  alternates: { canonical: `${SITE_URL}/loans/va/` },
  openGraph: { title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate", description: "VA loans offer zero down payment and no PMI for eligible veterans in Utah." },
  twitter: { card: "summary_large_image", title: "VA Loans in Utah | Ondo Real Estate", description: "Zero down payment home loans for eligible veterans and service members in Utah." },
}

const benefits = [
  { title: "Zero Down Payment", description: "No down payment required for eligible borrowers — the most powerful benefit in housing finance", icon: <DollarSign className="h-6 w-6" /> },
  { title: "No Private Mortgage Insurance", description: "VA loans never require PMI regardless of down payment amount — saving hundreds per month", icon: <Shield className="h-6 w-6" /> },
  { title: "Competitive Rates", description: "VA loans historically carry rates 0.25–0.5% below conventional — backed by the government guarantee", icon: <Star className="h-6 w-6" /> },
  { title: "Limited Closing Costs", description: "VA caps what lenders can charge; sellers can pay all closing costs on a VA loan", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function VALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="VA Home Loans in Utah"
        description="VA loans offer zero down payment and no PMI for eligible veterans in Utah."
        pathname="/loans/va"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "VA Loans", url: `${SITE_URL}/loans/va` },
        ])}
      />
      <PageBanner title="VA Home Loans" subtitle="Earned benefits for veterans and active-duty service members — zero down, no PMI" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The VA Home Loan Benefit</h2>
              <p className="text-lg text-foreground/70">
                The VA home loan program is one of the most powerful financial benefits available to those who have served. Backed by the Department of Veterans Affairs, VA loans allow eligible borrowers to purchase a home with no down payment, no PMI, and competitive rates — in Utah and nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Eligibility & Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Who Is Eligible</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Veterans with honorable discharge</li>
                    <li>• Active-duty service members (90+ days)</li>
                    <li>• National Guard / Reserves (6+ years or 90 days wartime)</li>
                    <li>• Surviving spouses of veterans who died in service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">VA Funding Fee (2024)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• First use, 0% down: 2.15% of loan amount</li>
                    <li>• Subsequent use, 0% down: 3.3%</li>
                    <li>• Can be financed into the loan</li>
                    <li>• Waived for veterans with service-connected disability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Certificate of Eligibility (COE)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Required before the loan can close</li>
                    <li>• Most lenders pull it directly from VA systems (takes minutes)</li>
                    <li>• Or request via eBenefits or VA Form 26-1880</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Utah Military Context</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Hill Air Force Base (Davis County) — large VA loan market</li>
                    <li>• Dugway Proving Ground, Tooele County</li>
                    <li>• Utah National Guard installations across Wasatch Front</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">VA vs. Conventional: The Numbers</h3>
              <p className="text-foreground/70 mb-4">On a $450,000 purchase in Davis County:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">VA Loan</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: $0</li>
                    <li>• PMI: $0/month</li>
                    <li>• Funding fee: ~$9,675 (financed)</li>
                    <li>• Total cash to close: ~$5,000–8,000 (closing costs only)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Conventional (5% down)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: $22,500</li>
                    <li>• PMI: ~$150–200/month until 80% LTV</li>
                    <li>• No funding fee</li>
                    <li>• Total cash to close: ~$31,000+</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Start Your VA Loan</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 9: Loan page — USDA

**Files:**
- Create: `app/loans/usda/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, MapPin, Home, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "USDA Rural Loans in Utah | Zero Down | Ondo Real Estate",
  description: "USDA loans offer zero down payment for eligible rural and suburban Utah areas. Learn about income limits, eligible areas (Cache Valley, Sanpete), and how to qualify.",
  alternates: { canonical: `${SITE_URL}/loans/usda/` },
  openGraph: { title: "USDA Rural Loans in Utah | Zero Down | Ondo Real Estate", description: "USDA loans offer zero down payment for eligible rural Utah areas." },
  twitter: { card: "summary_large_image", title: "USDA Loans in Utah | Ondo Real Estate", description: "Zero down payment loans for eligible rural and suburban Utah areas." },
}

const benefits = [
  { title: "Zero Down Payment", description: "100% financing with no down payment required for eligible properties and borrowers", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Rural Utah Coverage", description: "Many suburban Utah areas qualify — Cache Valley, Sanpete County, rural Utah County, and more", icon: <MapPin className="h-6 w-6" /> },
  { title: "Lower Mortgage Insurance", description: "USDA guarantee fee (1%) and annual fee (0.35%) are lower than FHA MIP over the life of the loan", icon: <Home className="h-6 w-6" /> },
  { title: "Competitive Fixed Rates", description: "Government-backed guarantee enables competitive 30-year fixed rates for qualified borrowers", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function USDALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="USDA Rural Loans in Utah"
        description="USDA loans offer zero down payment for eligible rural and suburban Utah areas."
        pathname="/loans/usda"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "USDA Loans", url: `${SITE_URL}/loans/usda` },
        ])}
      />
      <PageBanner title="USDA Rural Loans" subtitle="Zero down payment financing for eligible rural and suburban Utah communities" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a USDA Loan?</h2>
              <p className="text-lg text-foreground/70">
                USDA Rural Development loans are backed by the U.S. Department of Agriculture to support homeownership in rural and suburban communities. They offer zero down payment and competitive rates — and more Utah areas qualify than most buyers realise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">USDA Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Income Limits</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Household income must be ≤115% of area median income (AMI)</li>
                    <li>• Salt Lake County: ~$110,000–130,000 for a family of 4 (verify at eligibility.sc.egov.usda.gov)</li>
                    <li>• All household income counts — not just borrowers on the loan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Eligible Utah Areas</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Cache Valley (Logan, Hyrum, Richmond)</li>
                    <li>• Sanpete County (Manti, Ephraim, Mt. Pleasant)</li>
                    <li>• Rural Utah County pockets (Elk Ridge, Woodland Hills)</li>
                    <li>• Many Box Elder, Millard, Sevier county communities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Fees</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront guarantee fee: 1.0% of loan (financed)</li>
                    <li>• Annual fee: 0.35% of remaining balance</li>
                    <li>• No monthly PMI — annual fee is significantly lower than FHA MIP</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property & Credit</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Must be primary residence; no investment properties</li>
                    <li>• Minimum 640 credit score for GUS automated approval</li>
                    <li>• Manual underwrite possible below 640 with strong file</li>
                    <li>• Property must be in USDA-eligible area (verify before offer)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Check Your Eligibility</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 10: Loan page — Jumbo

**Files:**
- Create: `app/loans/jumbo/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, TrendingUp, Building2, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jumbo Loans in Utah | Park City & Draper | Ondo Real Estate",
  description: "Jumbo loans for Utah homes above the $766,550 conforming limit. We work with Park City, Draper, and other high-value markets. Learn requirements and get pre-approved.",
  alternates: { canonical: `${SITE_URL}/loans/jumbo/` },
  openGraph: { title: "Jumbo Loans in Utah | Park City & Draper | Ondo Real Estate", description: "Jumbo loans for Utah homes above the $766,550 conforming limit." },
  twitter: { card: "summary_large_image", title: "Jumbo Loans in Utah | Ondo Real Estate", description: "Jumbo loans for high-value properties in Park City, Draper, and across Utah." },
}

const benefits = [
  { title: "Above Conforming Limits", description: "Finance properties exceeding the $766,550 2024 Utah conforming limit — up to $3M+", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Competitive Rates", description: "Jumbo rates are now often at parity with or below conventional — the spread has narrowed significantly", icon: <TrendingUp className="h-6 w-6" /> },
  { title: "Utah High-Value Markets", description: "Specialists in Park City, Draper, Holladay, Cottonwood Heights, and other premium corridors", icon: <Building2 className="h-6 w-6" /> },
  { title: "Flexible Structures", description: "Fixed and ARM options; interest-only available for qualified buyers; portfolio lending options", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function JumboLoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Jumbo Loans in Utah"
        description="Jumbo loans for Utah homes above the $766,550 conforming limit."
        pathname="/loans/jumbo"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "Jumbo Loans", url: `${SITE_URL}/loans/jumbo` },
        ])}
      />
      <PageBanner title="Jumbo Loans" subtitle="Financing for Utah's premium and high-value properties" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a Jumbo Loan?</h2>
              <p className="text-lg text-foreground/70">
                A jumbo loan is a mortgage that exceeds the conforming loan limits set by Fannie Mae and Freddie Mac. For most Utah counties in 2024, that limit is $766,550. Properties in Summit County (Park City) have a higher limit of $1,149,825 before jumbo treatment applies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Jumbo Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Credit Score</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Typically 700+ required; 720+ for best terms</li>
                    <li>• No government guarantee — lenders set their own overlays</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Down Payment</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Typically 10–20% depending on loan size</li>
                    <li>• Some portfolio lenders offer 5–10% with reserves</li>
                    <li>• 80% LTV preferred to avoid jumbo PMI</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Reserves</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• 6–18 months PITI in liquid or near-liquid assets</li>
                    <li>• Retirement accounts often count at 60–70%</li>
                    <li>• Business assets may qualify with 2-year CPA letter</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Utah High-Value Corridors</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Park City / Deer Valley / Jordanelle</li>
                    <li>• Draper, South Jordan, Holladay</li>
                    <li>• Cottonwood Heights, Little Cottonwood Canyon area</li>
                    <li>• Emigration Canyon, Millcreek hillsides</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Discuss Your Jumbo Purchase</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/contact">Talk to a Loan Officer</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 11: PM feature — Tenant Screening

**Files:**
- Create: `app/property-management/tenant-screening/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserCheck, Shield, FileText, Clock } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tenant Screening Utah | Property Management | Ondo Real Estate",
  description: "Comprehensive tenant screening for Utah landlords: credit, criminal, eviction, and income verification. Fair Housing compliant. Powered by the Ondo owner portal.",
  alternates: { canonical: `${SITE_URL}/property-management/tenant-screening/` },
  openGraph: { title: "Tenant Screening Utah | Ondo Real Estate", description: "Credit, criminal, eviction, and income verification for Utah rental properties." },
  twitter: { card: "summary_large_image", title: "Tenant Screening | Ondo Real Estate", description: "Comprehensive tenant screening for Utah landlords." },
}

const checks = [
  { title: "Credit Report", description: "Full tri-merge credit report with score, payment history, collections, and debt load", icon: <FileText className="h-6 w-6" /> },
  { title: "Criminal Background", description: "National and state-level criminal background search with sex offender registry check", icon: <Shield className="h-6 w-6" /> },
  { title: "Eviction History", description: "National eviction database search covering court filings and judgments", icon: <UserCheck className="h-6 w-6" /> },
  { title: "Income Verification", description: "Employer verification, pay stub review, and bank statement analysis for 3× rent threshold", icon: <Clock className="h-6 w-6" /> },
]

export default function TenantScreeningPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Tenant Screening Utah"
        description="Comprehensive tenant screening for Utah landlords: credit, criminal, eviction, and income verification."
        pathname="/property-management/tenant-screening"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Tenant Screening", url: `${SITE_URL}/property-management/tenant-screening` },
        ])}
      />
      <PageBanner title="Tenant Screening" subtitle="Protect your investment with thorough, Fair Housing-compliant tenant verification" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Screening Matters</h2>
              <p className="text-lg text-foreground/70">
                A single bad placement can cost $8,000–15,000 in lost rent, legal fees, and turnover costs. Our systematic screening process applies consistent, documented criteria to every applicant — protecting your asset and keeping you compliant with Utah Fair Housing law.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {checks.map((c, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{c.icon}</div>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Applicant Applies Online", desc: "Prospective tenants complete a standardised application through the Ondo portal. Consent for background and credit checks is collected digitally." },
                  { step: "2", title: "Automated Screening Reports", desc: "Our system runs credit, criminal, eviction, and income checks within minutes. Results are scored against your pre-set criteria (minimum FICO, income multiple, eviction history tolerance)." },
                  { step: "3", title: "Owner Review & Decision", desc: "You review the full report in your owner dashboard. Our team flags any concerns and provides a recommendation. You make the final placement decision." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{s.title}</h4>
                      <p className="text-foreground/70">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Start Screening Smarter</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/property-management">Full PM Services</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={APP_PORTAL_URL}>Owner Portal</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 12: PM feature — Maintenance Coordination

**Files:**
- Create: `app/property-management/maintenance-coordination/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, Bell, ClipboardList, Users } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maintenance Coordination | Property Management Utah | Ondo",
  description: "Ondo handles tenant maintenance requests end-to-end: intake, vendor dispatch, owner approval, and completion tracking. Keep your Utah rental in top condition.",
  alternates: { canonical: `${SITE_URL}/property-management/maintenance-coordination/` },
  openGraph: { title: "Maintenance Coordination | Ondo Real Estate", description: "End-to-end maintenance coordination for Utah rental properties." },
  twitter: { card: "summary_large_image", title: "Maintenance Coordination | Ondo", description: "We handle tenant maintenance requests from intake to completion." },
}

const features = [
  { title: "24/7 Request Intake", description: "Tenants submit requests via the portal any time — categorised by urgency, with photo attachments", icon: <Bell className="h-6 w-6" /> },
  { title: "Vetted Vendor Network", description: "We dispatch from our pre-screened Utah vendor network — licensed, insured, and rated by past performance", icon: <Users className="h-6 w-6" /> },
  { title: "Owner Approval Thresholds", description: "You set a dollar threshold. Work under it proceeds automatically; above it requires your sign-off", icon: <ClipboardList className="h-6 w-6" /> },
  { title: "Completion Tracking", description: "Every request logged from open to close with photos, invoices, and tenant sign-off in your dashboard", icon: <Wrench className="h-6 w-6" /> },
]

export default function MaintenanceCoordinationPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Maintenance Coordination | Property Management Utah"
        description="End-to-end maintenance coordination for Utah rental properties."
        pathname="/property-management/maintenance-coordination"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Maintenance Coordination", url: `${SITE_URL}/property-management/maintenance-coordination` },
        ])}
      />
      <PageBanner title="Maintenance Coordination" subtitle="Fast, transparent maintenance handling — tenants stay happy, your asset stays protected" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Maintenance Done Right</h2>
              <p className="text-lg text-foreground/70">
                Slow maintenance response is the top reason Utah tenants don't renew. Our coordination system ensures every request is acknowledged, triaged, and resolved quickly — with full visibility for owners and tenants throughout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{f.icon}</div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">The Workflow</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Tenant Submits Request", desc: "Via the tenant portal: description, urgency level (routine / urgent / emergency), and photos. Emergency requests trigger an immediate on-call response." },
                  { step: "2", title: "Triage and Vendor Dispatch", desc: "Our team reviews, categorises, and dispatches the appropriate vendor from our network. For work above your approval threshold, we contact you with vendor quote before proceeding." },
                  { step: "3", title: "Work Completed and Documented", desc: "Vendor completes the work and submits completion photos and invoice. Tenant confirms resolution. Invoice is attached to the property ledger and visible in your monthly statement." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{s.title}</h4>
                      <p className="text-foreground/70">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/property-management">Full PM Services</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={APP_PORTAL_URL}>Owner Portal</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 13: PM feature — Owner Reporting

**Files:**
- Create: `app/property-management/owner-reporting/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, DollarSign, FolderOpen } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Owner Reporting | Property Management Utah | Ondo Real Estate",
  description: "Real-time owner reporting for Utah rental properties: monthly statements, NOI tracking, maintenance history, and document vault — all in one dashboard.",
  alternates: { canonical: `${SITE_URL}/property-management/owner-reporting/` },
  openGraph: { title: "Owner Reporting | Ondo Real Estate", description: "Monthly statements, NOI tracking, and document vault for Utah rental owners." },
  twitter: { card: "summary_large_image", title: "Owner Reporting | Ondo", description: "Real-time financial and maintenance reporting for Utah rental owners." },
}

const features = [
  { title: "Monthly Statements", description: "Detailed income and expense statements delivered by the 10th — rent collected, vendor invoices, management fees, net disbursement", icon: <FileText className="h-6 w-6" /> },
  { title: "NOI Tracking", description: "Gross rent, vacancy, operating expenses, and net operating income tracked monthly with year-over-year comparison", icon: <BarChart3 className="h-6 w-6" /> },
  { title: "Disbursement History", description: "Every owner distribution logged with bank reference — downloadable for tax preparation or lender review", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Document Vault", description: "Leases, inspection reports, invoices, and notices stored and searchable — access any document in seconds", icon: <FolderOpen className="h-6 w-6" /> },
]

export default function OwnerReportingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Owner Reporting | Property Management Utah"
        description="Monthly statements, NOI tracking, and document vault for Utah rental owners."
        pathname="/property-management/owner-reporting"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Owner Reporting", url: `${SITE_URL}/property-management/owner-reporting` },
        ])}
      />
      <PageBanner title="Owner Reporting" subtitle="Complete financial visibility for your Utah rental portfolio — real-time, no spreadsheets" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Know Your Numbers, Always</h2>
              <p className="text-lg text-foreground/70">
                Most property management firms send a PDF statement once a month. We give you a live dashboard with every transaction, every document, and every maintenance event — accessible any time from any device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{f.icon}</div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">What You See in the Portal</h3>
              <ul className="space-y-3 text-foreground/70">
                <li>• <strong>Portfolio summary</strong> — total units, occupied vs vacant, total monthly rent roll, and aggregate NOI</li>
                <li>• <strong>Per-property drill-down</strong> — tenant info, lease dates, last payment, open maintenance items</li>
                <li>• <strong>Maintenance log</strong> — every request from open to closed with vendor, cost, and completion date</li>
                <li>• <strong>Year-end packet</strong> — 1099 preparation, full-year income/expense summary, and all invoices in one download</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/property-management">Full PM Services</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={APP_PORTAL_URL}>Owner Portal</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 14: Resources Templates page

**Files:**
- Create: `app/resources/templates/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ClipboardCheck, Wrench, BookOpen } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Utah Real Estate Templates | Lease, Checklist & Playbooks | Ondo",
  description: "Free Utah real estate templates: residential lease agreement, move-in checklist, maintenance request form, and landlord onboarding playbook. Request or download.",
  alternates: { canonical: `${SITE_URL}/resources/templates/` },
  openGraph: { title: "Utah Real Estate Templates | Ondo Real Estate", description: "Free Utah lease, checklist, and landlord templates." },
  twitter: { card: "summary_large_image", title: "Real Estate Templates | Ondo", description: "Free Utah real estate templates for landlords and owners." },
}

const templates = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Residential Lease Agreement",
    description: "Utah-compliant residential lease covering rent terms, security deposit, maintenance responsibilities, entry notice requirements, and lease renewal. Updated for current Utah Code § 57-22 Fit Premises requirements.",
    items: ["Month-to-month and fixed-term versions", "Utility and HOA addendum", "Pet addendum with deposit schedule", "Lead paint disclosure (pre-1978 homes)"],
    cta: "Request via Contact",
    href: "/contact",
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "Move-In / Move-Out Checklist",
    description: "Room-by-room condition checklist with space for photos and signatures. Designed to document pre-existing conditions at move-in and compare at move-out — protecting both landlord and tenant.",
    items: ["Every room with condition fields", "Appliance inventory section", "Photo log with timestamp fields", "Dual signature with date"],
    cta: "Download PDF",
    href: "/contact",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Maintenance Request Form",
    description: "Tenant-facing maintenance request template with urgency tiering (routine / urgent / emergency), description fields, and photo attachment guidance. The same workflow used in the Ondo owner portal.",
    items: ["Urgency classification (3 tiers)", "Problem description with photos", "Access permission fields", "Tenant acknowledgement section"],
    cta: "Used in Owner Portal",
    href: "/property-management/maintenance-coordination",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Landlord Onboarding Playbook",
    description: "A first-90-days checklist for new rental property owners. Covers insurance review, utility setup, lease execution, tenant communication protocols, maintenance system setup, and first-month reconciliation.",
    items: ["Pre-possession 30-point checklist", "Insurance and utility transfer guide", "Lease signing and deposit collection", "Month 1–3 milestone calendar"],
    cta: "Request via Contact",
    href: "/contact",
  },
]

export default function ResourcesTemplatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Real Estate Templates"
        description="Free Utah real estate templates: lease, move-in checklist, maintenance form, and landlord playbook."
        pathname="/resources/templates"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Resources", url: `${SITE_URL}/resources` },
          { name: "Templates", url: `${SITE_URL}/resources/templates` },
        ])}
      />
      <PageBanner title="Real Estate Templates" subtitle="Utah-specific forms, checklists, and playbooks for landlords and owners" backgroundImage="/modern-apartment-balcony.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Generic templates from other states can create compliance gaps in Utah. These documents are built for Utah landlord-tenant law, referencing current Utah Code requirements, and are used by our property management team every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {templates.map((t, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{t.icon}</div>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-4 flex-1">
                    <ul className="space-y-1 text-sm text-foreground/70 mb-6">
                      {t.items.map((item, j) => <li key={j}>✓ {item}</li>)}
                    </ul>
                    <Button asChild variant="outline" size="sm">
                      <Link href={t.href}>{t.cta}</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center bg-muted rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Need Something Specific?</h3>
              <p className="text-foreground/70 mb-6">Our team can provide custom addenda, HOA-specific lease clauses, or multi-unit lease packages.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/contact">Contact Our Team</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/resources">All Resources</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 15: Case Studies page

**Files:**
- Create: `app/about/case-studies/page.tsx`

- [ ] Create the file:

```tsx
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Case Studies | Utah Real Estate | Ondo Real Estate",
  description: "Real results from Utah owners, buyers, and investors who work with Ondo: reduced vacancy, faster closings, jumbo refinances, and fractional investment outcomes.",
  alternates: { canonical: `${SITE_URL}/about/case-studies/` },
  openGraph: { title: "Client Case Studies | Ondo Real Estate", description: "Real results from Utah owners, buyers, and investors working with Ondo." },
  twitter: { card: "summary_large_image", title: "Case Studies | Ondo Real Estate", description: "Real results from Utah real estate clients working with Ondo." },
}

const stories = [
  {
    id: "salt-lake-vacancy",
    headline: "Salt Lake Owner Cuts Vacancy From 45 to 12 Days",
    description: "A Salt Lake City landlord with three single-family rentals was averaging 45 days of vacancy between tenants. After switching to Ondo full-service management with proactive lease renewal outreach and systematic tenant screening, average vacancy dropped to 12 days over the following 12 months.",
    type: "Single-Family Rentals",
    location: "Salt Lake City, UT",
    challenge: "High vacancy and inconsistent tenant quality driving turnover costs",
    solution: "Full-service property management, tenant screening, and renewal automation",
    outcomes: ["Vacancy: 45 days → 12 days average", "Turnover costs down 60%", "On-time rent payments: 94% vs 71% prior"],
    datePublished: "2025-09-15",
  },
  {
    id: "lehi-fha-buyer",
    headline: "First-Time Buyer in Lehi Closes with FHA + DPA, $0 Over Asking",
    description: "A first-time buyer in Lehi qualified for an FHA loan paired with the Utah Housing Corporation FirstHome DPA program, covering the full down payment. Strategic offer structuring — flexible close date and escalation clause — won the home against three competing offers without going over asking price.",
    type: "Owner-Occupied Purchase",
    location: "Lehi, UT (Utah County)",
    challenge: "Limited down payment savings in a competitive multiple-offer market",
    solution: "FHA + UHC DPA combination, strategic offer structure",
    outcomes: ["Down payment gap closed via DPA program", "Accepted at list price vs 3 competing offers", "Closed in 28 days"],
    datePublished: "2025-07-20",
  },
  {
    id: "fractional-investor",
    headline: "Investor Accesses 7.2% Projected Yield via Fractional Deal",
    description: "An accredited investor wanted real estate exposure without the management burden of direct ownership. Through Ondo's investment platform, they participated in a sponsor-led multifamily syndication with a 7.2% projected cash-on-cash yield and full property management handled by the sponsor team.",
    type: "Fractional / Syndication",
    location: "Wasatch Front, UT",
    challenge: "Desired real estate cash flow without operational involvement",
    solution: "Fractional investment through vetted sponsor deal on Ondo platform",
    outcomes: ["7.2% projected cash-on-cash yield", "Diversified across asset class", "Zero management involvement required"],
    datePublished: "2025-05-10",
  },
  {
    id: "park-city-jumbo-refi",
    headline: "Park City Owner Saves $380/Month on Jumbo Refinance",
    description: "A Park City property owner held a jumbo mortgage at a rate originated during the 2022 spike. When rates moved, our team modelled the break-even and executed a jumbo refinance that reduced the monthly payment by $380 with a 19-month break-even on closing costs.",
    type: "Jumbo Refinance",
    location: "Park City, UT (Summit County)",
    challenge: "Above-market rate on existing jumbo loan; unclear if refinance economics made sense",
    solution: "Break-even analysis, jumbo refinance execution",
    outcomes: ["$380/month payment reduction", "19-month break-even on closing costs", "Rate locked in 2-week window"],
    datePublished: "2025-03-01",
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Client Case Studies"
        description="Real results from Utah owners, buyers, and investors who work with Ondo."
        pathname="/about/case-studies"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Case Studies", url: `${SITE_URL}/about/case-studies` },
        ])}
      />

      {stories.map((s) => (
        <script
          key={s.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": s.headline,
              "description": s.description,
              "datePublished": s.datePublished,
              "author": { "@type": "Organization", "name": "Ondo Real Estate" },
            }),
          }}
        />
      ))}

      <PageBanner title="Client Case Studies" subtitle="Real outcomes from Utah owners, buyers, and investors" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-8 mb-12">
              {stories.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{s.type}</span>
                      <span className="text-xs bg-muted text-foreground/70 px-2 py-1 rounded">{s.location}</span>
                    </div>
                    <CardTitle className="text-xl">{s.headline}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-6">{s.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-1">Challenge</p>
                        <p className="text-foreground/70">{s.challenge}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-1">Solution</p>
                        <p className="text-foreground/70">{s.solution}</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-2">Outcomes</p>
                        <ul className="space-y-1 text-foreground/70">
                          {s.outcomes.map((o, i) => <li key={i}>• {o}</li>)}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center bg-muted rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Write Your Own Story?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/contact">Talk to Our Team</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/about/testimonials">Read Testimonials</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

---

## Task 16: Update site-index.ts (9 new entries)

**Files:**
- Modify: `lib/site-index.ts`

- [ ] Add 4 loan entries to the `buy-finance` section (after the `conventional` entry):

```ts
{ name: "FHA loans", href: "/loans/fha", description: "3.5% down with 580+ FICO; government-backed flexibility for first-time buyers." },
{ name: "VA loans", href: "/loans/va", description: "Zero down, no PMI for eligible Utah veterans and active-duty service members." },
{ name: "USDA rural loans", href: "/loans/usda", description: "Zero down for eligible rural Utah areas including Cache Valley and Sanpete." },
{ name: "Jumbo loans", href: "/loans/jumbo", description: "Financing above $766,550 for Park City, Draper, and other high-value Utah markets." },
```

- [ ] Add 4 entries to the `rent-manage` section (after the `property-management` entry):

```ts
{ name: "Tenant screening", href: "/property-management/tenant-screening", description: "Credit, criminal, eviction, and income checks — Fair Housing compliant." },
{ name: "Maintenance coordination", href: "/property-management/maintenance-coordination", description: "Request intake, vendor dispatch, and completion tracking for Utah rentals." },
{ name: "Owner reporting", href: "/property-management/owner-reporting", description: "Monthly statements, NOI tracking, and document vault in the owner portal." },
{ name: "Real estate templates", href: "/resources/templates", description: "Utah lease, move-in checklist, maintenance form, and landlord playbook." },
```

- [ ] Add 1 entry to the `about` section (after the `testimonials` entry):

```ts
{ name: "Case studies", href: "/about/case-studies", description: "Owner, buyer, and investor outcomes — vacancy reduction, FHA closings, jumbo refi." },
```

- [ ] Verify all new paths appear in `/sitemap` (HTML sitemap page) after `pnpm dev`.

---

## Verification Checklist

- [ ] `pnpm build` completes with no errors and no duplicate static param warnings
- [ ] All 14 new routes return 200 (not 404) in development
- [ ] `/sitemap` HTML page shows all 9 new site-index entries
- [ ] `/llms.txt` includes new paths (visible at localhost:3000/llms.txt)
- [ ] Each blog post page shows the correct `<title>` tag (check via browser dev tools → head)
- [ ] Each loan page shows breadcrumb JSON-LD (check via browser dev tools → sources or Google Rich Results Test)
- [ ] Case studies page shows 4 Article JSON-LD script tags in page source
