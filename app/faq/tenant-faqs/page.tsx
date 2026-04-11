import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tenant FAQs | Ondo Real Estate",
  description: "Find answers to common tenant questions about applications, leases, payments, maintenance, and renting with Ondo Real Estate.",
  alternates: { canonical: `${SITE_URL}/faq/tenant-faqs/` },
  openGraph: {
    title: "Tenant FAQs | Ondo Real Estate",
    description: "Find answers to common tenant questions about applications, leases, payments, maintenance, and renting with Ondo Real Estate.",
  },
}


export default function TenantFAQPage() {
  const faqs = [
    {
      question: "How do I apply for a property?",
      answer: 'You can apply for a property by clicking the "View Details" button on any property listing. This will open an application form where you can provide your information. Once submitted, a property manager will review your application and contact you within 1-2 business days.'
    },
    {
      question: "What documents do I need to apply?",
      answer: "For a complete rental application, you'll typically need proof of income (pay stubs, tax returns, or bank statements), photo ID, references from previous landlords, and authorization for a credit and background check. Having these documents ready will speed up your application process."
    },
    {
      question: "How much is the security deposit?",
      answer: "Security deposits typically equal one month's rent, but may vary based on the property and your application details. The exact amount will be specified in your lease agreement. Security deposits are fully refundable at the end of your lease, minus any charges for damages beyond normal wear and tear."
    },
    {
      question: "How do I report maintenance issues?",
      answer: `You can report maintenance issues through our tenant portal, by email, or by phone for emergencies at ${SITE_PHONE}. Our maintenance team responds to emergency requests within 24 hours and non-emergency requests within 2-3 business days. We provide 24/7 emergency maintenance support for issues like water leaks, heating failures, or security concerns.`
    },
    {
      question: "Can I have pets in my rental?",
      answer: "Pet policies vary by property. Properties that allow pets typically require an additional pet deposit and/or monthly pet rent. Breed and size restrictions may apply. Service animals are accommodated according to fair housing laws and are exempt from pet fees."
    },
    {
      question: "How do I pay rent?",
      answer: "We offer multiple payment options including online payments through our portal, automatic bank transfers, and traditional check payments. Online payments are the most convenient and secure option. You can set up automatic payments to never miss a due date."
    },
    {
      question: "What happens if I need to break my lease early?",
      answer: "Early lease termination policies vary by property and lease agreement. Contact us as soon as possible to discuss your situation. We may be able to work out a solution that minimizes penalties, such as finding a replacement tenant or negotiating a buyout fee."
    },
    {
      question: "How do I renew my lease?",
      answer: "We typically contact tenants 60-90 days before lease expiration to discuss renewal options. You can also reach out to us directly to start the renewal process. Renewal terms and any rent adjustments will be discussed during this process."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Tenant FAQs | Ondo Real Estate"
        description="Find answers to common tenant questions about applications, leases, payments, maintenance, and renting with Ondo Real Estate."
        pathname="/faq/tenant-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Tenant FAQs", url: `${SITE_URL}/faq/tenant-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Tenant FAQs"
        subtitle="Everything renters need to know about applications, leases, and living in our properties"
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
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">For Tenants</h2>
                <p className="text-gray-300 text-sm">Applications, leases, payments, and maintenance</p>
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
      <Script id="tenant-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
