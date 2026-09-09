/**
 * Ondo real estate glossary.
 *
 * One entry per term people actually type into a search box. Each entry powers
 * three surfaces from a single definition:
 *   1. `/glossary/` — the browsable index (search + category + A–Z).
 *   2. `/glossary/{slug}/` — a standalone page with its own title, canonical and
 *      `DefinedTerm` structured data, so a search for the term can land here.
 *   3. Inline term strips on calculators and service pages.
 *
 * Editorial rules for anything added here:
 * - `short` is one sentence and doubles as the meta description. Keep it under
 *   about 155 characters so it is not truncated in a result snippet.
 * - Do NOT restate a rate, fee, limit, or program threshold inline. Those live in
 *   `lending-facts.ts` with an `asOf` stamp and a source note; reference that
 *   module or link to the page that carries it. A number copied into a glossary
 *   entry goes stale silently.
 * - Set `lending: true` on anything touching credit, rates, payments or loan
 *   terms. The term page appends the standard lending disclosure automatically;
 *   it is a template property, never something an author remembers to add.
 * - Definitions explain what a term means. They do not promise an outcome, quote
 *   a price, or imply a credit decision.
 */

import { LENDING_FACTS_AS_OF } from "./lending-facts"

export const GLOSSARY_CATEGORIES = [
  "mortgage",
  "buying",
  "selling",
  "investing",
  "renting",
  "closing",
] as const

export type GlossaryCategory = (typeof GLOSSARY_CATEGORIES)[number]

export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  mortgage: "Mortgage & lending",
  buying: "Buying a home",
  selling: "Selling a home",
  investing: "Investing",
  renting: "Renting & management",
  closing: "Closing, title & notary",
}

export const GLOSSARY_CATEGORY_BLURBS: Record<GlossaryCategory, string> = {
  mortgage: "How loans are priced, qualified, and paid down.",
  buying: "The purchase contract, inspections, and what happens between offer and keys.",
  selling: "Pricing, listing, and what you actually walk away with.",
  investing: "The return metrics owners and investors use to compare deals.",
  renting: "Leases, deposits, screening, and day-to-day management.",
  closing: "Title, escrow, signing, and the notary step at the end.",
}

export type GlossaryLink = {
  label: string
  href: string
}

export type GlossaryTerm = {
  /** URL segment. Stable — changing it breaks an indexed page. */
  slug: string
  term: string
  /** Abbreviations and alternate phrasings people search. Feeds on-page search only. */
  aliases?: readonly string[]
  category: GlossaryCategory
  /** One sentence, doubles as the meta description. Under ~155 characters. */
  short: string
  /** Body copy. Each entry is a paragraph. */
  definition: readonly string[]
  /** Optional "so what" framing, rendered as a callout. */
  whyItMatters?: string
  /** Other glossary slugs worth reading next. */
  seeAlso?: readonly string[]
  /** Calculator slugs this term is an input or output of. */
  calculators?: readonly string[]
  /** Ondo pages that go deeper on the term. */
  related?: readonly GlossaryLink[]
  /** Appends the standard lending disclosure. Set for anything about credit, rates, or payments. */
  lending?: boolean
}

/** Snapshot stamp shown on lending entries, so a reader knows when it was written. */
export const GLOSSARY_AS_OF = LENDING_FACTS_AS_OF

