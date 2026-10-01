import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { FIND_YOUR_SERVICER, HUD_COUNSELING_PHONE, NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

export const metadata: Metadata = {
  title: pageTitle("Disaster & Emergency Help FAQs | Ondo Real Estate"),
  description: "What to do after a disaster: document damage, call your insurer and mortgage servicer, and apply for FEMA help. Ondo does not service mortgages.",
  alternates: { canonical: `${SITE_URL}/faq/disaster-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Disaster & Emergency Help FAQs | Ondo Real Estate"),
    description: "What to do after a disaster: document damage, call your insurer and mortgage servicer, and apply for FEMA help. Ondo does not service mortgages.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function DisasterFAQPage() {
  const faqs = [
    {
      question: "What should I do if my property is damaged in a disaster?",
      answer: "First, make sure you and your family are safe. Then document all damage with photos and video and contact your insurance company to file a claim. If the property is one we manage, also contact us at " + SITE_PHONE + " so we can coordinate repairs."
    },
    {
      question: "Can I get help with mortgage payments after a disaster?",
      answer: `Call your mortgage servicer as soon as you can and ask about disaster relief. ${FIND_YOUR_SERVICER} ${NOT_A_SERVICER}`
    },
    {
      question: "What is mortgage forbearance?",
      answer: "Forbearance is an agreement with your servicer to pause or reduce your mortgage payments for a set time. The payments are still owed. Ask your servicer how and when they must be repaid before you agree."
    },
    {
      question: "How do I apply for disaster assistance?",
      answer: "If your area has a federal disaster declaration, you can apply for FEMA assistance at disasterassistance.gov. The U.S. Small Business Administration also offers disaster loans, and Utah Emergency Management has state resources."
    },
    {
      question: "What if my rental home is not livable after a disaster?",
      answer: `Contact your property manager or landlord and read your lease. If we manage the home, call ${SITE_PHONE}. If you have renters insurance, ask your insurer whether it covers temporary housing.`
    },
    {
      question: "What documentation do I need for disaster assistance?",
      answer: "Expect to need photos of the damage, your insurance claim information, any FEMA letters, and proof of where you live and of any lost income. Each program publishes its own list."
    },
    {
      question: "Where can I get free help with my mortgage after a disaster?",
      answer: `A HUD-approved housing counselor can help at no cost. Call ${HUD_COUNSELING_PHONE} or visit hud.gov.`
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Disaster & Emergency Help FAQs | Ondo Real Estate"
        description="What to do after a disaster: document damage, call your insurer and mortgage servicer, and apply for FEMA help. Ondo does not service mortgages."
        pathname="/faq/disaster-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Disaster FAQs", url: `${SITE_URL}/faq/disaster-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Disaster & Emergency Help FAQs"
        subtitle="What to do after a disaster and who to call"
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
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">After a Disaster</h2>
                <p className="text-muted-foreground text-sm">Safety, insurance, servicer and FEMA</p>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Emergency Contact</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    For life-threatening emergencies, call <strong className="text-foreground">911</strong> immediately.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    For mortgage relief after a disaster, call your mortgage servicer. For a property we manage, call us at <strong className="text-foreground">{SITE_PHONE}</strong>
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
              <p className="text-muted-foreground mb-4">Need immediate assistance?</p>
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
