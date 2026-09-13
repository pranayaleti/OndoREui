import type { Metadata } from "next"
import CalculatorsPage from "./CalculatorsPage"
import { GlossaryCategoryGrid } from "@/components/content/glossary-terms"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME, pageTitleText } from "@/lib/site"
export const metadata: Metadata = {
  title: "Mortgage & Affordability Calculators",
  description:
    "Free Utah calculators for buyers, sellers and landlords: mortgage payment, closing costs, net sale proceeds and refinance break-even.",
  alternates: {
    canonical: `${SITE_URL}/calculators/`,
  },
  openGraph: {
    title: pageTitleText("Utah Real Estate Calculators: Mortgage & Closing Cost"),
    description:
      "Free Utah calculators for buyers, sellers and landlords: mortgage payment, closing costs, net sale proceeds and refinance break-even.",
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
      {/* Server-rendered: a reader who does not recognise "cap rate" or "DTI" gets a
          definition without leaving, and each chip is a crawlable internal link. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <GlossaryCategoryGrid
            heading="Not sure what an input means?"
            lead="Every figure these calculators ask for has a plain-English definition — what it is, and what changes if you get it wrong."
          />
        </div>
      </section>
    </>
  )
}