const MORTGAGE_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "apr",
    term: "APR (Annual Percentage Rate)",
    aliases: ["annual percentage rate", "apr vs rate"],
    category: "mortgage",
    short:
      "The yearly cost of a loan expressed as a percentage, including the interest rate plus most lender fees.",
    definition: [
      "APR bundles the note rate together with most of the lender’s cost of doing the loan — origination, discount points, and certain other charges — and re-expresses the whole thing as a single annual percentage. It exists so two offers with different fee structures can be compared on one number.",
      "APR is almost always higher than the note rate, because the note rate alone ignores fees. The note rate is what actually determines your monthly principal and interest; APR is a comparison tool, not the number your payment is calculated from.",
    ],
    whyItMatters:
      "A lower rate with high fees can carry a higher APR than a slightly higher rate with none. Compare both numbers on the Loan Estimate rather than shopping on rate alone.",
    seeAlso: ["interest-rate", "discount-points", "loan-estimate", "origination-fee"],
    calculators: ["mortgage-payment", "refinance"],
    related: [{ label: "APR vs rate on a Loan Estimate", href: "/blog/apr-vs-rate-on-a-loan-estimate/" }],
    lending: true,
  },
  {
    slug: "amortization",
    term: "Amortization",
    aliases: ["amortisation", "amortization schedule"],
    category: "mortgage",
    short:
      "The schedule that splits each mortgage payment between interest and principal over the life of the loan.",
    definition: [
      "On a fully amortizing loan, every payment is the same size but its composition changes. Early payments are mostly interest, because interest is charged on a large remaining balance. As the balance falls, more of each payment goes to principal.",
      "That front-loading is why paying extra in the first years reduces total interest so much more than the same dollar paid near the end, and why a homeowner who sells after a few years has built less equity than the number of payments might suggest.",
    ],
    seeAlso: ["principal", "interest-rate", "recast", "piti"],
    calculators: ["mortgage-payment"],
    related: [{ label: "Mortgage paydown strategies", href: "/blog/mortgage-paydown-hacks/" }],
    lending: true,
  },
  {
    slug: "arm",
    term: "ARM (Adjustable-Rate Mortgage)",
    aliases: ["adjustable rate mortgage", "5/1 arm", "7/6 arm", "variable rate mortgage"],
    category: "mortgage",
    short:
      "A mortgage whose interest rate is fixed for an initial period and then adjusts on a set schedule against an index.",
    definition: [
      "An ARM is quoted as two numbers — an initial fixed period and an adjustment frequency after it. Once the fixed period ends, the rate resets periodically to an index plus a margin, within limits set by the note’s caps.",
      "The caps are the part worth reading closely: there is normally a limit on the first adjustment, a limit on each later adjustment, and a lifetime ceiling. Those three numbers, not the teaser rate, define your actual worst case.",
    ],
    whyItMatters:
      "An ARM can make sense when the fixed period comfortably outlasts how long you expect to hold the loan. It is a bet on your own timeline, so price the worst case before taking one.",
    seeAlso: ["fixed-rate-mortgage", "interest-rate", "refinance"],
    related: [{ label: "ARM caps in plain English", href: "/blog/arm-caps-in-plain-english/" }],
    lending: true,
  },
  {
    slug: "closing-costs",
    term: "Closing costs",
    aliases: ["settlement costs", "cash to close"],
    category: "mortgage",
    short:
      "The lender, title, and third-party fees due at closing — separate from your down payment.",
    definition: [
      "Closing costs cover the work of originating the loan and transferring title: origination and underwriting charges, appraisal, credit report, title search and title insurance, recording fees, and the settlement agent’s fee.",
      "They are distinct from both the down payment and prepaids. Down payment is equity you are putting into the property; prepaids are your own future taxes and insurance funded in advance. All three land on the same wire, which is why the total surprises people.",
    ],
    seeAlso: ["prepaids", "down-payment", "earnest-money", "closing-disclosure", "seller-concessions"],
    calculators: ["closing-cost", "home-sale"],
    related: [
      { label: "Utah closing costs: title, origination, prepaids", href: "/blog/utah-closing-costs-title-origination-prepaids/" },
      { label: "Cash to close beyond the down payment", href: "/blog/utah-cash-to-close-besides-down-payment/" },
    ],
    lending: true,
  },
  {
    slug: "conforming-loan",
    term: "Conforming loan",
    aliases: ["conforming limit", "agency loan"],
    category: "mortgage",
    short:
      "A conventional mortgage that fits the size and eligibility rules the major agencies will buy.",
    definition: [
      "A conforming loan stays within the maximum loan amount published for its county and meets the agencies’ underwriting rules. Because those loans can be sold into a deep secondary market, they generally price better than loans that cannot.",
      "The limit is set by county and is republished periodically, so a loan that is conforming in one county may be a jumbo one county over. Look up the current figure for the specific county rather than assuming a national number.",
    ],
    seeAlso: ["jumbo-loan", "conventional-loan", "loan-to-value"],
    related: [{ label: "Looking up your county loan limit", href: "/blog/utah-county-conforming-loan-limit-lookup/" }],
    lending: true,
  },
  {
    slug: "conventional-loan",
    term: "Conventional loan",
    category: "mortgage",
    short:
      "A mortgage not insured or guaranteed by a government program such as FHA, VA, or USDA.",
    definition: [
      "Conventional loans follow agency guidelines rather than a government insurance program. They tend to reward stronger credit and more equity, and they allow mortgage insurance to be removed once the loan reaches the program’s equity threshold — which government-insured loans do not always permit.",
      "Lenders layer their own overlays on top of agency guidelines, so two lenders can reach different answers on the same file.",
    ],
    seeAlso: ["fha-loan", "va-loan", "usda-loan", "pmi", "conforming-loan"],
    related: [{ label: "Conventional loans in Utah", href: "/loans/conventional/" }],
    lending: true,
  },
  {
    slug: "dti",
    term: "DTI (Debt-to-Income Ratio)",
    aliases: ["debt to income", "debt-to-income", "back-end ratio", "front-end ratio"],
    category: "mortgage",
    short:
      "The share of your gross monthly income taken up by monthly debt payments, including the proposed housing payment.",
    definition: [
      "Underwriters usually look at two ratios. The front-end ratio counts only the housing payment. The back-end ratio counts the housing payment plus the other monthly obligations reporting on your credit — car loans, minimum card payments, student loans, and support obligations.",
      "What counts is narrower than most people expect. It is monthly obligations on the credit report, not your whole budget: groceries, utilities, and childcare generally do not appear, while a car payment you intend to pay off soon still does.",
    ],
    whyItMatters:
      "DTI is usually the constraint that decides how much home you qualify for — more often than the down payment. Published maximums are not a promise that a high-DTI file will be approved.",
    seeAlso: ["pre-approval", "underwriting", "piti", "hoa"],
    calculators: ["affordability", "income", "buying-power"],
    related: [{ label: "DTI, front-end and back-end, with HOA", href: "/blog/dti-frontend-backend-with-hoa/" }],
    lending: true,
  },
  {
    slug: "discount-points",
    term: "Discount points",
    aliases: ["points", "buying down the rate", "mortgage points"],
    category: "mortgage",
    short:
      "An optional upfront fee paid to the lender in exchange for a permanently lower interest rate.",
    definition: [
      "One point is one percent of the loan amount, paid at closing, in exchange for a lower note rate for the life of the loan. Points are optional, and how much rate each point buys varies by lender and by day.",
      "The only honest way to evaluate points is a break-even: divide what the points cost by the monthly payment they save, and compare that number of months against how long you realistically expect to keep the loan.",
    ],
    whyItMatters:
      "Points reward a long hold. If you refinance or sell before the break-even, you paid for a discount you never collected.",
    seeAlso: ["apr", "interest-rate", "rate-lock", "temporary-buydown"],
    calculators: ["mortgage-payment", "refinance"],
    related: [{ label: "Discount points break-even, without the sales pitch", href: "/blog/discount-points-breakeven-without-sales-pitch/" }],
    lending: true,
  },
  {
    slug: "down-payment",
    term: "Down payment",
    category: "mortgage",
    short:
      "The share of the purchase price you pay in cash, becoming your starting equity in the property.",
    definition: [
      "The down payment sets your loan-to-value ratio, which in turn drives pricing and whether mortgage insurance is required. It is separate from closing costs and prepaids, which are due on the same day but are not equity.",
      "Minimums differ by program, and gift funds from an eligible donor are often allowed when the paper trail is documented properly. Programs and lender overlays both apply, so confirm the requirement for your specific file.",
    ],
    seeAlso: ["loan-to-value", "pmi", "closing-costs", "earnest-money", "gift-funds"],
    calculators: ["affordability", "buying-power", "mortgage-payment"],
    related: [
      { label: "Should you wait for 20% down?", href: "/blog/should-i-wait-for-20-percent-down/" },
      { label: "Down payment assistance and gift funds", href: "/blog/gift-funds-down-payment-rules/" },
    ],
    lending: true,
  },
  {
    slug: "escrow-account",
    term: "Escrow account (impounds)",
    aliases: ["impound account", "escrow impounds", "escrow analysis"],
    category: "mortgage",
    short:
      "An account your servicer uses to collect and pay your property taxes and homeowners insurance alongside the mortgage payment.",
    definition: [
      "Rather than paying taxes and insurance in lump sums, you pay one twelfth each month with the mortgage. The servicer holds the money and pays the bills when they come due, then re-analyzes the account periodically and adjusts the monthly figure.",
      "Because taxes and insurance premiums change, the escrow portion of your payment changes too — which is why a payment can rise even on a fixed-rate loan. A shortage after the first year is common when the initial estimate was based on pre-sale figures.",
    ],
    whyItMatters:
      "The escrow account is why “fixed rate” does not mean “fixed payment.” Only principal and interest are fixed.",
    seeAlso: ["piti", "prepaids", "property-tax", "homeowners-insurance"],
    related: [
      { label: "How the escrow cushion is set", href: "/blog/escrow-cushion-how-it-is-set/" },
      { label: "Escrow shortage after year one", href: "/blog/escrow-shortage-after-first-year/" },
    ],
    lending: true,
  },
  {
    slug: "fha-loan",
    term: "FHA loan",
    aliases: ["fha", "federal housing administration loan"],
    category: "mortgage",
    short:
      "A government-insured mortgage designed to widen access to financing, with lower down payment and credit thresholds than most conventional loans.",
    definition: [
      "FHA loans are insured by the Federal Housing Administration, which lets lenders accept lower down payments and lower credit scores than a typical conventional file. In exchange, the borrower pays mortgage insurance — an upfront premium that is often financed, plus an annual premium collected monthly.",
      "Most lenders apply overlays stricter than HUD’s published floor, so a published minimum is not a guarantee a file will be originated. FHA loans are generally for a primary residence, with limited exceptions.",
    ],
    seeAlso: ["mip", "conventional-loan", "down-payment", "house-hacking"],
    related: [
      { label: "FHA loans in Utah", href: "/loans/fha/" },
      { label: "FHA vs conventional in Utah", href: "/blog/fha-vs-conventional-loans-utah/" },
    ],
    lending: true,
  },
  {
    slug: "fixed-rate-mortgage",
    term: "Fixed-rate mortgage",
    aliases: ["30 year fixed", "15 year fixed"],
    category: "mortgage",
    short:
      "A mortgage whose interest rate never changes, so principal and interest stay the same for the full term.",
    definition: [
      "The note rate is locked for the life of the loan. A shorter term generally carries a lower rate and much less total interest, at the cost of a higher required monthly payment; a longer term does the reverse.",
      "Fixed rate fixes principal and interest only. Taxes, insurance, HOA dues, and mortgage insurance can all still move, so the total payment is not frozen.",
    ],
    seeAlso: ["arm", "amortization", "escrow-account", "piti"],
    calculators: ["mortgage-payment"],
    related: [
      { label: "30-year fixed", href: "/buy/30-year/" },
      { label: "15-year fixed", href: "/buy/15-year/" },
    ],
    lending: true,
  },
  {
    slug: "heloc",
    term: "HELOC (Home Equity Line of Credit)",
    aliases: ["home equity line of credit", "equity line"],
    category: "mortgage",
    short:
      "A revolving credit line secured by your home equity, drawn and repaid like a credit card during a draw period.",
    definition: [
      "A HELOC gives you a limit you can draw against during a draw period, typically paying interest only on what is drawn, followed by a repayment period when the balance amortizes. The rate is usually variable.",
      "Because it is secured by the home, a HELOC prices better than unsecured credit — and carries the corresponding risk. Lenders commonly require seasoning and a maximum combined loan-to-value across all liens.",
    ],
    seeAlso: ["cash-out-refinance", "equity", "loan-to-value", "lien"],
    related: [
      { label: "HELOC options", href: "/loans/heloc/" },
      { label: "HELOC vs cash-out refinance", href: "/blog/heloc-vs-cash-out-refinance/" },
    ],
    lending: true,
  },
  {
    slug: "interest-rate",
    term: "Interest rate (note rate)",
    aliases: ["note rate", "mortgage rate"],
    category: "mortgage",
    short:
      "The percentage charged on your loan balance — the number your principal and interest payment is calculated from.",
    definition: [
      "The note rate is what the promissory note obligates you to pay on the outstanding balance. It drives the principal and interest portion of the payment; it does not include fees, which is what separates it from APR.",
      "A rate you see quoted in the news is an average across many files with assumptions attached. Your rate depends on credit, loan-to-value, occupancy, property type, program, and the day you lock.",
    ],
    seeAlso: ["apr", "rate-lock", "discount-points", "arm"],
    calculators: ["mortgage-payment", "buying-power"],
    related: [
      { label: "Mortgage rates explained", href: "/buy/rates/" },
      { label: "Why the headline average is not your quote", href: "/blog/mortgage-rate-trends-2025/" },
    ],
    lending: true,
  },
  {
    slug: "jumbo-loan",
    term: "Jumbo loan",
    aliases: ["non-conforming loan"],
    category: "mortgage",
    short:
      "A mortgage larger than the conforming limit for its county, underwritten to the lender’s own standards.",
    definition: [
      "Because a jumbo cannot be sold into the agency market, the lender holds more of the risk and sets the guidelines. That commonly means more reserves, tighter credit, and more documentation than a conforming file of the same size would need.",
      "Whether a loan is jumbo depends on the county limit, not on whether the house feels expensive.",
    ],
    seeAlso: ["conforming-loan", "conventional-loan", "reserves"],
    related: [{ label: "Jumbo loans in Utah", href: "/loans/jumbo/" }],
    lending: true,
  },
  {
    slug: "loan-estimate",
    term: "Loan Estimate",
    aliases: ["le", "loan estimate form"],
    category: "mortgage",
    short:
      "A standardized three-page disclosure showing a loan’s rate, payment, and closing costs in a fixed format.",
    definition: [
      "Lenders must provide a Loan Estimate shortly after an application, and the format is identical across lenders — which makes it the only reliable way to compare two offers line by line.",
      "Compare the rate, the APR, the total closing costs, and the cash to close together. A quote delivered as a text message or a screenshot is not a Loan Estimate and is not comparable.",
    ],
    whyItMatters:
      "Ask every lender for a Loan Estimate on the same day. Rates move, so quotes gathered a week apart are not a fair comparison.",
    seeAlso: ["apr", "closing-disclosure", "closing-costs", "origination-fee"],
    related: [{ label: "APR vs rate on a Loan Estimate", href: "/blog/apr-vs-rate-on-a-loan-estimate/" }],
    lending: true,
  },
  {
    slug: "loan-to-value",
    term: "LTV (Loan-to-Value Ratio)",
    aliases: ["ltv", "loan to value", "cltv", "combined loan to value"],
    category: "mortgage",
    short:
      "The loan amount as a percentage of the property’s value — the main measure of how much equity cushions the loan.",
    definition: [
      "LTV is the loan divided by the lesser of purchase price or appraised value. A lower LTV means more equity, which generally improves pricing and can remove the need for mortgage insurance.",
      "Combined LTV (CLTV) adds every lien on the property, which is the figure that matters when a second mortgage or HELOC sits behind the first.",
    ],
    seeAlso: ["down-payment", "pmi", "equity", "heloc", "appraisal"],
    calculators: ["mortgage-payment", "refinance"],
    lending: true,
  },
  {
    slug: "mip",
    term: "MIP (Mortgage Insurance Premium)",
    aliases: ["fha mortgage insurance", "upfront mip", "annual mip"],
    category: "mortgage",
    short:
      "The mortgage insurance charged on an FHA loan: an upfront premium plus an annual premium collected monthly.",
    definition: [
      "MIP protects the FHA insurance fund, not the borrower. The upfront premium is commonly financed into the loan; the annual premium is divided across twelve payments.",
      "MIP and conventional PMI end differently. PMI can generally be removed once the loan reaches the program’s equity threshold; on many FHA loans the annual premium stays for the life of the loan unless the borrower refinances out of FHA entirely.",
    ],
    whyItMatters:
      "That difference in how the insurance ends is often the deciding factor between FHA and conventional — not the rate.",
    seeAlso: ["pmi", "fha-loan", "conventional-loan", "refinance"],
    related: [{ label: "How mortgage insurance actually ends", href: "/blog/mip-vs-pmi-how-mortgage-insurance-ends/" }],
    lending: true,
  },
  {
    slug: "pmi",
    term: "PMI (Private Mortgage Insurance)",
    aliases: ["private mortgage insurance", "mortgage insurance"],
    category: "mortgage",
    short:
      "Insurance on a conventional loan that protects the lender when the borrower has less than the program’s required equity.",
    definition: [
      "PMI is typically required on a conventional loan above the program’s loan-to-value threshold. It is priced from credit and LTV, collected monthly, and protects the lender rather than the borrower.",
      "Unlike FHA’s annual MIP, PMI can usually be removed — either automatically as the balance amortizes down, or on request once the equity threshold is met under the program’s rules, sometimes supported by a new appraisal.",
    ],
    seeAlso: ["mip", "loan-to-value", "down-payment", "conventional-loan"],
    calculators: ["mortgage-payment", "affordability"],
    related: [{ label: "PMI removal: original value vs new appraisal", href: "/blog/pmi-removal-original-value-vs-new-appraisal/" }],
    lending: true,
  },
  {
    slug: "piti",
    term: "PITI",
    aliases: ["principal interest taxes insurance", "pitia"],
    category: "mortgage",
    short:
      "Principal, Interest, Taxes and Insurance — the four parts of a typical monthly mortgage payment.",
    definition: [
      "Principal and interest repay the loan. Taxes and insurance are collected into an escrow account and paid on your behalf. Underwriters often work with PITIA, which adds association dues where they apply.",
      "Quoting only principal and interest understates a real payment substantially, because taxes, insurance, and any association dues are due whether or not they are escrowed.",
    ],
    seeAlso: ["escrow-account", "dti", "hoa", "property-tax", "reserves"],
    calculators: ["mortgage-payment", "affordability"],
    lending: true,
  },
  {
    slug: "pre-approval",
    term: "Pre-approval",
    aliases: ["preapproval", "pre approval"],
    category: "mortgage",
    short:
      "A lender’s conditional commitment to lend after reviewing your credit, income, and assets — stronger than a pre-qualification.",
    definition: [
      "A pre-approval follows an application and a review of actual documentation, and normally includes an automated underwriting decision. It is what a listing agent expects to see attached to an offer.",
      "It is still conditional. Final approval depends on the appraisal, title, and a re-verification of your credit and employment before closing — which is why new debt during underwriting can undo one.",
    ],
    whyItMatters:
      "Pre-approval, automated underwriting findings, and clear-to-close are three different milestones. Knowing which one you have tells you how firm your position really is.",
    seeAlso: ["pre-qualification", "underwriting", "dti", "rate-lock"],
    related: [
      { label: "Pre-approval vs AUS vs clear-to-close", href: "/blog/pre-approval-vs-aus-vs-clear-to-close/" },
      { label: "Get pre-qualified", href: "/qualify/" },
    ],
    lending: true,
  },
  {
    slug: "pre-qualification",
    term: "Pre-qualification",
    aliases: ["prequalification", "pre qual"],
    category: "mortgage",
    short:
      "An early estimate of what you might borrow, based on information you provide rather than verified documentation.",
    definition: [
      "A pre-qualification is a conversation and a rough calculation. Nothing has been verified, so it carries far less weight with a seller than a pre-approval.",
      "It is still useful at the start: it sets a realistic price range before you spend weekends touring homes outside it.",
    ],
    seeAlso: ["pre-approval", "dti", "underwriting"],
    calculators: ["affordability", "income"],
    related: [{ label: "Get pre-qualified", href: "/qualify/" }],
    lending: true,
  },
  {
    slug: "prepaids",
    term: "Prepaids",
    aliases: ["prepaid items", "prepaid interest"],
    category: "mortgage",
    short:
      "Money collected at closing to fund your own future taxes and insurance, plus interest from closing to month end.",
    definition: [
      "Prepaids are not a lender fee. They are your own expenses collected early: the first year of homeowners insurance, the initial deposit into the escrow account, and interest covering the days between closing and the start of the first full month.",
      "They are frequently mistaken for closing costs. Both are due at closing, but prepaids fund an account you benefit from, while closing costs pay for services.",
    ],
    seeAlso: ["closing-costs", "escrow-account", "homeowners-insurance", "property-tax"],
    calculators: ["closing-cost"],
    related: [{ label: "Utah closing costs: title, origination, prepaids", href: "/blog/utah-closing-costs-title-origination-prepaids/" }],
    lending: true,
  },
  {
    slug: "principal",
    term: "Principal",
    category: "mortgage",
    short: "The amount borrowed and still owed, separate from the interest charged on it.",
    definition: [
      "Principal is the balance itself. Each payment reduces it a little, and interest for the next period is charged on whatever remains.",
      "An extra payment applied directly to principal removes all the future interest that balance would have generated — which is why extra principal early in the schedule is worth far more than the same amount later.",
    ],
    seeAlso: ["amortization", "interest-rate", "recast", "equity"],
    calculators: ["mortgage-payment"],
    related: [{ label: "Biweekly and extra principal vs refinancing", href: "/blog/biweekly-extra-principal-vs-refinance/" }],
    lending: true,
  },
  {
    slug: "rate-lock",
    term: "Rate lock",
    aliases: ["lock", "locking your rate", "float"],
    category: "mortgage",
    short:
      "A lender’s commitment to hold a quoted interest rate for a set number of days while your loan is processed.",
    definition: [
      "Locking protects you from rate movement between application and closing, for a defined period. Letting the rate float leaves you exposed to the market in both directions.",
      "If a lock expires before closing, an extension usually has a cost. If rates fall meaningfully after you lock, whether you can capture that depends on the lender’s written float-down policy — which is a specific product feature, not a courtesy.",
    ],
    seeAlso: ["interest-rate", "discount-points", "underwriting"],
    related: [
      { label: "Lock vs float, and extensions", href: "/blog/rate-lock-extension-vs-floating/" },
      { label: "What a lock does if rates drop", href: "/blog/rate-lock-if-rates-drop/" },
    ],
    lending: true,
  },
  {
    slug: "recast",
    term: "Recast",
    aliases: ["mortgage recast", "re-amortization"],
    category: "mortgage",
    short:
      "Re-amortizing an existing loan after a large principal payment, lowering the monthly payment while keeping the rate and term.",
    definition: [
      "You make a lump-sum payment toward principal, and the servicer recalculates the payment over the remaining term. The note rate does not change and there is no new loan, so a recast avoids the cost and underwriting of a refinance.",
      "Not every loan or servicer permits it, and there is usually a fee and a minimum lump sum. A recast lowers the payment; it does not shorten the term.",
    ],
    whyItMatters:
      "If you like your rate and simply want a smaller payment after a windfall, a recast is often the cheaper answer than refinancing.",
    seeAlso: ["refinance", "amortization", "principal"],
    related: [{ label: "Recast vs refinance", href: "/blog/recast-vs-refinance/" }],
    lending: true,
  },
  {
    slug: "refinance",
    term: "Refinance",
    aliases: ["refi", "rate and term refinance"],
    category: "mortgage",
    short:
      "Replacing an existing mortgage with a new one to change the rate, the term, or both.",
    definition: [
      "A rate-and-term refinance changes the pricing or payoff schedule without taking cash out. Because it is a new loan, it comes with new closing costs and new underwriting.",
      "The decision is a break-even: the costs divided by the monthly saving gives the months required to come out ahead. A lower rate that resets you to a fresh thirty-year schedule can still increase total interest paid.",
    ],
    seeAlso: ["cash-out-refinance", "streamline-refinance", "closing-costs", "recast"],
    calculators: ["refinance"],
    related: [
      { label: "Refinance options", href: "/refinance/" },
      { label: "When a lower rate still loses", href: "/blog/refinance-break-even-when-lower-rate-loses/" },
    ],
    lending: true,
  },
  {
    slug: "cash-out-refinance",
    term: "Cash-out refinance",
    aliases: ["cash out refi"],
    category: "mortgage",
    short:
      "Refinancing for more than you owe and taking the difference in cash, converting equity into spendable funds.",
    definition: [
      "The new loan pays off the existing one and returns the difference at closing. Because it raises the loan-to-value, a cash-out is usually priced above a rate-and-term refinance and has tighter limits.",
      "It replaces your entire first mortgage, so it is rarely the right tool when your existing rate is well below the market — a second lien or a HELOC may cost less overall even at a higher rate on the smaller balance.",
    ],
    seeAlso: ["refinance", "heloc", "equity", "loan-to-value"],
    calculators: ["refinance"],
    related: [
      { label: "Cash-out refinance", href: "/refinance/cash-out/" },
      { label: "Using cash-out to buy a rental", href: "/blog/cash-out-to-buy-a-rental/" },
    ],
    lending: true,
  },
  {
    slug: "streamline-refinance",
    term: "Streamline refinance",
    aliases: ["fha streamline", "va irrrl", "irrrl"],
    category: "mortgage",
    short:
      "A reduced-documentation refinance available on some government-backed loans when the result benefits the borrower.",
    definition: [
      "FHA and VA both offer streamlined paths that can waive parts of the usual documentation — sometimes income verification or the appraisal — when refinancing an existing loan of the same type.",
      "Streamlines generally do not allow cash out beyond a small limit, and eligibility depends on payment history and on the refinance producing a genuine benefit under the program’s test.",
    ],
    seeAlso: ["refinance", "fha-loan", "va-loan"],
    related: [{ label: "FHA and VA streamline refinances", href: "/blog/fha-va-streamline-refinance-less-docs/" }],
    lending: true,
  },
  {
    slug: "temporary-buydown",
    term: "Temporary buydown",
    aliases: ["2-1 buydown", "3-2-1 buydown", "seller buydown"],
    category: "mortgage",
    short:
      "A prepaid subsidy that reduces the payment for the first year or two, after which the payment rises to the note rate.",
    definition: [
      "In a 2-1 buydown, the payment is calculated at a rate two points lower in year one and one point lower in year two, then at the note rate thereafter. The subsidy is funded upfront — commonly by a seller or builder — and held in an escrow that releases each month.",
      "Nothing about the note changes. The rate on your loan is the full rate from day one, and underwriting generally qualifies you at that rate, not the discounted one.",
    ],
    whyItMatters:
      "The cost of a buydown is roughly the sum of the subsidized payments. If the seller is funding it, compare that against simply asking for the equivalent as a price reduction or permanent rate buydown.",
    seeAlso: ["discount-points", "seller-concessions", "interest-rate"],
    calculators: ["temporary-buydown"],
    related: [{ label: "Who pays in year three", href: "/blog/temporary-buydown-who-pays-year-three/" }],
    lending: true,
  },
  {
    slug: "underwriting",
    term: "Underwriting",
    aliases: ["underwriter", "aus", "automated underwriting"],
    category: "mortgage",
    short:
      "The lender’s review of your credit, income, assets, and the property to decide whether the loan can be made.",
    definition: [
      "Most files start with an automated underwriting decision, then a human underwriter verifies that the documentation supports what was entered and issues conditions to clear before closing.",
      "Underwriting continues until funding. Credit and employment are typically re-verified shortly before closing, which is why opening new accounts or changing jobs mid-process can derail an approved file.",
    ],
    seeAlso: ["pre-approval", "dti", "reserves", "appraisal"],
    related: [
      { label: "How underwriters verify income", href: "/blog/how-underwriters-verify-income/" },
      { label: "A new auto loan during underwriting", href: "/blog/new-auto-loan-during-underwriting/" },
    ],
    lending: true,
  },
  {
    slug: "usda-loan",
    term: "USDA loan",
    aliases: ["rural development loan", "usda rural"],
    category: "mortgage",
    short:
      "A government-backed loan for eligible rural and suburban areas that can allow no down payment for qualifying borrowers.",
    definition: [
      "USDA financing is limited by two tests: the property must sit within an eligible area on the published map, and household income must fall under the limit for that county and household size.",
      "Eligible areas include more suburban edges than the word “rural” suggests, so the map is worth checking before ruling it out. Both tests must pass — a qualifying borrower in an ineligible location does not qualify.",
    ],
    seeAlso: ["va-loan", "fha-loan", "down-payment"],
    related: [
      { label: "USDA loans", href: "/loans/usda/" },
      { label: "Reading the USDA map and income limits", href: "/blog/usda-map-income-limit-eligibility/" },
    ],
    lending: true,
  },
  {
    slug: "va-loan",
    term: "VA loan",
    aliases: ["veterans affairs loan", "va home loan", "coe"],
    category: "mortgage",
    short:
      "A mortgage guaranteed by the Department of Veterans Affairs for eligible service members, veterans, and some surviving spouses.",
    definition: [
      "VA loans can allow financing with no down payment and do not carry monthly mortgage insurance. Most borrowers instead pay a one-time funding fee, which can usually be financed and is commonly waived for veterans with a qualifying service-connected disability rating.",
      "Eligibility runs through a Certificate of Eligibility and available entitlement, and the loan carries an occupancy requirement. Zero down is a feature of remaining entitlement and a qualifying file — not automatic for every veteran.",
    ],
    seeAlso: ["usda-loan", "fha-loan", "down-payment", "occupancy"],
    related: [
      { label: "VA loans", href: "/loans/va/" },
      { label: "Second VA loan and entitlement", href: "/blog/va-entitlement-second-va-loan/" },
    ],
    lending: true,
  },
  {
    slug: "dscr-loan",
    term: "DSCR loan",
    aliases: ["debt service coverage ratio loan", "investor cash flow loan"],
    category: "mortgage",
    short:
      "An investment-property loan qualified on the property’s rental income rather than the borrower’s personal income.",
    definition: [
      "A DSCR loan underwrites the asset. The lender compares the property’s rent against the payment obligation, and qualifies on that ratio instead of tax returns and personal debt-to-income.",
      "That makes it useful for self-employed investors and for borrowers whose returns understate cash flow. It generally prices above a full-documentation loan and asks for more down payment and reserves.",
    ],
    seeAlso: ["dscr", "noi", "cash-flow", "non-qm"],
    calculators: ["dscr"],
    related: [{ label: "DSCR vs full-doc rental loans", href: "/blog/dscr-vs-full-doc-rental-loan/" }],
    lending: true,
  },
  {
    slug: "non-qm",
    term: "Non-QM loan",
    aliases: ["non qualified mortgage", "bank statement loan"],
    category: "mortgage",
    short:
      "A mortgage outside the Qualified Mortgage rules, using alternative documentation such as bank statements or asset depletion.",
    definition: [
      "Non-QM covers files that do not fit standard agency documentation — self-employed borrowers whose returns understate income, investors, and asset-rich borrowers with modest taxable income. Bank statement, asset depletion, and DSCR programs all sit here.",
      "Non-QM is not subprime. It is different documentation, generally at a higher rate, with real underwriting behind it.",
    ],
    seeAlso: ["dscr-loan", "underwriting", "self-employed-income"],
    related: [
      { label: "Non-QM options", href: "/learn/non-qm/" },
      { label: "Bank statement loans", href: "/blog/bank-statement-loans-when-tax-returns-undercount-income/" },
    ],
    lending: true,
  },
  {
    slug: "origination-fee",
    term: "Origination fee",
    aliases: ["lender fee", "origination charge"],
    category: "mortgage",
    short:
      "The lender’s charge for processing and underwriting the loan, shown in the closing cost section of the Loan Estimate.",
    definition: [
      "Origination covers the lender’s own work on the file. It appears alongside — and separately from — discount points, which buy down the rate rather than paying for processing.",
      "Because origination is a lender charge rather than a third-party cost, it is one of the more negotiable lines, and it is folded into APR.",
    ],
    seeAlso: ["apr", "closing-costs", "discount-points", "loan-estimate"],
    calculators: ["closing-cost"],
    lending: true,
  },
  {
    slug: "reserves",
    term: "Reserves",
    aliases: ["cash reserves", "months of reserves", "pitia reserves"],
    category: "mortgage",
    short:
      "Liquid assets left after closing, measured in how many months of the full housing payment they would cover.",
    definition: [
      "Reserves are counted in months of PITIA remaining after the down payment and closing costs are paid. Requirements rise with investment properties, multiple financed properties, and weaker compensating factors.",
      "Retirement accounts often count at a discounted value rather than in full, and the funds generally have to be documented and sourced like any other asset.",
    ],
    seeAlso: ["piti", "underwriting", "jumbo-loan", "gift-funds"],
    related: [{ label: "How reserves are counted", href: "/blog/mortgage-reserves-months-of-pitia/" }],
    lending: true,
  },
  {
    slug: "gift-funds",
    term: "Gift funds",
    category: "mortgage",
    short:
      "Money from an eligible donor toward your down payment or closing costs, allowed when documented with a clear paper trail.",
    definition: [
      "Most programs permit gift funds from an eligible donor, usually a family member, supported by a gift letter stating that no repayment is expected. Some programs allow a gift to cover the entire down payment.",
      "The documentation is the hard part. Lenders trace the money from the donor’s account into yours, so a cash deposit or a transfer that cannot be sourced can hold up a file even when the gift itself is perfectly allowable.",
    ],
    seeAlso: ["down-payment", "reserves", "underwriting"],
    related: [{ label: "Gift funds and down payment rules", href: "/blog/gift-funds-down-payment-rules/" }],
    lending: true,
  },
  {
    slug: "self-employed-income",
    term: "Self-employed income",
    aliases: ["1099 income", "business income", "schedule c income"],
    category: "mortgage",
    short:
      "Income from self-employment, generally qualified on net figures after business deductions rather than gross receipts.",
    definition: [
      "Lenders typically work from tax returns and use net income after deductions, often averaged across a period and adjusted for certain add-backs such as depreciation. Aggressive write-offs lower taxable income and therefore lower qualifying income.",
      "History matters. Programs generally want to see the business established over a documented period, though there are exceptions where prior employment in the same line of work supports a shorter history.",
    ],
    seeAlso: ["dti", "non-qm", "underwriting", "dscr-loan"],
    related: [
      { label: "Variable income", href: "/learn/variable-income/" },
      { label: "Two years of returns vs one", href: "/blog/two-years-of-tax-returns-vs-one-year-mortgage/" },
    ],
    lending: true,
  },
]

