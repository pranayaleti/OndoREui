import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, HelpCircle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "General FAQs | Ondo Real Estate",
  description: "Get answers to general questions about Ondo Real Estate property management services, areas we serve, and how to get started.",
  alternates: { canonical: `${SITE_URL}/faq/general-faqs/` },
  openGraph: {
    title: "General FAQs | Ondo Real Estate",
    description: "Get answers to general questions about Ondo Real Estate property management services, areas we serve, and how to get started.",
  },
}


export default function GeneralFAQPage() {
  const faqs = [
    {
      question: "What services does Ondo Real Estate provide?",
      answer: "We provide comprehensive property management services including tenant screening, rent collection, maintenance coordination, property marketing, financial reporting, and legal compliance management."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve the greater Salt Lake City area, including Salt Lake City, Holladay, Midvale, Magna, and surrounding communities. We're continuously expanding to new areas."
    },
    {
      question: "How do I get started with your services?",
      answer: `Getting started is easy! Contact us through our website, call us at ${SITE_PHONE}, or email us at ${SITE_EMAILS.primary}. We'll schedule a consultation to discuss your needs.`
    },
    {
      question: "Are you licensed and insured?",
      answer: "Yes, we are fully licensed property managers in Utah and carry comprehensive liability and errors & omissions insurance to protect our clients."
    },
    {
      question: "How do you handle legal compliance?",
      answer: "We stay current with all federal, state, and local housing laws including fair housing regulations, landlord-tenant laws, and safety requirements."
    },
    {
      question: "What makes Ondo Real Estate different from other property management companies?",
      answer: "We combine local expertise with modern technology to provide exceptional service. Our team is responsive, transparent, and committed to maximizing your property's value while ensuring tenant satisfaction."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="General FAQs | Ondo Real Estate"
        description="Get answers to general questions about Ondo Real Estate property management services, areas we serve, and how to get started."
        pathname="/faq/general-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "General FAQs", url: `${SITE_URL}/faq/general-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="General FAQs & Getting Started"
        subtitle="Common questions about our services and how to get started"
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
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">General Questions</h2>
                <p className="text-gray-300 text-sm">Everything you need to know to get started</p>
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
              <p className="text-gray-300 mb-4">Still have questions?</p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ JSON-LD */}
      <Script id="general-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
