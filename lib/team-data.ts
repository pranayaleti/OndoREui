import {
  LICENSING_LIVE,
  SITE_BROKERAGE_NAME,
  SITE_COMPANY_NMLS_ID,
  SITE_LENDER_NAME,
  SITE_LOAN_OFFICER,
  SITE_RE_LICENSE_NUMBER,
} from "./site"

/**
 * Public team roster. Only real people who have agreed to be listed belong here.
 * Do not add titles, license numbers, years of experience, photos or personal
 * mailboxes that are not verified (contact goes through /contact/). License fields are
 * placeholders until licensing and render only when LICENSING_LIVE (lib/site.ts) is on.
 */
export type TeamMemberLicenses = {
  realEstate: { number: string; brokerageName: string }
  mortgage: { nmlsId: string; lenderName: string; lenderNmlsId: string }
}

export type TeamMember = {
  name: string
  slug: string
  title: string
  bio: string
  /** The fields below feed the founder's profile page and Person JSON-LD (lib/seo.ts). */
  image?: string
  knowsAbout?: readonly string[]
  /** Counties served, as schema.org AdministrativeArea names. */
  areaServed?: readonly string[]
  /** The person's own claimed profiles (not the company's). Empty until supplied. */
  sameAs?: readonly string[]
  licenses?: TeamMemberLicenses
}

export const FOUNDER_SLUG = "pranay-reddy-aleti"
/** The founder's profile page: the one place the full Person node lives. */
export const FOUNDER_PROFILE_PATH = `/about/team/${FOUNDER_SLUG}/`

export const teamMembers: TeamMember[] = [
  {
    name: "Pranay Reddy Aleti",
    slug: FOUNDER_SLUG,
    title: "Founder",
    bio: "Pranay founded Ondo Real Estate and built the platform behind the owner and tenant portals. He started in software and moved into real estate, and he still works with clients directly.",
    image: "/founder-image.webp",
    knowsAbout: [
      "Property management",
      "Utah real estate",
      "Real estate investing",
      "Home financing",
      "Full stack software development",
    ],
    areaServed: ["Salt Lake County", "Utah County", "Davis County", "Weber County"],
    sameAs: [],
    licenses: {
      realEstate: { number: SITE_RE_LICENSE_NUMBER, brokerageName: SITE_BROKERAGE_NAME },
      mortgage: {
        nmlsId: SITE_LOAN_OFFICER.nmlsId,
        lenderName: SITE_LENDER_NAME,
        lenderNmlsId: SITE_COMPANY_NMLS_ID,
      },
    },
  },
]

export function getTeam(): TeamMember[] {
  return teamMembers
}

export function findTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug)
}

export function getFounder(): TeamMember {
  const founder = findTeamMemberBySlug(FOUNDER_SLUG)
  if (!founder) throw new Error(`team-data: founder "${FOUNDER_SLUG}" is missing from teamMembers`)
  return founder
}

/** Role line under the founder's name. License titles appear only once licensing is live. */
export function founderRoleLabel(live: boolean = LICENSING_LIVE): string {
  return live ? "Founder · Utah real estate agent and loan officer" : "Founder, Ondo Real Estate"
}
