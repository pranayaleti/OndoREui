import { PageBanner } from "@/components/page-banner"
import { FaqAccordion } from "@/components/faq-accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { notaryFaqBank } from "@/lib/service-faq"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import type { Metadata } from "next"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Notary & Closings FAQs | Ondo Real Estate"),
  description: "Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing.",
  alternates: { canonical: `${SITE_URL}/faq/notary-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Notary & Closings FAQs | Ondo Real Estate"),
    description: "Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing.",
    images: OG_IMAGES.guides,
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE_URLS.guides] },
}


export default function NotaryFAQPage() {
  const faqs = notaryFaqBank.map((f) => ({
    question: f.q,
    answer: f.a,
    links: /today/i.test(f.q) ? [{ label: "Same-day sessions", href: "/notary/on-demand/" }] : undefined,
  }))

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Notary & Closings FAQs | Ondo Real Estate"
        description="Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing."
        pathname="/faq/notary-faqs"
        image={`${SITE_URL}/og/guides.jpg`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Notary FAQs", url: `${SITE_URL}/faq/notary-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Notary & Closings FAQs"
        subtitle="Remote Online Notary (RON): how it works, what it costs and what to bring."
      />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-card">
        <div className="container px-4 md:px-6">
          <Link
            href="/faq"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Notary questions</h2>
                <p className="text-muted-foreground text-sm">Everything about notarization and document signing</p>
              </div>
            </div>

            <FaqAccordion items={faqs} />

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Ready to book a remote notary session?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/notary"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book notary
                </Link>
                <Link
                  href="/notary/on-demand"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
                >
                  On-demand / same-day
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/[0.06]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