const BUYING_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "appraisal",
    term: "Appraisal",
    category: "buying",
    short:
      "A licensed appraiser’s independent opinion of a property’s market value, ordered by the lender.",
    definition: [
      "The lender needs to know the collateral supports the loan, so it orders an appraisal based on recent comparable sales. The resulting value caps how much the lender will lend, regardless of what you agreed to pay.",
      "An appraisal is not a home inspection. It estimates value; it does not tell you whether the furnace is near the end of its life.",
    ],
    seeAlso: ["appraisal-gap", "home-inspection", "loan-to-value", "contingency"],
    lending: true,
  },
  {
    slug: "appraisal-gap",
    term: "Appraisal gap",
    category: "buying",
    short:
      "The shortfall when a property appraises below the contract price, which the buyer generally must cover in cash.",
    definition: [
      "Lending is based on the lesser of price or appraised value, so a low appraisal does not reduce what you owe the seller — it reduces what the lender will finance. The difference has to come from somewhere.",
      "The usual outcomes are renegotiating the price, covering the gap in cash, disputing the appraisal with better comparables, or exercising an appraisal contingency to exit.",
    ],
    seeAlso: ["appraisal", "contingency", "earnest-money", "down-payment"],
    lending: true,
  },
  {
    slug: "contingency",
    term: "Contingency",
    aliases: ["contingencies", "inspection contingency", "financing contingency"],
    category: "buying",
    short:
      "A condition in the purchase contract that must be satisfied, or the buyer can withdraw without losing earnest money.",
    definition: [
      "Common contingencies cover financing, appraisal, inspection, and sometimes the sale of the buyer’s current home. Each carries a deadline, and each is a defined exit if the condition is not met.",
      "Waiving contingencies makes an offer more competitive and moves risk onto the buyer. A waived inspection contingency does not mean skipping the inspection — it means giving up the contractual right to renegotiate or walk based on what it finds.",
    ],
    whyItMatters:
      "Contingency deadlines are the real clock in a transaction. Missing one can convert a refundable deposit into a non-refundable one.",
    seeAlso: ["earnest-money", "due-diligence", "repc", "appraisal-gap"],
  },
  {
    slug: "closing-disclosure",
    term: "Closing Disclosure",
    aliases: ["cd", "closing disclosure form"],
    category: "buying",
    short:
      "The final statement of your loan terms and closing costs, provided a set number of days before closing.",
    definition: [
      "The Closing Disclosure mirrors the Loan Estimate’s format so the two can be compared directly. You receive it in advance specifically so there is time to check it against what you were quoted.",
      "Read the cash to close, the rate, and the monthly payment against your Loan Estimate. Certain changes are limited by tolerance rules, and some revisions restart the waiting period.",
    ],
    seeAlso: ["loan-estimate", "closing-costs", "settlement", "prepaids"],
    lending: true,
  },
  {
    slug: "due-diligence",
    term: "Due diligence",
    aliases: ["due diligence period", "inspection period"],
    category: "buying",
    short:
      "The defined window after acceptance when a buyer investigates the property and can act on what they find.",
    definition: [
      "Due diligence is when inspections happen, disclosures are reviewed, association documents are read, and any specialist evaluations are ordered. It is the buyer’s window to get informed.",
      "It is bounded by dates in the contract. Once the period closes, the leverage it provided closes with it.",
    ],
    seeAlso: ["contingency", "home-inspection", "repc", "sellers-disclosure"],
  },
  {
    slug: "earnest-money",
    term: "Earnest money",
    aliases: ["emd", "earnest money deposit", "good faith deposit"],
    category: "buying",
    short:
      "A deposit made with an offer to show the buyer is serious, held in trust and credited toward closing.",
    definition: [
      "Earnest money is deposited with a neutral party after acceptance and applied to your down payment or closing costs at closing. It is not an extra cost, but it is money committed early.",
      "Whether it is refundable depends entirely on the contingencies and their deadlines. Within a live contingency, a buyer who withdraws properly generally recovers it; after those deadlines pass, it is at risk.",
    ],
    seeAlso: ["contingency", "down-payment", "closing-costs", "repc"],
    related: [{ label: "Earnest money vs down payment vs closing costs", href: "/blog/earnest-money-vs-down-payment-vs-closing-costs/" }],
  },
  {
    slug: "escalation-clause",
    term: "Escalation clause",
    category: "buying",
    short:
      "An offer term that automatically raises your price above competing offers, up to a stated maximum.",
    definition: [
      "An escalation clause states an increment and a ceiling: it beats a verified competing offer by the increment, stopping at the cap. It is a tool for competitive markets where a buyer does not want to bid against themselves.",
      "It also reveals your maximum to the seller, and it does not change what the property will appraise for. Escalating past appraised value creates a gap someone has to fund.",
    ],
    seeAlso: ["appraisal-gap", "contingency", "earnest-money"],
  },
  {
    slug: "home-inspection",
    term: "Home inspection",
    category: "buying",
    short:
      "A buyer-ordered evaluation of a property’s condition and systems, used to decide whether and how to proceed.",
    definition: [
      "An inspector examines accessible structure and systems — roof, foundation, electrical, plumbing, HVAC — and reports condition and likely remaining life. Specialists may be brought in for sewer lines, radon, or structural questions.",
      "The report is information, not a repair list the seller owes you. What happens next is negotiation, and how much leverage you have depends on your contingencies.",
    ],
    seeAlso: ["due-diligence", "contingency", "appraisal", "sellers-disclosure"],
  },
  {
    slug: "repc",
    term: "REPC (Real Estate Purchase Contract)",
    aliases: ["utah repc", "purchase contract"],
    category: "buying",
    short:
      "Utah’s standard residential purchase contract, which sets the deadlines the whole transaction runs on.",
    definition: [
      "The REPC is the state-approved form used for most Utah residential purchases. It defines the price and terms and, critically, a set of dated deadlines — due diligence, financing and appraisal, and settlement.",
      "Those deadlines drive the loan process. A financing deadline that arrives before underwriting has cleared conditions is a problem worth anticipating at the offer stage, not discovering the week it lands.",
    ],
    whyItMatters:
      "In Utah, the REPC deadlines are the transaction’s schedule. Align them with your lender’s realistic timeline before signing.",
    seeAlso: ["contingency", "due-diligence", "earnest-money", "settlement"],
    related: [{ label: "Utah REPC deadlines and your loan", href: "/blog/utah-repc-deadline-and-your-loan/" }],
  },
  {
    slug: "seller-concessions",
    term: "Seller concessions",
    aliases: ["seller credit", "seller paid closing costs"],
    category: "buying",
    short:
      "Money the seller contributes toward the buyer’s closing costs, capped by the loan program.",
    definition: [
      "A concession is a credit toward allowable buyer costs — closing costs, prepaids, or funding a temporary buydown. It is often more useful than an equivalent price reduction, because it reduces cash needed at closing rather than trimming a monthly payment slightly.",
      "Every program caps concessions, and the cap varies with occupancy and down payment. A credit above the cap is not simply refunded to the buyer.",
    ],
    seeAlso: ["closing-costs", "temporary-buydown", "prepaids"],
    calculators: ["closing-cost"],
    lending: true,
  },
  {
    slug: "walkthrough",
    term: "Final walkthrough",
    category: "buying",
    short:
      "A last inspection shortly before closing to confirm the property’s condition and that agreed repairs were done.",
    definition: [
      "The walkthrough verifies the home is in the condition the contract requires: agreed repairs completed, included items still present, and no new damage from moving out.",
      "It is not a renegotiation opportunity in the general sense — it exists to confirm the agreed state. Problems found here are handled before funding, which is why it happens close to, but not on, closing day.",
    ],
    seeAlso: ["settlement", "home-inspection", "contingency"],
  },
]

