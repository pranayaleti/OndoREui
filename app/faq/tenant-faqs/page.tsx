import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { UTAH_RENTAL_LAW_DISCLAIMER, utahRulesAsFaqs } from "@/lib/content/utah-rental-law"
import { SITE_URL, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Renting FAQs | Ondo Real Estate"),
  description: "Renting with Ondo: how to apply, deposits, paying rent, autopay, maintenance and your lease.",
  alternates: { canonical: `${SITE_URL}/faq/tenant-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Renting FAQs | Ondo Real Estate"),
    description: "Renting with Ondo: how to apply, deposits, paying rent, autopay, maintenance and your lease.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function TenantFAQPage() {
  const businessFaqs = [
    {
      question: "How do I apply for a property?",
      answer: "Pick a home on the rentals page and request a showing. After the showing we send an application link. Every applicant is screened against the same written criteria, and we reply within one business day."
    },
    {
      question: "What documents do I need to apply?",
      answer: "For a complete rental application, you'll typically need proof of income (pay stubs, tax returns, or bank statements), photo ID, references from previous landlords, and authorization for a credit and background check. Having these documents ready will speed up your application process."
    },
    {
      question: "How much is the security deposit?",
      answer: "Security deposits typically equal one month's rent, but may vary based on the property and your application details. The exact amount will be specified in your lease agreement. Your deposit is returned after the tenancy ends, minus deductions Utah law allows: unpaid rent, cleaning costs, damage beyond normal wear and tear, and other losses from a lease breach. Any deductions must appear on a written itemized statement."
    },
    {
      question: "How do I report maintenance issues?",
      answer: `You can report maintenance issues through our tenant portal, by email, or by phone for emergencies at ${SITE_PHONE}. Emergencies like water leaks, no heat or security problems are handled first. Routine requests are scheduled within 2 to 3 business days.`
    },
    {
      question: "Can I have pets in my rental?",
      answer: "Pet policies vary by property. Properties that allow pets typically require an additional pet deposit and/or monthly pet rent. Breed and size restrictions may apply. Assistance animals that provide disability-related assistance are not pets, and we do not charge pet rent, pet deposits, or pet fees for them."
    },
    {
      question: "When is rent due, and what if I am late?",
      answer: "Your lease sets the due date, any grace period and any late fee. If you are going to have trouble paying, tell us before the due date so we can talk through it."
    },
    {
      question: "How do I pay rent?",
      answer: "Log in to the tenant portal and go to Payments. You can pay once or set up autopay for the date your lease allows. The portal lists the payment methods for your home and any fee before you confirm."
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

  // Utah statutory answers live in one cited module so the FAQ page, the
  // FAQPage JSON-LD, and any other surface stay consistent. These are the
  // questions people actually type, which is also what assistants get asked.
  const faqs = [...businessFaqs, ...utahRulesAsFaqs("tenant")]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Renting FAQs | Ondo Real Estate"
        description="Renting with Ondo: how to apply, deposits, paying rent, autopay, maintenance and your lease."
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
        title="Renting FAQs"
        subtitle="Applying, deposits, rent, maintenance and your lease."
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
                <h2 className="text-2xl font-bold text-foreground">For renters</h2>
                <p className="text-muted-foreground text-sm">Applications, deposits, payments and maintenance</p>
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

            <p className="mt-8 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {UTAH_RENTAL_LAW_DISCLAIMER}
            </p>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
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

    </div>
  )
}
