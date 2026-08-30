/**
 * Honest program tradeoffs for “Is this right for me?” tables.
 * Educational snapshots. Not a decision engine and not a credit promise.
 */

import {
  CONVENTIONAL_SNAPSHOT,
  FHA_SNAPSHOT,
  USDA_SNAPSHOT,
  VA_FUNDING_FEE,
} from "./lending-facts"

export const PROGRAM_FIT_IDS = [
  "conventional",
  "fha",
  "va",
  "usda",
  "jumbo",
  "refinance",
  "heloc",
] as const

export type ProgramFitId = (typeof PROGRAM_FIT_IDS)[number]

export type ComparisonColumn = {
  id: string
  heading: string
  href?: string
}

export type ComparisonRow = {
  id: string
  criterion: string
  cells: Record<string, string>
}

export const PURCHASE_PROGRAM_COLUMNS: readonly ComparisonColumn[] = [
  { id: "conventional", heading: "Conventional", href: "/loans/conventional" },
  { id: "fha", heading: "FHA", href: "/loans/fha" },
  { id: "va", heading: "VA", href: "/loans/va" },
  { id: "usda", heading: "USDA", href: "/loans/usda" },
  { id: "jumbo", heading: "Jumbo", href: "/loans/jumbo" },
] as const

export const EQUITY_PROGRAM_COLUMNS: readonly ComparisonColumn[] = [
  { id: "refinance", heading: "Cash-out refinance", href: "/refinance/cash-out" },
  { id: "heloc", heading: "HELOC", href: "/loans/heloc" },
] as const

const PURCHASE_ROWS: readonly ComparisonRow[] = [
  {
    id: "credit",
    criterion: "Credit (typical overlay, not a promise)",
    cells: {
      conventional: CONVENTIONAL_SNAPSHOT.typicalMinimumScore,
      fha: FHA_SNAPSHOT.scoreNote,
      va: "VA does not publish a single FICO floor. Lender overlays still apply.",
      usda: USDA_SNAPSHOT.creditNote,
      jumbo: "Investor overlays; often stronger than conforming conventional. Not a published floor.",
      refinance: "Depends on the first-lien program you refinance into.",
      heloc: "Second-lien overlays vary by investor; often similar to or tighter than the first mortgage.",
    },
  },
  {
    id: "down-payment",
    criterion: "Down payment / equity",
    cells: {
      conventional: CONVENTIONAL_SNAPSHOT.lowDownOptions,
      fha: `${FHA_SNAPSHOT.minDownPayment580Plus} down at 580+ under HUD policy; overlays often sit higher. ${FHA_SNAPSHOT.minDownPayment500To579} at 500–579.`,
      va: VA_FUNDING_FEE.downPaymentNote,
      usda: "Zero down when the property map, household income, and occupancy tests are met.",
      jumbo: "Often 10–20% depending on loan size and reserves. Overlay, not a statute.",
      refinance: "Cash-out LTV is an overlay (commonly around 80% on conventional). Confirm the investor.",
      heloc: "Combined LTV (first + line) is an overlay. The first mortgage stays in place.",
    },
  },
  {
    id: "occupancy",
    criterion: "Occupancy",
    cells: {
      conventional: "Primary, second home, and investment — each with different pricing and overlays.",
      fha: FHA_SNAPSHOT.occupancy,
      va: "Primary residence. Remaining-entitlement cases still have an occupancy test.",
      usda: USDA_SNAPSHOT.occupancy,
      jumbo: "Primary, second home, and investment exist as overlays. Pricing and down payment change with occupancy.",
      refinance: "Cash-out occupancy and LTV rules depend on whether the property is a primary, second home, or rental.",
      heloc: "Owner-occupied is the common case. Investment HELOCs are a different overlay conversation.",
    },
  },
  {
    id: "property",
    criterion: "Property type",
    cells: {
      conventional: "1–4 units, condos and PUDs when the project meets investor rules.",
      fha: "1–4 units as a primary. Condos need FHA project approval. HUD minimum property standards apply.",
      va: "VA MPRs and an occupancy appraisal. Condos need VA project approval.",
      usda: "Address must be on the USDA map. Existing homes and some new construction; not an investment rental.",
      jumbo: "Project and property overlays are investor-specific. High-cost condos can be harder than detached.",
      refinance: "Same property that already secures the loan, subject to the new investor’s overlay.",
      heloc: "The subject property must support a second lien. Title, HOA, and occupancy still matter.",
    },
  },
  {
    id: "insurance",
    criterion: "MIP / PMI / funding fee / guarantee fee",
    cells: {
      conventional: CONVENTIONAL_SNAPSHOT.pmiRemoval,
      fha: `Upfront MIP ${FHA_SNAPSHOT.upfrontMip}. ${FHA_SNAPSHOT.annualMipNote} Life-of-loan MIP is common below 10% down.`,
      va: `Funding fee may apply or be waived. First-use, less than 5% down snapshot: ${VA_FUNDING_FEE.firstUseLessThan5PercentDown}. ${VA_FUNDING_FEE.exemptionNote} No monthly PMI.`,
      usda: `${USDA_SNAPSHOT.upfrontGuaranteeFee}; annual ${USDA_SNAPSHOT.annualFee}. ${USDA_SNAPSHOT.feeNote}`,
      jumbo: "Some jumbo files have no monthly PMI at lower LTVs. Others price risk into rate. Compare Loan Estimates.",
      refinance: "A cash-out can reintroduce PMI/MIP if you land above the equity threshold of the new program.",
      heloc: "No PMI in the conventional sense. The cost is the second-lien rate, fees, and a variable payment on many lines.",
    },
  },
  {
    id: "limits",
    criterion: "Loan limits",
    cells: {
      conventional: "FHFA conforming limit for the property county. Look up this year’s table.",
      fha: "HUD FHA county limit. Different table from FHFA. Look up the property county.",
      va: "County limits matter when entitlement is partial. Full entitlement files follow current VA/FHFA interaction — confirm, do not memorize a number.",
      usda: "Area loan limits exist. The map and income tests usually bind first.",
      jumbo: "Any amount above the FHFA conforming limit for that county. Not a single Utah-wide number.",
      refinance: "The new loan must fit the program you refinance into (conforming, FHA, VA, jumbo).",
      heloc: "The line size is an investor overlay against appraised value and combined LTV, not an FHFA county cap.",
    },
  },
]

