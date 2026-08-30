/**
 * Input explanations for mortgage calculators.
 * Keep this educational: what the field means, what the tool does not know.
 */

import { DTI_EDUCATION, LENDING_FACTS_AS_OF, UTAH_CLOSING_NOTES } from "./lending-facts"

export type CalculatorInputField = {
  name: string
  meaning: string
}

export type CalculatorInputCopy = {
  slug: string
  heading: string
  lead: string
  fields: readonly CalculatorInputField[]
  related: readonly { label: string; href: string }[]
}

const AFFORDABILITY: CalculatorInputCopy = {
  slug: "affordability",
  heading: "What these affordability inputs actually count",
  lead: `This tool illustrates a price range from income, debts, and housing expenses. It is not underwriting. Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Gross monthly income",
      meaning:
        DTI_EDUCATION.variableIncomeNote +
        " Enter an average you can document, not last month’s best deposit.",
    },
    {
      name: "Monthly debts",
      meaning:
        DTI_EDUCATION.backendNote +
        " Count minimums that show on the credit report (installments, revolving, student loans as the investor requires). Do not omit a car payment you plan to “pay off later.” HOA is usually housing, not this box.",
    },
    {
      name: "Down payment",
      meaning:
        "Cash toward price, not closing costs. Gift funds and DPA can fund this only when the program allows and the paper trail is complete.",
    },
    {
      name: "Rate",
      meaning:
        "An illustration rate you type in. It is not today’s quote, a lock, or APR. APR also includes most lender fees.",
    },
    {
      name: "Taxes, insurance, HOA",
      meaning:
        "Front-end DTI includes PITI plus HOA when it applies. " +
        DTI_EDUCATION.frontendNote +
        " County tax and HOA vary widely in Utah; the default is not your bill.",
    },
  ],
  related: [
    { label: "How underwriters verify income", href: "/blog/how-underwriters-verify-income" },
    { label: "Student loans and DTI after IDR / SAVE", href: "/blog/student-loans-dti-idr-save" },
    { label: "DTI: front-end vs back-end with HOA", href: "/blog/dti-frontend-backend-with-hoa" },
    { label: "Variable income hub", href: "/learn/variable-income" },
  ],
}

const INCOME: CalculatorInputCopy = {
  slug: "income",
  heading: "Variable income and this income calculator",
  lead: `The calculator works backward from a price to an illustrative income need. It cannot see overtime history, 1099 expenses, or a down year. Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Target price and down payment",
      meaning: "Together they set the loan amount. Closing costs and prepaids are not this loan amount.",
    },
    {
      name: "Rate and term",
      meaning: "Illustration only. A typed rate is not a quote. Term changes payment more than most people expect.",
    },
    {
      name: "Monthly debts",
      meaning:
        "Back-end DTI uses counted debts. " +
        DTI_EDUCATION.backendNote +
        " Variable income is still averaged before this ratio is run.",
    },
  ],
  related: [
    { label: "Can I get a mortgage if income changes monthly?", href: "/blog/can-i-get-a-mortgage-if-my-income-changes-every-month" },
    { label: "Gig plus W-2: how the average is built", href: "/blog/gig-plus-w2-income-mortgage-average" },
    { label: "CPA letter vs tax returns", href: "/blog/cpa-letter-vs-tax-returns-underwriting" },
    { label: "I just went 1099 last month", href: "/blog/just-went-1099-last-month" },
  ],
}

const CLOSING: CalculatorInputCopy = {
  slug: "closing-cost",
  heading: "Utah closing-cost inputs (ranges, not a title quote)",
  lead: `${UTAH_CLOSING_NOTES.rangeNote} Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Home price and down payment",
      meaning:
        "Price drives title premiums, recording, and prepaid tax estimates. Down payment is not a closing cost; it is cash to close on a different line.",
    },
    {
      name: "Loan program",
      meaning:
        "FHA, VA, USDA, and conventional have different prepaid and fee shapes (MIP, funding fee, guarantee fee). The calculator cannot waive a VA funding fee for you.",
    },
    {
      name: "Prepaid months for tax and insurance",
      meaning:
        UTAH_CLOSING_NOTES.taxCalendar +
        " Title and origination still vary by company. " +
        UTAH_CLOSING_NOTES.titleVaries,
    },
  ],
  related: [
    { label: "Utah closing costs: title, origination, prepaids", href: "/blog/utah-closing-costs-title-origination-prepaids" },
    { label: "Owner’s vs lender’s title insurance", href: "/blog/title-insurance-owner-vs-lender" },
    { label: "Impounds vs waiving escrow", href: "/blog/impounds-vs-waiving-escrow" },
    { label: "Escrow shortage after the first year", href: "/blog/escrow-shortage-after-first-year" },
    { label: "Earnest money vs down payment vs closing costs", href: "/blog/earnest-money-vs-down-payment-vs-closing-costs" },
    { label: "Cash besides down payment", href: "/blog/utah-cash-to-close-besides-down-payment" },
    { label: "First-time buyer hub", href: "/learn/first-time" },
  ],
}

const REFINANCE: CalculatorInputCopy = {
  slug: "refinance",
  heading: "Include points and origination in break-even",
  lead: `A lower note rate still loses if you move or refinance again before costs are earned back. Put points, origination, title, and prepaid interest into closing costs — not just the appraisal. Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Current balance, rate, and remaining term",
      meaning: "Use the note you have, not a statement “remaining interest.” Remaining term changes how much interest you would have paid anyway.",
    },
    {
      name: "New rate",
      meaning: "Illustration only. Discount points that buy the rate down belong in closing costs, not hidden in the rate field.",
    },
    {
      name: "Closing costs (include points and origination)",
      meaning:
        "Origination can be a fee or a lender credit. Discount points are a prepaid interest cost. Title, recording, and prepaid interest still apply. Break-even months = those costs ÷ monthly principal-and-interest savings. Credits reduce the numerator.",
    },
  ],
  related: [
    { label: "When a lower rate still loses after costs", href: "/blog/refinance-break-even-when-lower-rate-loses" },
    { label: "“No closing cost” refinance: the cost is in the rate", href: "/blog/no-closing-cost-refinance-rate-credit-tradeoff" },
    { label: "Discount points: breakeven without a sales pitch", href: "/blog/discount-points-breakeven-without-sales-pitch" },
    { label: "FHA / VA streamline: what less docs still requires", href: "/blog/fha-va-streamline-refinance-less-docs" },
    { label: "Recast vs refinance", href: "/blog/recast-vs-refinance" },
    { label: "Delayed financing after a cash purchase", href: "/blog/delayed-financing-after-cash-purchase" },
  ],
}

