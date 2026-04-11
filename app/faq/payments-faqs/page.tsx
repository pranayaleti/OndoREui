import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, DollarSign, AlertCircle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payments & Billing FAQs | Ondo Real Estate",
  description: "Find answers to payment questions about due dates, payment methods, auto-pay, late fees, and online payments.",
  alternates: { canonical: `${SITE_URL}/faq/payments-faqs/` },
  openGraph: {
    title: "Payments & Billing FAQs | Ondo Real Estate",
    description: "Find answers to payment questions about due dates, payment methods, auto-pay, late fees, and online payments.",
  },
}


export default function PaymentsFAQPage() {
  const faqs = [
    {
      question: "When is my payment due?",
      answer: "Your payment is due on the 1st of each month. You have a 15-day grace period before any late fees are assessed."
    },
    {
      question: "How can I change my payment due date?",
      answer: "Contact our customer service team to discuss changing your payment due date. Some restrictions may apply."
    },
    {
      question: "What happens if I miss a payment?",
      answer: "If you miss a payment, you may be charged a late fee after the grace period. Contact us immediately if you're having trouble making payments. We're here to help and may be able to work out a payment plan."
    },
    {
      question: "Can I make extra payments?",
      answer: "Yes! You can make extra payments at any time. These will be applied to your principal balance, helping you pay off your loan faster."
    },
    {
      question: "How do I set up automatic payments?",
      answer: "You can set up automatic payments through our online portal or by calling customer service. You can choose the payment amount and date. Auto-pay ensures you never miss a payment and helps you build a positive payment history."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept checking accounts, savings accounts, and debit cards through our online portal. Credit card payments may have additional fees. You can also pay by phone or mail."
    },
    {
      question: "How do I pay rent online?",
      answer: "Log into your tenant portal and navigate to the payments section. You can make a one-time payment or set up recurring automatic payments. The portal accepts bank transfers and debit cards."
    },
    {
      question: "Are there fees for online payments?",
      answer: "Bank transfers (ACH) are typically free. Debit card payments may have a small processing fee. Credit card payments usually have higher fees. Check your portal for current fee information."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Payments & Billing FAQs | Ondo Real Estate"
        description="Find answers to payment questions about due dates, payment methods, auto-pay, late fees, and online payments."
        pathname="/faq/payments-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Payments FAQs", url: `${SITE_URL}/faq/payments-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Payments & Billing FAQs"
        subtitle="Everything you need to know about rent, payments, and billing"
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
                <h2 className="text-2xl font-bold text-white">Payment Questions</h2>
                <p className="text-gray-300 text-sm">Rent, autopay, due dates, fees, and online payments</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Important Payment Information</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Payments are due on the 1st of each month</li>
                    <li>• 15-day grace period before late fees</li>
                    <li>• Late fees typically range from $25-$50</li>
                    <li>• Contact us immediately if you're having payment difficulties</li>
                  </ul>
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
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[accent-1] to-[accent-2] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Call {SITE_PHONE}
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
      <Script id="payments-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
