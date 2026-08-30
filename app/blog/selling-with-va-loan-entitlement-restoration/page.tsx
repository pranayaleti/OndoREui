import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, VA_ENTITLEMENT, VA_ENTITLEMENT_RESTORATION, VA_FUNDING_FEE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/selling-with-va-loan-entitlement-restoration"

const faqs = [
  {
    question: "If I sell my house and pay off the VA loan, do I get my entitlement back?",
    answer: VA_ENTITLEMENT_RESTORATION.afterSale,
  },
  {
    question: "Is restoration the same as using VA while I still have a VA loan?",
    answer: VA_ENTITLEMENT_RESTORATION.notRemaining,
  },
  {
    question: "Does restoration put me back on the first-use funding fee?",
    answer: VA_ENTITLEMENT_RESTORATION.fundingFee,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "restore", heading: "Sell, pay off, restore" },
  { id: "keep", heading: "Keep the first VA loan", href: "/blog/va-entitlement-second-va-loan" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What you are asking",
    cells: {
      restore: "Can used entitlement come back after this loan is gone so a later purchase can use VA again?",
      keep: "Can I buy another home with VA while this loan is still open?",
    },
  },
  {
    id: "engine",
    criterion: "What VA is testing",
    cells: {
      restore: VA_ENTITLEMENT_RESTORATION.afterSale,
      keep: VA_ENTITLEMENT.remainingEntitlement,
    },
  },
  {
    id: "occupancy",
    criterion: "Occupancy",
    cells: {
      restore: "You typically will not occupy the sold house. The next VA purchase still has to meet occupancy on that new property.",
      keep: VA_ENTITLEMENT.occupancy,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Selling with a VA Loan: Entitlement Restoration",
  description:
    "How VA entitlement is typically restored after you sell and pay off the loan. Distinct from keeping a VA loan and buying another. No entitlement dollar figures.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["VA entitlement restoration after sale", "selling a home with a VA loan", "restore VA entitlement"],
  faqs,
})

export default function VaEntitlementRestorationPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Selling with a VA Loan: Entitlement Restoration",
        description:
          "How VA entitlement is typically restored after you sell and pay off the loan. Distinct from keeping a VA loan and buying another. No entitlement dollar figures.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Payoff plus disposition is a different file from “can I keep this VA loan and buy another.”",
        faqs,
        keywords: ["VA entitlement restoration", "sell house with VA loan"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you sell a home that has a VA loan and that loan is paid in full, used entitlement is typically restored so
        you can use VA again on a later purchase. That is restoration after sale — not the question of keeping the first
        VA loan and buying another house. This page does not quote entitlement dollars. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF} ({VA_ENTITLEMENT_RESTORATION.source}).
      </p>
      <p>{VA_ENTITLEMENT_RESTORATION.notADollar}</p>

      <h2>Two conversations people mix up</h2>
      <ComparisonTable
        caption={`Restoration after sale vs remaining entitlement as of ${LENDING_FACTS_AS_OF}. Confirm the COE.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Occupancy, remaining guaranty, and lender overlays still apply."
      />
      <p>
        If you are not selling — you want to keep the first house as a rental or you still live there — start with{" "}
        <Link href="/blog/va-entitlement-second-va-loan">can I use VA if I still have a VA loan</Link>. Occupancy
        mislabeling is a different problem:{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment occupancy</Link>.
      </p>

      <h2>How restoration usually happens after a sale</h2>
      <ol>
        <li>
          <strong>The VA loan is paid in full.</strong> Sale proceeds, a conventional refinance that pays VA off, or
          cash can do that. A listing is not a payoff.
        </li>
        <li>
          <strong>The property is disposed of under current VA rules.</strong> {VA_ENTITLEMENT_RESTORATION.afterSale}
        </li>
        <li>
          <strong>The Certificate of Eligibility is updated.</strong> Restoration shows on the COE. Ask the next lender
          to pull it rather than assuming last year’s COE still matches.
        </li>
      </ol>

      <h2>Other restoration paths (still not dollar figures)</h2>
      <ul>
        <li>
          <strong>One-time restoration without a sale.</strong> {VA_ENTITLEMENT_RESTORATION.oneTime}
        </li>
        <li>
          <strong>Assumption and substitution.</strong> {VA_ENTITLEMENT_RESTORATION.substitution} A buyer who is not
          VA-eligible assuming the loan is a different (often narrower) path.
        </li>
      </ul>

      <h2>Funding fee after you use VA again</h2>
      <p>
        {VA_ENTITLEMENT_RESTORATION.fundingFee} Subsequent-use snapshot (less than 5% down):{" "}
        {VA_FUNDING_FEE.subsequentUseLessThan5PercentDown} as of {LENDING_FACTS_AS_OF}. Confirm the current schedule.
        Finance vs cash: <Link href="/blog/va-funding-fee-finance-vs-pay-cash">funding fee guide</Link>. Residual income
        still applies on the next purchase:{" "}
        <Link href="/blog/va-residual-income-vs-dti">residual vs DTI</Link>.
      </p>

      <h2>Scenario: you are under contract to sell</h2>
      <ul>
        <li>Tell the listing side and the loan officer that the loan to be paid is VA. Payoff letters take time.</li>
        <li>
          If you will buy again with VA, do not write the next offer as if zero-down entitlement is already restored
          until the COE reflects it — or until a loan officer has applied current VA rules to the timeline.
        </li>
        <li>
          A Utah purchase contract still runs its own clocks:{" "}
          <Link href="/blog/utah-repc-deadline-and-your-loan">REPC deadlines</Link>.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Look up current restoration rules on va.gov. Do not use a blog dollar figure.</li>
        <li>Ask a lender to pull or update the COE after payoff, not from memory.</li>
        <li>
          Program overview: <Link href="/loans/va">VA loans in Utah</Link>. A conversation still does not restore
          entitlement.
        </li>
      </ol>
    </ArticleShell>
  )
}