const SELLING_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "cma",
    term: "CMA (Comparative Market Analysis)",
    aliases: ["comparative market analysis", "comps"],
    category: "selling",
    short:
      "An agent’s pricing analysis built from recent comparable sales, active listings, and expired listings nearby.",
    definition: [
      "A CMA triangulates a realistic price range from what has actually sold recently, what is currently competing, and what failed to sell. Adjustments account for differences in size, condition, and location.",
      "It is not an appraisal. A CMA guides list price; an appraisal is a licensed opinion the lender relies on, and the two can disagree.",
    ],
    seeAlso: ["appraisal", "days-on-market", "net-proceeds", "mls"],
    related: [{ label: "What’s my home worth?", href: "/whats-my-home-worth/" }],
  },
  {
    slug: "days-on-market",
    term: "Days on market (DOM)",
    aliases: ["dom", "days on market"],
    category: "selling",
    short:
      "How long a listing has been active, a signal buyers read as evidence about pricing.",
    definition: [
      "DOM counts the days since a listing went active. Buyers use it as a proxy for desirability, and a rising count invites lower offers regardless of the property’s merits.",
      "Delisting and relisting to reset the counter is visible in most systems and tends to read as exactly what it is.",
    ],
    seeAlso: ["cma", "list-to-sale-ratio", "mls"],
  },
  {
    slug: "list-to-sale-ratio",
    term: "List-to-sale price ratio",
    category: "selling",
    short:
      "Final sale price divided by list price, showing how closely homes are selling to asking.",
    definition: [
      "A ratio near or above one suggests sellers are holding their price or receiving competitive offers; well below one suggests buyers are negotiating successfully.",
      "Read it alongside days on market. Both together describe negotiating conditions far better than either alone.",
    ],
    seeAlso: ["days-on-market", "cma"],
    related: [{ label: "Market reports", href: "/market-reports/" }],
  },
  {
    slug: "net-proceeds",
    term: "Net proceeds",
    aliases: ["seller net", "net sheet"],
    category: "selling",
    short:
      "What a seller actually receives after loan payoff, commissions, and closing costs are deducted from the sale price.",
    definition: [
      "Sale price is the headline; net proceeds is the number that reaches you. Subtract the mortgage payoff, brokerage compensation, seller-side closing costs, any agreed concessions, and prorated taxes.",
      "Payoff is not the same as your last statement balance — it includes interest through the payoff date and any fees.",
    ],
    seeAlso: ["closing-costs", "seller-concessions", "equity", "settlement"],
    calculators: ["home-sale"],
    related: [{ label: "Sell with Ondo", href: "/sell/" }],
  },
  {
    slug: "listing-agreement",
    term: "Listing agreement",
    category: "selling",
    short:
      "The contract between a seller and a brokerage authorizing marketing of the property and setting compensation and duration.",
    definition: [
      "It defines the term, the price, the brokerage’s authority to market and show, and how compensation works. It is a contract for services, and its length and cancellation terms are negotiable.",
      "Read the duration and any protection period, which can entitle the brokerage to compensation if a buyer it introduced returns after expiry.",
    ],
    seeAlso: ["mls", "cma"],
  },
  {
    slug: "mls",
    term: "MLS (Multiple Listing Service)",
    category: "selling",
    short:
      "The cooperative database brokerages use to share listings and the source most consumer portals draw from.",
    definition: [
      "The MLS distributes a listing to participating brokerages and, downstream, to the public portals buyers browse. Getting into it is how a listing reaches the broadest audience quickly.",
      "Data accuracy matters more than most sellers expect, because errors propagate everywhere the feed reaches.",
    ],
    seeAlso: ["listing-agreement", "days-on-market"],
  },
  {
    slug: "staging",
    term: "Staging",
    category: "selling",
    short:
      "Preparing and presenting a home so buyers can picture living in it, from decluttering through furnishing.",
    definition: [
      "Staging ranges from cleaning, decluttering, and depersonalizing to renting furniture for an empty property. Its purpose is to help buyers form a positive first impression quickly, including in photographs.",
      "The highest-return work is usually the least glamorous: light, cleanliness, and removing clutter, done before photography rather than after listing.",
    ],
    seeAlso: ["days-on-market", "cma"],
    related: [{ label: "Home staging tips that work", href: "/blog/home-staging-tips-that-work/" }],
  },
  {
    slug: "sellers-disclosure",
    term: "Seller’s disclosure",
    category: "selling",
    short:
      "The seller’s written statement of known material facts and defects about the property.",
    definition: [
      "Sellers disclose known material conditions — past leaks, system repairs, boundary issues, and similar facts that would matter to a buyer. It reports what the seller knows; it is not an inspection.",
      "Disclosing is generally the safer course. Known problems that surface later are considerably more expensive than problems disclosed upfront.",
    ],
    seeAlso: ["home-inspection", "due-diligence"],
  },
]

