import {
  FEE_COMPARISON_AS_OF,
  GROWTH_MGMT_RATE,
  GROWTH_MIN_UNITS,
  LEASING_FEE_RATE,
  PORTFOLIO_MIN_UNITS,
  STARTER_MAX_UNITS,
  STARTER_MGMT_RATE,
} from "./fee-comparison"

/**
 * Data for /vs/buildium/ and /vs/turbotenant/.
 *
 * Rules for this module:
 * - Ondo's price is always built from lib/fee-comparison.ts, the same constants
 *   /pricing/ uses. Never type a fee here.
 * - Ondo is a full-service management company. Buildium and TurboTenant are
 *   software you run yourself, so the pages say that instead of comparing a
 *   subscription price with a management fee as if they were the same thing.
 * - Only list Ondo features the live platform delivers. No counts of tools,
 *   roles, calculators or credit bureaus (those drift or are not live).
 * - Competitor facts carry COMPETITOR_FACTS_AS_OF and are shown with a
 *   "check their site" note. Remove a competitor cell if it cannot be sourced.
 */

export const COMPETITOR_FACTS_AS_OF = FEE_COMPARISON_AS_OF

export const COMPETITOR_FACTS_NOTE = `Competitor details are from their public sites as of ${COMPETITOR_FACTS_AS_OF} and may have changed. Check their sites before you decide.`

const pct = (rate: number) => `${Math.round(rate * 100)}%`

export const ONDO_FEE_SUMMARY = `${pct(STARTER_MGMT_RATE)} of collected rent (1–${STARTER_MAX_UNITS} units), ${pct(GROWTH_MGMT_RATE)} (${GROWTH_MIN_UNITS}–${PORTFOLIO_MIN_UNITS - 1} units)`

export const ONDO_LEASING_SUMMARY = `One-time ${pct(LEASING_FEE_RATE)} of first month's rent when we place a new tenant`

export const ONDO_PRICING_FRAMING =
  "Ondo is full-service management: we run the rental for a percentage of collected rent. Buildium and TurboTenant are software you run yourself, so their price is a subscription and your time is not included."

export type FeatureRow = {
  feature: string
  ondo: boolean | string
  competitor: boolean | string
}

export type CategoryBlock = {
  category: string
  rows: FeatureRow[]
}

export type QuickStat = {
  label: string
  ondo: string
  competitor: string
}

// ─── Buildium ────────────────────────────────────────────────────────────────

export const BUILDIUM_CATEGORIES: CategoryBlock[] = [
  {
    category: "Price and model",
    rows: [
      { feature: "What you pay", ondo: ONDO_FEE_SUMMARY, competitor: `Software from $62/mo (as of ${COMPETITOR_FACTS_AS_OF})` },
      { feature: "Who does the work", ondo: "Ondo manages the rental", competitor: "You or your team" },
      { feature: "Leasing", ondo: ONDO_LEASING_SUMMARY, competitor: "Not included, you list and screen" },
    ],
  },
  {
    category: "Core Platform",
    rows: [
      { feature: "Owner portal", ondo: true, competitor: true },
      { feature: "Tenant portal", ondo: "Full portal", competitor: "Resident Center" },
      { feature: "PWA offline access", ondo: true, competitor: false },
      { feature: "White-label branding", ondo: false, competitor: true },
    ],
  },
  {
    category: "Payments & Accounting",
    rows: [
      { feature: "Rent collection", ondo: true, competitor: true },
      { feature: "Full GL accounting", ondo: "Basic", competitor: true },
      { feature: "Owner disbursements", ondo: true, competitor: true },
      { feature: "1099 generation", ondo: true, competitor: true },
    ],
  },
  {
    category: "Screening & Leasing",
    rows: [
      { feature: "Tenant screening", ondo: true, competitor: true },
      { feature: "State lease templates", ondo: false, competitor: true },
      { feature: "E-signatures", ondo: true, competitor: true },
      { feature: "Lease renewal", ondo: true, competitor: true },
    ],
  },
  {
    category: "Unique to Ondo RE",
    rows: [
      { feature: "RE agent tools", ondo: true, competitor: false },
      { feature: "Loan officer integration", ondo: true, competitor: false },
      { feature: "Notary services", ondo: true, competitor: false },
      { feature: "AI assistant", ondo: true, competitor: "Check their site" },
      { feature: "Tenant risk scoring", ondo: true, competitor: false },
    ],
  },
]

export const BUILDIUM_QUICK_STATS: QuickStat[] = [
  { label: "What you pay", ondo: pct(STARTER_MGMT_RATE), competitor: "$62/mo+" },
  { label: "Model", ondo: "Full service", competitor: "DIY software" },
  { label: "Phone support", ondo: "All tiers", competitor: "$192+/mo" },
]

// ─── TurboTenant ─────────────────────────────────────────────────────────────

export const TURBOTENANT_CATEGORIES: CategoryBlock[] = [
  {
    category: "Price and model",
    rows: [
      { feature: "What you pay", ondo: ONDO_FEE_SUMMARY, competitor: "Free tier for landlords, paid upgrades" },
      { feature: "Who does the work", ondo: "Ondo manages the rental", competitor: "You" },
      { feature: "Leasing", ondo: ONDO_LEASING_SUMMARY, competitor: "Not included, you list and screen" },
    ],
  },
  {
    category: "Core Platform",
    rows: [
      { feature: "Owner portal", ondo: true, competitor: true },
      { feature: "Tenant portal", ondo: true, competitor: "Basic" },
      { feature: "PWA offline support", ondo: true, competitor: false },
    ],
  },
  {
    category: "Payments",
    rows: [
      { feature: "Rent collection", ondo: true, competitor: true },
      { feature: "Late fee automation", ondo: true, competitor: true },
      { feature: "Owner disbursements", ondo: true, competitor: false },
    ],
  },
  {
    category: "Screening & Leasing",
    rows: [
      { feature: "Tenant screening", ondo: true, competitor: true },
      { feature: "E-signatures", ondo: true, competitor: true },
      { feature: "Lease renewal", ondo: true, competitor: "Partial" },
    ],
  },
  {
    category: "Unique to Ondo",
    rows: [
      { feature: "RE agent tools", ondo: true, competitor: false },
      { feature: "Loan officer tools", ondo: true, competitor: false },
      { feature: "Notary services", ondo: true, competitor: false },
      { feature: "AI assistant", ondo: true, competitor: "Check their site" },
      { feature: "Tenant risk scoring", ondo: true, competitor: false },
      { feature: "Vendor management", ondo: true, competitor: "Basic" },
    ],
  },
]

export const TURBOTENANT_QUICK_STATS: QuickStat[] = [
  { label: "What you pay", ondo: pct(STARTER_MGMT_RATE), competitor: "Free tier" },
  { label: "Model", ondo: "Full service", competitor: "DIY software" },
  { label: "Leasing fee", ondo: `${pct(LEASING_FEE_RATE)} of 1st month`, competitor: "You handle it" },
]
