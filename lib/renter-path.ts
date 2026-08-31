export const RENTER_PATH_HEADING = "How to rent with Ondo"

export const RENTER_PATH_FAIR_HOUSING =
  "Equal Housing Opportunity. We consider every complete application using the same written, property-specific criteria."

export type RenterPathVariant = "listings" | "listing-detail"

export type RenterPathStepId = "find" | "review" | "apply"

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
    id: "review",
    title: "Review requirements",
    body: "Read this home’s written criteria, then check whether you have the documents ready.",
    href: "#listing-apply",
  },
  {
    id: "apply",
    title: "Tour or apply",
    body: "Schedule a tour or start an application. The same written criteria apply to every complete file. Starting is not an approval.",
    href: "#listing-apply",
  },
]

export const RENTER_PATH_STEPS_LISTINGS: readonly RenterPathStep[] = [
  {
    id: "find",
    title: "Find a home",
    body: "Match a pin or a card. Open details for rent, photos, and the exact street.",
  },
  {
    id: "review",
    title: "Review a listing",
    body: "Open a home for rent, deposit, photos, and written requirements.",
  },
  {
    id: "apply",
    title: "Tour or apply",
    body: "Request a showing or apply from the listing when applications are open. Starting is not an approval.",
    href: "#ask-leasing",
  },
]

export function renterPathSteps(variant: RenterPathVariant): readonly RenterPathStep[] {
  return variant === "listing-detail" ? RENTER_PATH_STEPS : RENTER_PATH_STEPS_LISTINGS
}

export function renterPathIntro(variant: RenterPathVariant): string {
  switch (variant) {
    case "listings":
      return "Ondo-managed homes along the Wasatch Front. Review rent and written requirements, then tour or apply when the listing is open."
    case "listing-detail":
      return "Review this home’s rent, deposit, and application requirements. You can request a tour or start an application when the listing is open."
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}
