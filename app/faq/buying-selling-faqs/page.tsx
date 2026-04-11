import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buying & Selling FAQs | Ondo Real Estate",
  description: "Get answers to common questions about buying homes, selling properties, renting vs buying, home valuations, and the Utah real estate market.",
  alternates: { canonical: `${SITE_URL}/faq/buying-selling-faqs/` },
  openGraph: {
    title: "Buying & Selling FAQs | Ondo Real Estate",
    description: "Get answers to common questions about buying homes, selling properties, renting vs buying, home valuations, and the Utah real estate market.",
  },
}


export default function BuyingSellingFAQPage() {
  const faqs = [
    {
      question: "Is it better to rent or buy right now in Utah?",
      answer:
        "It depends on how long you plan to stay, how stable your income is, and whether you're comfortable with maintenance and market swings. Our rent‑vs‑own calculators and Utah‑specific blog posts help you see the real, long‑term costs. If you're within a 3–7 year horizon, we'll walk through both paths with actual numbers, not just rules of thumb.",
    },
    {
      question: "How do I know what my home is worth before I sell?",
      answer:
        "You can start with online estimates, but serious pricing should look at recent local sales, condition, upgrades, and competition. We combine data (comps, days on market) with on‑the‑ground Utah experience to recommend a pricing strategy, then keep adjusting based on showings and feedback.",
    },
    {
      question: "What should I do before listing my home for sale?",
      answer:
        "Most homes benefit from a deep clean, small cosmetic fixes, decluttering, and addressing obvious repairs. You don't have to fully remodel to get a strong result. We'll walk the home with you and prioritize only the projects that move the needle for your specific price point and neighborhood.",
    },
    {
      question: "What should I look for in a rental as a tenant?",
      answer:
        "Beyond price and location, look at responsiveness of management, clarity of the lease, condition of the unit, parking, and how maintenance is handled. With Ondo‑managed rentals, you'll get clear expectations up front, documented move‑in condition, and easy ways to pay rent and submit maintenance requests.",
    },
    {
      question: "How do I get started with buying a home in Utah?",
      answer:
        "Start by getting pre-approved for a mortgage, then work with our agents to define your criteria and search areas. We'll help you navigate the entire process from search to closing.",
    },
    {
      question: "What areas do you serve for home buying?",
      answer:
        "We serve the entire Wasatch Front including Salt Lake City, Lehi, Provo, Orem, Sandy, Draper, American Fork, Pleasant Grove, and surrounding Utah communities.",
    },
    {
      question: "Do you help with first-time home buyers?",
      answer:
        "Absolutely! We specialize in guiding first-time buyers through the entire process, including down payment assistance programs, first-time buyer incentives, and educational resources.",
    },
    {
      question: "What's the current Utah real estate market like?",
      answer:
        "The Utah market varies by location, but generally offers good value with strong appreciation potential. Our agents provide current market analysis and pricing guidance for your target areas.",
    },
    {
      question: "How much do your real estate services cost for buyers?",
      answer:
        "Our buyer representation is typically free to you - the seller pays the commission. We're committed to providing excellent service without additional fees to buyers.",
    },
    {
      question: "How long does a typical purchase take?",
      answer:
        "Most financed purchases close in 30–45 days after acceptance. Cash purchases can close faster depending on title and inspections.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Buying & Selling FAQs | Ondo Real Estate"
        description="Get answers to common questions about buying homes, selling properties, renting vs buying, home valuations, and the Utah real estate market."
        pathname="/faq/buying-selling-faqs"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Buying & Selling FAQs", url: `${SITE_URL}/faq/buying-selling-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Buying & Selling FAQs"
        subtitle="Common questions about buying homes, selling properties, and renting vs buying"
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
                <h2 className="text-2xl font-bold text-white">Buying & Selling Questions</h2>
                <p className="text-gray-300 text-sm">Everything about buying, selling, and renting properties</p>
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
              <p className="text-gray-300 mb-4">Ready to buy or sell?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/buy"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-1 to-accent-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start Buying
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center px-6 py-3 border border-accent-1 text-accent-2 font-semibold rounded-lg hover:bg-accent-1/10 transition-colors"
                >
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ JSON-LD */}
      <Script id="buying-selling-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
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
