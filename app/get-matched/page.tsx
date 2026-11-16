// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME, pageTitleText } from "@/lib/site"
import { LeadQualifierWizard } from "@/components/lead-qualifier-wizard"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

const title = pageTitleText("Get Matched with the Right Ondo RE Service | 60-Second Quiz")
const description =
  "A few questions, then we match you with the right Ondo service: management, buying, selling, renting, loans or notary. We reply within one business day."

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/get-matched/` },
  openGraph: { type: "website", title, description, url: `${SITE_URL}/get-matched/`, images: OG_IMAGES.buy },
  twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE_URLS.buy] },
  robots: { index: true, follow: true },
}

export default function GetMatchedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background py-12 md:py-20">
      <SEO
        title={title}
        description={description}
        pathname="/get-matched"
        image={`${SITE_URL}/og/buy.jpg`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Get Matched", url: `${SITE_URL}/get-matched` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME}, Service Matcher`,
            description:
              "Free lead qualifier, four or five quick questions, that matches Utah property owners, buyers, renters, and investors with the right Ondo RE service in under a minute.",
            serviceType: "Online Lead Qualifier",
            areaServed: "Utah",
          }),
        ]}
      />
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-xl">
          <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">Get matched in 60 seconds</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A few quick questions, then we point you to the right Ondo service. No commitment.
          </p>
        </header>
        <LeadQualifierWizard />
      </div>
    </main>
  )
}
