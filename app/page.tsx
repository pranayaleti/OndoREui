import type { Metadata } from "next"
import LandingPage from "@/components/landing-page"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE, homeOpenGraphImages } from "@/lib/home-metadata"
import { SITE_BRAND_SHORT, SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: HOME_PAGE_TITLE,
  description: HOME_PAGE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    images: homeOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    images: homeOpenGraphImages.map((i) => i.url),
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO
        title={HOME_PAGE_TITLE}
        description={HOME_PAGE_DESCRIPTION}
        pathname="/"
        image={`${SITE_URL}/modern-office-building.webp`}
        keywords={[
          SITE_BRAND_SHORT,
          "Ondo RE",
          "Ondo Real Estate",
          "ondo real estate utah",
          // Core market/service
          "Utah real estate",
          "real estate Utah",
          "Utah real estate listings",
          "homes for sale Utah",
          "property management Utah",
          "rental property management",
          "tenant screening Utah",
          "home buying Utah",
          "first-time home buyer Utah",
          "home selling Utah",
          "sell my house Utah",
          "Utah home loans",
          "mortgage lender Utah",
          "mortgage pre-approval Utah",
          "refinance Utah",
          // Geos
          "Wasatch Front",
          "Salt Lake City real estate",
          "Lehi real estate",
          "Provo real estate",
          "Orem real estate",
          "Sandy real estate",
          "Draper real estate",
          "American Fork real estate",
          "Pleasant Grove real estate",
          "Utah County real estate",
          // Topics
          "Utah housing market",
          "MLS listings Utah",
        ]}
        jsonLd={[
          generateBreadcrumbJsonLd([{ name: "Home", url: SITE_URL }]),
          generateServiceJsonLd({
            name: `${SITE_BRAND_SHORT} — Utah property management, mortgages & real estate`,
            description:
              "Full-service Utah real estate for owners, tenants, and investors: property management, buying and selling, home loans, and portfolio-minded tools across the Wasatch Front and expansion markets.",
            serviceType: "Real estate services",
            areaServed: "Utah",
            offers: {
              description:
                "Consultations for property management, mortgages, investments, and leasing; subject to eligibility and market availability.",
            },
          }),
        ]}
      />
      <LandingPage />
    </main>
  )
}
