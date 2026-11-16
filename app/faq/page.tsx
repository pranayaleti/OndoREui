import Link from "next/link"
import type { ReactNode } from "react"
import { Building2, ChevronRight, FileText, Home, KeyRound, Landmark } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { FaqAccordion } from "@/components/faq-accordion"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS, pageTitle } from "@/lib/site"
import { PM_SERVICE_AREA_SUMMARY } from "@/lib/service-faq"
import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

const DESCRIPTION =
  "Answers about renting, property management, buying and selling, home loans and remote online notary with Ondo Real Estate in Utah."

export const metadata: Metadata = pageCanonicalMetadata("/faq/", {
  title: pageTitle("FAQs | Ondo Real Estate"),
  description: DESCRIPTION,
})

interface FAQTile {
  name: string
  description: string
  path: string
  icon: ReactNode
}

const faqTiles: FAQTile[] = [
  { name: "Renting", description: "Applying, deposits, rent payments, maintenance and your lease.", path: "/faq/tenant-faqs/", icon: <KeyRound className="h-6 w-6" /> },
  { name: "Property management", description: "Fees, screening, maintenance, statements and inspections.", path: "/faq/owner-faqs/", icon: <Building2 className="h-6 w-6" /> },
  { name: "Buying and selling", description: "Agreements, pricing, escrow, earnest money and closing.", path: "/faq/buying-selling-faqs/", icon: <Home className="h-6 w-6" /> },
  { name: "Home loans", description: "Pre-approval, programs, credit, and help with a loan you already have.", path: "/faq/loans-faqs/", icon: <Landmark className="h-6 w-6" /> },
  { name: "Notary", description: "How remote online notarization works, what it costs and what to bring.", path: "/faq/notary-faqs/", icon: <FileText className="h-6 w-6" /> },
]

const generalFaqs = [
  {
    question: "What does Ondo Real Estate do?",
    answer: "Five things: rentals and property management, buying, selling, home loans and remote online notarization. One local team in Lehi, Utah.",
  },
  {
    question: "What areas do you serve?",
    answer: `${PM_SERVICE_AREA_SUMMARY} Remote notary sessions are available in every state.`,
  },
  {
    question: "How do I get started?",
    answer: `Call ${SITE_PHONE}, email ${SITE_EMAILS.primary}, or book a 30-minute call from the contact page. Tell us what you need and we will take it from there.`,
  },
  {
    question: "Are you licensed and insured?",
    answer: "Real estate and mortgage licensing is in progress. Property management is offered as Ondo Real Estate. Utah's separate property manager license becomes available January 1, 2027, and Ondo will hold it once the Division of Real Estate finalizes its rules. The licensing page shows where each line of business stands.",
  },
  {
    question: "How do you handle fair housing?",
    answer: "Every applicant is screened against the same written criteria, and we follow federal, Utah and local fair housing law. Assistance animals are not pets and carry no pet fees.",
  },
]

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="FAQs | Ondo Real Estate"
        description={DESCRIPTION}
        pathname="/faq"
        image={`${SITE_URL}/og/guides.jpg`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
          ]),
          generateFAQJsonLd(generalFaqs),
        ]}
      />
      <PageBanner title="Questions, answered" subtitle="Pick a topic, or start with the general questions below." />

      <main className="flex-1 bg-gradient-to-b from-background to-card py-12">
        <div className="container px-4 md:px-6">
          <section className="mb-16" aria-labelledby="faq-topics-heading">
            <h2 id="faq-topics-heading" className="sr-only">
              Topics
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
              {faqTiles.map((tile) => (
                <Link key={tile.path} href={tile.path} className="group block h-full">
                  <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {tile.icon}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{tile.name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{tile.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                      Read
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-3xl" aria-labelledby="faq-general-heading">
            <h2 id="faq-general-heading" className="mb-6 text-center text-2xl font-bold text-foreground md:text-3xl">
              General questions
            </h2>
            <FaqAccordion items={generalFaqs} />
            <p className="mt-10 text-center text-muted-foreground">
              Something else?{" "}
              <Link href="/contact/" className="font-medium text-primary underline underline-offset-4">
                Contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
