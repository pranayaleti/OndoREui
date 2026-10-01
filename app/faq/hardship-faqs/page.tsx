import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { FIND_YOUR_SERVICER, HUD_COUNSELING_PHONE, NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

export const metadata: Metadata = {
  title: pageTitle("Hardship & Assistance Options FAQs | Ondo Real Estate"),
  description: "What to do if you are behind on your mortgage or rent: call your servicer, get free HUD housing counseling, and avoid scams. Ondo does not service mortgages.",
  alternates: { canonical: `${SITE_URL}/faq/hardship-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Hardship & Assistance Options FAQs | Ondo Real Estate"),
    description: "What to do if you are behind on your mortgage or rent: call your servicer, get free HUD housing counseling, and avoid scams. Ondo does not service mortgages.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function HardshipFAQPage() {
  const faqs = [
    {
      question: "What should I do if I cannot make my mortgage payment?",
      answer: `Call your mortgage servicer as soon as you know, before you miss a payment if you can. ${FIND_YOUR_SERVICER} Ask what options it offers, such as a repayment plan, a deferral, forbearance or a loan modification.`
    },
    {
      question: "Can Ondo Real Estate arrange forbearance or a loan modification?",
      answer: `No. ${NOT_A_SERVICER} Only your servicer, or the investor that owns your loan, can offer those options.`
    },
    {
      question: "Who can help me for free?",
      answer: `A HUD-approved housing counselor can review your situation and help you talk to your servicer at no cost. Call ${HUD_COUNSELING_PHONE} or visit hud.gov. The Consumer Financial Protection Bureau (consumerfinance.gov) explains your rights and takes complaints about mortgage servicers.`
    },
    {
      question: "How do I avoid hardship scams?",
      answer: "Be careful with anyone who asks for a fee up front to change your loan, tells you to stop talking to your servicer, or asks you to sign over your deed. Real housing counseling through HUD is free."
    },
    {
      question: "Will asking for help affect my credit?",
      answer: "It depends on the option and on how your servicer reports it. Ask your servicer, in writing if you can, how each option will be reported before you agree to it."
    },
    {
      question: "What documents will my servicer ask for?",
      answer: "Servicers commonly ask for proof of income and hardship, recent bank statements and a short hardship letter. Ask your servicer for its exact list."
    },
    {
      question: "I rent a home that Ondo Real Estate manages and I am behind on rent. What do I do?",
      answer: `Contact us as early as you can at ${SITE_PHONE}. Read your lease for the due date and any fees, and tell us what is going on so we can talk through your options.`
    },
    {
      question: "What if I decide to sell my home?",
      answer: "Selling is one option some homeowners consider. Talk to your servicer and a housing counselor first so you understand your payoff and your other choices. If you decide to sell, you can contact us to talk it through."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Hardship & Assistance Options FAQs | Ondo Real Estate"
        description="What to do if you are behind on your mortgage or rent: call your servicer, get free HUD housing counseling, and avoid scams. Ondo does not service mortgages."
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
        subtitle="If you are behind on your mortgage, start with your servicer and a free housing counselor"
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
                <h2 className="text-2xl font-bold text-foreground">Hardship Help</h2>
                <p className="text-muted-foreground text-sm">Who to call when payments get hard</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Important: Call Your Servicer Early</h3>
                  <p className="text-muted-foreground text-sm">
                    Do not wait until you are behind. The sooner you call your mortgage servicer, the more options you have. For free help, call a HUD-approved housing counselor at <strong className="text-foreground">{HUD_COUNSELING_PHONE}</strong>. {NOT_A_SERVICER}
                  </p>
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
              <p className="text-muted-foreground mb-4">Renting a home we manage?</p>
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

    </div>
  )
}
