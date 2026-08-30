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
import { LENDING_FACTS_AS_OF, NON_QM } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"

const faqs = [
  {
    question: "Is Non-QM the same as a bank-statement loan?",
    answer:
      "Bank-statement is one Non-QM stack. DSCR and asset-depletion are others. They underwrite different things (deposits vs rent vs eligible assets) and are not interchangeable.",
  },
  {
    question: "If I have large brokerage or retirement assets, is that a bank-statement loan?",
    answer:
      "No. Bank-statement qualifies from deposits. Asset-depletion treats eligible assets as a qualifying-income formula. DSCR qualifies from the property’s rent. They are not interchangeable. See the asset-depletion guide.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "bank", heading: "Bank-statement", href: "/blog/bank-statement-loans-when-tax-returns-undercount-income" },
  { id: "dscr", heading: "DSCR", href: "/blog/dscr-vs-full-doc-rental-loan" },
  { id: "asset", heading: "Asset-depletion", href: "/blog/asset-depletion-qualifying-non-qm" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "qualifies",
    criterion: "What is typically used to qualify",
    cells: {
      bank: NON_QM.bankStatement,
      dscr: NON_QM.dscr,
      asset: NON_QM.assetDepletion,
    },
  },
  {
    id: "who",
    criterion: "Who it is usually for",
    cells: {
      bank: "Self-employed borrowers whose tax returns undercount cash flow after write-offs.",
      dscr: "Investors who want the property’s rent to carry the payment. Occupancy is usually investment.",
      asset: "Borrowers with substantial eligible liquid assets and thinner documented employment income.",
    },
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/learn/non-qm", {
  title: "Non-QM, Bank-Statement, and DSCR | Ondo Real Estate",
  description:
    "Bank-statement, DSCR, and asset-depletion are different Non-QM stacks. Informational, not a credit decision or a cheaper conventional shortcut.",
})

export default function NonQmLearnPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Non-QM besides bank-statement: asset depletion and DSCR"
        description="When agency tax-return income does not match cash flow: bank-statement, DSCR, and asset-depletion files."
        pathname="/learn/non-qm"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Learn", url: `${SITE_URL}/learn` },
            { name: "Non-QM", url: `${SITE_URL}/learn/non-qm` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Non-QM: bank-statement, DSCR, asset-depletion"
        subtitle="Different stacks when agency income calc does not match documentable cash flow. Not a secret cheaper conventional loan."
        backgroundImage="/modern-office-building.png"
      />
      <article className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav items={[{ label: "Learn", href: "/learn" }, { label: "Non-QM" }]} />
          <div className="prose prose-lg prose-invert mt-6 max-w-none">
            <p className="lead text-xl text-foreground/70">
              {NON_QM.what} Snapshot as of {LENDING_FACTS_AS_OF}.
            </p>
            <p>{NON_QM.notAgency}</p>
            <ComparisonTable
              caption={`Three Non-QM conversations as of ${LENDING_FACTS_AS_OF}. Overlays differ by investor.`}
              columns={columns}
              rows={rows}
              footnote="Pricing, prepayment penalties, and reserve requirements are typically less standard than agency QM. This table is not a menu you can order from a blog."
            />
            <h2>Guides that already exist on this site</h2>
            <ul>
              <li>
                <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">
                  Bank-statement loans when tax returns undercount income
                </Link>
              </li>
              <li>
                <Link href="/blog/just-went-1099-last-month">I just went 1099 last month</Link> — new 1099 income is
                usually not yet an agency average, and it is not automatically a bank-statement file either.
              </li>
              <li>
                <Link href="/blog/k-1-income-what-usually-counts">K-1 income: what usually counts</Link> — agency K-1
                calc vs a Non-QM conversation when the return does not match cash.
              </li>
              <li>
                <Link href="/blog/asset-depletion-qualifying-non-qm">
                  Asset-depletion qualifying: retirement and investment assets
                </Link>{" "}
                — a written formula on eligible assets, not a brokerage screenshot. Agency and Non-QM paths differ.
              </li>
              <li>
                <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc rental loan</Link> — property
                qualifies vs borrower qualifies. Occupancy still has to match use.
              </li>
              <li>
                <Link href="/blog/itin-non-us-citizen-mortgage-documentation">
                  ITIN / non-U.S. citizen documentation
                </Link>{" "}
                — legal eligibility and document categories, not a national-origin preference.
              </li>
              <li>
                <Link href="/calculators/dscr">DSCR calculator</Link> — illustration of rent vs payment, not an
                approval.
              </li>
              <li>
                <Link href="/learn/investment">Investment financing hub</Link> — occupancy, cash-out to a rental, FHA
                house-hack.
              </li>
            </ul>
            <h2>Start with agency if the docs support it</h2>
            <p>
              Two years of returns, a 1099 stack, or a W-2 average still belongs on{" "}
              <Link href="/learn/variable-income">variable income</Link> and{" "}
              <Link href="/loans">loan programs</Link> first. Non-QM is the branch when those paths cannot see the
              cash flow you can document.
            </p>
          </div>
          <ContentFaq items={faqs} />
          <RelatedContent path="/learn/non-qm" title="Guides in this cluster" />
          <NextStepCta
            path="/learn/non-qm"
            heading="Non-QM is a conversation, not a form"
            body="Pricing and overlays are investor-specific. Bring statements or a rent roll as illustrations, not as a demand for a product."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
