# Site Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical, high, and medium priority issues from the comprehensive site review, plus suppress false-positive console warnings.

**Architecture:** Targeted, in-place edits to existing components — no new files needed. Issues span 7 files: `footer.tsx`, `app/properties/page-client.tsx`, `components/landing/testimonials-section.tsx`, `components/landing/social-proof-bar.tsx`, `components/landing/email-capture-section.tsx`, `components/landing-page.tsx`, and `lib/push-notifications.ts`.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Tailwind CSS, shadcn/ui.

---

## File Map

| File | Change |
|------|--------|
| `components/footer.tsx:470` | Remove "LLM brief" link |
| `app/properties/page-client.tsx:441-553` | Replace error + empty states with contact form + placeholder properties |
| `components/landing/testimonials-section.tsx:8-12` | Pick testimonials from varied cities (Lehi, Draper, Provo) |
| `components/landing/social-proof-bar.tsx:7-11` | Add "and growing" context to Properties stat |
| `components/landing/email-capture-section.tsx:30-33` | Add 4-bullet guide preview |
| `components/landing-page.tsx:29` | Change `CalendlyBookSection` to `variant="compact"` |
| `lib/push-notifications.ts:84` | Guard VAPID warn behind explicit check to avoid false positives |

---

## Task 1: Remove "LLM brief" from public footer

**Files:**
- Modify: `components/footer.tsx:470`

- [ ] **Step 1: Remove the LLM brief link**

Find this line in `components/footer.tsx`:
```tsx
<Link href="/llms.txt" className="hover:text-foreground">LLM brief</Link>
```
Delete it entirely (including any surrounding whitespace). The `llms.txt` file stays — it just shouldn't be in the public footer.

