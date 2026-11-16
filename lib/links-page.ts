import {
  APP_PORTAL_URL,
  LICENSING,
  licensingState,
  type LicensingState,
  SITE_CALENDLY_URL,
  SITE_LOAN_OFFICER,
  SITE_SOCIAL_LINKS,
  type SocialLink,
} from "@/lib/site"
import { UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"

/**
 * Content for /links, the link-in-bio page that replaced linktr.ee/ondorealestate.
 * Every social bio points here, so edit this file (not the page) to add, reorder,
 * or retire a link. lib/links-page.test.ts fails the build if a site path stops
 * resolving to a route or an outside URL loses its scheme.
 */
export type LinksPageLink = {
  /** GA4 `links_click` event label. Keep it stable: a new id starts a new click count. */
  id: string
  label: string
  /** Site path with trailing slash (same tab, keeps UTM attribution) or absolute URL (new tab). */
  href: string
}

export type LinksPageSection = {
  id: string
  /** Who the section is for, so visitors can find their path at a glance. */
  heading: string
  links: readonly LinksPageLink[]
}

/** Plain text, or a phrase the page highlights in the brand color. */
export type IntroSegment = string | { highlight: string }

type LinksPageIntro = {
  heading: string
  paragraphs: readonly (readonly IntroSegment[])[]
  facts: readonly string[]
}

/** The role sentence once both licenses are active: titles, NMLS ID, and the three services. */
const LICENSED_ROLE_PARAGRAPH: readonly IntroSegment[] = [
  "As a Utah ",
  { highlight: "real estate agent" },
  " and ",
  { highlight: "loan officer" },
  ` (NMLS #${SITE_LOAN_OFFICER.nmlsId}), I help you `,
  { highlight: "buy a home" },
  ", ",
  { highlight: "sell your home" },
  " and ",
  { highlight: "find the right home loan" },
  ". My team manages rentals too.",
]

/** Real estate license active, mortgage license still pending: the agent title only, no NMLS claim. */
const AGENT_ONLY_ROLE_PARAGRAPH: readonly IntroSegment[] = [
  "As a Utah ",
  { highlight: "real estate agent" },
  ", I help you ",
  { highlight: "buy a home" },
  " and ",
  { highlight: "sell your home" },
  ", and I'm here to talk ",
  { highlight: "home loans" },
  " while my loan officer license finalizes. My team manages rentals too.",
]

/** Mortgage license active, real estate license still pending: the loan officer title and NMLS ID only. */
const LOAN_ONLY_ROLE_PARAGRAPH: readonly IntroSegment[] = [
  "As a ",
  { highlight: "loan officer" },
  ` (NMLS #${SITE_LOAN_OFFICER.nmlsId}), I help you `,
  { highlight: "find the right home loan" },
  ", and I'm here to talk ",
  { highlight: "buying" },
  " and ",
  { highlight: "selling" },
  " while my real estate license finalizes. My team manages rentals too.",
]

/** Placeholder until licensing: same services, no title or NMLS claim. */
const PENDING_ROLE_PARAGRAPH: readonly IntroSegment[] = [
  "I help Utah ",
  { highlight: "owners" },
  " manage their rentals today, and I'm here to talk ",
  { highlight: "buying" },
  ", ",
  { highlight: "selling" },
  " and ",
  { highlight: "home loans" },
  " while my real estate and loan officer licenses finalize.",
]

/**
 * First thing a new visitor reads after watching a video: who Pranay is, in his own
 * words (adapted from the founder's letter at /founders-letter), with his roles and
 * Ondo's buy, sell and loan services highlighted.
 *
 * LICENSE CLAIMS: "real estate agent" is only true once RE_LICENSE_LIVE is on, and "loan
 * officer" with the NMLS ID only once MLO_LICENSE_LIVE is on (lib/site.ts). Each paragraph
 * carries only the titles that are live; the pending paragraph names the services without them.
 */
export function buildLinksPageIntro(live: boolean | LicensingState = LICENSING): LinksPageIntro {
  const state = licensingState(live)
  const roles =
    state.re && state.mlo
      ? LICENSED_ROLE_PARAGRAPH
      : state.re
        ? AGENT_ONLY_ROLE_PARAGRAPH
        : state.mlo
          ? LOAN_ONLY_ROLE_PARAGRAPH
          : PENDING_ROLE_PARAGRAPH
  return {
    heading: "Hi, I'm Pranay",
    paragraphs: [
      [
        "I spent over a decade building software, and I own and manage rental property myself. I built Ondo to make real estate simpler.",
      ],
      roles,
      ["Everything's in one place here. Start with a free call, or pick your path below."],
    ],
    /** Same numbers the homepage shows (lib/social-proof-stats.ts), so the two never drift apart. */
    facts: [`${UTAH_CITIES_SERVED} Utah cities`, "Founded 2022", "Based in Lehi, Utah"],
  }
}

export const LINKS_PAGE_INTRO: LinksPageIntro = buildLinksPageIntro()

/**
 * The one solid-orange button, right under Call / Text / Email / Save. It sits above the intro
 * so it is on the first screen of a phone in Instagram's or TikTok's in-app browser.
 */
export const LINKS_PAGE_PRIMARY_CTA: LinksPageLink = {
  id: "book-call",
  label: "Book a free 30-minute call",
  href: SITE_CALENDLY_URL,
}

/** Order is priority: buying, selling and home loans lead, right after "Start here". */
export const LINKS_PAGE_SECTIONS: readonly LinksPageSection[] = [
  {
    id: "start",
    heading: "Start here",
    links: [
      // U+00A0 non-breaking space keeps "60 seconds" together when the label wraps on phones.
      { id: "quiz", label: "Get matched to the right service in 60 seconds", href: "/get-matched/" },
      // The "Comment NUMBERS" reel calculator, for viewers who tap the bio instead of commenting.
      { id: "numbers", label: "See what a high rate, empty rental or overpriced listing costs you", href: "/numbers/" },
    ],
  },
  {
    id: "buying",
    heading: "Buying a home",
    links: [
      { id: "afford-quiz", label: "See how much home you can afford", href: "/buy/quiz/" },
      { id: "buy", label: "Buy a home in Utah", href: "/buy/" },
      { id: "browse-for-sale", label: "Browse homes for sale", href: "/properties/" },
    ],
  },
  {
    id: "selling",
    heading: "Selling a home",
    links: [
      { id: "home-value", label: "See what your home could sell for", href: "/whats-my-home-worth/" },
      { id: "sell", label: "Sell your home", href: "/sell/" },
    ],
  },
  {
    id: "loans",
    heading: "Home loans",
    links: [
      { id: "loans", label: "Explore home loans", href: "/loans/" },
      { id: "second-look", label: "Get a second look at your Loan Estimate", href: "/loans/second-look/" },
      { id: "refinance", label: "Refinance your home", href: "/refinance/" },
      { id: "rate-watch", label: "Join the refinance rate watch", href: "/refinance/watch/" },
    ],
  },
  {
    id: "owners",
    heading: "Rental owners",
    links: [
      { id: "rent-estimate", label: "Get a free rent estimate", href: "/whats-my-home-worth/" },
      { id: "management", label: "Management pricing and what's included", href: "/property-management/" },
      { id: "new-investors", label: "How investing in Utah real estate works", href: "/investments/" },
    ],
  },
  {
    id: "clients",
    heading: "Renters and clients",
    links: [
      { id: "browse-homes", label: "Browse homes for rent", href: "/properties/" },
      // Portal root, not /login: the SPA serves deep links with a 404 status, which link checkers flag.
      { id: "portal-login", label: "Tenant and owner portal login", href: APP_PORTAL_URL },
    ],
  },
  {
    id: "agents",
    heading: "Real estate agents",
    links: [
      { id: "agent-referral", label: "Refer a client to Ondo", href: "/contact/?audience=agent_referrals" },
      { id: "affiliate", label: "Join our affiliate program", href: "/affiliate/" },
    ],
  },
  {
    id: "about",
    heading: "Get to know me",
    links: [
      { id: "founder-story", label: "Read my story", href: "/founders-letter/" },
      { id: "about", label: "About Ondo Real Estate", href: "/about/" },
    ],
  },
  {
    id: "more",
    heading: "More from Ondo",
    links: [
      { id: "notary", label: "Book a remote online notary", href: "/notary/" },
      { id: "faq", label: "Read the FAQs", href: "/faq/" },
      { id: "newsletter", label: "Get Utah market updates by email", href: "/subscribe/" },
      { id: "home", label: "Explore the full Ondo site", href: "/" },
    ],
  },
]

/** Social profile URLs for the icon row: the same `live` flags the footer and JSON-LD use. */
export function linksPageSocials(profiles: readonly SocialLink[] = SITE_SOCIAL_LINKS): string[] {
  return profiles.filter((profile) => profile.live).map((profile) => profile.url)
}
