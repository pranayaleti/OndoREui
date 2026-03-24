import { SITE_BRAND_SHORT, SITE_NAME, SITE_URL } from "@/lib/site"

/** Homepage-only title (≤60 chars) for Next.js metadata. */
export const HOME_PAGE_TITLE = "Ondo RE | Property Management, Mortgages & Real Estate | UT"

/** Homepage meta description (≤155 chars). */
export const HOME_PAGE_DESCRIPTION =
  "Ondo RE is Utah's tech-forward real estate partner—property management, buying & lending, and investor tools. Owners, tenants & investors: one platform."

export const homeOpenGraphImages = [
  {
    url: `${SITE_URL}/modern-office-building.webp`,
    width: 1200,
    height: 630,
    alt: `${SITE_BRAND_SHORT} (${SITE_NAME}) — Utah real estate and property management`,
  },
]
