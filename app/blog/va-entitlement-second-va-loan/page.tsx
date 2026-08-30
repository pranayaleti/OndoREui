import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF, VA_ENTITLEMENT, VA_FUNDING_FEE } from "@/lib/content"
import Link from "next/link"

const path = "/blog/va-entitlement-second-va-loan"

const faqs = [
  {
    question: "Can I have two VA loans at once?",
    answer: VA_ENTITLEMENT.remainingEntitlement,
  },
  {
    question: "If I keep the first house as a rental, is that still occupancy?",
    answer: VA_ENTITLEMENT.occupancy,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Can I Use VA If I Still Have a VA Loan?",
  description:
    "Remaining entitlement, occupancy, and restoration — how a second VA purchase is underwritten when you have not sold the first home.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["VA entitlement second loan", "remaining VA entitlement occupancy"],
  faqs,
})

export default function VaEntitlementPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Can I Use VA If I Still Have a VA Loan?",
        description:
          "Remaining entitlement, occupancy, and restoration — how a second VA purchase is underwritten when you have not sold the first home.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A second VA purchase is remaining entitlement plus occupancy, not a second-home slogan.",
        faqs,
        keywords: ["VA remaining entitlement", "two VA loans"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Sometimes yes: if remaining entitlement and occupancy rules work for the new property. It is not automatic,
        and it is not a VA second-home product by default. Snapshot as of {LENDING_FACTS_AS_OF} ({VA_ENTITLEMENT.source}
        ).
      </p>

      <h2>Three different conversations</h2>
      <ol>
        <li>
          <strong>Remaining entitlement.</strong> {VA_ENTITLEMENT.remainingEntitlement} County limits still matter when
          entitlement is partial. Look up method:{" "}
          <Link href="/blog/utah-county-conforming-loan-limit-lookup">Utah county limit how-to</Link>.
        </li>
        <li>
          <strong>Occupancy.</strong> {VA_ENTITLEMENT.occupancy} Moving for work or a permanent change of station is a
          facts-and-circumstances file, not a blog yes.
        </li>
        <li>
          <strong>Restoration after sale.</strong> Paying off the VA loan and disposing of the property is a different
          file from remaining entitlement. See{" "}
          <Link href="/blog/selling-with-va-loan-entitlement-restoration">selling and entitlement restoration</Link>.
        </li>
      </ol>

      <h2>Funding fee on a subsequent use</h2>
      <p>
        Subsequent-use funding fee snapshot (less than 5% down): {VA_FUNDING_FEE.subsequentUseLessThan5PercentDown}.
        Confirm the current schedule. Finance vs cash:{" "}
        <Link href="/blog/va-funding-fee-finance-vs-pay-cash">funding fee guide</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Pull or update the Certificate of Eligibility so remaining entitlement is visible. Do not write an offer that
        assumes a second zero-down VA loan until a loan officer has applied current VA and lender overlays. Program
        overview: <Link href="/loans/va">VA loans in Utah</Link>. Residual income still applies:{" "}
        <Link href="/blog/va-residual-income-vs-dti">residual vs DTI</Link>.
      </p>
    </ArticleShell>
  )
}
