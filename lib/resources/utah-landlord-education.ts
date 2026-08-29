/**
 * Outbound pointers to third-party Utah landlord education and official
 * public pages. Destinations were resolved from:
 * - https://www.thegoodlandlord.net/home/
 * - https://www.thegoodlandlord.net/home/helpfulwebsites
 * - https://www.rhautah.org/education-center
 *
 * Ondo does not operate these programs and does not host their PDFs.
 * Educational only — not legal advice.
 */

export const UTAH_LANDLORD_EDUCATION_KINDS = [
  "official",
  "training",
  "forms",
  "association",
] as const

export type UtahLandlordEducationKind = (typeof UTAH_LANDLORD_EDUCATION_KINDS)[number]

export interface UtahLandlordEducationLink {
  title: string
  href: string
  source: string
  description: string
  kind: UtahLandlordEducationKind
  /** True when the live page redirected to login or labeled member-only. */
  loginMayBeRequired?: boolean
}

export const UTAH_LANDLORD_EDUCATION_SECTION_HREF = "/resources#utah-landlord-education"

export const UTAH_LANDLORD_EDUCATION_DISCLAIMER =
  "These are third-party programs and official public pages. Ondo Real Estate does not operate The Good Landlord or the Rental Housing Association of Utah (RHA Utah), does not host their class content or form PDFs, and does not issue city business-license discounts. Educational only — not legal advice, not a substitute for a licensed attorney, and not Ondo’s lease packet. Fair Housing and Equal Housing Opportunity rules apply to every rental; we do not steer applicants toward or away from any neighborhood or protected class."

export const UTAH_LANDLORD_EDUCATION_INTRO =
  "Some Utah cities require a Good Landlord class for a rental business-license fee discount. Confirm whether your city participates and what it currently accepts — use the cities page below, then verify with the city. Completing a class through Ondo is not how that discount is granted."

