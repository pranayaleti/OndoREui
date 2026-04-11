import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Owner FAQs | Ondo Real Estate",
  description: "Find answers to property owner questions about management services, fees, tenant screening, maintenance, and reporting.",
  alternates: { canonical: `${SITE_URL}/faq/owner-faqs/` },
  openGraph: {
    title: "Owner FAQs | Ondo Real Estate",
    description: "Find answers to property owner questions about management services, fees, tenant screening, maintenance, and reporting.",
  },
}


export default function OwnerFAQPage() {
  const faqs = [
    {
      question: "What services do you offer property owners?",
      answer: "We offer comprehensive property management services including tenant screening and placement, rent collection, property maintenance, financial reporting, legal compliance, and property marketing. We can customize our services based on your specific needs and property requirements."
    },
    {
      question: "How do you screen potential tenants?",
      answer: "Our thorough screening process includes credit checks, criminal background checks, employment verification, income verification (requiring income of 3x the monthly rent), rental history verification, and personal references. This comprehensive approach helps us find reliable, responsible tenants for your property."
    },
    {
      question: "What are your management fees?",
      answer: "Our management fees typically range from 7-10% of monthly collected rent, depending on the property type, size, and services required. We also charge a leasing fee of 50-75% of the first month's rent for new tenant placement. We don't get paid unless you get paid, aligning our interests with yours."
    },
    {
      question: "How do you handle maintenance and repairs?",
      answer: "We have a network of licensed, insured, and vetted contractors who provide quality work at reasonable rates. For minor repairs (typically under $500), we handle them without owner approval to ensure prompt service. For larger repairs, we consult with you, provide estimates, and proceed with your approval."
    },
    {
      question: "How often will I receive statements and payments?",
      answer: "Property owners receive detailed monthly statements showing all income and expenses. Rent payments, minus management fees and any maintenance costs, are directly deposited to your bank account by the 15th of each month. You'll also receive annual statements for tax purposes and have 24/7 access to your property's financial information through our owner portal."
    },
    {
      question: "How often do you inspect properties?",
      answer: "We conduct move-in, move-out, and regular quarterly inspections. We also perform drive-by inspections monthly and full interior inspections annually. This helps us catch maintenance issues early and ensure tenants are maintaining the property properly."
    },
    {
      question: "What happens if a tenant doesn't pay rent?",
      answer: "We follow a structured process including late notices, payment plans, and if necessary, legal eviction proceedings. We work with tenants to resolve payment issues whenever possible, but we take swift action when needed to protect your investment."
    },
    {
      question: "Can I see my property's financial information online?",
      answer: "Yes! Our owner portal provides 24/7 access to your property's financial information, including income statements, expense reports, tenant payment history, and maintenance records. You can view and download reports at any time."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Owner FAQs | Ondo Real Estate"
        description="Find answers to property owner questions about management services, fees, tenant screening, maintenance, and reporting."
        pathname="/faq/owner-faqs"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Owner FAQs", url: `${SITE_URL}/faq/owner-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Owner FAQs"
        subtitle="Everything property owners need to know about our management services"
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
                <h2 className="text-2xl font-bold text-white">For Property Owners</h2>
                <p className="text-gray-300 text-sm">Management, reporting, fees, and performance insights</p>
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
      <Script id="owner-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
