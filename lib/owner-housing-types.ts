export type OwnerHousingTypeId = "sfh" | "townhome" | "condo-hoa" | "small-multifamily"

export type OwnerHousingType = {
  id: OwnerHousingTypeId
  title: string
  utahHook: string
  opsNote: string
  href: string
  linkLabel: string
}

/**
 * Long-term housing Ondo actually manages, tied to neighborhood stock we
 * already publish. Not a vacation/STR grid and not a numbered 01–06 portfolio.
 */
export const OWNER_HOUSING_TYPES: readonly OwnerHousingType[] = [
  {
    id: "sfh",
    title: "Single-family homes",
    utahHook:
      "Victorian, Craftsman, and mid-century houses — the Avenues-style stock already on our neighborhood pages.",
    opsNote:
      "Wasatch winters mean furnace inspections and pipe insulation before freeze-up. Working heat is a landlord obligation; after-hours no-heat goes to the 24/7 emergency line.",
    href: "/neighborhoods/salt-lake-city/the-avenues/",
    linkLabel: "Avenues housing notes",
  },
  {
    id: "townhome",
    title: "Townhomes",
    utahHook:
      "Infill and new-construction townhomes like the Sugar House mix of bungalows, ramblers, and attached product.",
    opsNote:
      "Shared walls change how we schedule exterior work. We read the CC&Rs before listing so snow removal and paint cycles are not a surprise.",
    href: "/neighborhoods/salt-lake-city/sugar-house/",
    linkLabel: "Sugar House housing notes",
  },
  {
    id: "condo-hoa",
    title: "Condos and HOA communities",
    utahHook:
      "Downtown lofts, converted warehouses, and association buildings where rental caps and move-in windows live in the CC&Rs.",
    opsNote:
      "We coordinate against HOA billing, elevator reservations, and rental-registration rules. Occupant type is never the filter — the documents are.",
    href: "/neighborhoods/salt-lake-city/downtown/",
    linkLabel: "Downtown housing notes",
  },
  {
    id: "small-multifamily",
    title: "Small multifamily",
    utahHook:
      "Duplexes, fourplexes, and 2–8 unit conversions — the Liberty Wells mix of bungalows and small multi-family.",
    opsNote:
      "Several doors under one owner is why Growth pricing (5+) is a different rate than Starter. We manage the building, not a nightly calendar.",
    href: "/neighborhoods/salt-lake-city/liberty-wells/",
    linkLabel: "Liberty Wells housing notes",
  },
]
