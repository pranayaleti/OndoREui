import {
  ADVERTISED_FLAT_MONTHLY,
  FEE_COMPARISON_AS_OF,
  TYPICAL_UTAH_PM_RANGE_LABEL,
} from "./fee-comparison"

export type PricingIncludedRow = {
  item: string
  ondo: string
  typical: string
}

/**
 * Honest included-vs-typical lines for /pricing. Typical column is industry
 * context, not a named dunk on any one shop. No guarantee products.
 */
export const PRICING_INCLUDED_ROWS: readonly PricingIncludedRow[] = [
  {
    item: "When the management fee is billed",
    ondo: "Published plans bill a percentage of collected rent. Confirm the executed agreement; there is no separate vacancy retainer on those plans.",
    typical: "Percentage of rent, or a flat monthly that may still be billed during vacancy — ask before you sign.",
  },
  {
    item: "Rate by portfolio size",
    ondo: "Starter 10% (1–4 units). Growth 8% (5–15 units). Portfolio 16+ is a custom quote.",
    typical: `Advertised ${TYPICAL_UTAH_PM_RANGE_LABEL} of collected rent (${FEE_COMPARISON_AS_OF}), or a flat monthly (some Utah shops publish ~$${ADVERTISED_FLAT_MONTHLY} as of ${FEE_COMPARISON_AS_OF}) that does not move with your rent.`,
  },
  {
    item: "Setup / onboarding",
    ondo: "None. Account setup is included. The only published one-time extra is leasing when we place a new tenant.",
    typical: "Some shops charge a setup or onboarding fee. Verify before you sign.",
  },
  {
    item: "Leasing / placement",
    ondo: "One-time 50% of first month’s rent when we place a new tenant. No leasing fee on renewals.",
    typical: "0–100% of first month. Some Utah managers advertise $0 placement; others charge a full month. Verify the current offer.",
  },
  {
    item: "Cancellation",
    ondo: "30-day written notice. Month to month — we earn the next month.",
    typical: "30–90 day notice or an annual term. Read the agreement.",
  },
  {
    item: "Vendor invoices",
    ondo: "No markup. Copies of bills sit in the monthly owner statement.",
    typical: "Markup or preferred-vendor premiums are common. Ask how invoices are billed through.",
  },
  {
    item: "Owner technology",
    ondo: "Custom owner portal and AI assistant — built for Ondo, not a white-label franchise login.",
    typical: "AppFolio-class or franchise stack shared across many offices.",
  },
  {
    item: "After-hours emergencies",
    ondo: "24/7 emergency line for burst pipes, no-heat, and lockouts. Not office-hours-only.",
    typical: "Business hours plus an answering service. Coverage varies by office.",
  },
  {
    item: "Licenses in one shop",
    ondo: "Licensed brokerage and property management in one shop. NMLS ID is on file. This table is not an offer or commitment to lend.",
    typical: "Brokerage and PM in-house; lending often a separate shop.",
  },
]
