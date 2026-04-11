import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hardship & Assistance Options FAQs | Ondo Real Estate",
  description: "Find answers to questions about hardship assistance, mortgage forbearance, loan modification, and payment relief options.",
  alternates: { canonical: `${SITE_URL}/faq/hardship-faqs/` },
  openGraph: {
    title: "Hardship & Assistance Options FAQs | Ondo Real Estate",
    description: "Find answers to questions about hardship assistance, mortgage forbearance, loan modification, and payment relief options.",
  },
}


export default function HardshipFAQPage() {
  const faqs = [
    {
      question: "What is hardship assistance?",
      answer: "Hardship assistance programs help homeowners who are experiencing financial difficulties make their mortgage payments. Options include forbearance (temporary payment pause), loan modification (permanent payment change), and payment deferral (adding missed payments to the end of your loan)."
    },
    {
      question: "What qualifies as a financial hardship?",
      answer: "Common hardships include job loss or reduced income, medical emergencies, divorce or separation, death of a co-borrower, natural disasters, or other unexpected financial difficulties that affect your ability to make mortgage payments."
    },
    {
      question: "How do I apply for hardship assistance?",
      answer: `Contact us immediately at ${SITE_PHONE} to discuss your situation. Don't wait until you're behind on payments—the sooner you reach out, the more options we have to help. We'll guide you through the application process and help you gather the necessary documentation.`
    },
    {
      question: "What is mortgage forbearance?",
      answer: "Forbearance allows you to temporarily pause or reduce your mortgage payments for a specific period (typically 3-12 months) while you work through your financial hardship. You'll need to resume payments after the forbearance period ends, and we'll work with you on a repayment plan."
    },
    {
      question: "What is a loan modification?",
      answer: "A loan modification permanently changes the terms of your loan to make payments more affordable. This might include lowering your interest rate, extending your loan term, or reducing your principal balance. This is typically for long-term financial hardships."
    },
    {
      question: "Will hardship assistance affect my credit?",
      answer: "If you're approved for a hardship assistance program and make payments as agreed, it typically won't negatively impact your credit. However, if you're already behind on payments before applying, that may have already affected your credit. We'll discuss the specific impact based on your situation."
    },
    {
      question: "What documentation do I need?",
      answer: "You'll need documentation of your hardship, such as pay stubs, unemployment benefits, medical bills, divorce papers, or other proof of financial difficulty. You'll also need recent bank statements, tax returns, and a hardship letter explaining your situation. We'll provide a complete list when you contact us."
    },
    {
      question: "How long does the application process take?",
      answer: "The application process typically takes 2-4 weeks once we receive all required documentation. We'll work with you throughout the process and keep you updated on the status of your application."
    },
    {
      question: "What if I'm denied hardship assistance?",
      answer: "If your application is denied, we'll explain why and discuss alternative options. You may be able to appeal the decision with additional documentation, or we can explore other solutions like refinancing or selling the property."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Hardship & Assistance Options FAQs | Ondo Real Estate"
        description="Find answers to questions about hardship assistance, mortgage forbearance, loan modification, and payment relief options."
        pathname="/faq/hardship-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Hardship FAQs", url: `${SITE_URL}/faq/hardship-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Hardship & Assistance Options FAQs"
        subtitle="Payment relief and assistance plans for financial difficulties"
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
                <h2 className="text-2xl font-bold text-white">Hardship Assistance</h2>
                <p className="text-gray-300 text-sm">Payment relief & assistance plans</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Important: Contact Us Early</h3>
                  <p className="text-gray-300 text-sm">
                    Don't wait until you're behind on payments. The sooner you contact us about financial difficulties, the more options we have to help. Call us at <strong className="text-white">{SITE_PHONE}</strong> to discuss your situation.
                  </p>
                </div>
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
              <p className="text-gray-300 mb-4">Need help with payments?</p>
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
      <Script id="hardship-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
