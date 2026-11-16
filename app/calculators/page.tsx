import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"
import type { Metadata } from "next"
import CalculatorsPage from "./CalculatorsPage"
import { GlossaryCategoryGrid } from "@/components/content/glossary-terms"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitleText } from "@/lib/site"
export const metadata: Metadata = {
  title: "Mortgage & Affordability Calculators",
  description:
    "Free Utah calculators for buyers, sellers and landlords: mortgage payment, closing costs, net sale proceeds and refinance break-even.",
  alternates: {
    canonical: `${SITE_URL}/calculators/`,
  },
  openGraph: {
    type: "website",
    title: pageTitleText("Utah Real Estate Calculators: Mortgage & Closing Cost"),
    description:
      "Free Utah calculators for buyers, sellers and landlords: mortgage payment, closing costs, net sale proceeds and refinance break-even.",
    url: `${SITE_URL}/calculators`,
    images: OG_IMAGES.guides,
  },
  // Without its own twitter block the page inherits the root layout's, and shares the homepage's
  // title and picture on X instead of its own.
  twitter: {
    card: "summary_large_image",
    title: pageTitleText("Utah Real Estate Calculators: Mortgage & Closing Cost"),
    description: "Free Utah calculators for buyers, sellers and landlords: mortgage payment, closing costs, net sale proceeds and refinance break-even.",
    images: [OG_IMAGE_URLS.guides],
  },
}

export default function CalculatorsIndexPage() {
  return (
    <>
      <SEO
        title="Mortgage & Affordability Calculators"
        description="Use our mortgage payment, affordability, and refinance calculators to plan your Utah home purchase or refinance."
        pathname="/calculators"
        image={`${SITE_URL}/og/guides.jpg`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
        ])}
      />
      <main>
        <CalculatorsPage />
        {/* Server-rendered: a reader who does not recognise "cap rate" or "DTI" gets a
            definition without leaving, and each chip is a crawlable internal link. */}
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <GlossaryCategoryGrid
              heading="Not sure what an input means?"
              lead="Every figure these calculators ask for has a plain-English definition: what it is, and what changes if you get it wrong."
            />
          </div>
        </section>
      </main>
    </>
  )
}