const INVESTING_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "cap-rate",
    term: "Cap rate (Capitalization rate)",
    aliases: ["capitalization rate", "cap"],
    category: "investing",
    short:
      "Net operating income divided by property value — the unlevered yield used to compare properties.",
    definition: [
      "Cap rate expresses what a property earns relative to its price, before any financing. Because it ignores the loan, it compares the asset itself rather than a particular buyer’s deal structure.",
      "It is only as good as the NOI behind it. An NOI that omits vacancy, management, or capital reserves produces a cap rate that flatters the property.",
    ],
    whyItMatters:
      "Cap rate compares assets; cash-on-cash compares deals. You need both, because financing changes the answer.",
    seeAlso: ["noi", "cash-on-cash-return", "grm", "operating-expenses"],
    calculators: ["cap-rate", "roi"],
  },
  {
    slug: "cash-on-cash-return",
    term: "Cash-on-cash return",
    aliases: ["coc", "cash on cash"],
    category: "investing",
    short:
      "Annual pre-tax cash flow divided by the cash you actually invested, measuring return on money out of pocket.",
    definition: [
      "Cash-on-cash divides the year’s cash flow after debt service by total cash invested — down payment, closing costs, and upfront work. Unlike cap rate, it accounts for leverage.",
      "It measures only cash flow. It ignores principal paydown, appreciation, and tax treatment, so it understates total return on a leveraged hold.",
    ],
    seeAlso: ["cap-rate", "cash-flow", "roi", "leverage"],
    calculators: ["cash-on-cash", "roi"],
    related: [{ label: "Cash-on-cash return explained", href: "/blog/cash-on-cash-return-explained/" }],
  },
  {
    slug: "cash-flow",
    term: "Cash flow",
    category: "investing",
    short:
      "What remains each month after rent has covered operating expenses and debt service.",
    definition: [
      "Cash flow is rent minus operating expenses minus the mortgage payment. Honest cash flow subtracts vacancy, management, maintenance, and capital reserves even in months nothing goes wrong.",
      "A property that only cash flows when fully occupied with no repairs is not producing cash flow; it is producing a good month.",
    ],
    seeAlso: ["noi", "cash-on-cash-return", "vacancy-rate", "capex", "operating-expenses"],
    calculators: ["cash-on-cash", "roi"],
  },
  {
    slug: "noi",
    term: "NOI (Net Operating Income)",
    aliases: ["net operating income"],
    category: "investing",
    short:
      "Income after operating expenses but before debt service, taxes on income, and capital expenditures.",
    definition: [
      "NOI takes gross rental income, subtracts vacancy and operating expenses — management, maintenance, insurance, property taxes, utilities the owner pays — and stops there. Financing is deliberately excluded so the property can be judged independently of the buyer’s loan.",
      "Because the mortgage is excluded, NOI is not cash flow. Two investors with identical NOI can have very different cash flow depending on how they financed the purchase.",
    ],
    seeAlso: ["cap-rate", "cash-flow", "operating-expenses", "dscr"],
    calculators: ["cap-rate", "dscr"],
  },
  {
    slug: "grm",
    term: "GRM (Gross Rent Multiplier)",
    aliases: ["gross rent multiplier"],
    category: "investing",
    short:
      "Property price divided by annual gross rent — a fast screening ratio that ignores expenses.",
    definition: [
      "GRM is a first-pass filter for comparing similar properties in one market. A lower number means less price paid per dollar of rent.",
      "It says nothing about expenses, so two properties with identical GRMs can perform very differently once taxes, insurance, and maintenance are counted. Screen with GRM, decide with NOI.",
    ],
    seeAlso: ["cap-rate", "noi", "one-percent-rule"],
    calculators: ["grm"],
  },
  {
    slug: "dscr",
    term: "DSCR (Debt Service Coverage Ratio)",
    aliases: ["debt service coverage ratio"],
    category: "investing",
    short:
      "Net operating income divided by annual debt service — how many times the property covers its own loan payment.",
    definition: [
      "A DSCR of 1.0 means the property exactly covers its debt service, with nothing spare. Lenders on investment loans generally want a cushion above that.",
      "The ratio is only as reliable as the NOI feeding it, so vacancy and management assumptions matter as much as the rent figure.",
    ],
    seeAlso: ["noi", "dscr-loan", "cash-flow"],
    calculators: ["dscr"],
    related: [{ label: "DSCR vs full-doc rental loans", href: "/blog/dscr-vs-full-doc-rental-loan/" }],
  },
  {
    slug: "one-percent-rule",
    term: "1% rule",
    aliases: ["one percent rule"],
    category: "investing",
    short:
      "A screening heuristic that monthly rent should be roughly one percent of purchase price.",
    definition: [
      "The 1% rule is a back-of-envelope filter for deciding which listings deserve a real analysis. It is a triage tool, not an underwriting standard.",
      "It has become harder to satisfy in appreciating markets, and it ignores expenses entirely, so properties that pass can still lose money and properties that fail can still be sound.",
    ],
    seeAlso: ["fifty-percent-rule", "grm", "cash-flow", "cap-rate"],
    calculators: ["one-percent-rule"],
  },
  {
    slug: "fifty-percent-rule",
    term: "50% rule",
    aliases: ["fifty percent rule"],
    category: "investing",
    short:
      "A rough assumption that operating expenses will consume about half of gross rent, excluding the mortgage.",
    definition: [
      "The 50% rule is a sanity check against optimistic expense estimates. It bundles taxes, insurance, management, maintenance, vacancy, and reserves into one blunt assumption.",
      "Actual ratios vary widely with property age, taxes, and whether the owner pays utilities. Use it to catch a projection that assumes almost no expenses, then replace it with real numbers.",
    ],
    seeAlso: ["one-percent-rule", "operating-expenses", "capex", "noi"],
    calculators: ["fifty-percent-rule"],
  },
  {
    slug: "roi",
    term: "ROI (Return on Investment)",
    aliases: ["return on investment"],
    category: "investing",
    short:
      "Total return relative to what was invested, usually including cash flow, principal paydown, and appreciation.",
    definition: [
      "ROI is deliberately broad, which makes it useful for a full picture and easy to misuse in comparisons. A cash-flow-only ROI and one including appreciation are not the same measurement.",
      "Whenever ROI is quoted, the useful question is what is in the numerator and over what period.",
    ],
    seeAlso: ["cash-on-cash-return", "cagr", "appreciation", "equity"],
    calculators: ["roi", "cagr", "retirement"],
  },
  {
    slug: "cagr",
    term: "CAGR (Compound Annual Growth Rate)",
    aliases: ["compound annual growth rate"],
    category: "investing",
    short:
      "The smoothed annual rate at which a value would have grown to reach its ending amount over a period.",
    definition: [
      "CAGR converts total growth over several years into a single annualized rate, which makes holdings of different durations comparable.",
      "It smooths away everything that happened in between. Two investments with identical CAGR can have had very different volatility along the way.",
    ],
    seeAlso: ["roi", "appreciation"],
    calculators: ["cagr", "retirement"],
  },
  {
    slug: "appreciation",
    term: "Appreciation",
    category: "investing",
    short:
      "An increase in a property’s value over time, from market movement or from improvements made to it.",
    definition: [
      "Market appreciation comes from conditions outside your control. Forced appreciation comes from work you do — renovation, better management, raising below-market rents.",
      "Appreciation is unrealized until you sell or borrow against it, and it is not guaranteed. Treating projected appreciation as the reason a deal works turns an investment into a bet on the market.",
    ],
    calculators: ["rent-vs-own", "retirement", "cagr"],
    seeAlso: ["equity", "cagr", "roi", "cash-flow"],
  },
  {
    slug: "depreciation",
    term: "Depreciation",
    category: "investing",
    short:
      "A tax deduction that lets an owner write off the cost of a rental building over a set recovery period.",
    definition: [
      "Depreciation spreads the building’s cost — not the land’s — across a recovery period defined in the tax code, producing a paper expense that reduces taxable rental income without a cash outlay.",
      "It is generally recaptured when the property is sold. Depreciation is also commonly added back when a lender calculates qualifying income from rentals, because it did not actually cost you cash.",
    ],
    whyItMatters:
      "This is tax treatment, and it depends on your circumstances. Confirm the specifics with a qualified tax professional.",
    seeAlso: ["noi", "cash-flow", "1031-exchange", "self-employed-income"],
    related: [{ label: "Depreciation add-back on Schedule E", href: "/blog/depreciation-add-back-schedule-e/" }],
  },
  {
    slug: "1031-exchange",
    term: "1031 exchange",
    aliases: ["like kind exchange", "1031"],
    category: "investing",
    short:
      "A tax provision allowing capital gains deferral when investment property is exchanged for other like-kind investment property.",
    definition: [
      "A 1031 exchange defers capital gains tax when proceeds are reinvested into qualifying replacement property under strict rules, including identification and closing deadlines and the use of a qualified intermediary.",
      "The deadlines are unforgiving and the proceeds generally cannot touch your hands. It defers tax rather than eliminating it.",
    ],
    whyItMatters:
      "The structure has to be in place before you close the sale. This is specialist territory — involve a qualified intermediary and a tax advisor early.",
    seeAlso: ["depreciation", "appreciation", "opportunity-zone"],
    related: [{ label: "Investment services", href: "/investments/" }],
  },
  {
    slug: "opportunity-zone",
    term: "Opportunity zone",
    category: "investing",
    short:
      "A designated area where qualifying long-term investments can receive preferential capital gains treatment.",
    definition: [
      "Opportunity zones are census tracts designated to attract investment, with tax benefits tied to investing eligible gains through a qualified fund and holding for defined periods.",
      "The benefit depends on the structure and the holding period, not merely on buying inside the boundary.",
    ],
    seeAlso: ["1031-exchange", "appreciation"],
    related: [{ label: "Opportunity zones", href: "/investments/opportunity-zones/" }],
  },
  {
    slug: "vacancy-rate",
    term: "Vacancy rate",
    category: "investing",
    short:
      "The share of time or units sitting empty, budgeted as a reduction to expected rental income.",
    definition: [
      "Vacancy covers turnover between tenants and time on market. Projections that assume full occupancy every month overstate income, because turnover is a normal cost of owning rentals.",
      "Days vacant are usually more expensive than a modest rent concession to retain a good tenant — an empty unit earns nothing while every fixed cost continues.",
    ],
    seeAlso: ["cash-flow", "noi", "turnover", "operating-expenses"],
    related: [{ label: "Vacancy risk playbook", href: "/blog/vacancy-risk-playbook/" }],
  },
  {
    slug: "operating-expenses",
    term: "Operating expenses",
    aliases: ["opex"],
    category: "investing",
    short:
      "The recurring costs of running a property — taxes, insurance, management, maintenance, and owner-paid utilities.",
    definition: [
      "Operating expenses are the ongoing costs of keeping a property rented. They exclude the mortgage, which is debt service, and exclude capital expenditures, which are large infrequent replacements.",
      "Understating them is the most common flaw in a rental projection. Management and maintenance are real costs even when you do the work yourself — you are paying with time.",
    ],
    seeAlso: ["noi", "capex", "cash-flow", "fifty-percent-rule"],
    calculators: ["owner-vs-self", "cap-rate"],
  },
  {
    slug: "capex",
    term: "CapEx (Capital expenditures)",
    aliases: ["capital expenditures", "capital reserve"],
    category: "investing",
    short:
      "Large, infrequent replacements — roof, HVAC, water heater — budgeted monthly even though they are paid rarely.",
    definition: [
      "CapEx covers components with a long life and a large replacement cost. They are not monthly expenses, but they are entirely predictable in aggregate, which is why owners reserve for them monthly.",
      "A property with no CapEx reserve is not more profitable; it is deferring a known bill. The roof’s age tells you roughly when it arrives.",
    ],
    seeAlso: ["operating-expenses", "cash-flow", "noi", "maintenance-reserve"],
    related: [{ label: "Maintenance and CapEx strategy", href: "/blog/maintenance-capex-strategy/" }],
  },
  {
    slug: "equity",
    term: "Equity",
    category: "investing",
    short:
      "The difference between what a property is worth and what is owed against it.",
    definition: [
      "Equity grows three ways: the down payment you put in, principal paid down each month, and appreciation. It is unrealized until you sell or borrow against it.",
      "Lenders measure the same relationship from the other direction as loan-to-value, and the available portion is limited by what a lender will lend against the property.",
    ],
    calculators: ["rent-vs-own", "home-sale"],
    seeAlso: ["loan-to-value", "heloc", "cash-out-refinance", "appreciation"],
  },
  {
    slug: "leverage",
    term: "Leverage",
    category: "investing",
    short:
      "Using borrowed money to control a larger asset, amplifying both returns and losses.",
    definition: [
      "A mortgage lets a modest down payment control a much larger asset, so appreciation and cash flow are earned on the full value while only part of the capital is yours. That is why cash-on-cash returns on financed property can exceed unlevered yield.",
      "The amplification runs both directions. Leverage magnifies a downturn, and debt service continues through vacancy — which is what turns a difficult month into a serious problem.",
    ],
    seeAlso: ["cash-on-cash-return", "cap-rate", "dscr", "equity"],
  },
  {
    slug: "house-hacking",
    term: "House hacking",
    category: "investing",
    short:
      "Living in one unit of a property while renting the others, using owner-occupied financing to buy an income property.",
    definition: [
      "Buying a small multi-unit property as your primary residence can allow owner-occupied financing terms on a property that also produces rent — generally better terms than an investment loan.",
      "Occupancy requirements are real obligations, and some programs allow a portion of projected rent to help you qualify. The rules are program-specific.",
    ],
    seeAlso: ["fha-loan", "occupancy", "cash-flow", "dscr-loan"],
    related: [{ label: "House hacking a duplex with FHA", href: "/blog/house-hacking-duplex-with-fha/" }],
    lending: true,
  },
  {
    slug: "occupancy",
    term: "Occupancy type",
    aliases: ["primary residence", "second home", "investment property"],
    category: "investing",
    short:
      "How you will use a property — primary residence, second home, or investment — which drives pricing and program eligibility.",
    definition: [
      "Occupancy is a core underwriting factor. Primary residences generally receive the best pricing and lowest down payments; second homes sit in between; investment properties carry the highest requirements.",
      "Occupancy is certified at closing, and misrepresenting it on a loan application is a serious matter, not a technicality.",
    ],
    seeAlso: ["house-hacking", "underwriting", "dscr-loan", "va-loan"],
    related: [{ label: "Second home vs investment occupancy", href: "/blog/second-home-vs-investment-occupancy/" }],
    lending: true,
  },
]

