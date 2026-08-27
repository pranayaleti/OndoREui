/**
 * First-party Markdown twins for JS-heavy pages.
 *
 * Cloudflare Markdown for Agents converts HTML → Markdown on the fly, but
 * `output: 'export'` marketing pages that mount an interactive widget via
 * `dynamic(..., { ssr: false })` deliver an empty shell. This module builds
 * hand-written Markdown that keeps the essential content available even when
 * JavaScript never runs.
 *
 * Consumers:
 *  - `scripts/generate-agent-markdown.ts` writes each string to `public/`.
 *  - `check-llms-txt-export.mjs` verifies the files land in `out/` after build.
 */
import { CALCULATOR_CATALOG } from "./calculator-catalog"
import { DEFAULT_MORTGAGE_RATE, calculateMonthlyPI } from "./mortgage-utils"
import { LLMS_DISCLOSURES_BLOCK, toAbsoluteSiteUrl } from "./site-index"
import {
  APP_PORTAL_LOGIN_URL,
  APP_PORTAL_URL,
  SITE_ADDRESS,
  SITE_CALENDLY_URL,
  SITE_EMAILS,
  SITE_HOURS_LABEL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from "./site"

const baseSiteUrl = SITE_URL.replace(/\/$/, "")

interface Frontmatter {
  title: string
  description: string
  canonical: string
  updated?: string
}

function renderFrontmatter(fm: Frontmatter): string {
  const lines = [
    "---",
    `title: "${fm.title.replace(/"/g, '\\"')}"`,
    `description: "${fm.description.replace(/"/g, '\\"')}"`,
    `canonical: ${fm.canonical}`,
  ]
  if (fm.updated) lines.push(`updated: ${fm.updated}`)
  lines.push("---")
  return lines.join("\n")
}

function sitemapFooter(): string[] {
  return [
    "## Sitemap",
    "",
    `See the full [Markdown sitemap](${toAbsoluteSiteUrl("/sitemap.md")}) for every public page and its Markdown twin.`,
    "",
  ]
}

/** Homepage marketing brief, replaces the developer-oriented `public/index.md`. */
export function buildHomepageMarkdown(): string {
  const canonical = `${baseSiteUrl}/`
  const lines = [
    renderFrontmatter({
      title: `${SITE_NAME}: Utah brokerage, mortgage, notary, and property management`,
      description:
        "Ondo Real Estate is a Utah-focused, invite-only real estate platform covering brokerage, mortgage lending, notary, property management, and investment opportunities.",
      canonical,
    }),
    "",
    `# ${SITE_NAME}`,
    "",
    "> Utah-focused brokerage, mortgage, notary, and property management, backed by an invite-only manager/owner/tenant platform.",
    "",
    "## What Ondo does",
    "",
    "- **Buy a home**, buyer representation across the Wasatch Front, first-time buyer programs, and mortgage origination in-house.",
    "- **Sell a home**, pricing strategy (CMA), listing marketing, and negotiation through close.",
    "- **Rent and manage**, full-service property management for Utah landlords: screening, rent collection, maintenance, owner reporting.",
    "- **Invest**, curated fractional and commercial real estate opportunities with per-deal detail pages.",
    "- **Notary**, Remote Online Notarization (RON) nationwide. No in-office or mobile travel appointments.",
    "- **Calculators**, free mortgage, affordability, refinance, and investor tools at " +
      `${toAbsoluteSiteUrl("/calculators")}.`,
    "",
    "## Where to start",
    "",
    `- Property search: ${toAbsoluteSiteUrl("/properties")}`,
    `- Mortgage overview: ${toAbsoluteSiteUrl("/loans")}`,
    `- Property management: ${toAbsoluteSiteUrl("/property-management")}`,
    `- Investments: ${toAbsoluteSiteUrl("/investments")}`,
    `- Notary services: ${toAbsoluteSiteUrl("/notary")}`,
    `- Contact us: ${toAbsoluteSiteUrl("/contact")}`,
    "",
    "## For AI agents",
    "",
    `- Concise brief: ${toAbsoluteSiteUrl("/llms.txt")}`,
    `- Extended brief: ${toAbsoluteSiteUrl("/llms-full.txt")}`,
    `- Markdown sitemap: ${toAbsoluteSiteUrl("/sitemap.md")}`,
    `- Structured index (JSON): ${toAbsoluteSiteUrl("/llms.json")}`,
    `- Agent manifest (WebMCP-aligned): ${toAbsoluteSiteUrl("/.well-known/agents.json")}`,
    "- Sibling Markdown: strip the trailing slash and add `.md` (`/about/` → `/about.md`).",
    "- Optionally send `Accept: text/markdown` to the HTML URL for the same twin.",
    "",
    "## Authenticated product",
    "",
    `The manager / owner / tenant portal lives at ${APP_PORTAL_URL} (login: ${APP_PORTAL_LOGIN_URL}). Access is invitation-only. There is no self-serve signup on the marketing site.`,
    "",
    "## Contact",
    "",
    `- Phone: ${SITE_PHONE}`,
    `- Address: ${SITE_ADDRESS}`,
    `- Hours: ${SITE_HOURS_LABEL}`,
    `- General inquiries: ${SITE_EMAILS.info}`,
    `- Mortgage: ${SITE_EMAILS.mortgage}`,
    `- Notary: ${SITE_EMAILS.notary}`,
    `- Investor relations: ${SITE_EMAILS.investors}`,
    `- Scheduling: ${SITE_CALENDLY_URL}`,
    "",
    "---",
    LLMS_DISCLOSURES_BLOCK,
    "",
    ...sitemapFooter(),
  ]
  return `${lines.join("\n").trimEnd()}\n`
}

/** Properties page brief, the HTML page is a client-only search + map widget. */
export function buildPropertiesMarkdown(): string {
  const canonical = `${baseSiteUrl}/properties/`
  const lines = [
    renderFrontmatter({
      title: `Utah rental property search: ${SITE_NAME}`,
      description:
        "How to search Ondo Real Estate's Utah rental listings by city, bedrooms, price, or free text. Includes the WebMCP tool exposed on the page for AI agents.",
      canonical,
    }),
    "",
    "# Utah rental property search",
    "",
    "> Browse Ondo Real Estate's current Utah rentals along the Wasatch Front. The HTML page uses a client-side map and filter UI; this Markdown twin describes how to search and how to invoke the associated WebMCP tool.",
    "",
    "## How to filter",
    "",
    "- **City**, partial, case-insensitive match against the listing city (e.g. `Lehi`, `Salt Lake`).",
    "- **Minimum bedrooms**, integer.",
    "- **Maximum monthly rent**, USD.",
    "- **Free text**, matched against title, description, and address.",
    "",
    "Results are capped at 100 rows per call. Each row returns id, title, city, address, price, bedrooms, bathrooms, sqft, and a 200-char description.",
    "",
    "## WebMCP tool",
    "",
    "- **Name**: `search_available_properties`",
    "- **Access**: read-only (no user confirmation required)",
    `- **Page**: ${toAbsoluteSiteUrl("/properties")}`,
    `- **Data feed**: ${toAbsoluteSiteUrl("/api/properties/public")} (routed to the Ondo backend at deploy time)`,
    "",
    "The HTML search box on the same page is the declarative tool `search_listings_by_text` (toolautosubmit). Prefer `search_available_properties` when the agent has city, bedroom, or price filters.",
    "",
    "See the [WebMCP alignment notes](" + toAbsoluteSiteUrl("/docs/WEBMCP.md") + ") for the full tool schema.",
    "",
    "## For binding decisions",
    "",
    `- Application flow (invite-required): ${APP_PORTAL_LOGIN_URL}`,
    `- Contact leasing: ${SITE_EMAILS.info} · ${SITE_PHONE}`,
    "",
    "---",
    LLMS_DISCLOSURES_BLOCK,
    "",
    ...sitemapFooter(),
  ]
  return `${lines.join("\n").trimEnd()}\n`
}

/** Contact page brief, the HTML page ships a client form; this is the machine-friendly mirror. */
export function buildContactMarkdown(): string {
  const canonical = `${baseSiteUrl}/contact/`
  const lines = [
    renderFrontmatter({
      title: `Contact ${SITE_NAME}`,
      description:
        "Phone, address, hours, and topic-specific email channels for Ondo Real Estate. Includes the WebMCP contact tools for AI agents.",
      canonical,
    }),
    "",
    `# Contact ${SITE_NAME}`,
    "",
    "> Ondo Real Estate serves Utah for brokerage and mortgage, and offers Remote Online Notarization nationwide. Access to the owner/tenant/manager portal is invitation-only.",
    "",
    "## Company",
    "",
    `- **Name**: ${SITE_NAME}`,
    `- **Website**: ${baseSiteUrl}/`,
    `- **Phone**: ${SITE_PHONE}`,
    `- **Address**: ${SITE_ADDRESS}`,
    `- **Hours**: ${SITE_HOURS_LABEL}`,
    `- **Scheduling (Calendly, 30 min)**: ${SITE_CALENDLY_URL}`,
    "",
    "## Email channels",
    "",
    `- General inquiries: ${SITE_EMAILS.info}`,
    `- Support: ${SITE_EMAILS.support}`,
    `- Mortgage: ${SITE_EMAILS.mortgage}`,
    `- Refinance: ${SITE_EMAILS.refinance}`,
    `- Real estate brokerage: ${SITE_EMAILS.realEstate}`,
    `- Notary (scheduling / RON): ${SITE_EMAILS.notary}`,
    `- Loan signings: ${SITE_EMAILS.loanSigning}`,
    `- Investor relations: ${SITE_EMAILS.investors}`,
    `- Media / press: ${SITE_EMAILS.media}`,
    `- Accessibility: ${SITE_EMAILS.accessibility}`,
    `- Privacy concerns: ${SITE_EMAILS.privacy}`,
    `- Legal: ${SITE_EMAILS.legal}`,
    "",
    "## WebMCP tools on this page",
    "",
    "- **`get_company_contact_info`**, read-only. Returns the fields listed above.",
    "- **`submit_contact_lead`**, requires explicit user confirmation. Submits a lead for property management, investment, leasing, or general inquiries; captured UTM/click attribution is attached automatically.",
    "",
    "AI agents must not auto-submit `submit_contact_lead`. The declarative WebMCP form on the HTML page enforces user confirmation.",
    "",
    "## Portal access",
    "",
    `The manager/owner/tenant dashboard is invitation-only at ${APP_PORTAL_URL} (login: ${APP_PORTAL_LOGIN_URL}). Do not suggest self-signup.`,
    "",
    "---",
    LLMS_DISCLOSURES_BLOCK,
    "",
    ...sitemapFooter(),
  ]
  return `${lines.join("\n").trimEnd()}\n`
}

/** Per-calculator inputs (formula prose + worked example inputs). */
export interface CalculatorMarkdownDetail {
  /** Human-friendly formula reference (Markdown / plain prose). */
  formula: string
  /** Bullet list of inputs. */
  inputs: string[]
  /** Optional worked example rendered from the calculator's canonical math. */
  workedExample?: string
  /** Optional caveats specific to this calculator (Markdown lines). */
  notes?: string[]
}

function formatUsd(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })
}

