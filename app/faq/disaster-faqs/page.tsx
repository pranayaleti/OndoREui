import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disaster & Emergency Help FAQs | Ondo Real Estate",
  description: "Find answers to questions about disaster assistance, emergency help, mortgage forbearance, and what to do after a disaster.",
  alternates: { canonical: `${SITE_URL}/faq/disaster-faqs/` },
  openGraph: {
    title: "Disaster & Emergency Help FAQs | Ondo Real Estate",
    description: "Find answers to questions about disaster assistance, emergency help, mortgage forbearance, and what to do after a disaster.",
  },
}


export default function DisasterFAQPage() {
  const faqs = [
    {
      question: "What should I do if my property is damaged in a disaster?",
      answer: "First, ensure your safety and the safety of your family. Then, document all damage with photos and videos. Contact your insurance company immediately to file a claim. Also contact us at " + SITE_PHONE + " so we can help coordinate repairs and discuss payment assistance options."
    },
    {
      question: "Can I get help with mortgage payments after a disaster?",
      answer: "Yes, we offer disaster-related mortgage assistance including forbearance (temporary payment pause), payment deferral, and loan modification options. Contact us as soon as possible to discuss your situation."
    },
    {
      question: "What is mortgage forbearance?",
      answer: "Forbearance allows you to temporarily pause or reduce your mortgage payments for a specific period (typically 3-12 months) while you recover from a disaster. You'll need to resume payments after the forbearance period ends."
    },
    {
      question: "How do I apply for disaster assistance?",
      answer: "Contact us immediately at " + SITE_PHONE + " to discuss your situation. We'll help you understand your options and guide you through the application process. You may also be eligible for FEMA assistance if your area has been declared a disaster zone."
    },
    {
      question: "What if I can't return to my property due to damage?",
      answer: "If your property is uninhabitable, contact us immediately. We can help arrange temporary housing assistance and work with your insurance company. We may also be able to pause or modify your mortgage payments during this time."
    },
    {
      question: "How long does disaster assistance last?",
      answer: "Disaster assistance duration varies based on your situation. Forbearance typically lasts 3-12 months, but can be extended if needed. We'll work with you to find a solution that fits your recovery timeline."
    },
    {
      question: "What documentation do I need for disaster assistance?",
      answer: "You'll need documentation of the disaster impact, such as photos of damage, insurance claim information, FEMA assistance letters (if applicable), and proof of displacement or income loss. We'll provide a complete list when you contact us."
    },
    {
      question: "Are there government programs that can help?",
      answer: "Yes, FEMA provides disaster assistance for declared disaster areas. The SBA offers low-interest disaster loans. Utah Emergency Management also provides state-level resources. We can help you navigate these programs and coordinate with your mortgage assistance."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Disaster & Emergency Help FAQs | Ondo Real Estate"
        description="Find answers to questions about disaster assistance, emergency help, mortgage forbearance, and what to do after a disaster."
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
        subtitle="24/7 support and assistance during emergencies and disasters"
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
                <h2 className="text-2xl font-bold text-white">Emergency Support</h2>
                <p className="text-gray-300 text-sm">24/7 assistance for disasters and emergencies</p>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Emergency Contact</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    For life-threatening emergencies, call <strong className="text-white">911</strong> immediately.
                  </p>
                  <p className="text-gray-300 text-sm">
                    For mortgage assistance during disasters, call us 24/7 at <strong className="text-white">{SITE_PHONE}</strong>
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
              <p className="text-gray-300 mb-4">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`tel:${SITE_PHONE.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Call {SITE_PHONE} (24/7)
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
      <Script id="disaster-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