const RENTING_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "lease-agreement",
    term: "Lease agreement",
    aliases: ["rental agreement", "lease"],
    category: "renting",
    short:
      "The contract setting the terms of a tenancy — rent, duration, responsibilities, and how it ends.",
    definition: [
      "A lease fixes rent and term and allocates responsibility for utilities, maintenance, and property care. A fixed-term lease runs to a date; a month-to-month renews continuously until proper notice is given.",
      "The provisions that matter most are usually the least dramatic: notice requirements, renewal mechanics, and who handles which repairs.",
    ],
    seeAlso: ["security-deposit", "notice-to-vacate", "tenant-screening", "renters-insurance"],
    related: [{ label: "Utah landlord-tenant law guide", href: "/blog/utah-landlord-tenant-law-guide/" }],
  },
  {
    slug: "security-deposit",
    term: "Security deposit",
    category: "renting",
    short:
      "Funds held during a tenancy to cover unpaid rent or damage beyond normal wear, returned under statutory rules.",
    definition: [
      "The deposit secures the tenant’s obligations. At move-out the landlord may deduct for unpaid rent and damage beyond ordinary wear and tear, and must return the balance with an itemized accounting within the period the law allows.",
      "Normal wear is not damage. Documented move-in and move-out condition reports are what make a deduction defensible.",
    ],
    whyItMatters:
      "Deposit handling is one of the most commonly litigated parts of a tenancy. Timelines and itemization requirements are set by statute.",
    seeAlso: ["lease-agreement", "move-out-inspection", "normal-wear-and-tear"],
    related: [{ label: "Tenant rights checklist", href: "/blog/tenant-rights-checklist/" }],
  },
  {
    slug: "tenant-screening",
    term: "Tenant screening",
    category: "renting",
    short:
      "Evaluating applicants against consistent, lawful criteria — income, rental history, credit, and background.",
    definition: [
      "Screening typically verifies income against a stated ratio, contacts prior landlords, and reviews credit and background reports. Written criteria applied identically to every applicant are what make the process defensible.",
      "Fair housing law governs how screening is conducted, and adverse action based on a consumer report carries its own notice requirements.",
    ],
    whyItMatters:
      "Consistency is the protection. Criteria decided in advance and applied to everyone are far safer than case-by-case judgment.",
    seeAlso: ["fair-housing", "lease-agreement", "rent-roll"],
    related: [{ label: "Tenant screening", href: "/property-management/tenant-screening/" }],
  },
  {
    slug: "fair-housing",
    term: "Fair housing",
    aliases: ["fair housing act", "protected classes"],
    category: "renting",
    short:
      "Laws prohibiting discrimination in housing based on protected characteristics, applying to advertising, screening, and terms.",
    definition: [
      "Fair housing law covers the whole cycle — how a unit is advertised, who is shown it, how applicants are screened, and the terms offered. Federal protected classes are supplemented by state and local ones.",
      "Intent is not the test. Language or a policy that has a discriminatory effect can violate the law even when no one meant harm, which is why advertising copy and screening criteria are written carefully.",
    ],
    whyItMatters:
      "Describe the property, never the person you imagine living in it. That single habit prevents most advertising violations.",
    seeAlso: ["tenant-screening", "lease-agreement"],
    related: [{ label: "Property management services", href: "/property-management/" }],
  },
  {
    slug: "rent-roll",
    term: "Rent roll",
    category: "renting",
    short:
      "A schedule of every unit with its tenant, rent, lease dates, and deposit — the income snapshot of a property.",
    definition: [
      "A rent roll lists occupancy and income unit by unit: who is in place, what they pay, when the lease ends, and what deposit is held. It is a standard diligence document when buying a tenanted property.",
      "Reading it well means looking for concentration of lease expirations, rents below market, and units occupied without a current written lease.",
    ],
    seeAlso: ["noi", "vacancy-rate", "lease-agreement", "turnover"],
    related: [{ label: "Owner reporting", href: "/property-management/owner-reporting/" }],
  },
  {
    slug: "turnover",
    term: "Turnover",
    aliases: ["unit turn", "make ready"],
    category: "renting",
    short:
      "The work and vacancy between one tenancy and the next — cleaning, repairs, marketing, and re-leasing.",
    definition: [
      "Turnover combines direct cost (cleaning, paint, repairs, marketing) with the vacancy loss while the unit is off the market. It is one of the largest controllable costs in rental ownership.",
      "Because turnover is expensive, retaining a reliable tenant at a slightly below-market rent is often better economics than pushing for the maximum and re-leasing.",
    ],
    seeAlso: ["vacancy-rate", "operating-expenses", "rent-ready", "cash-flow"],
  },
  {
    slug: "eviction",
    term: "Eviction",
    aliases: ["unlawful detainer"],
    category: "renting",
    short:
      "The legal process for removing a tenant, which must follow statutory notice and court procedure.",
    definition: [
      "Eviction is a court process with prescribed notice periods and filings. Only the process — never self-help such as changing locks or shutting off utilities — can remove a tenant.",
      "Procedural mistakes commonly restart the timeline, which is why documentation and correct notices matter more than speed.",
    ],
    whyItMatters:
      "This is legal territory with real consequences for getting it wrong. Involve counsel rather than improvising.",
    seeAlso: ["notice-to-vacate", "lease-agreement", "security-deposit"],
  },
  {
    slug: "notice-to-vacate",
    term: "Notice to vacate",
    category: "renting",
    short:
      "Written notice that a tenancy will end, with a lead time set by the lease and by statute.",
    definition: [
      "Either party may give notice under the terms of the lease and applicable law. Required lead time depends on the tenancy type and the reason.",
      "Notice given the wrong way or with too little lead time frequently does not count, which can push an intended end date out by a full period.",
    ],
    seeAlso: ["lease-agreement", "eviction", "turnover"],
  },
  {
    slug: "normal-wear-and-tear",
    term: "Normal wear and tear",
    category: "renting",
    short:
      "The gradual deterioration expected from ordinary use, which cannot be charged against a security deposit.",
    definition: [
      "Carpet worn along a traffic path, minor scuffs, and faded paint are ordinary use. A burn, a pet stain through to the pad, or a hole in a wall is damage.",
      "The distinction is where most deposit disputes live, and it is settled by evidence — dated condition reports and photographs at move-in and move-out.",
    ],
    seeAlso: ["security-deposit", "move-out-inspection", "turnover"],
  },
  {
    slug: "move-out-inspection",
    term: "Move-out inspection",
    category: "renting",
    short:
      "A documented walkthrough at the end of a tenancy, compared against move-in condition to determine deductions.",
    definition: [
      "The move-out inspection is only meaningful against a move-in baseline. Photographs and a signed condition report at the start are what make deductions at the end supportable.",
      "Many jurisdictions give tenants a right to be present or to receive an itemized statement within a set period.",
    ],
    seeAlso: ["security-deposit", "normal-wear-and-tear", "turnover"],
  },
  {
    slug: "hoa",
    term: "HOA (Homeowners Association)",
    aliases: ["homeowners association", "hoa dues", "coa"],
    category: "renting",
    short:
      "An association governing a community, collecting dues and enforcing rules that can include rental restrictions.",
    definition: [
      "HOA dues fund shared maintenance, insurance, and reserves, and the association enforces community rules. Dues count in your housing costs and in underwriting, and special assessments can arrive on top of them.",
      "For investors, the governing documents matter as much as the dues: rental caps, minimum lease terms, and approval requirements can make a property unusable as a rental.",
    ],
    whyItMatters:
      "Read the governing documents and the reserve study during due diligence. An underfunded association is a future special assessment.",
    calculators: ["cost-of-living", "affordability"],
    seeAlso: ["piti", "dti", "condo", "operating-expenses"],
    related: [{ label: "Townhome vs condo: the HOA docs lenders ask for", href: "/blog/townhome-vs-condo-hoa-docs-lenders-ask/" }],
  },
  {
    slug: "renters-insurance",
    term: "Renters insurance",
    category: "renting",
    short:
      "A tenant’s policy covering personal belongings and liability, which a landlord’s policy does not cover.",
    definition: [
      "The landlord’s policy covers the building, not the tenant’s possessions or personal liability. Renters insurance covers those, usually inexpensively, and many leases require it.",
      "Liability coverage is the part tenants underestimate — it responds when a tenant is responsible for damage or injury.",
    ],
    seeAlso: ["lease-agreement", "homeowners-insurance"],
  },
  {
    slug: "rent-ready",
    term: "Rent-ready",
    category: "renting",
    short:
      "The condition a unit must reach before it can be marketed — clean, functional, safe, and legal to occupy.",
    definition: [
      "Rent-ready means cleaned, repaired, with working systems, smoke and carbon monoxide detectors in place, and no habitability defects. It is the point at which photographs and showings are worthwhile.",
      "Listing before a unit is rent-ready tends to cost more than the delay saves: weak photos and disappointing showings extend vacancy.",
    ],
    seeAlso: ["turnover", "vacancy-rate", "maintenance-reserve"],
  },
  {
    slug: "maintenance-reserve",
    term: "Maintenance reserve",
    category: "renting",
    short:
      "Money set aside monthly for routine repairs, so ordinary problems do not become cash-flow emergencies.",
    definition: [
      "A maintenance reserve covers the ordinary and recurring: appliance repairs, plumbing calls, minor damage. It is distinct from a CapEx reserve, which funds large replacements.",
      "Older properties and those with deferred maintenance need larger reserves. The reserve is what keeps a broken water heater from becoming a financing problem.",
    ],
    seeAlso: ["capex", "operating-expenses", "cash-flow"],
    related: [{ label: "Maintenance coordination", href: "/property-management/maintenance-coordination/" }],
  },
  {
    slug: "property-management-fee",
    term: "Property management fee",
    category: "renting",
    short:
      "What a manager charges to operate a rental, commonly a percentage of collected rent plus defined additional fees.",
    definition: [
      "The headline percentage is rarely the whole cost. Leasing or placement fees, renewal fees, maintenance coordination markups, and vacancy handling all belong in the comparison.",
      "Compare on total annual cost against the service actually delivered, and read how the agreement is terminated.",
    ],
    whyItMatters:
      "The real comparison is not manager against manager but total cost against your own time and results if you self-manage.",
    seeAlso: ["operating-expenses", "cash-flow", "rent-roll"],
    calculators: ["owner-vs-self"],
    related: [
      { label: "Property management fees in Utah", href: "/blog/property-management-fees-utah/" },
      { label: "Compare Utah property managers", href: "/compare-utah-property-managers/" },
    ],
  },
]

