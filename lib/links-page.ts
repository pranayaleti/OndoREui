import { APP_PORTAL_LOGIN_URL, SITE_CALENDLY_URL, SITE_SOCIAL_LINKS, type SocialLink } from "@/lib/site"

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
  /** Phrased as the visitor's situation so they can find their path at a glance. */
  heading: string
  links: readonly LinksPageLink[]
}

export const LINKS_PAGE_SECTIONS: readonly LinksPageSection[] = [
  {
    id: "start",
    heading: "Start here",
    links: [
      { id: "book-call", label: "Book a free 30-minute call", href: SITE_CALENDLY_URL, primary: true },
      // U+2011 non-breaking hyphen: a plain one wraps as "60-" / "second" on phones.
      { id: "quiz", label: "Not sure yet? Take the 60‑second quiz", href: "/get-matched/" },
    ],
  },
  {
    id: "owners",
    heading: "Own a rental?",
    links: [
      { id: "rent-estimate", label: "See what it should rent for", href: "/whats-my-home-worth/" },
      { id: "management", label: "What management costs and covers", href: "/property-management/" },
      { id: "new-investors", label: "New to investing? Start here", href: "/new-investors/" },
    ],
  },
  {
    id: "buy-sell",
    heading: "Buying, selling or borrowing?",
    links: [
      { id: "buy", label: "Buy a home in Utah", href: "/buy/" },
      { id: "sell", label: "Sell your home", href: "/sell/" },
      { id: "loans", label: "Home loans and refinancing", href: "/loans/" },
    ],
  },
  {
    id: "clients",
    heading: "Renting, or already a client?",
    links: [
      { id: "browse-homes", label: "Browse homes for rent and sale", href: "/properties/" },
      { id: "portal-login", label: "Log in to your tenant or owner portal", href: APP_PORTAL_LOGIN_URL },
    ],
  },
  {
    id: "more",
    heading: "Something else?",
    links: [
      { id: "notary", label: "Remote online notary, nationwide", href: "/notary/" },
      { id: "affiliate", label: "Agents and pros: join our affiliate program", href: "/affiliate/" },
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
