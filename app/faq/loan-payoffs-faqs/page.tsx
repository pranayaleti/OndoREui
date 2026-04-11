import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Loan Payoffs & Closings FAQs | Ondo Real Estate",
  description: "Find answers to questions about paying off your mortgage, getting payoff quotes, refinancing, and the payoff process.",
  alternates: { canonical: `${SITE_URL}/faq/loan-payoffs-faqs/` },
  openGraph: {
    title: "Loan Payoffs & Closings FAQs | Ondo Real Estate",
    description: "Find answers to questions about paying off your mortgage, getting payoff quotes, refinancing, and the payoff process.",
  },
}


export default function LoanPayoffsFAQPage() {
  const faqs = [
    {
      question: "How do I get a payoff quote?",
      answer: `Contact our loan servicing department by phone at ${SITE_PHONE}, email, or through your online account. We'll provide an official payoff statement with the exact amount and validity period.`
    },
    {
      question: "How long is a payoff quote valid?",
      answer: "Payoff quotes are typically valid for 10-15 business days. After this period, you'll need to request a new quote as interest accrues daily."
    },
    {
      question: "Are there prepayment penalties?",
      answer: "This depends on your specific loan terms. Some loans have prepayment penalties, especially in the first few years. We'll include any penalties in your payoff quote."
    },
    {
      question: "Can I make a partial payoff?",
      answer: "Yes, you can make extra principal payments at any time. This reduces your total interest and can help pay off your loan faster. There's usually no penalty for making extra payments."
    },
    {
      question: "What happens after I pay off my loan?",
      answer: "We'll process the payoff, release the lien on your property, and send you a satisfaction of mortgage document. You'll also receive a final statement. The lien release is typically recorded with the county recorder's office."
    },
    {
      question: "Can I pay off my loan online?",
      answer: "Yes, you can make payments through our online portal. For full payoffs, we recommend contacting us first to ensure you have the correct amount and to coordinate the payoff process."
    },
    {
      question: "What information do I need to request a payoff quote?",
      answer: "You'll need your loan number, property address, and the date you plan to pay off the loan. Having your account information ready will help speed up the process."
    },
    {
      question: "Can I refinance instead of paying off?",
      answer: "Yes, refinancing is an option that may allow you to get better loan terms, lower your interest rate, or access equity. Contact us to discuss whether refinancing makes sense for your situation."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Loan Payoffs & Closings FAQs | Ondo Real Estate"
        description="Find answers to questions about paying off your mortgage, getting payoff quotes, refinancing, and the payoff process."
        pathname="/faq/loan-payoffs-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Loan Payoffs FAQs", url: `${SITE_URL}/faq/loan-payoffs-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Loan Payoffs & Closings FAQs"
        subtitle="Everything you need to know about paying off your mortgage"
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
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Loan Payoffs</h2>
                <p className="text-gray-300 text-sm">Paying off or refinancing a loan</p>
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
              <p className="text-gray-300 mb-4">Need help with a payoff?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`tel:${SITE_PHONE.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Call {SITE_PHONE}
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

      {/* FAQ JSON-LD */}
      <Script id="loan-payoffs-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