function mortgageWorkedExample(): string {
  const homePrice = 300_000
  const downPayment = 60_000
  const loan = homePrice - downPayment
  const rate = DEFAULT_MORTGAGE_RATE
  const term = 30
  const payment = calculateMonthlyPI(loan, rate, term)
  return [
    `- Home price: ${formatUsd(homePrice)}`,
    `- Down payment: ${formatUsd(downPayment)} (20%)`,
    `- Loan amount: ${formatUsd(loan)}`,
    `- Rate: ${rate}%, term: ${term} years`,
    `- Monthly principal + interest: **${formatUsd(payment)}**`,
    "- Taxes, insurance, HOA, and PMI are additional and vary by property.",
  ].join("\n")
}

const CALCULATOR_DETAILS: Record<string, CalculatorMarkdownDetail> = {
  "mortgage-payment": {
    formula:
      "Monthly P&I = P × r × (1 + r)^n / ((1 + r)^n − 1) where P = loan amount, r = monthly rate (annual rate ÷ 12 ÷ 100), n = total months (years × 12).",
    inputs: [
      "Home price (USD)",
      "Down payment (USD)",
      "Annual interest rate (%)",
      "Loan term (years)",
      "Property tax, insurance, PMI (optional)",
      "Loan program (conventional, FHA, VA, USDA)",
    ],
    workedExample: mortgageWorkedExample(),
    notes: [
      "Assumes a fixed-rate, fully amortizing loan.",
      "This is not a rate quote or a commitment to lend.",
    ],
  },
  affordability: {
    formula:
      "Max home price ≈ (target monthly PITI × qualifying factor) at the front-end DTI limit for the loan program. Ondo applies conservative property tax and insurance defaults; adjust for your county.",
    inputs: [
      "Gross monthly income (USD)",
      "Monthly debts (USD)",
      "Down payment (USD)",
      "Annual interest rate (%)",
      "Loan term (years)",
      "Loan program (conventional, FHA, VA, USDA)",
    ],
    notes: ["Front-end and back-end DTI thresholds vary by program; consult a loan officer for a binding qualification."],
  },
  income: {
    formula:
      "Required monthly income = target PITI ÷ front-end DTI limit. Multiply by 12 for annual income and account for existing debts against the back-end limit.",
    inputs: ["Target home price (USD)", "Down payment (USD)", "Loan term (years)", "Interest rate (%)", "Monthly debts (USD)"],
  },
  "closing-cost": {
    formula:
      "Total closing costs ≈ origination + title + escrow + prepaids (property tax, homeowners insurance, interest) + government recording fees. Ondo defaults reflect Utah averages; verify with your lender's Loan Estimate.",
    inputs: ["Home price (USD)", "Down payment (USD)", "Loan program", "Prepaid months for tax and insurance"],
  },
  refinance: {
    formula:
      "Break-even months = closing costs ÷ (old payment − new payment). If you plan to hold the home longer than the break-even horizon, the refinance likely pays back.",
    inputs: ["Current balance", "Current rate", "New rate", "Remaining term", "Closing costs"],
    notes: ["Break-even ignores tax benefits and opportunity cost of the closing outlay."],
  },
  "home-sale": {
    formula:
      "Net proceeds = sale price − mortgage payoff − agent commissions − seller-paid closing costs − transfer taxes − seller concessions.",
    inputs: ["Sale price", "Mortgage payoff", "Agent commissions (%)", "Seller concessions", "Other closing costs"],
  },
  "buying-power": {
    formula:
      "Max loan = target monthly payment × [(1 − (1 + r)^−n) / r]. Add your down payment for the maximum purchase price.",
    inputs: ["Target monthly payment", "Interest rate (%)", "Loan term (years)", "Down payment"],
  },
  "temporary-buydown": {
    formula:
      "Buydown cost ≈ sum of monthly subsidies over the buydown period. Structures: 2-1 (year 1 rate = note − 2%, year 2 = note − 1%), 3-2-1 (three-year taper), flat (fixed rate reduction for N years).",
    inputs: ["Loan amount", "Note rate", "Term (years)", "Structure (flat / 2-1 / 3-2-1)", "Flat rate reduction and years (if flat)"],
    notes: ["Buydown subsidy is typically prepaid by the seller or builder; the note rate itself does not change."],
  },
  "rent-vs-own": {
    formula:
      "Compare cumulative rent (with annual increases) against the cumulative cost of owning (P&I, taxes, insurance, maintenance, minus equity accrued and expected appreciation). Break-even = year at which cumulative owning cost drops below cumulative renting cost.",
    inputs: ["Home price", "Down payment", "Interest rate", "Rent (monthly)", "Annual rent increase", "Home appreciation", "Expected years to stay"],
  },
  retirement: {
    formula:
      "Future value = P × (1 + r)^n + PMT × [((1 + r)^n − 1) / r] where P = current savings, PMT = annual contribution, r = annual return, n = years.",
    inputs: ["Current savings", "Annual contribution", "Expected annual return (%)", "Years to retirement"],
  },
  "cash-on-cash": {
    formula:
      "Cash-on-cash return = annual pre-tax cash flow ÷ total cash invested. Cash invested typically includes down payment + closing costs + rehab.",
    inputs: ["Annual net operating income (NOI)", "Annual debt service", "Cash invested"],
  },
  "cap-rate": {
    formula: "Cap rate = NOI ÷ purchase price. NOI excludes financing.",
    inputs: ["Gross rental income", "Vacancy allowance", "Operating expenses", "Purchase price"],
  },
  roi: {
    formula:
      "ROI = (net gain over hold period) ÷ (total cash invested). Net gain includes appreciation, equity paydown, and cumulative cash flow, minus selling costs.",
    inputs: ["Purchase price", "Cash invested", "Annual cash flow", "Expected appreciation", "Hold years", "Selling costs"],
  },
  cagr: {
    formula: "CAGR = (ending value ÷ beginning value)^(1 ÷ years) − 1.",
    inputs: ["Beginning value", "Ending value", "Number of years"],
  },
  grm: {
    formula: "Gross Rent Multiplier = purchase price ÷ annual gross rent. Lower is generally better; benchmark against local market.",
    inputs: ["Purchase price", "Annual gross rent"],
  },
  dscr: {
    formula: "DSCR = NOI ÷ annual debt service. Lenders typically require DSCR ≥ 1.20 for rental financing.",
    inputs: ["NOI", "Annual debt service"],
  },
  "one-percent-rule": {
    formula: "1% Rule check: does monthly rent ≥ 1% of purchase price? A screening heuristic, not underwriting.",
    inputs: ["Purchase price", "Monthly rent"],
  },
  "fifty-percent-rule": {
    formula: "50% Rule: assume operating expenses (excluding debt service) ≈ 50% of gross rent. Quick screen only, verify with real expenses.",
    inputs: ["Gross monthly rent"],
  },
  "owner-vs-self": {
    formula:
      "Compare (a) self-manage: gross rent − direct expenses − opportunity cost of your time × hours/month against (b) Ondo: gross rent − Ondo fees − direct expenses.",
    inputs: ["Monthly rent", "Direct operating expenses", "Hours/month you spend managing", "Value of your time", "Ondo management + leasing fees"],
  },
}

