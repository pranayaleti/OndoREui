import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, DollarSign, AlertCircle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { FIND_YOUR_SERVICER, NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

export const metadata: Metadata = {
  title: pageTitle("Payments & Billing FAQs | Ondo Real Estate"),
  description: "Rent payment questions for tenants: due dates, payment methods, autopay and online payments. Check your lease for grace periods and late fees.",
  alternates: { canonical: `${SITE_URL}/faq/payments-faqs/` },
  openGraph: {
    title: pageTitleText("Payments & Billing FAQs | Ondo Real Estate"),
    description: "Rent payment questions for tenants: due dates, payment methods, autopay and online payments. Check your lease for grace periods and late fees.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function PaymentsFAQPage() {
  const faqs = [
    {
      question: "When is my rent due?",
      answer: "Your lease states the due date. Any grace period and late fee are also set by your lease and by Utah law, so check your lease or ask us before you rely on a number."
    },
    {
      question: "How can I change my rent due date?",
      answer: "Contact our team to ask. Any change has to be agreed with us, and some restrictions may apply."
    },
    {
      question: "What happens if I miss a rent payment?",
      answer: "Your lease explains what applies. Contact us as early as you can if you are having trouble paying, so we can talk about it before it becomes a bigger problem."
    },
    {
      question: "How do I set up automatic payments?",
      answer: "If autopay is available for your home, you can set it up in your tenant portal or by contacting us. You choose the payment date and amount allowed by your lease."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Your tenant portal lists the payment methods available for your home and any fees that apply."
    },
    {
      question: "How do I pay rent online?",
      answer: "Log into your tenant portal and go to the payments section. You can make a one-time payment or set up recurring payments if they are available for your home."
    },
    {
      question: "Are there fees for online payments?",
      answer: "Your tenant portal shows the current fees for each payment method before you confirm a payment."
    },
    {
      question: "I have a question about my mortgage payment. Who do I ask?",
      answer: `Ask your mortgage servicer. ${FIND_YOUR_SERVICER} ${NOT_A_SERVICER}`
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Payments & Billing FAQs | Ondo Real Estate"
        description="Rent payment questions for tenants: due dates, payment methods, autopay and online payments. Check your lease for grace periods and late fees."
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
            className="inline-flex items-center gap-2 text-accent-2 hover:text-accent-1 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Payment Questions</h2>
                <p className="text-muted-foreground text-sm">Rent, autopay, due dates and online payments</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Important Payment Information</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Your lease sets your rent due date, any grace period and any late fee</li>
                    <li>• Your tenant portal shows payment methods and fees</li>
                    <li>• Contact us early if you are having trouble paying rent</li>
                  </ul>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-xl bg-card/60 px-6 py-2 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-foreground hover:no-underline py-4">
                    <span className="text-left font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 pt-2 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Need help with payments?</p>
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
