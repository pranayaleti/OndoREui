// NOTE(i18n): server component — English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { LeadQualifierWizard } from "@/components/lead-qualifier-wizard"

const title = "Get Matched with the Right Ondo RE Service | 60-Second Quiz"
const description =
  "Answer 5 quick questions and get matched with the right Ondo Real Estate service — property management, mortgages, buying, selling, or notary. No commitment, real-person follow-up within 1 business day."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/get-matched` },
  openGraph: { title, description, url: `${SITE_URL}/get-matched` },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
}

export default function GetMatchedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background py-12 md:py-20">
      <SEO
        title={title}
        description={description}
        pathname="/get-matched"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Get Matched", url: `${SITE_URL}/get-matched` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME} — Service Matcher`,
            description:
              "Free 5-question lead qualifier that matches Utah property owners, buyers, renters, and investors with the right Ondo RE service in under a minute.",
            serviceType: "Online Lead Qualifier",
            areaServed: "Utah",
          }),
        ]}
      />
      <div className="container mx-auto px-4">
        <LeadQualifierWizard />
      </div>
    </main>
  )
}
