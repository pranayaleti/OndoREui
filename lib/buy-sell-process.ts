export type BuySellProcessStep = {
  label: string
  title: string
  desc: string
  href?: string
  hrefLabel?: string
}

/**
 * Buyer sequence for /buy only. Homepage HowItWorksSection stays owner-PM.
 * Financing is a parallel track via /loans — not an instant prequal letter.
 */
export const BUY_PROCESS_STEPS: readonly BuySellProcessStep[] = [
  {
    label: "Shop",
    title: "Shop with an agent",
    desc: "An Ondo agent searches live for-sale inventory with you, including the MLS. This website lists rentals we manage, not a public for-sale feed.",
    href: "/get-matched",
    hrefLabel: "Get matched with an agent",
  },
  {
    label: "Offer",
    title: "Write the offer",
    desc: "We help structure price, dates, and contingencies on the Utah purchase contract after a real lending conversation — not an instant online approval.",
  },
  {
    label: "Negotiate",
    title: "Negotiate",
    desc: "Inspection, appraisal, and credits. Your agent works the contract. Nothing on this site is a credit decision.",
  },
  {
    label: "Close",
    title: "Close",
    desc: "Title, underwriting, and keys. Financing can run in parallel from day one.",
    href: "/loans",
    hrefLabel: "Home loans",
  },
]

/**
 * Seller sequence for /sell only. Lines match services already described in
 * `lib/site-index.ts` (CMA, photography, MLS syndication, negotiation).
 */
export const SELL_PROCESS_STEPS: readonly BuySellProcessStep[] = [
  {
    label: "CMA",
    title: "Price with a CMA",
    desc: "A comparative market analysis and a written pricing range before you list. The online estimator is not a CMA.",
    href: "/whats-my-home-worth",
    hrefLabel: "Start with a home-value estimate",
  },
  {
    label: "List",
    title: "Market and list",
    desc: "Professional photography, staging guidance, and MLS syndication to major consumer portals through that listing.",
  },
  {
    label: "Show",
    title: "Showings",
    desc: "Coordinated showings while the home is on market, then offer review with you.",
  },
  {
    label: "Close",
    title: "Close",
    desc: "Negotiation through title, inspections, and recording.",
  },
]
