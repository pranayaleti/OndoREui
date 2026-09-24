import { SITE_URL } from "./site"

export type SocialPlatform =
  | "Links"
  | "Blog"
  | "News"
  | "Notary"
  | "LinkedIn"
  | "Instagram"
  | "Facebook"
  | "X"
  | "YouTube"
  | "Other"

export type SocialPost = {
  platform: SocialPlatform
  title: string
  excerpt: string
  url: string
  date: string
}

const base = SITE_URL.replace(/\/$/, "")

/**
 * Curated highlights for `/socials`.
 * Prefer real Ondo pages (and /links, our link-in-bio hub) over third-party hosts.
 * Replace entries when you publish new campaigns or posts.
 */
export const SOCIAL_POSTS: readonly SocialPost[] = [
  {
    platform: "Links",
    title: "All Ondo links in one place",
    excerpt:
      "Book a call, see what your rental should earn, browse homes, or log in to your portal. One page, on our own site.",
    url: `${base}/links/`,
    date: "2026-09-24",
  },
  {
    platform: "Notary",
    title: "On-demand notary: same-day when we can",
    excerpt:
      "Need a notarization today? We try to accommodate same-day when capacity allows. Remote online (RON) nationwide.",
    url: `${base}/notary/on-demand/`,
    date: "2026-07-14",
  },
  {
    platform: "Blog",
    title: "Remote Online Notary in all 50 states",
    excerpt:
      "How ONDO Notary delivers secure RON nationwide for real estate and loan packages.",
    url: `${base}/blog/remote-online-notary-all-50-states/`,
    date: "2026-06-15",
  },
  {
    platform: "News",
    title: "Real estate news we track",
    excerpt:
      "Curated national and Utah market sources, inventory, rates, and policy, in one place.",
    url: `${base}/news/`,
    date: "2026-07-01",
  },
  {
    platform: "Blog",
    title: "Why Utah remains a top investment market",
    excerpt:
      "Population growth, jobs, and housing dynamics across the Wasatch Front for owners and investors.",
    url: `${base}/blog/why-utah-best-real-estate-investment/`,
    date: "2026-05-20",
  },
]