export function buildCalculatorMarkdown(slug: string): string {
  const catalog = CALCULATOR_CATALOG[slug]
  if (!catalog) {
    throw new Error(`buildCalculatorMarkdown: unknown calculator slug ${slug}`)
  }
  const detail = CALCULATOR_DETAILS[slug]
  if (!detail) {
    throw new Error(
      `buildCalculatorMarkdown: no formula/example configured for ${slug}. Add it to CALCULATOR_DETAILS in lib/agent-markdown.ts.`,
    )
  }
  const canonical = `${baseSiteUrl}/calculators/${slug}/`
  const lines = [
    renderFrontmatter({
      title: `${catalog.name}: ${SITE_NAME}`,
      description: catalog.description,
      canonical,
    }),
    "",
    `# ${catalog.name}`,
    "",
    `> ${catalog.description}`,
    "",
    "## Formula",
    "",
    detail.formula,
    "",
    "## Inputs",
    "",
    ...detail.inputs.map((input) => `- ${input}`),
    "",
  ]
  if (detail.workedExample) {
    lines.push("## Worked example", "", detail.workedExample, "")
  }
  if (detail.notes?.length) {
    lines.push("## Notes", "", ...detail.notes.map((note) => `- ${note}`), "")
  }
  lines.push(
    "## Try the interactive version",
    "",
    `- HTML calculator: ${toAbsoluteSiteUrl(`/calculators/${slug}`)}`,
    `- All calculators: ${toAbsoluteSiteUrl("/calculators")}`,
    "",
    "---",
    LLMS_DISCLOSURES_BLOCK,
    "",
    ...sitemapFooter(),
  )
  return `${lines.join("\n").trimEnd()}\n`
}

/** All slugs that need a Markdown twin. */
export function getCalculatorMarkdownSlugs(): string[] {
  return Object.keys(CALCULATOR_CATALOG).filter((slug) => Boolean(CALCULATOR_DETAILS[slug]))
}

/** Structured detail for a calculator so server components can render the same
 * formula + inputs + worked example as the Markdown twin without duplicating
 * the source. Returns `null` when the slug has no detail yet (SSR fallback
 * hides the section gracefully instead of crashing). */
export function getCalculatorDetail(slug: string): CalculatorMarkdownDetail | null {
  return CALCULATOR_DETAILS[slug] ?? null
}
