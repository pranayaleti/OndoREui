import type { PricingIncludedRow } from "./pricing-included"

/**
 * Honest listing-service lines for /sell. Pulled from services already
 * described in `lib/site-index.ts` (CMA, photography, staging guidance,
 * MLS syndication, negotiation). Typical column is industry pattern, not
 * a named brokerage dunk and not a savings claim.
 */
export const SELL_INCLUDED_ROWS: readonly PricingIncludedRow[] = [
  {
    item: "Pricing (CMA)",
    ondo: "Comparative market analysis and a written pricing strategy before you list. The online estimator is not a CMA.",
    typical: "A CMA is common with a full-service listing agent. Automated estimates are not a CMA.",
  },
  {
    item: "Photography",
    ondo: "Professional listing photography as part of going to market.",
    typical: "Often included; some shops bill photo or video a la carte. Verify the listing agreement.",
  },
  {
    item: "Staging",
    ondo: "Staging guidance. Physical staging, if used, is scoped separately.",
    typical: "Guidance is common; full furniture staging is usually an extra vendor cost.",
  },
  {
    item: "MLS syndication",
    ondo: "We list on the MLS and syndicate to major consumer portals through that listing.",
    typical: "Full-service listings typically go on the MLS. Flat-fee or FSBO paths vary.",
  },
  {
    item: "Showings & negotiation",
    ondo: "Coordinated showings, offer review, negotiation, and closing coordination.",
    typical: "Included in a full-service listing agreement; limited-service models differ.",
  },
  {
    item: "Listing compensation",
    ondo: "Quoted in writing for your property. No published flat listing fee on this site.",
    typical: "Negotiated with the listing broker. There is no single statewide rate.",
  },
  {
    item: "Buyer-broker compensation",
    ondo: "A separate, negotiated item. We do not advertise that the seller automatically pays the buyer’s agent.",
    typical: "Since 2024, buyer-broker pay is negotiated and written into a buyer agreement — not “typically free.”",
  },
]
