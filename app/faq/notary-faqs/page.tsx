import { PageBanner } from "@/components/page-banner"
import { FaqAccordion } from "@/components/faq-accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { NOTARY_PRICING_SUMMARY } from "@/lib/notary-fees"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Notary & Closings FAQs | Ondo Real Estate"),
  description: "Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing.",
  alternates: { canonical: `${SITE_URL}/faq/notary-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Notary & Closings FAQs | Ondo Real Estate"),
    description: "Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function NotaryFAQPage() {
  const faqs = [
    {
      question: "What do I need for a remote notary session?",
      answer:
        "Have a valid government‑issued photo ID and your unsigned documents ready. All sessions are Remote Online Notary (RON), so you also need a phone or computer with a camera, microphone, and stable internet. If your document needs witnesses, tell us when you book and we will confirm how that works for a remote session. We'll guide you on exactly what each document type needs before your session.",
    },
    {
      question: "Can you notarize documents for out‑of‑state transactions?",
      answer:
        "Yes. Remote Online Notarization lets us notarize for clients located anywhere in the U.S., as long as the receiving party accepts RON documents (most modern lenders and employers do). We regularly support out‑of‑state real estate closings, employment forms, and business agreements.",
    },
    {
      question: "What's the difference between mobile and online notarization?",
      answer:
        "ONDO Notary offers Remote Online Notarization (RON) only, a secure video session available nationwide. We do not offer in-office or mobile travel appointments. Confirm the receiving party accepts electronic notarization before you book.",
    },
    {
      question: "How quickly can I get a document notarized?",
      answer:
        "We'll try to accommodate same-day when capacity allows, especially for Remote Online Notary (RON). Request earlier in the day (ideally by noon MT) for the best odds. Same-day is best-effort, not a guaranteed SLA.",
      links: [{ label: "How on-demand scheduling works", href: "/notary/on-demand/" }],
    },
    {
      question: "Do you offer on-demand or same-day notary?",
      answer:
        "Yes. ONDO Notary offers on-demand scheduling for urgent remote online notarization. We try to accommodate same-day when our calendar allows, RON nationwide. Evenings and weekends are limited and not guaranteed. For the best chance of same-day, request by noon Mountain Time and tell us your documents are urgent.",
      links: [{ label: "On-demand notary", href: "/notary/on-demand/" }, { label: "Book a notary session", href: "/notary/" }],
    },
    {
      question: "What types of documents can you notarize?",
      answer:
        "We notarize a wide variety of documents including real estate closing documents, power of attorney, wills and estate documents, business agreements, loan documents, affidavits, and more. If you're unsure if your document can be notarized, contact us and we'll let you know.",
    },
    {
      question: "How much does notarization cost?",
      answer: NOTARY_PRICING_SUMMARY,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Notary & Closings FAQs | Ondo Real Estate"
        description="Get answers to common questions about Remote Online Notarization (RON) and what to expect during a document signing."
        pathname="/faq/notary-faqs"
        image={`${SITE_URL}/modern-office-building.png`}
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
        subtitle="Common questions about notarization services and what to expect"
      />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-card">
        <div className="container px-4 md:px-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-accent-2 hover:text-accent-1 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Notary & Closings Questions</h2>
                <p className="text-muted-foreground text-sm">Everything about notarization and document signing</p>
              </div>
            </div>

            <FaqAccordion items={faqs} />

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Ready to book a remote notary session?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/notary"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
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
                  className="inline-flex items-center justify-center px-6 py-3 border border-accent-1 text-accent-2 font-semibold rounded-lg hover:bg-accent-1/10 transition-colors"
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
