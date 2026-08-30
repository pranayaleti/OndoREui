import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { ComparisonTable } from "@/components/content/comparison-table"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { LENDING_FACTS_AS_OF, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"

const faqs = [
  {
    question: "Is a DSCR loan the same as house-hacking with FHA?",
    answer:
      "No. DSCR is typically investment occupancy. An FHA duplex house-hack is a primary residence: you live in one unit. Occupancy has to match use.",
  },
  {
    question: "Can I label a rental as a second home for pricing?",
    answer: OCCUPANCY_TYPES.fraud,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "hack", heading: "Occupy one unit (house-hack)", href: "/blog/house-hacking-duplex-with-fha" },
  { id: "rental", heading: "Do not occupy (investment)", href: "/blog/dscr-vs-full-doc-rental-loan" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "occ",
    criterion: "Occupancy",
    cells: {
      hack: "Primary. FHA and many conventional 2–4 unit purchases require you to live in one unit.",
      rental: "Investment. Second-home occupancy is exclusive personal use — not a rental business label.",
    },
  },
  {
    id: "qualify",
    criterion: "Typical qualification",
    cells: {
      hack: "Borrower DTI plus a worksheet on the unit you will not occupy. FHA 3–4 units add self-sufficiency.",
      rental: "Full-doc borrower DTI, or DSCR on the property’s rent versus the payment.",
    },
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/learn/investment", {
  title: "Investment Property Financing | Ondo Real Estate",
  description:
    "DSCR vs full-doc, occupancy types, cash-out to buy a rental, and FHA duplex house-hacks. Informational, not occupancy coaching.",
})

export default function InvestmentLearnPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Investment property financing: DSCR, occupancy, and house-hacking"
        description="DSCR vs full-doc rental qualification, occupancy types, cash-out to buy a rental, and FHA duplex house-hacks."
        pathname="/learn/investment"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Learn", url: `${SITE_URL}/learn` },
            { name: "Investment financing", url: `${SITE_URL}/learn/investment` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Investment financing: occupancy first"
        subtitle="DSCR, full-doc, cash-out, and FHA house-hacks are different files. Occupancy has to match how you will use the property."
        backgroundImage="/modern-office-building.png"
      />
      <article className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav items={[{ label: "Learn", href: "/learn" }, { label: "Investment financing" }]} />
          <div className="prose prose-lg prose-invert mt-6 max-w-none">
            <p className="lead text-xl text-foreground/70">
              Start with occupancy, then pick a qualification path. A rental you will not live in is not a second home
              on paper. Snapshot as of {LENDING_FACTS_AS_OF}.
            </p>
            <p>{OCCUPANCY_TYPES.fairHousing}</p>
            <ComparisonTable
              caption={`Occupy vs not occupy as of ${LENDING_FACTS_AS_OF}.`}
              columns={columns}
              rows={rows}
              footnote="Educational snapshot. Not occupancy coaching."
            />
            <h2>Guides in this cluster</h2>
            <ul>
              <li>
                <Link href="/blog/first-rental-occupancy-if-you-still-live-there">
                  First rental: occupancy if you still live there
                </Link>{" "}
                — stay-put rental is investment occupancy. Not a duplex house-hack.
              </li>
              <li>
                <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc rental loan</Link> — property qualifies
                vs borrower qualifies. Calculator: <Link href="/calculators/dscr">DSCR illustration</Link>.
              </li>
              <li>
                <Link href="/blog/second-home-vs-investment-occupancy">Second home vs investment occupancy</Link> — three
                occupancy types. Commercial: <Link href="/buy/second-home">second-home overview</Link>.
              </li>
              <li>
                <Link href="/blog/cash-out-to-buy-a-rental">Cash-out to buy a rental</Link> — two LTVs, two occupancies.
                Compare structure on <Link href="/blog/heloc-vs-cash-out-refinance">HELOC vs cash-out</Link>.
              </li>
              <li>
                <Link href="/blog/delayed-financing-after-cash-purchase">Delayed financing after a cash purchase</Link>{" "}
                — agency exception when you bought with cash, then want a mortgage later. Not HELOC seasoning.
              </li>
              <li>
                <Link href="/blog/house-hacking-duplex-with-fha">House-hacking a duplex with FHA</Link> — occupy one
                unit. Self-sufficiency is a 3–4 unit test.
              </li>
              <li>
                <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E rental income</Link> — history on
                properties you already own. Depreciation add-back:{" "}
                <Link href="/blog/depreciation-add-back-schedule-e">what agency files allow</Link>.
              </li>
              <li>
                <Link href="/blog/cross-collateral-equity-to-buy-another-house">
                  Cross-collateral / using equity to buy another house
                </Link>{" "}
                — educational; not a published agency product you can assume.
              </li>
              <li>
                <Link href="/blog/mortgage-reserves-months-of-pitia">Reserves: months of PITIA</Link> — investment and
                2–4 unit files commonly need more remaining assets after cash to close.
              </li>
              <li>
                <Link href="/learn/non-qm">Non-QM hub</Link> — bank-statement, DSCR, and{" "}
                <Link href="/blog/asset-depletion-qualifying-non-qm">asset-depletion</Link> as different stacks.
              </li>
            </ul>
          </div>
          <ContentFaq items={faqs} />
          <RelatedContent path="/learn/investment" title="Guides in this cluster" />
          <NextStepCta
            path="/learn/investment"
            heading="Occupancy is the first question"
            body="Bring how you will use the property, not a requested rate. Investment pricing is file-specific."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