export const UTAH_LANDLORD_EDUCATION_LINKS: readonly UtahLandlordEducationLink[] = [
  {
    title: "Utah Fit Premises Act (Utah Code Title 57, Chapter 22)",
    href: "https://le.utah.gov/xcode/Title57/Chapter22/57-22.html",
    source: "Utah Legislature",
    description:
      "Official Utah Code chapter on landlord and tenant habitability duties. The Good Landlord’s helpful-websites list pointed at a Legislature PDF of this chapter; this is the live statute page.",
    kind: "official",
  },
  {
    title: "Utah eviction process (Online Court Assistance Program)",
    href: "https://www.utcourts.gov/en/self-help/services/ocap.html",
    source: "Utah State Courts",
    description:
      "Utah State Courts OCAP — the destination The Good Landlord labeled “Utah Eviction process.” Use it to generate court forms; it is not legal advice and not an Ondo filing service.",
    kind: "official",
  },
  {
    title: "Utah State Courts housing self-help",
    href: "https://www.utcourts.gov/en/self-help/case-categories/housing.html",
    source: "Utah State Courts",
    description:
      "Official self-help hub for eviction and other landlord-tenant topics. Educational court information — not a substitute for a licensed attorney.",
    kind: "official",
  },
  {
    title: "HUD Fair Housing guidance",
    href: "https://www.hud.gov/fairhousing",
    source: "HUD",
    description:
      "U.S. Department of Housing and Urban Development Fair Housing information, including Equal Housing Opportunity. The PDF on The Good Landlord’s helpful-websites list currently returns 404, so this official HUD page is the working destination.",
    kind: "official",
  },
  {
    title: "Landlord-tenant mediation (Utah State Courts)",
    href: "https://www.utcourts.gov/en/about/miscellaneous/mediation.html",
    source: "Utah State Courts",
    description:
      "Current Utah State Courts mediation and arbitration page. The Good Landlord’s older landlord-tenant mediation URL now 404s; this is the official replacement, not a private marketing wrapper.",
    kind: "official",
  },
  {
    title: "The Good Landlord — helpful websites",
    href: "https://www.thegoodlandlord.net/home/helpfulwebsites",
    source: "The Good Landlord",
    description:
      "Their list of Utah Fit Premises, eviction, HUD Fair Housing, and mediation links. Official destinations are listed separately in this section.",
    kind: "official",
  },
  {
    title: "The Good Landlord — training home",
    href: "https://www.thegoodlandlord.net/home/",
    source: "The Good Landlord",
    description:
      "Independent landlord training based in Kaysville, UT (online and live classes). Not an Ondo course and not a city license by itself.",
    kind: "training",
  },
  {
    title: "The Good Landlord — live classes",
    href: "https://www.thegoodlandlord.net/home/classes",
    source: "The Good Landlord",
    description:
      "Schedule and registration for live Good Landlord classes. Confirm dates and city-discount rules with the provider and the city.",
    kind: "training",
  },
  {
    title: "The Good Landlord — online training",
    href: "https://www.thegoodlandlord.net/home/onlinetraining",
    source: "The Good Landlord",
    description:
      "Online Good Landlord training. An account login may be required to start the course.",
    kind: "training",
    loginMayBeRequired: true,
  },
  {
    title: "Good Landlord cities",
    href: "https://www.thegoodlandlord.net/home/goodlandlordcities",
    source: "The Good Landlord",
    description:
      "Cities this provider lists as participating in a Good Landlord program. Participation and license-fee discounts change — verify with the city before you rely on a discount.",
    kind: "training",
  },
  {
    title: "The Good Landlord — background checks",
    href: "https://www.thegoodlandlord.net/home/backgroundchecks",
    source: "The Good Landlord",
    description:
      "Third-party screening service offered by The Good Landlord, not by Ondo. Apply the same criteria to every applicant (Fair Housing). Account login may be required.",
    kind: "training",
    loginMayBeRequired: true,
  },
  {
    title: "RHA Utah — Good Landlord class",
    href: "https://www.rhautah.org/good-landlord",
    source: "RHA Utah",
    description:
      "RHA of Utah’s Good Landlord class (property-management basics). RHA states that some cities require this class for a good-landlord discount on business-license fees, and that the class is accepted statewide. Ondo does not operate the class or the discount.",
    kind: "training",
  },
  {
    title: "Utah Professional Rental Operator (UPRO)",
    href: "https://www.rhautah.org/upro-certification",
    source: "RHA Utah",
    description:
      "RHA of Utah’s 32-hour UPRO designation series. Association education — not an Ondo credential.",
    kind: "training",
  },
  {
    title: "Certified Apartment Manager (CAM)",
    href: "https://www.rhautah.org/cam-certification",
    source: "RHA Utah",
    description:
      "National Apartment Association CAM designation administered in Utah by RHA. Member or registration steps may apply.",
    kind: "training",
  },
  {
    title: "RHA general membership meetings",
    href: "https://www.rhautah.org/general-membership-meetings",
    source: "RHA Utah",
    description:
      "Recurring RHA of Utah membership meetings with rotating education topics. Membership details are on RHA’s site.",
    kind: "training",
  },
  {
    title: "RHA maintenance education",
    href: "https://www.rhautah.org/events/education",
    source: "RHA Utah",
    description:
      "RHA education calendar for maintenance training (including HVAC and CPO topics they list). Confirm current events on their calendar.",
    kind: "training",
  },
  {
    title: "Certified Apartment Supplier (CAS)",
    href: "https://www.rhautah.org/cas-certification",
    source: "RHA Utah",
    description:
      "NAA Certified Apartment Supplier designation administered by RHA of Utah for industry suppliers — not a landlord license.",
    kind: "training",
  },
  {
    title: "RHA education shorts",
    href: "https://www.rhautah.org/education-videos",
    source: "RHA Utah",
    description:
      "Short topic videos listed from RHA’s Education Center. Member login may be required; some items are pending migration on their site.",
    kind: "training",
    loginMayBeRequired: true,
  },
  {
    title: "The Good Landlord — download forms",
    href: "https://www.thegoodlandlord.net/home/forms",
    source: "The Good Landlord",
    description:
      "Their form downloads (leases and related files they host). Ondo does not copy or serve these PDFs. Account login may be required.",
    kind: "forms",
    loginMayBeRequired: true,
  },
  {
    title: "RHA printed / PDF material",
    href: "https://www.rhautah.org/education-downloads",
    source: "RHA Utah",
    description:
      "RHA Education Center pamphlets and PDFs (including a landlord guide and HUD assistance-animal materials they publish). Link out — Ondo does not host the files.",
    kind: "forms",
  },
  {
    title: "RHA Utah Education Center",
    href: "https://www.rhautah.org/education-center",
    source: "RHA Utah",
    description:
      "Rental Housing Association of Utah education hub: Good Landlord class, UPRO, CAM, membership meetings, maintenance education, CAS, education shorts, printed materials, and market reports.",
    kind: "association",
  },
  {
    title: "RHA market reports",
    href: "https://www.rhautah.org/economic-data",
    source: "RHA Utah",
    description:
      "RHA economic-forecast and multifamily market report downloads. Third-party data — not an Ondo appraisal, CMA, or valuation.",
    kind: "association",
  },
]

export function utahLandlordEducationKindLabel(kind: UtahLandlordEducationKind): string {
  switch (kind) {
    case "official":
      return "Official statutes, courts & HUD"
    case "training":
      return "Training & classes"
    case "forms":
      return "Third-party forms (link out)"
    case "association":
      return "Association education & reports"
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

export interface UtahLandlordEducationGroup {
  kind: UtahLandlordEducationKind
  label: string
  links: readonly UtahLandlordEducationLink[]
}

export function groupedUtahLandlordEducationLinks(): UtahLandlordEducationGroup[] {
  return UTAH_LANDLORD_EDUCATION_KINDS.map((kind) => ({
    kind,
    label: utahLandlordEducationKindLabel(kind),
    links: UTAH_LANDLORD_EDUCATION_LINKS.filter((link) => link.kind === kind),
  }))
}