const CLOSING_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "title-insurance",
    term: "Title insurance",
    category: "closing",
    short:
      "A policy protecting against defects in a property’s ownership history, issued after a search of the public record.",
    definition: [
      "Unlike other insurance, title insurance looks backward. It protects against problems that already exist in the chain of title — undisclosed heirs, forged documents, recording errors, unpaid liens — and is paid once at closing.",
      "The lender’s policy protects the lender for the loan amount and is usually required. An owner’s policy protects your equity and is generally optional but far cheaper bought at closing than later.",
    ],
    whyItMatters:
      "The lender’s policy protects the lender, not you. If you want your own equity protected, that is the separate owner’s policy.",
    seeAlso: ["title-search", "lien", "deed", "escrow-officer"],
    related: [{ label: "Owner’s vs lender’s title insurance", href: "/blog/title-insurance-owner-vs-lender/" }],
  },
  {
    slug: "title-search",
    term: "Title search",
    category: "closing",
    short:
      "An examination of public records to confirm ownership and surface liens, easements, or other claims.",
    definition: [
      "The search traces the chain of ownership and looks for anything attached to the property: mortgages, tax liens, judgments, easements, and restrictions. Findings are listed as exceptions in the title commitment.",
      "Reading the commitment’s exceptions during due diligence is worthwhile — an easement or restriction can affect how you are able to use the property.",
    ],
    seeAlso: ["title-insurance", "lien", "deed", "due-diligence"],
  },
  {
    slug: "deed",
    term: "Deed",
    aliases: ["warranty deed", "quitclaim deed"],
    category: "closing",
    short:
      "The document transferring ownership of real property, recorded in the public record at closing.",
    definition: [
      "A deed conveys title from seller to buyer. Types differ in the warranties given: a warranty deed guarantees clear title, while a quitclaim transfers only whatever interest the grantor happens to have, with no promises.",
      "The deed is not the loan. The deed conveys ownership; a mortgage or trust deed creates the lender’s security interest against it.",
    ],
    seeAlso: ["title-insurance", "lien", "recording", "settlement"],
  },
  {
    slug: "lien",
    term: "Lien",
    category: "closing",
    short:
      "A legal claim against a property securing a debt, which generally must be resolved before clear title transfers.",
    definition: [
      "Mortgages are voluntary liens. Tax liens, mechanic’s liens from unpaid contractors, and judgment liens are involuntary. Priority is usually determined by recording order and by statute.",
      "Outstanding liens surface in the title search and are typically paid from proceeds at closing so the buyer receives clear title.",
    ],
    seeAlso: ["title-search", "title-insurance", "heloc", "net-proceeds"],
  },
  {
    slug: "escrow-officer",
    term: "Escrow officer (settlement agent)",
    aliases: ["settlement agent", "closing agent"],
    category: "closing",
    short:
      "The neutral third party who holds funds and documents and carries out the closing according to instructions.",
    definition: [
      "The escrow officer holds earnest money, collects signed documents and funds, pays off existing liens, disburses proceeds, and sends the deed for recording. They act for the transaction, not for either side.",
      "Escrow in this sense — a neutral closing party — is different from the escrow account your servicer uses for taxes and insurance after closing.",
    ],
    seeAlso: ["settlement", "escrow-account", "title-insurance", "recording"],
  },
  {
    slug: "settlement",
    term: "Settlement (closing)",
    category: "closing",
    short:
      "The meeting where documents are signed, funds are disbursed, and ownership transfers.",
    definition: [
      "At settlement the buyer signs loan documents and the deed is executed, funds are wired and disbursed, and the deed is sent for recording. Ownership formally changes when the deed records, which can be the same day or shortly after signing.",
      "Signing and funding are separate steps. A file can be signed and still awaiting funding, which is why possession is defined by the contract rather than by the signing appointment.",
    ],
    seeAlso: ["escrow-officer", "closing-disclosure", "recording", "walkthrough"],
  },
  {
    slug: "recording",
    term: "Recording",
    category: "closing",
    short:
      "Filing the deed and security instrument with the county so the transfer and any liens become public record.",
    definition: [
      "Recording puts the world on notice of ownership and of liens against the property, and it establishes priority among competing claims.",
      "Until documents record, the transfer is not reflected in the public record — which is why recording, not signing, is the moment most often treated as completion.",
    ],
    seeAlso: ["deed", "lien", "settlement", "title-search"],
  },
  {
    slug: "ron",
    term: "RON (Remote Online Notarization)",
    aliases: ["remote online notarization", "online notary", "remote notary"],
    category: "closing",
    short:
      "Notarization performed over live audio-video with identity verification, producing a digitally signed and sealed record.",
    definition: [
      "In a RON session the signer appears by live audio-video, passes identity verification, and signs electronically while the notary applies a digital seal. The session is recorded and retained under the rules of the notary’s commissioning state.",
      "Acceptance depends on the commissioning state’s authority and on whether the receiving party — a lender, title company, or county recorder — accepts electronically notarized documents.",
    ],
    whyItMatters:
      "RON removes travel from a signing, which matters most for out-of-state sellers, deployed service members, and anyone closing across time zones.",
    seeAlso: ["notary-acknowledgment", "jurat", "settlement"],
    related: [
      { label: "Online notary services", href: "/notary/" },
      { label: "Preparing for a remote notary session", href: "/blog/prepare-for-remote-online-notary-session/" },
    ],
  },
  {
    slug: "notary-acknowledgment",
    term: "Acknowledgment",
    aliases: ["notarial acknowledgment"],
    category: "closing",
    short:
      "A notarial act where the signer confirms to the notary that the signature is theirs and was made willingly.",
    definition: [
      "In an acknowledgment, the notary verifies identity and the signer acknowledges having signed voluntarily. The signature does not have to be made in front of the notary — only acknowledged.",
      "Acknowledgments are the usual act for deeds and other recordable instruments.",
    ],
    seeAlso: ["jurat", "ron", "deed"],
    related: [{ label: "Notary services", href: "/notary/" }],
  },
  {
    slug: "jurat",
    term: "Jurat",
    category: "closing",
    short:
      "A notarial act where the signer swears or affirms the truth of a document and signs in the notary’s presence.",
    definition: [
      "A jurat requires the signature to be made in front of the notary, together with an oath or affirmation that the contents are true. Affidavits and sworn statements typically use one.",
      "The difference from an acknowledgment matters: a jurat is about the truth of the contents, an acknowledgment about the authenticity of the signature.",
    ],
    seeAlso: ["notary-acknowledgment", "ron"],
    related: [{ label: "Notary services", href: "/notary/" }],
  },
  {
    slug: "apostille",
    term: "Apostille",
    category: "closing",
    short:
      "A certificate authenticating a public document for legal use in another participating country.",
    definition: [
      "An apostille is issued by a designated state authority — commonly the Secretary of State — certifying the authenticity of a notary’s commission or an official’s signature so the document is recognized abroad.",
      "It authenticates the official who signed, not the contents. Countries outside the applicable convention use a different legalization process.",
    ],
    seeAlso: ["notary-acknowledgment", "ron"],
    related: [{ label: "Notary services", href: "/notary/" }],
  },
  {
    slug: "property-tax",
    term: "Property tax",
    category: "closing",
    short:
      "An annual tax assessed by local government on real property, usually collected monthly through escrow.",
    definition: [
      "Property tax is levied by local taxing entities based on an assessed value and the applicable rates. It is prorated between buyer and seller at closing and, for most mortgages, collected monthly into an escrow account.",
      "Assessments and rates change, so a payment based on the seller’s tax figure can shift after the first assessment following a sale. Owner-occupied properties may qualify for exemptions that an investment property does not.",
    ],
    calculators: ["cost-of-living", "mortgage-payment"],
    seeAlso: ["escrow-account", "piti", "prepaids", "operating-expenses"],
    related: [{ label: "Understanding property taxes in Utah", href: "/blog/understanding-property-taxes-utah/" }],
  },
  {
    slug: "homeowners-insurance",
    term: "Homeowners insurance",
    aliases: ["hazard insurance", "ho-3", "ho-6"],
    category: "closing",
    short:
      "Property and liability coverage a lender requires, typically paid a year in advance at closing then escrowed.",
    definition: [
      "Lenders require coverage protecting the structure at least to the replacement cost of the improvements. A standard homeowners policy covers a detached house; a condo unit uses a different form that coordinates with the association’s master policy.",
      "The first year is generally paid at closing as a prepaid item, with subsequent premiums collected monthly through escrow.",
    ],
    calculators: ["cost-of-living", "mortgage-payment"],
    seeAlso: ["prepaids", "escrow-account", "piti", "hoa", "renters-insurance"],
    related: [{ label: "Hazard vs HO-3 vs HO-6 condo insurance", href: "/blog/hazard-vs-ho3-vs-ho6-condo-insurance/" }],
  },
  {
    slug: "condo",
    term: "Condominium",
    aliases: ["condo", "condominium"],
    category: "closing",
    short:
      "Ownership of an individual unit plus a shared interest in common areas, governed by an association.",
    definition: [
      "A condo owner holds the unit interior and an undivided interest in common elements. That structure means the association’s finances and insurance affect every owner directly.",
      "Financing is project-based as well as borrower-based: lenders review the association’s budget, reserves, owner-occupancy ratio, litigation, and insurance, and a project that fails review can make an otherwise strong borrower unable to finance that unit.",
    ],
    whyItMatters:
      "With a condo you are underwriting the association as well as the unit. Reserves and the owner-occupancy ratio can decide whether financing is available at all.",
    seeAlso: ["hoa", "homeowners-insurance", "fha-loan", "title-insurance"],
    related: [{ label: "Townhome vs condo: HOA docs lenders ask for", href: "/blog/townhome-vs-condo-hoa-docs-lenders-ask/" }],
    lending: true,
  },
]

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  ...MORTGAGE_TERMS,
  ...BUYING_TERMS,
  ...SELLING_TERMS,
  ...INVESTING_TERMS,
  ...RENTING_TERMS,
  ...CLOSING_TERMS,
]

