import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Escrow, Taxes & Insurance FAQs | Ondo Real Estate",
  description: "Find answers to questions about escrow accounts, property taxes, homeowners insurance, and how escrow works.",
  alternates: { canonical: `${SITE_URL}/faq/escrow-faqs/` },
  openGraph: {
    title: "Escrow, Taxes & Insurance FAQs | Ondo Real Estate",
    description: "Find answers to questions about escrow accounts, property taxes, homeowners insurance, and how escrow works.",
  },
}


export default function EscrowFAQPage() {
  const faqs = [
    {
      question: "What is escrow?",
      answer: "Escrow is a neutral third-party process where funds and documents are held securely until all conditions of the real estate transaction are met. It protects both buyers and sellers during the home buying process."
    },
    {
      question: "How long does escrow typically take?",
      answer: "Escrow typically takes 30-45 days, depending on the complexity of the transaction, loan processing time, and any contingencies that need to be resolved."
    },
    {
      question: "What happens to my earnest money if the deal falls through?",
      answer: "It depends on the reason for cancellation. If you cancel within your contingency periods (inspection, appraisal, loan), you typically get your earnest money back. If you cancel outside these periods, the seller may be entitled to keep it."
    },
    {
      question: "Can I choose my own escrow company?",
      answer: "In Utah, either the buyer or seller can choose the escrow company, but it's typically negotiated during the offer process. Both parties must agree on the choice."
    },
    {
      question: "What are closing costs and who pays them?",
      answer: "Closing costs include various fees like title insurance, escrow fees, loan origination fees, and more. In Utah, these are typically split between buyer and seller, but the exact split is negotiable."
    },
    {
      question: "What is an escrow account for taxes and insurance?",
      answer: "An escrow account is set up by your lender to hold funds for property taxes and homeowners insurance. Each month, a portion of your mortgage payment goes into this account, and the lender pays these bills when they're due."
    },
    {
      question: "Can I cancel my escrow account?",
      answer: "You may be able to cancel your escrow account once you have sufficient equity (typically 20% or more) and a good payment history. However, some lenders require escrow accounts for the life of the loan."
    },
    {
      question: "What happens if my escrow account has a shortage?",
      answer: "If your escrow account has a shortage (usually due to increased taxes or insurance), your lender will typically spread the shortage over the next 12 months by increasing your monthly payment, or you can pay it in a lump sum."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Escrow, Taxes & Insurance FAQs | Ondo Real Estate"
        description="Find answers to questions about escrow accounts, property taxes, homeowners insurance, and how escrow works."
        pathname="/faq/escrow-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Escrow FAQs", url: `${SITE_URL}/faq/escrow-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Escrow, Taxes & Insurance FAQs"
        subtitle="Understanding escrow accounts, property taxes, and insurance"
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
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Escrow & Accounts</h2>
                <p className="text-gray-300 text-sm">Taxes, insurance, and escrow accounts</p>
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
      <Script id="escrow-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
