import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notary & Closings FAQs | Ondo Real Estate",
  description: "Get answers to common questions about notary services, Remote Online Notarization (RON), mobile notary, and what to expect during document signing.",
  alternates: { canonical: `${SITE_URL}/faq/notary-faqs/` },
  openGraph: {
    title: "Notary & Closings FAQs | Ondo Real Estate",
    description: "Get answers to common questions about notary services, Remote Online Notarization (RON), mobile notary, and what to expect during document signing.",
  },
}


export default function NotaryFAQPage() {
  const faqs = [
    {
      question: "What do I need to bring to a notary appointment?",
      answer:
        "Bring a valid government‑issued photo ID, your unsigned documents, and any required witnesses. For Remote Online Notary (RON), you'll also need a phone or computer with camera, microphone, and stable internet. We'll guide you on exactly what each document type needs before your session.",
    },
    {
      question: "Can you notarize documents for out‑of‑state transactions?",
      answer:
        "Yes. Remote Online Notarization lets us notarize for clients located anywhere in the U.S., as long as the receiving party accepts RON documents (most modern lenders and employers do). We regularly support out‑of‑state real estate closings, employment forms, and business agreements.",
    },
    {
      question: "What's the difference between mobile, in‑office, and online notarization?",
      answer:
        "In‑office means you come to our Lehi office. Mobile means we travel to you in Utah County. Remote Online Notarization (RON) happens completely online via secure video. All three are performed by the same commissioned notary; we'll recommend the best option based on urgency, location, and document type.",
    },
    {
      question: "How quickly can I get a document notarized?",
      answer:
        "For Remote Online Notary (RON), we can often schedule same-day appointments. In-office appointments are typically available within 24-48 hours. Mobile notary services in Utah County can be arranged with advance notice. Emergency or rush services may be available for an additional fee.",
    },
    {
      question: "What types of documents can you notarize?",
      answer:
        "We notarize a wide variety of documents including real estate closing documents, power of attorney, wills and estate documents, business agreements, loan documents, affidavits, and more. If you're unsure if your document can be notarized, contact us and we'll let you know.",
    },
    {
      question: "How much does notarization cost?",
      answer:
        "Standard notarization fees vary by service type. Remote Online Notary (RON) typically costs less than mobile services. Contact us for current pricing based on your specific needs. We offer competitive rates and transparent pricing with no hidden fees.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Notary & Closings FAQs | Ondo Real Estate"
        description="Get answers to common questions about notary services, Remote Online Notarization (RON), mobile notary, and what to expect during document signing."
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
            className="inline-flex items-center gap-2 text-[accent-2] hover:text-[accent-1] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[accent-1] to-[accent-2] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Notary & Closings Questions</h2>
                <p className="text-gray-300 text-sm">Everything about notarization and document signing</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/10 rounded-xl bg-card/60 px-6 py-2 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-white hover:no-underline py-4">
                    <span className="text-left font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4 pt-2 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">Ready to schedule a notary appointment?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/notary"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[accent-1] to-[accent-2] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Book Notary Service
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[accent-1] text-[accent-2] font-semibold rounded-lg hover:bg-[accent-1]/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ JSON-LD */}
      <Script id="notary-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        })}
      </Script>
    </div>
  )
}