const BY_SLUG: ReadonlyMap<string, GlossaryTerm> = new Map(
  GLOSSARY_TERMS.map((entry) => [entry.slug, entry]),
)

export const GLOSSARY_SLUGS: readonly string[] = GLOSSARY_TERMS.map((entry) => entry.slug)

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return BY_SLUG.get(slug)
}

/** Alphabetical by display term, case-insensitive, ignoring a leading article. */
export function sortedGlossaryTerms(): GlossaryTerm[] {
  return [...GLOSSARY_TERMS].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
  )
}

export function glossaryTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  return sortedGlossaryTerms().filter((entry) => entry.category === category)
}

/** First letter used for the A–Z jump list. Non-letters group under "#". */
export function glossaryInitial(entry: GlossaryTerm): string {
  const first = entry.term.trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(first) ? first : "#"
}

export function glossaryInitials(): string[] {
  return [...new Set(sortedGlossaryTerms().map(glossaryInitial))].sort()
}

/**
 * Substring match across term, aliases, and the one-line summary.
 * Deliberately simple: the dataset is small and shipping a search index for
 * ~90 entries would cost more bytes than it saves.
 */
export function searchGlossary(query: string): GlossaryTerm[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return sortedGlossaryTerms()
  return sortedGlossaryTerms().filter((entry) => {
    if (entry.term.toLowerCase().includes(needle)) return true
    if (entry.slug.includes(needle)) return true
    if (entry.short.toLowerCase().includes(needle)) return true
    return (entry.aliases ?? []).some((alias) => alias.toLowerCase().includes(needle))
  })
}

/** Terms that explain a given calculator's inputs or outputs. */
export function glossaryTermsForCalculator(calculatorSlug: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((entry) => (entry.calculators ?? []).includes(calculatorSlug))
}

/** Resolve `seeAlso` slugs to entries, dropping any that no longer exist. */
export function relatedGlossaryTerms(entry: GlossaryTerm): GlossaryTerm[] {
  return (entry.seeAlso ?? [])
    .map((slug) => BY_SLUG.get(slug))
    .filter((value): value is GlossaryTerm => Boolean(value))
}

export function glossaryHref(slug: string): string {
  return `/glossary/${slug}/`
}
