/**
 * Single source of truth for blog slugs used in links and tests.
 * Each slug must have app/blog/<slug>/page.tsx (static route).
 * Keep in sync when adding or removing blog posts.
 */

/** Slugs with their own app/blog/<slug>/page.tsx static directory. */
const STATIC_ROUTE_SLUGS = [
  "building-high-performance-real-estate-nextjs-supabase",
  "commercial-real-estate-101-tenant-mix",
  "crypto-and-real-estate-hedge",
  "dashboards-for-landlords",
  "designing-property-owner-portal",
  "engineering-real-estate-investment-calculators",
  "first-time-home-buyer-guide",
  "full-stack-dev-landlord-gaps",
  "home-staging-tips-that-work",
  "maintenance-capex-strategy",
  "mobile-notary-utah-county-guide",
  "modernizing-notary-workflows-integration",
  "mortgage-rate-trends-2025",
  "new-landlord-mistakes-systems",
  "prepare-for-remote-online-notary-session",
  "property-management-automation-checklist",
  "property-management-tips-utah-landlords",
  "remote-online-notary-all-50-states",
  "remote-online-notary-real-estate-closings",
  "renting-vs-owning-hidden-math",
  "technical-seo-for-real-estate",
  "understanding-property-taxes-utah",
  "utah-rent-vs-buy-wasatch-front",
  "vacancy-risk-playbook",
  "why-utah-best-real-estate-investment",
] as const;

/** Every slug that must resolve to a built blog page. */
export const ALL_VALID_BLOG_SLUGS = new Set<string>([...STATIC_ROUTE_SLUGS]);

/**
 * Slugs linked from the blog index page (app/blog/page.tsx).
 * Every entry must be in ALL_VALID_BLOG_SLUGS or the link will 404 in production.
 */
export const BLOG_INDEX_SLUGS = [
  "remote-online-notary-all-50-states",
  "renting-vs-owning-hidden-math",
  "full-stack-dev-landlord-gaps",
  "commercial-real-estate-101-tenant-mix",
  "crypto-and-real-estate-hedge",
  "new-landlord-mistakes-systems",
  "utah-rent-vs-buy-wasatch-front",
  "property-management-automation-checklist",
  "vacancy-risk-playbook",
  "maintenance-capex-strategy",
  "dashboards-for-landlords",
  "building-high-performance-real-estate-nextjs-supabase",
  "engineering-real-estate-investment-calculators",
  "modernizing-notary-workflows-integration",
  "technical-seo-for-real-estate",
  "designing-property-owner-portal",
  "mobile-notary-utah-county-guide",
  "remote-online-notary-real-estate-closings",
  "prepare-for-remote-online-notary-session",
  "first-time-home-buyer-guide",
] as const;

export function isValidBlogSlug(slug: string): boolean {
  return ALL_VALID_BLOG_SLUGS.has(slug);
}
