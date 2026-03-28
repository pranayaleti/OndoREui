# Competitive Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the top competitive gaps identified in the competitive analysis: SEO structured data, canonical tag fixes, comparison landing pages, calculator lead capture, and tenant invite magic links in OndoREui.

**Architecture:** 4 independent workstreams that can be done in any order. All changes are in OndoREui (Next.js 15 static export). SEO work uses existing `lib/seo.ts` JSON-LD helpers and `<SEO>` component. Calculator lead capture uses a new client component with localStorage + optional backend POST. Comparison pages follow the existing `app/compare/page.tsx` pattern. Tenant invite wires OndoREui to the existing backend invite API.

**Tech Stack:** Next.js 15 (static export), TypeScript, Tailwind CSS, shadcn/ui, existing `lib/seo.ts` helpers, `lib/api/http.ts` for API calls.

---

## File Structure

### SEO Fixes
- Modify: `app/compare/page.tsx` — add canonical + JSON-LD
- Modify: `app/calculators/page.tsx` — fix trailing slash on canonical
- Modify: `app/pricing/page.tsx` — fix trailing slash on canonical
- Modify: `app/contact/page.tsx` — fix trailing slash on canonical

### Comparison Landing Pages
- Create: `app/vs/turbotenant/page.tsx` — dedicated TurboTenant comparison
- Create: `app/vs/buildium/page.tsx` — dedicated Buildium comparison
- Create: `app/vs/layout.tsx` — shared layout/metadata for /vs/* pages

### Calculator Lead Capture
- Create: `components/calculators/lead-capture-modal.tsx` — email capture dialog
- Create: `lib/api/leads.ts` — lead submission API helper
- Modify: `pages/calculators/mortgage-payment-calculator.tsx` — integrate lead capture (template for others)

### Tenant Invite Magic Links (OndoREui)
- Create: `app/invite/[token]/page.tsx` — server component for invite landing
- Create: `app/invite/[token]/invite-page-client.tsx` — client component for invite flow
- Create: `lib/api/invitations.ts` — invitation API helpers

---

## Task 1: Fix Canonical Tag Inconsistencies

**Files:**
- Modify: `app/compare/page.tsx:8-11`
- Modify: `app/calculators/page.tsx` (canonical line)
- Modify: `app/pricing/page.tsx` (canonical line)
- Modify: `app/contact/page.tsx` (canonical line)

- [ ] **Step 1: Fix compare page — add canonical and JSON-LD**

In `app/compare/page.tsx`, update the metadata export to include canonical and add SEO component import:

```tsx
// At top, add imports:
import { SITE_URL, SITE_BRAND_SHORT } from "@/lib/site"
import SEO from "@/components/seo"

export const metadata: Metadata = {
  title: `Compare Property Management Software | ${SITE_BRAND_SHORT}`,
  description: `See how ${SITE_BRAND_SHORT} compares to Buildium, AppFolio, TurboTenant, and RentRedi. Utah-local expertise, AI-powered risk scoring, and full-service property management.`,
  alternates: {
    canonical: `${SITE_URL}/compare/`,
  },
}
```

Then inside the `ComparePage` component, add `<SEO>` as the first child of `<main>`:

```tsx
<SEO
  title="Compare Property Management Software"
  description={`See how ${SITE_BRAND_SHORT} compares to Buildium, AppFolio, TurboTenant, and RentRedi.`}
  pathname="/compare/"
/>
```

- [ ] **Step 2: Fix calculators page canonical trailing slash**

In `app/calculators/page.tsx`, find the canonical line and ensure it ends with `/`:

```tsx
canonical: `${SITE_URL}/calculators/`,
```

- [ ] **Step 3: Fix pricing page canonical trailing slash**

In `app/pricing/page.tsx`, find the canonical line and ensure it ends with `/`:

```tsx
canonical: `${SITE_URL}/pricing/`,
```

- [ ] **Step 4: Fix contact page canonical trailing slash**

In `app/contact/page.tsx`, find the canonical line and ensure it ends with `/`:

```tsx
canonical: `${SITE_URL}/contact/`,
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add app/compare/page.tsx app/calculators/page.tsx app/pricing/page.tsx app/contact/page.tsx
git commit -m "fix(seo): add canonical to compare page, fix trailing slashes on calculator/pricing/contact canonicals"
```

---

## Task 2: Create /vs/turbotenant Comparison Page

**Files:**
- Create: `app/vs/turbotenant/page.tsx`

- [ ] **Step 1: Create the TurboTenant comparison page**

Create `app/vs/turbotenant/page.tsx`:

```tsx
import type { Metadata } from "next"
import { Check, X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: `${SITE_BRAND_SHORT} vs TurboTenant — Honest Comparison (2026)`,
  description: `Compare ${SITE_BRAND_SHORT} and TurboTenant side by side. See why property owners who need more than basic landlord tools choose Ondo RE for full-lifecycle real estate management.`,
  alternates: {
    canonical: `${SITE_URL}/vs/turbotenant/`,
  },
  openGraph: {
    title: `${SITE_BRAND_SHORT} vs TurboTenant — Which Is Better for You?`,
    description: `Side-by-side feature comparison for landlords, investors, and property managers.`,
  },
}

type ComparisonRow = {
  feature: string
  ondo: boolean | string
  competitor: boolean | string
  category: string
}

const rows: ComparisonRow[] = [
  // Core
  { feature: "Owner portal", ondo: true, competitor: true, category: "Core Platform" },
  { feature: "Tenant portal (full)", ondo: true, competitor: "Basic", category: "Core Platform" },
  { feature: "PWA with offline support", ondo: true, competitor: false, category: "Core Platform" },
  { feature: "Multi-role auth (6 roles)", ondo: true, competitor: "2 roles", category: "Core Platform" },
  // Payments
  { feature: "Online rent collection", ondo: true, competitor: true, category: "Payments" },
  { feature: "Late fee automation", ondo: true, competitor: true, category: "Payments" },
  { feature: "Owner disbursements", ondo: true, competitor: false, category: "Payments" },
  { feature: "Mortgage & investment calculators", ondo: "10 built-in", competitor: false, category: "Payments" },
  { feature: "Crypto/alt payment support", ondo: "Planned", competitor: false, category: "Payments" },
  // Screening
  { feature: "Tenant screening", ondo: true, competitor: true, category: "Screening & Leasing" },
  { feature: "E-signatures", ondo: true, competitor: "$59/lease", category: "Screening & Leasing" },
  { feature: "Credit building for tenants", ondo: "4 bureaus", competitor: true, category: "Screening & Leasing" },
  { feature: "Lease renewal automation", ondo: true, competitor: "Partial", category: "Screening & Leasing" },
  // Unique
  { feature: "RE agent / brokerage tools", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Loan officer integration", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Notary services built-in", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "AI assistant (10 tools)", ondo: true, competitor: "Lease + listings only", category: "Unique to Ondo" },
  { feature: "At-risk tenant scoring (ML)", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Vendor management", ondo: true, competitor: "Basic", category: "Unique to Ondo" },
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-medium">{value}</span>
  return value
    ? <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
    : <X className="mx-auto h-5 w-5 text-foreground/30" />
}

export default function VsTurboTenantPage() {
  const categories = [...new Set(rows.map((r) => r.category))]

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={`${SITE_BRAND_SHORT} vs TurboTenant — Honest Comparison (2026)`}
        description="Compare Ondo RE and TurboTenant side by side."
        pathname="/vs/turbotenant/"
      />

      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {SITE_BRAND_SHORT} vs TurboTenant
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          TurboTenant is great for basic landlord tools. But if you&apos;re an investor, RE agent, or
          need a platform that works for <strong>both</strong> sides of the door — here&apos;s why
          owners switch to {SITE_BRAND_SHORT}.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Calculators", ondo: "10", tt: "0" },
          { label: "Auth roles", ondo: "6", tt: "2" },
          { label: "AI tools", ondo: "10", tt: "2" },
          { label: "Offline support", ondo: "Full PWA", tt: "None" },
        ].map((s) => (
          <Card key={s.label} className="border-foreground/10 text-center">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{s.label}</p>
              <p className="mt-1 text-lg font-bold text-primary">{s.ondo}</p>
              <p className="text-sm text-foreground/40">vs {s.tt}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="mb-16 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground/70">Feature</th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold bg-primary/5 text-primary dark:bg-primary/10">{SITE_BRAND_SHORT}</th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold text-foreground">TurboTenant</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={`cat-${cat}`}>
                  <td colSpan={3} className="px-4 pt-6 pb-2 text-xs font-bold uppercase tracking-wider text-primary">{cat}</td>
                </tr>
                {rows.filter((r) => r.category === cat).map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "" : "bg-foreground/[0.02] dark:bg-foreground/[0.03]"}>
                    <td className="border-b border-foreground/5 px-4 py-3 font-medium text-foreground">{row.feature}</td>
                    <td className="border-b border-foreground/5 px-4 py-3 text-center bg-primary/5 dark:bg-primary/10"><CellValue value={row.ondo} /></td>
                    <td className="border-b border-foreground/5 px-4 py-3 text-center"><CellValue value={row.competitor} /></td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </section>

      {/* Why Switch */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">When {SITE_BRAND_SHORT} is the better choice</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { title: "You're a RE agent who also manages rentals", desc: "No other platform combines property search, financing, and management. TurboTenant is landlord-only — Ondo serves your full workflow." },
            { title: "You want a platform that tenants actually like", desc: "TurboTenant treats tenants as applicants. Ondo gives them a full portal: maintenance requests, messaging, documents, credit building, and rent payment tracking." },
            { title: "You need offline reliability", desc: "Ondo is a full PWA with IndexedDB queuing and background sync. TurboTenant requires constant connectivity. Try managing a property showing with spotty signal." },
            { title: "You're growing past 10 units", desc: "TurboTenant's bulk actions are limited. Ondo supports multi-role auth, vendor management, owner disbursements, and reporting that scales with your portfolio." },
          ].map((d) => (
            <Card key={d.title} className="border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{d.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{d.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* When TurboTenant wins (honesty builds trust) */}
      <section className="mb-16 rounded-xl border border-foreground/10 p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">When TurboTenant might be better</h2>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li>You have 1-3 units and want the absolute simplest free tool with no learning curve.</li>
          <li>You need state-specific lease templates today (Ondo is building this).</li>
          <li>You prefer native iOS/Android apps over a PWA.</li>
        </ul>
        <p className="mt-4 text-sm text-foreground/50">We believe in honest comparisons. Choose the tool that fits your needs.</p>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center dark:bg-[var(--gradient-overlay)]">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to try {SITE_BRAND_SHORT}?</h2>
        <p className="mb-6 text-foreground/70">See what full-lifecycle property management looks like.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild><Link href="/pricing">See pricing</Link></Button>
          <Button variant="outline" asChild><Link href="/contact/#book-a-call">Book a call</Link></Button>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds, `/vs/turbotenant` page is generated.

- [ ] **Step 3: Commit**

```bash
git add app/vs/turbotenant/page.tsx
git commit -m "feat(seo): add /vs/turbotenant comparison landing page"
```

---

## Task 3: Create /vs/buildium Comparison Page

**Files:**
- Create: `app/vs/buildium/page.tsx`

- [ ] **Step 1: Create the Buildium comparison page**

Create `app/vs/buildium/page.tsx`:

```tsx
import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: `${SITE_BRAND_SHORT} vs Buildium — Honest Comparison (2026)`,
  description: `Compare ${SITE_BRAND_SHORT} and Buildium side by side. Full-lifecycle real estate management vs enterprise PM software — see which fits your portfolio.`,
  alternates: {
    canonical: `${SITE_URL}/vs/buildium/`,
  },
  openGraph: {
    title: `${SITE_BRAND_SHORT} vs Buildium — Which Is Better for You?`,
    description: `Feature comparison for property managers and investors choosing between Ondo RE and Buildium.`,
  },
}

type ComparisonRow = {
  feature: string
  ondo: boolean | string
  competitor: boolean | string
  category: string
}

const rows: ComparisonRow[] = [
  { feature: "Owner portal", ondo: true, competitor: true, category: "Core Platform" },
  { feature: "Tenant portal", ondo: "Full portal", competitor: "Resident Center", category: "Core Platform" },
  { feature: "PWA with offline support", ondo: true, competitor: false, category: "Core Platform" },
  { feature: "White-label branding", ondo: false, competitor: true, category: "Core Platform" },
  { feature: "Starting price", ondo: "Contact us", competitor: "$62/mo", category: "Core Platform" },
  { feature: "Online rent collection", ondo: true, competitor: true, category: "Payments & Financials" },
  { feature: "Full GL accounting", ondo: "Basic", competitor: true, category: "Payments & Financials" },
  { feature: "Owner disbursements", ondo: true, competitor: true, category: "Payments & Financials" },
  { feature: "1099 generation", ondo: true, competitor: true, category: "Payments & Financials" },
  { feature: "Mortgage & investment calculators", ondo: "10 built-in", competitor: false, category: "Payments & Financials" },
  { feature: "Tenant screening", ondo: true, competitor: true, category: "Screening & Leasing" },
  { feature: "State-specific lease templates", ondo: false, competitor: true, category: "Screening & Leasing" },
  { feature: "E-signatures", ondo: true, competitor: "Dropbox Sign", category: "Screening & Leasing" },
  { feature: "Lease renewal automation", ondo: true, competitor: true, category: "Screening & Leasing" },
  { feature: "RE agent / brokerage tools", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Loan officer integration", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Notary services built-in", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "AI assistant (10 tools)", ondo: true, competitor: "2026 roadmap", category: "Unique to Ondo" },
  { feature: "At-risk tenant scoring (ML)", ondo: true, competitor: false, category: "Unique to Ondo" },
  { feature: "Credit building for tenants", ondo: "4 bureaus", competitor: false, category: "Unique to Ondo" },
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-medium">{value}</span>
  return value
    ? <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
    : <X className="mx-auto h-5 w-5 text-foreground/30" />
}

export default function VsBuildiumPage() {
  const categories = [...new Set(rows.map((r) => r.category))]

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={`${SITE_BRAND_SHORT} vs Buildium — Honest Comparison (2026)`}
        description="Compare Ondo RE and Buildium side by side."
        pathname="/vs/buildium/"
      />

      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {SITE_BRAND_SHORT} vs Buildium
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          Buildium is built for established PM firms with 50+ units. {SITE_BRAND_SHORT} serves
          the full real estate lifecycle — from finding properties to financing them to managing
          them. Here&apos;s how they compare.
        </p>
      </section>

      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Starting price", ondo: "Contact us", bd: "$62/mo" },
          { label: "Calculators", ondo: "10", bd: "0" },
          { label: "Phone support", ondo: "All tiers", bd: "$192+/mo" },
          { label: "Offline support", ondo: "Full PWA", bd: "None" },
        ].map((s) => (
          <Card key={s.label} className="border-foreground/10 text-center">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{s.label}</p>
              <p className="mt-1 text-lg font-bold text-primary">{s.ondo}</p>
              <p className="text-sm text-foreground/40">vs {s.bd}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-16 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground/70">Feature</th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold bg-primary/5 text-primary dark:bg-primary/10">{SITE_BRAND_SHORT}</th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold text-foreground">Buildium</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={`cat-${cat}`}>
                  <td colSpan={3} className="px-4 pt-6 pb-2 text-xs font-bold uppercase tracking-wider text-primary">{cat}</td>
                </tr>
                {rows.filter((r) => r.category === cat).map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "" : "bg-foreground/[0.02] dark:bg-foreground/[0.03]"}>
                    <td className="border-b border-foreground/5 px-4 py-3 font-medium text-foreground">{row.feature}</td>
                    <td className="border-b border-foreground/5 px-4 py-3 text-center bg-primary/5 dark:bg-primary/10"><CellValue value={row.ondo} /></td>
                    <td className="border-b border-foreground/5 px-4 py-3 text-center"><CellValue value={row.competitor} /></td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">When {SITE_BRAND_SHORT} is the better choice</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { title: "You don't want to pay $62/mo before you start", desc: "Buildium's Essential plan starts at $62/mo with limited support. Ondo offers flexible pricing and support at every tier." },
            { title: "You're an investor who also buys/sells", desc: "Buildium is PM-only. Ondo integrates brokerage, loan officer, and notary services — the full lifecycle under one roof." },
            { title: "You care about your tenants' experience", desc: "Buildium's Resident Center is functional but tenant-advocacy isn't in their DNA. Ondo builds for both sides of the lease." },
            { title: "You need AI that's ready today", desc: "Buildium's AI is on their 2026 roadmap. Ondo's 10-tool Claude assistant is live now — risk scoring, vendor suggestions, portfolio analysis." },
          ].map((d) => (
            <Card key={d.title} className="border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{d.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{d.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16 rounded-xl border border-foreground/10 p-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">When Buildium might be better</h2>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li>You manage 50+ units and need full general ledger accounting with journal entries.</li>
          <li>You need white-label branding for your PM firm.</li>
          <li>You need state-specific lease templates across multiple states today.</li>
        </ul>
        <p className="mt-4 text-sm text-foreground/50">We believe in honest comparisons. Choose the tool that fits your needs.</p>
      </section>

      <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center dark:bg-[var(--gradient-overlay)]">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to try {SITE_BRAND_SHORT}?</h2>
        <p className="mb-6 text-foreground/70">Full-lifecycle property management without the enterprise price tag.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild><Link href="/pricing">See pricing</Link></Button>
          <Button variant="outline" asChild><Link href="/contact/#book-a-call">Book a call</Link></Button>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds, `/vs/buildium` page is generated.

- [ ] **Step 3: Commit**

```bash
git add app/vs/buildium/page.tsx
git commit -m "feat(seo): add /vs/buildium comparison landing page"
```

---

## Task 4: Calculator Lead Capture Modal

**Files:**
- Create: `components/calculators/lead-capture-modal.tsx`
- Create: `lib/api/leads.ts`

- [ ] **Step 1: Create lead submission API helper**

Create `lib/api/leads.ts`:

```tsx
import { postJson } from "@/lib/api/http"

export interface LeadCapturePayload {
  email: string
  source: string // e.g. "calculator:mortgage-payment"
  calculatorSlug?: string
}

export interface LeadCaptureResponse {
  success: boolean
}

const LEAD_STORAGE_KEY = "ondo_lead_captured"

/** Check if user already provided email in this browser. */
export function hasLeadBeenCaptured(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(LEAD_STORAGE_KEY) === "true"
}

/** Mark lead as captured so we don't ask again. */
export function markLeadCaptured(email: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LEAD_STORAGE_KEY, "true")
  localStorage.setItem("ondo_lead_email", email)
}

/** Submit lead to backend. Falls back silently on error — the email is still saved locally. */
export async function submitLead(payload: LeadCapturePayload): Promise<boolean> {
  try {
    const res = await postJson<LeadCaptureResponse, LeadCapturePayload>("/api/leads/capture", payload)
    return res?.success ?? false
  } catch {
    // Backend may not have this endpoint yet — that's OK.
    // Lead is saved in localStorage regardless.
    return false
  }
}
```

- [ ] **Step 2: Create the lead capture modal component**

Create `components/calculators/lead-capture-modal.tsx`:

```tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { hasLeadBeenCaptured, markLeadCaptured, submitLead } from "@/lib/api/leads"

interface LeadCaptureModalProps {
  /** Calculator slug, e.g. "mortgage-payment" */
  calculatorSlug: string
  /** Calculator display name, e.g. "Mortgage Payment" */
  calculatorName: string
  /** Whether the user has completed a calculation (triggers the modal). */
  hasCalculated: boolean
}

export function LeadCaptureModal({ calculatorSlug, calculatorName, hasCalculated }: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hasCalculated && !hasLeadBeenCaptured()) {
      // Small delay so results render first
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [hasCalculated])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    markLeadCaptured(email)
    await submitLead({ email, source: `calculator:${calculatorSlug}`, calculatorSlug })
    setSubmitted(true)
    setLoading(false)
    setTimeout(() => setOpen(false), 1500)
  }, [email, calculatorSlug])

  const handleSkip = useCallback(() => {
    setOpen(false)
  }, [])

  if (hasLeadBeenCaptured()) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitted ? "You're all set!" : "Save your results"}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "Check your inbox for a copy of your calculation."
              : `Enter your email to save your ${calculatorName} calculation and get personalized insights from our loan officers.`}
          </DialogDescription>
        </DialogHeader>

        {!submitted && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Email me my results"}
            </Button>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              No thanks, just show results
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/calculators/lead-capture-modal.tsx lib/api/leads.ts
git commit -m "feat: add calculator lead capture modal and leads API helper"
```

---

## Task 5: Integrate Lead Capture into Mortgage Calculator (Template)

**Files:**
- Modify: `pages/calculators/mortgage-payment-calculator.tsx`

This task shows the integration pattern. The same pattern should be repeated for all 16 other calculators.

- [ ] **Step 1: Read the mortgage calculator to find where results render**

Run: Read `pages/calculators/mortgage-payment-calculator.tsx` and identify:
1. The component name
2. The state variable that holds calculation results (e.g. `results`, `monthlyPayment`, etc.)
3. Where results are rendered

- [ ] **Step 2: Add the LeadCaptureModal import and integrate**

At the top of the file, add:
```tsx
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
```

Inside the component, add a `hasCalculated` state tracker. Find the calculate handler function and set it to true when results are computed:
```tsx
const [hasCalculated, setHasCalculated] = useState(false)

// In the existing calculate handler, after setting results:
setHasCalculated(true)
```

At the bottom of the component's JSX (before the closing tag), add:
```tsx
<LeadCaptureModal
  calculatorSlug="mortgage-payment"
  calculatorName="Mortgage Payment"
  hasCalculated={hasCalculated}
/>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add pages/calculators/mortgage-payment-calculator.tsx
git commit -m "feat: integrate lead capture modal into mortgage payment calculator"
```

- [ ] **Step 5: Repeat for remaining calculators**

Apply the same 3-line integration (import, state, component) to each of these files in `pages/calculators/`:
- `affordability-calculator.tsx` (slug: "affordability", name: "Affordability")
- `income-calculator.tsx` (slug: "income", name: "Income")
- `closing-cost-calculator.tsx` (slug: "closing-cost", name: "Closing Cost")
- `refinance-calculator.tsx` (slug: "refinance", name: "Refinance")
- `home-sale-calculator.tsx` (slug: "home-sale", name: "Home Sale")
- `buying-power-calculator.tsx` (slug: "buying-power", name: "Buying Power")
- `temporary-buydown-calculator.tsx` (slug: "temporary-buydown", name: "Temporary Buydown")
- `rent-vs-own-calculator.tsx` (slug: "rent-vs-own", name: "Rent vs Own")
- `retirement-calculator.tsx` (slug: "retirement", name: "Retirement")
- `cash-on-cash-calculator.tsx` (slug: "cash-on-cash", name: "Cash on Cash")
- `cap-rate-calculator.tsx` (slug: "cap-rate", name: "Cap Rate")
- `roi-calculator.tsx` (slug: "roi", name: "ROI")
- `grm-calculator.tsx` (slug: "grm", name: "GRM")
- `dscr-calculator.tsx` (slug: "dscr", name: "DSCR")
- `one-percent-rule-calculator.tsx` (slug: "one-percent-rule", name: "1% Rule")
- `fifty-percent-rule-calculator.tsx` (slug: "fifty-percent-rule", name: "50% Rule")

Each integration is identical: import, add `hasCalculated` state + setter in calculate handler, add `<LeadCaptureModal>` at bottom of JSX.

- [ ] **Step 6: Commit all remaining calculators**

```bash
git add pages/calculators/
git commit -m "feat: add lead capture modal to all 17 calculators"
```

---

## Task 6: Tenant Invite Magic Link — API Helpers

**Files:**
- Create: `lib/api/invitations.ts`

The backend already has:
- `POST /api/invite` — creates invitation, sends email (requires auth)
- `GET /api/invitation/:token` — validates token, returns `{ email, role, expiresAt }`

- [ ] **Step 1: Create invitation API helpers**

Create `lib/api/invitations.ts`:

```tsx
import { networkFirstGet, postJson } from "@/lib/api/http"

export interface InvitationDetails {
  email: string
  role: string
  expiresAt: string
  propertyTitle?: string
  unitNumber?: string
}

export interface InvitationValidationResponse {
  success: boolean
  invitation: InvitationDetails
}

/** Validate an invitation token. Called on the invite landing page. */
export async function validateInviteToken(token: string): Promise<InvitationDetails | null> {
  try {
    const res = await networkFirstGet<InvitationValidationResponse>(
      `/api/invitation/${token}`,
      `invite-${token}`
    )
    return res?.invitation ?? null
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/api/invitations.ts
git commit -m "feat: add invitation validation API helper for magic links"
```

---

## Task 7: Tenant Invite Magic Link — Landing Page

**Files:**
- Create: `app/invite/[token]/page.tsx`
- Create: `app/invite/[token]/invite-page-client.tsx`

- [ ] **Step 1: Create the server component**

Create `app/invite/[token]/page.tsx`:

```tsx
import InvitePageClient from "./invite-page-client"

export function generateStaticParams() {
  // Placeholder for static export — real tokens are dynamic
  return [{ token: "_" }]
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <InvitePageClient token={token} />
}
```

- [ ] **Step 2: Create the client component**

Create `app/invite/[token]/invite-page-client.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-states"
import { validateInviteToken, type InvitationDetails } from "@/lib/api/invitations"
import { SITE_BRAND_SHORT } from "@/lib/site"
import Link from "next/link"

type PageState = "loading" | "valid" | "expired" | "error"

export default function InvitePageClient({ token }: { token: string }) {
  const [state, setState] = useState<PageState>("loading")
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)

  useEffect(() => {
    if (token === "_") {
      setState("error")
      return
    }

    validateInviteToken(token).then((result) => {
      if (result) {
        setInvitation(result)
        setState("valid")
      } else {
        setState("expired")
      }
    }).catch(() => setState("error"))
  }, [token])

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-foreground/70">Validating your invitation...</p>
        </div>
      </div>
    )
  }

  if (state === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-xl">Invitation Expired</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/70">
              This invitation link has expired or is no longer valid. Please ask your property
              manager to send a new invite.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Go to {SITE_BRAND_SHORT}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-xl">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/70">
              This invitation link is not valid. Please check the link and try again, or contact
              your property manager.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Go to {SITE_BRAND_SHORT}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Valid invitation
  const roleLabel = invitation?.role === "tenant" ? "tenant" : invitation?.role === "owner" ? "co-owner" : "user"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <CardTitle className="text-2xl">You&apos;re Invited!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-foreground/70">
              You&apos;ve been invited to join {SITE_BRAND_SHORT} as a <strong>{roleLabel}</strong>.
            </p>
            {invitation?.propertyTitle && (
              <p className="mt-2 text-sm text-foreground/50">
                Property: <strong className="text-foreground">{invitation.propertyTitle}</strong>
                {invitation.unitNumber && ` — Unit ${invitation.unitNumber}`}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-foreground/10 p-4 space-y-2 text-sm text-foreground/70">
            <p>By creating your account, you&apos;ll be able to:</p>
            <ul className="list-disc pl-5 space-y-1">
              {invitation?.role === "tenant" ? (
                <>
                  <li>Pay rent online with autopay</li>
                  <li>Submit and track maintenance requests</li>
                  <li>Message your property manager directly</li>
                  <li>Access your lease and documents</li>
                  <li>Build credit with on-time rent payments</li>
                </>
              ) : (
                <>
                  <li>View your property portfolio</li>
                  <li>Track rent payments and financials</li>
                  <li>Manage maintenance requests</li>
                  <li>Access documents and reports</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href={`/auth?invite=${token}&email=${encodeURIComponent(invitation?.email || "")}`}>
                Create your account
              </Link>
            </Button>
            <p className="text-center text-xs text-foreground/40">
              Already have an account?{" "}
              <Link href={`/auth?invite=${token}`} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/pranay/Documents/RE/OndoREui && npx next build 2>&1 | tail -20`
Expected: Build succeeds, `/invite/[token]` page is generated.

- [ ] **Step 4: Commit**

```bash
git add app/invite/
git commit -m "feat: add tenant invite magic link landing page"
```

---

## Summary

| Task | What it does | Files |
|------|-------------|-------|
| 1 | Fix canonical tag inconsistencies | 4 modified |
| 2 | /vs/turbotenant comparison page | 1 created |
| 3 | /vs/buildium comparison page | 1 created |
| 4 | Calculator lead capture modal + API | 2 created |
| 5 | Integrate lead capture into all 17 calculators | 17 modified |
| 6 | Invitation API helpers | 1 created |
| 7 | Tenant invite magic link landing page | 2 created |