const MORTGAGE_PAYMENT: CalculatorInputCopy = {
  slug: "mortgage-payment",
  heading: "Payment inputs vs a Loan Estimate",
  lead: "Principal and interest are the easy part. Taxes, insurance, HOA, and mortgage insurance are why two files with the same rate do not have the same payment.",
  fields: [
    {
      name: "Price, down payment, rate, term",
      meaning: "These set P&I. The typed rate is not APR and is not a lock.",
    },
    {
      name: "Taxes, insurance, PMI/MIP",
      meaning:
        DTI_EDUCATION.frontendNote +
        " PMI on conventional can often be removed with equity; FHA MIP often cannot. VA has a funding fee instead of monthly PMI.",
    },
  ],
  related: [
    { label: "How MIP vs PMI actually leaves the loan", href: "/blog/mip-vs-pmi-how-mortgage-insurance-ends" },
    { label: "DTI with HOA", href: "/blog/dti-frontend-backend-with-hoa" },
    { label: "Discount points breakeven", href: "/blog/discount-points-breakeven-without-sales-pitch" },
    { label: "Interest-only: who it is for", href: "/blog/interest-only-mortgages-who-they-are-for" },
    { label: "Why your quote is not the 30-year average", href: "/buy/rates" },
  ],
}

const TEMPORARY_BUYDOWN_COPY: CalculatorInputCopy = {
  slug: "temporary-buydown",
  heading: "What this buydown calculator is modeling",
  lead: `A 2-1 or 3-2-1 lowers the payment for a few years with a subsidy. The note rate does not change. Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Note rate and loan amount",
      meaning:
        "The note is the payment you eventually pay in full. The calculator does not lock a rate or quote APR.",
    },
    {
      name: "Structure (2-1, 3-2-1, or flat)",
      meaning:
        "These are payment subsidies with an end date. They are not discount points, which lower the note for the life of the loan.",
    },
    {
      name: "Who pays",
      meaning:
        "Seller, builder, borrower, or a lender credit can fund the subsidy. A flyer that says “free buydown” still has to show the cost on the Loan Estimate.",
    },
  ],
  related: [
    { label: "Temporary buydown: who pays, year 3", href: "/blog/temporary-buydown-who-pays-year-three" },
    { label: "Discount points breakeven", href: "/blog/discount-points-breakeven-without-sales-pitch" },
    { label: "Rates hub", href: "/buy/rates" },
  ],
}

const DSCR: CalculatorInputCopy = {
  slug: "dscr",
  heading: "What this DSCR calculator is modeling",
  lead: `Debt-service coverage here is an illustration of rent versus the proposed payment. It is not personal DTI, not underwriting, and not a DSCR product overlay. Snapshot as of ${LENDING_FACTS_AS_OF}.`,
  fields: [
    {
      name: "Monthly or annual rent",
      meaning:
        "Use supportable market rent or in-place leases, not a listing screenshot. A DSCR investor still haircuts vacancy and expenses. This field is not Schedule E history on properties you already own.",
    },
    {
      name: "Taxes, insurance, vacancy, and operating expenses",
      meaning:
        "Full-doc rental files use a different worksheet (often Schedule E). DSCR overlays set their own vacancy and expense haircuts. The calculator cannot see your tax returns or your occupancy.",
    },
    {
      name: "Loan amount, rate, term, required DSCR",
      meaning:
        "The typed rate is not a quote or APR. Required DSCR (often around 1.0–1.25 depending on the investor) is an overlay, not a published right. Occupancy on a DSCR purchase is typically investment.",
    },
  ],
  related: [
    { label: "DSCR vs full-doc rental loan", href: "/blog/dscr-vs-full-doc-rental-loan" },
    { label: "Asset-depletion qualifying", href: "/blog/asset-depletion-qualifying-non-qm" },
    { label: "Non-QM hub", href: "/learn/non-qm" },
    { label: "Investment financing hub", href: "/learn/investment" },
    { label: "Schedule E rental income", href: "/blog/schedule-e-rental-income-purchase-file" },
  ],
}

const COPY_BY_SLUG: Record<string, CalculatorInputCopy> = {
  affordability: AFFORDABILITY,
  income: INCOME,
  "closing-cost": CLOSING,
  refinance: REFINANCE,
  "mortgage-payment": MORTGAGE_PAYMENT,
  "temporary-buydown": TEMPORARY_BUYDOWN_COPY,
  dscr: DSCR,
}

export function calculatorInputCopyForSlug(slug: string): CalculatorInputCopy | undefined {
  return COPY_BY_SLUG[slug]
}

export function calculatorInputCopySlugs(): string[] {
  return Object.keys(COPY_BY_SLUG)
}
