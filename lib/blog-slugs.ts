/**
 * Single source of truth for blog slugs used in links and tests.
 * Each slug must have app/blog/<slug>/page.tsx (static route).
 * Keep in sync when adding or removing blog posts.
 */

/** Slugs with their own app/blog/<slug>/page.tsx static directory. */
const STATIC_ROUTE_SLUGS = [
  "backyard-upgrades-and-fertilizer-guide",
  "building-high-performance-real-estate-nextjs-supabase",
  "cash-on-cash-return-explained",
  "commercial-real-estate-101-tenant-mix",
  "crypto-and-real-estate-hedge",
  "dashboards-for-landlords",
  "designing-property-owner-portal",
  "engineering-real-estate-investment-calculators",
  "finishing-basement-roi",
  "first-time-home-buyer-guide",
  "full-stack-dev-landlord-gaps",
  "home-maintenance-schedule",
  "home-staging-tips-that-work",
  "maintenance-capex-strategy",
  "mobile-notary-utah-county-guide",
  "mortgage-paydown-hacks",
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
  "real-estate-agents-manage-own-rentals",
  "turbotenant-vs-buildium-vs-ondo",
  "collect-rent-with-crypto-guide",
  "online-notary-for-lease-agreements",
  "rent-vs-own-calculator-guide",
  "tenant-rights-checklist",
  "build-rental-portfolio-investor-2026",
  "property-management-pwa-offline",
  "switch-from-turbotenant-migration-guide",
  "property-management-calculators-which-one",
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
  "home-maintenance-schedule",
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
  "finishing-basement-roi",
  "backyard-upgrades-and-fertilizer-guide",
  "cash-on-cash-return-explained",
  "mortgage-paydown-hacks",
  "real-estate-agents-manage-own-rentals",
  "turbotenant-vs-buildium-vs-ondo",
  "collect-rent-with-crypto-guide",
  "online-notary-for-lease-agreements",
  "rent-vs-own-calculator-guide",
  "tenant-rights-checklist",
  "build-rental-portfolio-investor-2026",
  "property-management-pwa-offline",
  "switch-from-turbotenant-migration-guide",
  "property-management-calculators-which-one",
] as const;

export function isValidBlogSlug(slug: string): boolean {
  return ALL_VALID_BLOG_SLUGS.has(slug);
}
