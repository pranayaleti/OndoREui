export const RENTER_PATH_HEADING = "How to rent with Ondo"

export const RENTER_PATH_FAIR_HOUSING =
  "Equal Housing Opportunity. We consider every complete application using the same written criteria."

export type RenterPathVariant = "listings" | "listing-detail"

export type RenterPathStepId = "find" | "showing" | "invite"

export type RenterPathStep = {
  id: RenterPathStepId
  title: string
  body: string
  href?: string
}

export const RENTER_PATH_STEPS: readonly RenterPathStep[] = [
  {
    id: "find",
    title: "Find a home",
    body: "Match a pin or a card. Open details for rent, photos, and the exact street.",
  },
  {
    id: "showing",
    title: "Request a showing",
    body: "Leasing books the tour. These pages do not publish an open apply form.",
    href: "#ask-leasing",
  },
  {
    id: "invite",
    title: "Apply by invite",
    body: "After a showing, we send a screening link. The same written criteria apply to every complete application.",
  },
]

export function renterPathIntro(variant: RenterPathVariant): string {
  switch (variant) {
    case "listings":
      return "Ondo-managed homes along the Wasatch Front. Tour first — we send an application link after a showing."
    case "listing-detail":
      return "Request a showing to tour this home. Screening links go out after leasing confirms a visit."
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}
