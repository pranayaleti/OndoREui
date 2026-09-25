import { APP_PORTAL_LOGIN_URL, SITE_CALENDLY_URL, SITE_SOCIAL_LINKS, type SocialLink } from "@/lib/site"
import { PROPERTIES_MANAGED, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"

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
  /** Renders in the brand gradient. One per page, or nothing stands out. */
  primary?: boolean
}

export type LinksPageSection = {
  id: string
  /** Who the section is for, so visitors can find their path at a glance. */
  heading: string
  links: readonly LinksPageLink[]
}

/**
 * First thing a new visitor reads after watching a video: who Pranay is, in his own
 * words (adapted from the founder's letter at /founders-letter). No license claims here.
 */
export const LINKS_PAGE_INTRO = {
  heading: "Hi, I'm Pranay",
  paragraphs: [
    "I spent over a decade building software, and I own and manage rental property myself. Property management felt stuck in the past, so I built Ondo to make owning a rental stress-free and renting a home feel fair.",
    "Everything's in one place here. Start with a free call, or pick your path below.",
  ],
  /** Same numbers the homepage shows (lib/social-proof-stats.ts), so the two never drift apart. */
  facts: [`${UTAH_CITIES_SERVED}+ Utah cities`, `${PROPERTIES_MANAGED}+ properties managed`, "Based in Lehi, Utah"],
} as const

export const LINKS_PAGE_SECTIONS: readonly LinksPageSection[] = [
  {
    id: "start",
    heading: "Start here",
    links: [
      { id: "book-call", label: "Book a free 30-minute call", href: SITE_CALENDLY_URL, primary: true },
      // U+00A0 non-breaking space keeps "60 seconds" together when the label wraps on phones.
      { id: "quiz", label: "Get matched to the right service in 60 seconds", href: "/get-matched/" },
    ],
  },
  {
    id: "about",
    heading: "Get to know me",
    links: [
      { id: "founder-story", label: "Read my story", href: "/founders-letter/" },
      { id: "about", label: "About Ondo Real Estate", href: "/about/" },
      { id: "platform-tour", label: "Take the platform tour", href: "/tour/" },
    ],
  },
  {
    id: "owners",
    heading: "Rental owners",
    links: [
      { id: "rent-estimate", label: "Get a free rent estimate", href: "/whats-my-home-worth/" },
      { id: "management", label: "Management pricing and what's included", href: "/property-management/" },
      { id: "new-investors", label: "Start investing in Utah rentals", href: "/new-investors/" },
    ],
  },
  {
    id: "buy-sell",
    heading: "Buying, selling and loans",
    links: [
      { id: "afford-quiz", label: "See how much home you can afford", href: "/buy/quiz/" },
      { id: "buy", label: "Buy a home in Utah", href: "/buy/" },
      { id: "sell", label: "Sell your home", href: "/sell/" },
      { id: "loans", label: "Home loans and refinancing", href: "/loans/" },
    ],
  },
  {
    id: "clients",
    heading: "Renters and clients",
    links: [
      { id: "browse-homes", label: "Browse homes for rent and sale", href: "/properties/" },
      { id: "portal-login", label: "Tenant and owner portal login", href: APP_PORTAL_LOGIN_URL },
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

function isLinktree(url: string): boolean {
  try {
    return new URL(url).hostname.replace(/^www\./, "") === "linktr.ee"
  } catch {
    return false
  }
}

/**
 * Social profile URLs for the icon row: the same `live` flags the footer and
 * JSON-LD use, minus Linktree, which now forwards to /links and would loop.
 */
export function linksPageSocials(profiles: readonly SocialLink[] = SITE_SOCIAL_LINKS): string[] {
  return profiles.filter((profile) => profile.live && !isLinktree(profile.url)).map((profile) => profile.url)
}
