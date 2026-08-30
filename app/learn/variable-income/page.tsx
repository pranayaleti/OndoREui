import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { DTI_EDUCATION, LENDING_FACTS_AS_OF } from "@/lib/content"

const faqs = [
  {
    question: "Can I get a mortgage if my paycheck is different every month?",
    answer:
      "Often yes, if you can show a documented pattern. Underwriters typically average overtime, bonus, commission, or 1099 income over a history (commonly 12–24 months) rather than using the highest recent month. A single strong month does not replace a file.",
  },
  {
    question: "Do tax returns always decide self-employed income?",
    answer:
      "On many conventional and FHA files, yes: adjusted income on the returns (and transcripts) is the starting point. If write-offs make that number far below your deposits, some Non-QM bank-statement programs look at bank activity instead. Those programs have different pricing, documentation, and overlays.",
  },
  {
    question: "Is a 1099 contractor treated like a W-2 employee?",
    answer:
      "Usually not. Contract income is often treated like self-employment: history, net income after expenses, and stability matter. The checklist is in the 1099 documentation guide on this site.",
  },
  {
    question: "If I have a W-2 job and gig income, how is the average built?",
    answer:
      "Usually as two streams — W-2 history and gig or 1099 history — then added. A peak gig month does not replace the gig average, and a CPA letter does not replace tax returns. See the gig-plus-W-2 guide and the CPA letter vs returns guide.",
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/learn/variable-income", {
  title: "Mortgages When Income Changes Monthly | Ondo Real Estate",
  description:
    "How underwriters average overtime, 1099, commission, and self-employed income. Educational, not a credit decision.",
})

export default function VariableIncomePillarPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Mortgages when your income is not the same every month"
        description="How lenders typically average variable income, which documents to gather, and when a bank-statement option enters the conversation."
        pathname="/learn/variable-income"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Learn", url: `${SITE_URL}/learn` },
            { name: "Variable income", url: `${SITE_URL}/learn/variable-income` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Variable income mortgages"
        subtitle="Overtime, 1099, commission, and self-employed files are underwritten on a pattern, not last week's deposit."
        backgroundImage="/modern-office-building.png"
      />
      <article className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav items={[{ label: "Learn", href: "/learn" }, { label: "Variable income" }]} />
          <div className="prose prose-lg prose-invert mt-6 max-w-none">
            <p className="lead text-xl text-foreground/70">
              If your income moves around, you can still be a candidate for a mortgage. The question is whether the
              file shows a stable average, not whether last month was a good month. This pillar is the map. The
              supporting guides answer the specific document and program questions.
            </p>
            <h2>How underwriters usually look at uneven pay</h2>
            <p>
              {DTI_EDUCATION.variableIncomeNote} That average is then run through DTI: {DTI_EDUCATION.frontendNote}{" "}
              {DTI_EDUCATION.backendNote}
            </p>
            <p>
              Snapshot as of {LENDING_FACTS_AS_OF}. Investor guides and lender overlays change. A loan officer has to
              apply the guide that is in force for your product, not a blog paragraph.
            </p>
            <h2>Common files</h2>
            <ul>
              <li>
                <strong>Gig plus W-2.</strong>{" "}
                <Link href="/blog/gig-plus-w2-income-mortgage-average">How the average is built</Link> — two streams,
                then add. A peak gig month is not the method.
              </li>
              <li>
                <strong>CPA letter vs tax returns.</strong>{" "}
                <Link href="/blog/cpa-letter-vs-tax-returns-underwriting">What actually moves underwriting</Link> — a
                letter supports; it does not replace returns and transcripts.
              </li>
              <li>
                <strong>Commission or seasonal work.</strong> Two years is a common ask when the work is cyclical. See{" "}
                <Link href="/blog/commission-income-mortgage-averaging">commission averaging and a down year</Link>.
              </li>
              <li>
                <strong>W-2 overtime or bonus.</strong> History on the W-2s usually matters more than a verbal promise.{" "}
                <Link href="/blog/w2-overtime-likely-to-continue">Likely to continue</Link>.
              </li>
              <li>
                <strong>Self-employed history.</strong>{" "}
                <Link href="/blog/two-years-of-tax-returns-vs-one-year-mortgage">
                  Two years of returns vs one year
                </Link>
                .
              </li>
              <li>
                <strong>K-1 (partner / S-corp).</strong>{" "}
                <Link href="/blog/k-1-income-what-usually-counts">What usually counts on a K-1</Link> — distributions
                are not a qualifying method.
              </li>
              <li>
                <strong>Schedule E rentals.</strong>{" "}
                <Link href="/blog/schedule-e-rental-income-purchase-file">Rental income on a purchase file</Link> is
                history on properties you already own, not proposed rent. Depreciation add-back:{" "}
                <Link href="/blog/depreciation-add-back-schedule-e">what agency files allow</Link>.
              </li>
              <li>
                <strong>1099 / contract.</strong> See the{" "}
                <Link href="/blog/1099-mortgage-documentation-checklist">1099 documentation checklist</Link>. If you{" "}
                <Link href="/blog/just-went-1099-last-month">just went 1099 last month</Link>, that income is usually
                not yet an average. A spouse or partner’s W-2 only helps when they are a borrower —{" "}
                <Link href="/blog/spouse-w2-offset-1099-volatility">spouse W-2 offset</Link>.
              </li>
              <li>
                <strong>Co-mingled business and personal deposits.</strong>{" "}
                <Link href="/blog/business-vs-personal-bank-co-mingling">
                  Business vs personal co-mingling
                </Link>{" "}
                stalls sourcing — pair with the{" "}
                <Link href="/blog/large-deposits-60-day-paper-trail">60-day large-deposit trail</Link>.
              </li>
              <li>
                <strong>Self-employed with heavy write-offs.</strong> Taxable income can look small while deposits look
                strong. That is the{" "}
                <Link href="/learn/non-qm">Non-QM hub</Link> (bank-statement, DSCR, asset-depletion), not a conventional
                shortcut you can assume. Start with{" "}
                <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">
                  bank-statement loans
                </Link>
                .
              </li>
            </ul>
            <h2>What this hub does not do</h2>
            <p>
              It does not tell you that you will qualify. It does not pick a rate. It does not replace tax advice about
              how you report income. If gift funds are part of the down payment, read{" "}
              <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link> before you move money.
            </p>
          </div>
          <ContentFaq items={faqs} />
          <RelatedContent path="/learn/variable-income" title="Guides in this cluster" />
          <NextStepCta
            path="/learn/variable-income"
            heading="Bring a pattern, not a peak month"
            body="Use the income calculator for an illustration, then talk with a loan officer about the documents for your income type."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
