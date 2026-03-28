import type { Metadata } from "next"
import CalculatorsPage from "./CalculatorsPage"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Mortgage & Affordability Calculators",
  description:
    "Use our free mortgage payment, affordability, refinance, and investment calculators to plan your Utah home purchase, refinance, or real estate investment.",
  alternates: {
    canonical: `${SITE_URL}/calculators/`,
  },
  openGraph: {
    title: `Mortgage & Affordability Calculators | ${SITE_NAME}`,
    description:
      "Free real estate calculators for mortgage payments, home affordability, refinance break-even, rental ROI, and more.",
    url: `${SITE_URL}/calculators`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: `Real estate calculators by ${SITE_NAME}`,
      },
    ],
  },
}

export default function CalculatorsIndexPage() {
  return (
    <>
      <SEO
        title="Mortgage & Affordability Calculators"
        description="Use our mortgage payment, affordability, and refinance calculators to plan your Utah home purchase or refinance."
        pathname="/calculators"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
        ])}
      />
      <CalculatorsPage />
    </>
  )
}


