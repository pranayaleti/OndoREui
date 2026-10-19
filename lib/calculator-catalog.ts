/**
 * Shared calculator titles and descriptions for SEO, sitemap, and calculator routes.
 *
 * `name` and `description` are the UI copy. `seoTitle` / `seoDescription`
 * override them in <title> and the meta description where search intent
 * differs from the label: every one of these titles shipped without the word
 * "Utah", which is why /calculators/closing-cost/ sat at position 64 on
 * "how much are closing costs in utah" (682 impressions, no clicks).
 * Routes fall back to `Utah ${name}` when no override is set.
 */
export const CALCULATOR_CATALOG: Record<
  string,
  {
    name: string
    description: string
    applicationCategory?: string
    seoTitle?: string
    seoDescription?: string
  }
> = {
  "owner-vs-self": {
    seoTitle: "Property Manager vs Self-Managing: Cost Calculator",
    seoDescription:
      "Hire a Utah property manager or self-manage? Compare management fees against your hours, vacancy risk and turnover cost with real numbers.",
    name: "Self-Manage vs Ondo RE Calculator",
    description:
      "Compare annual net income from self-managing your Utah rental vs handing it to Ondo, including the hidden cost of your own time.",
    applicationCategory: "FinancialApplication",
  },
  "mortgage-payment": {
    seoTitle: "Utah Mortgage Calculator: Payment With Taxes & PMI",
    seoDescription:
      "Estimate a Utah mortgage payment including property taxes, insurance and PMI. See how rate, term and down payment move the monthly number.",
    name: "Mortgage Payment Calculator",
    description: "Estimate monthly mortgage payments with taxes, insurance, and PMI.",
  },
  affordability: {
    seoTitle: "Utah Home Affordability Calculator: What You Can Buy",
    seoDescription:
      "Find the Utah home price your income, debts and down payment actually support, using the same debt-to-income limits lenders apply.",
    name: "Home Affordability Calculator",
    description: "Estimate what home price fits your income, debts, and expenses.",
  },
  income: {
    name: "Required Income Calculator",
    description: "Calculate the income needed to qualify for your target home price.",
  },
  "closing-cost": {
    seoTitle: "Utah Closing Cost Calculator: What Buyers Pay",
    seoDescription:
      "Estimate closing costs on a Utah home purchase: title, escrow, origination, appraisal and prepaid taxes, broken out line by line before you offer.",
    name: "Closing Cost Calculator",
    description: "Estimate buyer closing costs, taxes, and prepaid expenses.",
  },
  refinance: {
    seoTitle: "Utah Refinance Calculator: Break-Even & Savings",
    seoDescription:
      "How many months it takes a Utah refinance to pay for itself. Compare new payment, total interest and closing costs against your current loan.",
    name: "Refinance Savings Calculator",
    description: "Model payment changes and break-even timing for a refinance.",
  },
  "home-sale": {
    seoTitle: "Utah Home Sale Calculator: Your Net Proceeds",
    seoDescription:
      "See what you actually walk away with when you sell a Utah home: commission, title, payoff, prorated taxes and concessions, netted out.",
    name: "Home Sale Proceeds Calculator",
    description: "Estimate net proceeds after agent fees, taxes, and payoff.",
  },
  "temporary-buydown": {
    name: "Temporary Buydown Calculator",
    description:
      "Model 2-1, 3-2-1, or flat temporary payment subsidies (note rate stays fixed; cost ≈ subsidy sum).",
  },
  "rent-vs-own": {
    name: "Rent vs Own Calculator",
    description: "Compare long-term costs and equity between renting and owning.",
  },
  "cash-on-cash": {
    name: "Cash-on-Cash Return Calculator",
    description: "Calculate cash-on-cash return for an investment property.",
  },
  "cap-rate": {
    name: "Cap Rate Calculator",
    description: "Compute capitalization rate from NOI and purchase price.",
  },
  roi: {
    name: "ROI Calculator",
    description: "Measure total ROI for a real estate investment with costs.",
  },
  dscr: {
    name: "DSCR Calculator",
    description: "Estimate debt service coverage ratio for rental financing.",
  },
  "one-percent-rule": {
    seoTitle: "Utah 1% and 50% Rule Calculator for Rentals",
    seoDescription: "Screen a Utah rental two ways in one place: rent as a share of price (the 1% rule) and expenses as half of rent (the 50% rule).",
    name: "1% and 50% Rule Calculator",
    description: "Screen a rental two ways: rent as a share of price (1%) and operating expenses as half of rent (50%).",
  },
}

export const CALCULATOR_SLUGS = Object.keys(CALCULATOR_CATALOG)
