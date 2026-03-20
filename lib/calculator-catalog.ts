/** Shared calculator titles and descriptions for SEO, sitemap, and calculator routes. */
export const CALCULATOR_CATALOG: Record<
  string,
  { name: string; description: string; applicationCategory?: string }
> = {
  "mortgage-payment": {
    name: "Mortgage Payment Calculator",
    description: "Estimate monthly mortgage payments with taxes, insurance, and PMI.",
  },
  affordability: {
    name: "Home Affordability Calculator",
    description: "Estimate what home price fits your income, debts, and expenses.",
  },
  income: {
    name: "Required Income Calculator",
    description: "Calculate the income needed to qualify for your target home price.",
  },
  "closing-cost": {
    name: "Closing Cost Calculator",
    description: "Estimate buyer closing costs, taxes, and prepaid expenses.",
  },
  refinance: {
    name: "Refinance Savings Calculator",
    description: "Model payment changes and break-even timing for a refinance.",
  },
  "home-sale": {
    name: "Home Sale Proceeds Calculator",
    description: "Estimate net proceeds after agent fees, taxes, and payoff.",
  },
  "buying-power": {
    name: "Buying Power Calculator",
    description: "See how rate, down payment, and debts change your buying power.",
  },
  "temporary-buydown": {
    name: "Temporary Buydown Calculator",
    description: "Model 2-1 or 3-2-1 buydown payment relief and total costs.",
  },
  "rent-vs-own": {
    name: "Rent vs Own Calculator",
    description: "Compare long-term costs and equity between renting and owning.",
  },
  retirement: {
    name: "Retirement Savings Calculator",
    description: "Project retirement savings growth and future income needs.",
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
  grm: {
    name: "GRM Calculator",
    description: "Calculate gross rent multiplier from price and rent.",
  },
  dscr: {
    name: "DSCR Calculator",
    description: "Estimate debt service coverage ratio for rental financing.",
  },
  "one-percent-rule": {
    name: "1% Rule Calculator",
    description: "Check if a property's rent meets the 1% rule benchmark.",
  },
  "fifty-percent-rule": {
    name: "50% Rule Calculator",
    description: "Estimate expenses quickly using the 50% rental rule.",
  },
}

export const CALCULATOR_SLUGS = Object.keys(CALCULATOR_CATALOG)
