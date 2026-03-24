import { SITE_BRAND_SHORT, SITE_NAME, SITE_URL } from "@/lib/site"

/** Homepage-only title (≤60 chars) for Next.js metadata. */
export const HOME_PAGE_TITLE = "Ondo RE | Utah Property Management, Loans & Real Estate"

/** Homepage meta description (≤155 chars). */
export const HOME_PAGE_DESCRIPTION =
  "Ondo RE manages Utah rental properties, originates home loans, and helps you buy or sell along the Wasatch Front. Owners, tenants & investors — one team."

export const homeOpenGraphImages = [
  {
    url: `${SITE_URL}/modern-office-building.webp`,
    width: 1200,
    height: 630,
    alt: `${SITE_BRAND_SHORT} (${SITE_NAME}) — Utah real estate and property management`,
  },
]