- [ ] **Step 2: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -5
```
Expected: no TypeScript errors.

---

## Task 2: Properties page — replace error/empty state with helpful fallback

The `/properties` page fails silently when `NEXT_PUBLIC_BACKEND_BASE_URL` is not set, showing "Properties are temporarily unavailable." Replace the error and empty-results states with a useful fallback: a contact capture + the same 3 sample properties already defined in `featured-properties-section.tsx`.

**Files:**
- Modify: `app/properties/page-client.tsx:440-553`

- [ ] **Step 1: Add sample properties constant near the top of the file**

Add after the imports (around line 40), before `export default function PropertiesClient()`:

```tsx
const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "sample-1",
    title: "Modern Downtown Apartment",
    address: "Salt Lake City, UT",
    addressParts: { city: "Salt Lake City", state: "UT", zipcode: "84101", country: "US" },
    price: 1850,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 900,
    type: "apartment",
    description: "Luxury apartment with balcony and city views, pet-friendly with modern amenities.",
    image: "/modern-apartment-balcony.webp",
    images: ["/modern-apartment-balcony.webp"],
    amenities: ["pet-friendly", "gym", "parking"],
    dateAdded: new Date("2026-01-15"),
    availability: "Immediate",
    leaseTerms: "12-month minimum",
  },
  {
    id: "sample-2",
    title: "Family Home with Garden",
    address: "Holladay, UT",
    addressParts: { city: "Holladay", state: "UT", zipcode: "84117", country: "US" },
    price: 2400,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1800,
    type: "house",
    description: "Spacious family home with fenced backyard, finished basement, and 2-car garage.",
    image: "/suburban-house-garden.webp",
    images: ["/suburban-house-garden.webp"],
    amenities: ["garage", "backyard", "basement"],
    dateAdded: new Date("2026-02-01"),
    availability: "Available in 30 days",
    leaseTerms: "12-month lease",
  },
  {
    id: "sample-3",
    title: "Modern Townhouse",
    address: "Midvale, UT",
    addressParts: { city: "Midvale", state: "UT", zipcode: "84047", country: "US" },
    price: 1650,
    bedrooms: 2,
    bathrooms: 1.5,
    sqft: 1100,
    type: "townhouse",
    description: "Contemporary townhouse with attached garage, open floor plan, and community pool access.",
    image: "/modern-townhouse-garage.webp",
    images: ["/modern-townhouse-garage.webp"],
    amenities: ["pool", "garage", "parking"],
    dateAdded: new Date("2026-01-20"),
    availability: "Immediate",
    leaseTerms: "6 or 12-month lease",
  },
]
```

- [ ] **Step 2: Replace the error state (lines ~441-466) with contact + sample properties**

Find the current error block starting at:
```tsx
) : error ? (
  <div className="flex flex-col items-center justify-center py-16">
```

Replace everything from `error ? (` down to the closing `) : properties.length > 0 ? (` with:

```tsx
) : error ? (
  <div>
    <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 px-5 py-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
      <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <div>
        <p className="font-semibold">Live listings temporarily unavailable</p>
        <p className="mt-0.5 text-amber-700 dark:text-amber-400">
          We&apos;re having trouble connecting to our listing database. The properties below are representative examples.{' '}
          <a href="/contact" className="underline hover:no-underline">Contact us</a> to ask about current availability.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_PROPERTIES.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={property.image || '/placeholder.svg'}
              alt={property.title}
              fill
              className="object-cover"
              loading="lazy"
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2 bg-primary text-foreground px-3 py-1 rounded-md font-medium">
              ${property.price.toLocaleString()}/mo
            </div>
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              Example listing
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
            <p className="text-foreground/70 text-sm mb-2">{property.address}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><Home className="h-4 w-4" aria-hidden="true" /> {property.bedrooms} Beds</span>
              <span className="flex items-center gap-1"><Building className="h-4 w-4" aria-hidden="true" /> {property.bathrooms} Baths</span>
              <span className="flex items-center gap-1"><Search className="h-4 w-4" aria-hidden="true" /> {property.sqft} sqft</span>
            </div>
            <Button asChild className="w-full mt-4">
              <a href="/contact">Inquire About Availability</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
```

- [ ] **Step 3: Replace empty-results state (lines ~525-554) with email capture**

Find the current "No properties found" block:
```tsx
) : (
  <div className="py-12 flex flex-col items-center">
    <div className="max-w-md w-full">
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-6 dark:bg-muted dark:border-border">
        <h3 className="text-lg font-semibold mb-4 dark:text-foreground">
          No properties found
        </h3>
```

Replace with:
```tsx
) : (
  <div className="py-12 flex flex-col items-center">
    <div className="max-w-md w-full">
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold mb-2">No properties match your filters</h3>
        <p className="text-foreground/70 mb-4 text-sm">
          Try widening your search, or get notified when new listings hit your area.
        </p>
        <Button
          onClick={() => {
            setFilters({
              priceRange: [500, 5000],
              bedrooms: 'any',
              bathrooms: 'any',
              propertyType: 'any',
              amenities: [],
            });
            setSearchQuery('');
          }}
          variant="outline"
          className="w-full mb-3"
        >
          Reset Filters
        </Button>
        <Button asChild className="w-full">
          <a href="/contact">Contact Us About Availability</a>
        </Button>
      </div>
    </div>
  </div>
```

- [ ] **Step 4: Verify the file compiles**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: no TypeScript errors.

---

## Task 3: Testimonials — use varied cities

**Files:**
- Modify: `components/landing/testimonials-section.tsx:8-12`

- [ ] **Step 1: Update the testimonial selection**

Find:
```tsx
const landingTestimonials = [
  testimonials.find((t) => t.role === "Tenant" && t.city === "Salt Lake City"),
  testimonials.find((t) => t.role === "Owner" && t.city === "Salt Lake City"),
  testimonials.find((t) => t.role === "Investor" && t.city === "Salt Lake City"),
].filter(Boolean)
```

Replace with:
```tsx
const landingTestimonials = [
  testimonials.find((t) => t.role === "Tenant" && t.city === "Lehi"),
  testimonials.find((t) => t.role === "Owner" && t.city === "Draper"),
  testimonials.find((t) => t.role === "Investor" && t.city === "Salt Lake City"),
].filter(Boolean)
```

Lehi has a Tenant (Priya S.) and Draper has an Owner (David K.) in the testimonials data — both are already in `lib/testimonials.ts`.

- [ ] **Step 2: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 4: Stats bar — add credibility context

**Files:**
- Modify: `components/landing/social-proof-bar.tsx:7-11`

- [ ] **Step 1: Update the stats data**

Find:
```tsx
const stats = [
  { icon: MapPin, value: 55, suffix: "+", label: "Utah cities served" },
  { icon: Building, value: 200, suffix: "+", label: "Properties managed" },
  { icon: Star, value: 4.9, suffix: "★", label: "Average client rating", decimals: 1 },
  { icon: Clock, value: 24, suffix: "/7", label: "Emergency maintenance response" },
]
```

Replace with:
```tsx
const stats = [
  { icon: MapPin, value: 55, suffix: "+", label: "Utah cities served" },
  { icon: Building, value: 200, suffix: "+", label: "Properties managed & growing" },
  { icon: Star, value: 4.9, suffix: "★", label: "Average client rating", decimals: 1 },
  { icon: Clock, value: 24, suffix: "/7", label: "Emergency maintenance response" },
]
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 5: Email capture section — add guide preview bullets

**Files:**
- Modify: `components/landing/email-capture-section.tsx:29-33`

- [ ] **Step 1: Add preview bullets below the description**

Find:
```tsx
          <p className="text-foreground/70 mb-6">
            Tenant screening, lease compliance, rent collection, maintenance — everything Utah owners
            need in one actionable PDF. Join our mailing list and get it instantly.
          </p>
```

Replace with:
```tsx
          <p className="text-foreground/70 mb-3">
            Join our mailing list and get this actionable PDF instantly.
          </p>
          <ul className="text-left text-sm text-foreground/70 mb-6 space-y-1.5 max-w-xs mx-auto">
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Utah tenant screening checklist &amp; red flags</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Lease compliance requirements specific to Utah law</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Rent collection &amp; late fee procedures</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Maintenance request response time standards</span>
            </li>
          </ul>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 6: Landing page Calendly — reduce height

The landing page `CalendlyBookSection` defaults to `variant="default"` which is `h-[700px]` — nearly a full viewport. Change to `compact` (`h-[480px]–520px`).

**Files:**
- Modify: `components/landing-page.tsx:29`

- [ ] **Step 1: Pass compact variant**

Find:
```tsx
      <CalendlyBookSection />
```

Replace with:
```tsx
      <CalendlyBookSection variant="compact" />
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 7: Suppress spurious VAPID push-notification console warning

Push notifications are disabled in `layout.tsx` (the import is commented out). However `lib/push-notifications.ts` still fires `console.warn` when `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is missing — even though push is explicitly disabled. Guard it so it only warns when push is actually being attempted.

**Files:**
- Modify: `lib/push-notifications.ts` (around line 84)

- [ ] **Step 1: Read the current warning block**

```bash
grep -n "VAPID_PUBLIC_KEY" /Users/pranay/Documents/RE/OndoREui/lib/push-notifications.ts
```

Note the exact line numbers, then find the block like:
```ts
if (!process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY']) {
  console.warn("[push-notifications] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set.")
```

- [ ] **Step 2: Add a guard to silence the warn when push hasn't been explicitly requested**

Wrap the warn so it only fires in development:
```ts
if (!process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY']) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("[push-notifications] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set — push notifications disabled.")
  }
```

Close the braces correctly. This keeps the warning useful locally without polluting production consoles.

- [ ] **Step 3: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 8: Suppress BACKEND_BASE_URL console warning in production

`lib/backend.ts:15` fires `console.warn('[OndoRE] NEXT_PUBLIC_BACKEND_BASE_URL is not set')` for all browser users on the deployed site when the env var isn't set. Gate it to development only.

**Files:**
- Modify: `lib/backend.ts:14-16`

- [ ] **Step 1: Read the current block**

```bash
grep -n "BACKEND_BASE_URL\|console.warn" /Users/pranay/Documents/RE/OndoREui/lib/backend.ts | head -5
```

Find the block:
```ts
if (typeof window !== 'undefined' && !BACKEND_BASE_URL) {
  console.warn('[OndoRE] NEXT_PUBLIC_BACKEND_BASE_URL is not set — API calls will use relative paths')
}
```

- [ ] **Step 2: Gate behind NODE_ENV check**

```ts
if (typeof window !== 'undefined' && !BACKEND_BASE_URL && process.env.NODE_ENV === 'development') {
  console.warn('[OndoRE] NEXT_PUBLIC_BACKEND_BASE_URL is not set — API calls will use relative paths')
}
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | tail -3
```

---

## Task 9: Properties page — suppress dev-only fetch error log

`page-client.tsx:127-129` logs fetch errors in development. This is already gated behind `NODE_ENV === 'development'`. No change needed — but verify the SAMPLE_PROPERTIES type aligns with the `Property` type from `@/app/types/property`.

- [ ] **Step 1: Check Property type shape**

```bash
grep -n "export.*type Property\|export.*interface Property" /Users/pranay/Documents/RE/OndoREui/app/types/property.ts
```

- [ ] **Step 2: Check if SAMPLE_PROPERTIES entries match required fields**

Read the first ~50 lines of `/Users/pranay/Documents/RE/OndoREui/app/types/property.ts` to verify field names match those used in Task 2's `SAMPLE_PROPERTIES` constant. Fix any mismatches (common ones: `image` vs `imageUrl`, optional vs required `addressParts`).

- [ ] **Step 3: Fix any type mismatches found in Step 2**

Adjust the SAMPLE_PROPERTIES constant to match the actual type definition.

- [ ] **Step 4: Verify build passes cleanly**

```bash
cd /Users/pranay/Documents/RE/OndoREui && npm run build 2>&1 | grep -c "error TS"
```
Expected: `0`

---

## Self-Review Checklist

- [x] **LLM brief removed** — Task 1 removes footer link
- [x] **Properties error state** — Task 2 shows sample cards + contact CTA instead of blank page
- [x] **Properties empty state** — Task 2 replaces with helpful message + contact CTA
- [x] **Testimonials city diversity** — Task 3 uses Lehi/Draper/SLC
- [x] **Stats credibility** — Task 4 adds "& growing" to properties stat
- [x] **Guide preview** — Task 5 adds 4 bullet points
- [x] **Calendly height** — Task 6 reduces from 700px to ~500px compact
- [x] **Console warn (VAPID)** — Task 7 gates to dev only
- [x] **Console warn (backend URL)** — Task 8 gates to dev only
- [x] **Type safety** — Task 9 validates SAMPLE_PROPERTIES against Property type

**Items from review NOT addressed in this plan (require design decisions or backend work):**
- Phone area code (408 vs Utah 801/385) — requires business decision + env var change
- Dark mode default — already correctly set to `defaultTheme="system"`, not hard-coded dark
- Solutions pages (landlords, property-managers) — both pages already exist and work
- Cities hover tooltip — already works in code (uses `hoveredCity` state + `setHoveredCity` on mouse events); if it appeared broken it was a display/timing issue not a code bug
- ZIP form validation — already fully implemented in `zip-service-selector.tsx` with rate limiting, Zod-style validation, and error feedback
- "Stop Claude" artifact — not present in codebase; likely a browser extension artifact