const EQUITY_ROWS: readonly ComparisonRow[] = [
  {
    id: "payment",
    criterion: "Payment shape",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance:
        "One new first-lien payment replaces the old mortgage. Closing costs are usually financed or paid at closing.",
      heloc:
        "The first mortgage stays. The line is a second payment (often interest-only in the draw period, then amortizing).",
    },
  },
  {
    id: "lien",
    criterion: "Lien position",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance: "Single first lien after closing. The old loan is paid off.",
      heloc: "Second lien behind the existing first. Default risk and pricing follow that structure.",
    },
  },
  {
    id: "rate-risk",
    criterion: "Rate structure",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance: "Usually a new fixed or ARM first mortgage. You re-spread closing costs over the new term.",
      heloc: "Many HELOCs are variable after a draw period. Payment can rise without a refinance.",
    },
  },
  {
    id: "tax-questions",
    criterion: "Tax questions (not tax advice)",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance:
        "Interest deductibility and whether cash-out is used for home improvement vs other purposes is a CPA question. This table is not tax advice.",
      heloc:
        "HELOC interest deductibility also depends on use of funds and current tax law. Ask a tax professional. This is not tax advice.",
    },
  },
  {
    id: "when-it-fits",
    criterion: "When people compare it",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance:
        "You also want a new first-lien rate or term, or you need a lump sum large enough that a second lien would be awkward.",
      heloc:
        "Your first-lien rate is worth keeping, the need is staged (draws over time), or you want to avoid resetting a 30-year clock.",
    },
  },
  {
    id: "closing",
    criterion: "Closing friction",
    cells: {
      conventional: "",
      fha: "",
      va: "",
      usda: "",
      jumbo: "",
      refinance: "Full mortgage close: appraisal, title, disclosures, three-day TRID wait on most files.",
      heloc: "Usually lighter than a first-lien refinance, still an appraisal/valuation and title work. Not “no closing.”",
    },
  },
]

export type ProgramFitTableId = "purchase" | "equity"

export function columnsForTable(table: ProgramFitTableId): readonly ComparisonColumn[] {
  switch (table) {
    case "purchase":
      return PURCHASE_PROGRAM_COLUMNS
    case "equity":
      return EQUITY_PROGRAM_COLUMNS
    default: {
      const _exhaustive: never = table
      return _exhaustive
    }
  }
}

export function rowsForTable(table: ProgramFitTableId): readonly ComparisonRow[] {
  switch (table) {
    case "purchase":
      return PURCHASE_ROWS
    case "equity":
      return EQUITY_ROWS
    default: {
      const _exhaustive: never = table
      return _exhaustive
    }
  }
}

export function filterProgramColumns(
  table: ProgramFitTableId,
  programIds?: readonly ProgramFitId[],
): ComparisonColumn[] {
  const columns = columnsForTable(table)
  if (!programIds?.length) return [...columns]
  const allow = new Set<string>(programIds)
  return columns.filter((column) => allow.has(column.id))
}

export function cellsForColumns(
  row: ComparisonRow,
  columns: readonly ComparisonColumn[],
): string[] {
  return columns.map((column) => row.cells[column.id])
}

export function isProgramFitId(value: string): value is ProgramFitId {
  return (PROGRAM_FIT_IDS as readonly string[]).includes(value)
}
