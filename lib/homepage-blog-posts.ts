/**
 * Curated landlord/property-management posts featured on the homepage.
 *
 * Kept as a tiny static list so the homepage does not have to import the
 * full blog client bundle. Each href must point to an existing app/blog page.
 * `readTime` must equal the post's byline and its lib/blog-posts.ts `readMinutes`
 * (lib/blog-posts.test.ts enforces it); do not type a number that was not measured.
 */

export interface HomepageBlogPost {
  href: string
  title: string
  excerpt: string
  category: string
  readTime: string
}

export const homepageBlogPosts: HomepageBlogPost[] = [
  {
    href: "/blog/how-to-choose-property-management-company-utah",
    title: "How to choose a property management company in Utah",
    excerpt:
      "What to ask, what to compare, and what red flags to walk away from before signing.",
    category: "Owners",
    readTime: "4 min read",
  },
  {
    href: "/blog/property-management-tips-utah-landlords",
    title: "Property management tips for Utah landlords",
    excerpt:
      "Screening, pricing, maintenance reserves, and the seasonal rhythms of the Wasatch Front rental market.",
    category: "Owners",
    readTime: "3 min read",
  },
  {
    href: "/blog/ultimate-guide-becoming-utah-landlord-2026",
    title: "The ultimate guide to becoming a Utah landlord",
    excerpt:
      "From LLC vs personal ownership to your first tenant renewal, without the wishful thinking.",
    category: "Guides",
    readTime: "8 min read",
  },
  {
    href: "/blog/new-landlord-mistakes-systems",
    title: "New-landlord mistakes and the systems that prevent them",
    excerpt:
      "Documentation, reserves, maintenance states, and comms playbooks that keep small problems small.",
    category: "Landlording",
    readTime: "1 min read",
  },
  {
    href: "/blog/property-management-automation-checklist",
    title: "Property management automation checklist",
    excerpt:
      "The highest-ROI automations for rent collection, maintenance triage, and owner reporting.",
    category: "Operations",
    readTime: "1 min read",
  },
  {
    href: "/blog/salt-lake-city-rental-market-report",
    title: "Salt Lake City rental market report",
    excerpt:
      "Current rent, vacancy, and days-on-market signals across SLC and neighboring corridors.",
    category: "Market",
    readTime: "3 min read",
  },
]
