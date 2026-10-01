import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { FIND_YOUR_SERVICER, HUD_COUNSELING_PHONE, NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

export const metadata: Metadata = {
  title: pageTitle("Loan Payoffs & Closings FAQs | Ondo Real Estate"),
  description: "Who to ask for a mortgage payoff quote, what happens after a payoff, and where to get free help. Your mortgage servicer issues payoffs, not Ondo.",
  alternates: { canonical: `${SITE_URL}/faq/loan-payoffs-faqs/` },
  openGraph: {
    title: pageTitleText("Loan Payoffs & Closings FAQs | Ondo Real Estate"),
    description: "Who to ask for a mortgage payoff quote, what happens after a payoff, and where to get free help. Your mortgage servicer issues payoffs, not Ondo.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function LoanPayoffsFAQPage() {
  const faqs = [
    {
      question: "How do I get a payoff quote?",
      answer: `Ask your mortgage servicer. ${FIND_YOUR_SERVICER} ${NOT_A_SERVICER}`
    },
    {
      question: "How long is a payoff quote valid?",
      answer: "Your servicer sets this and states it on the payoff statement. Interest keeps accruing every day, so ask for the daily interest amount if your closing date might move."
    },
    {
      question: "Are there prepayment penalties?",
      answer: "Your loan documents say. Check your note, or ask your servicer to confirm in writing whether a prepayment penalty applies before you pay off the loan."
    },
    {
      question: "Can I make extra payments toward principal?",
      answer: "Many loans allow it. Ask your servicer how to mark an extra payment as principal only, and check your note for any prepayment terms."
    },
    {
      question: "What happens after I pay off my loan?",
      answer: "Your servicer is responsible for releasing the lien. The release is recorded with the county recorder where the property is. Ask your servicer for the timeline, and keep your final statement and a copy of the recorded release."
    },
    {
      question: "Can I pay off my loan online?",
      answer: "Use your servicer's website or the payment instructions on its payoff statement. Ondo Real Estate does not accept mortgage payments."
    },
    {
      question: "Can I refinance instead of paying off?",
      answer: "Refinancing replaces your loan with a new one. Compare offers from more than one lender and read the Loan Estimate for each. Housing counselors can help you weigh it for free."
    },
    {
      question: "Where can I get free help with a payoff or a servicing problem?",
      answer: `A HUD-approved housing counselor can help at no cost. Call ${HUD_COUNSELING_PHONE} or visit hud.gov. The Consumer Financial Protection Bureau (consumerfinance.gov) also takes complaints about mortgage servicers.`
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Loan Payoffs & Closings FAQs | Ondo Real Estate"
        description="Who to ask for a mortgage payoff quote, what happens after a payoff, and where to get free help. Your mortgage servicer issues payoffs, not Ondo."
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
        subtitle="Your mortgage servicer handles payoffs. Here is who to ask and what to expect"
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
                <h2 className="text-2xl font-bold text-foreground">Loan Payoffs</h2>
                <p className="text-muted-foreground text-sm">Paying off or refinancing a loan</p>
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
              <p className="text-muted-foreground mb-4">Questions about a sale or purchase closing?</p>
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
