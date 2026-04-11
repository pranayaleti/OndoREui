import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, DollarSign } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Loans & Financing FAQs | Ondo Real Estate",
  description: "Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options.",
  alternates: { canonical: `${SITE_URL}/faq/loans-faqs/` },
  openGraph: {
    title: "Loans & Financing FAQs | Ondo Real Estate",
    description: "Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options.",
  },
}


export default function LoansFAQPage() {
  const faqs = [
    {
      question: "How much do I need for a down payment?",
      answer:
        "For many Utah buyers, conventional loans can start around 3% down, FHA around 3.5%, and some VA/USDA programs can be 0% down if you qualify. You'll still want extra funds for closing costs and reserves. Use our affordability and payment calculators, then we'll help you match your numbers to the right program on the Loans page.",
    },
    {
      question: "What is the difference between pre-qualification and pre-approval?",
      answer:
        "A pre-qualification is a quick estimate based on self‑reported info. A true pre‑approval means a loan team has pulled credit, reviewed documents, and issued a letter that sellers can trust. We recommend going straight to pre‑approval before you seriously shop so you know your numbers are solid.",
    },
    {
      question: "Should I fix my credit before I buy a home?",
      answer:
        "Small improvements to credit can sometimes save you tens of thousands over the life of a loan. Before you wait a full year, have us or your lender model your current score vs. a slightly higher score. In some cases buying now with a refinance later makes more sense than waiting; in other cases, a short credit tune‑up is worth it.",
    },
    {
      question: "What monthly payment should I target?",
      answer:
        "Instead of just shopping by price, we encourage you to shop by comfortable monthly payment. Start from your budget, plug it into our calculators, then walk that back to a price range. This keeps you from getting emotionally attached to homes that would feel too tight month‑to‑month.",
    },
    {
      question: "What types of home loans do you offer in Utah?",
      answer:
        "We offer conventional, FHA, VA, USDA, and jumbo loans. Our loan officers help you find the best program based on your financial situation, property location, and goals.",
    },
    {
      question: "How do I get pre-approved for a mortgage?",
      answer:
        "Start by completing our online application or contacting our loan officers. We'll review your income, credit, and assets to provide a pre-approval letter that strengthens your buying power.",
    },
    {
      question: "What are current Utah mortgage rates?",
      answer:
        "Mortgage rates change daily and vary by loan type, credit score, and down payment. Contact our loan officers for current rates and personalized quotes based on your situation.",
    },
    {
      question: "How long does the loan process take?",
      answer:
        "Typically 30-45 days from application to closing, though this can vary based on loan type and complexity. We work efficiently to meet your timeline and closing date.",
    },
    {
      question: "Do you offer first-time home buyer programs?",
      answer:
        "Yes, we work with various first-time buyer programs including down payment assistance, low down payment options, and special rate programs available in Utah.",
    },
    {
      question: "Can I refinance my existing Utah mortgage?",
      answer:
        "Absolutely! We offer rate and term refinancing, cash-out refinancing, and streamline refinancing for FHA and VA loans to help you lower payments or access equity.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Loans & Financing FAQs | Ondo Real Estate"
        description="Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options."
        pathname="/faq/loans-faqs"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Loans FAQs", url: `${SITE_URL}/faq/loans-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Loans & Financing FAQs"
        subtitle="Common questions about mortgages, pre-approval, and loan options"
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
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Loans & Financing Questions</h2>
                <p className="text-gray-300 text-sm">Everything about mortgages, pre-approval, and loan programs</p>
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
              <p className="text-gray-300 mb-4">Need help with your loan application?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/loans"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[accent-1] to-[accent-2] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Explore Loan Options
                </Link>
                <Link
                  href="/calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[accent-1] text-[accent-2] font-semibold rounded-lg hover:bg-[accent-1]/10 transition-colors"
                >
                  Use Loan Calculators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ JSON-LD */}
      <Script id="loans-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
