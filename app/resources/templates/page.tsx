import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TemplatesCatalog } from "@/components/resources/templates-catalog"
import { UtahLandlordEducationSection } from "@/components/resources/utah-landlord-education-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Landlord Templates & Seller Listing-Prep | Ondo Real Estate",
  description:
    "Browse Utah landlord templates, addendums, and disclosures, plus a federal lead-paint packet for other states. We email the file after you request it — not an instant download.",
  alternates: { canonical: `${SITE_URL}/resources/templates/` },
  openGraph: {
    title: "Landlord Templates, Addendums & Disclosures | Ondo Real Estate",
    description:
      "Request Utah-oriented lease, addendum, and disclosure packets, plus a federal lead-paint disclosure. Files are emailed after you request them.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Landlord Templates | Ondo Real Estate",
    description:
      "Utah lease, addendums, disclosures, and a seller listing-prep checklist. Request the file — not an instant download.",
  },
}

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Landlord Templates, Addendums & Disclosures"
        description="Request Utah landlord templates, addendums, and disclosures, plus a federal lead-paint packet. We email the file after you request it."
        pathname="/resources/templates"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Resources", url: `${SITE_URL}/resources` },
          { name: "Templates", url: `${SITE_URL}/resources/templates` },
        ])}
      />
      <PageBanner
        title="Templates & Resources"
        subtitle="Utah-oriented landlord forms, addendums, and disclosures, plus a seller listing-prep checklist. Samples are for reference only. Request the file — we email it. Not legal advice."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Why We Publish These Templates</h2>
              <p className="text-lg text-foreground/70">
                These packets reflect forms we use at Ondo. Landlord files are written for Utah law unless
                a card says otherwise (for example, federal lead-based paint). Each card lists when it
                applies and what to watch for. Leave your name and email to request the file — we email
                it; this is not an instant download or a binding contract. Samples are for reference
                only and must be reviewed through appropriate legal channels (a licensed attorney for
                the applicable state) before they can be approved or used.
              </p>
            </div>

            <p className="mb-10 text-center text-sm text-foreground/70">
              Official Utah statutes, HUD Fair Housing guidance, and third-party Good Landlord / RHA
              Utah classes are listed separately below. They are not Ondo-authored template cards
              and are not part of the request-the-file flow.
            </p>

            <TemplatesCatalog />

            <div className="mb-16">
              <UtahLandlordEducationSection />
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-2xl font-bold">Need Something Beyond the Templates?</h3>
              <p className="mb-6 text-foreground/70">
                If your situation calls for custom lease language, a full management handoff, or help
                getting your first Utah rental set up properly, we are happy to help. We are not a
                substitute for a licensed attorney.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">Talk to Our Team</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/resources">Browse All Resources</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
