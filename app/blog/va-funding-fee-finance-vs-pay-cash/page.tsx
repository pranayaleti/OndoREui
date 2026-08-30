import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import {
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  VA_FUNDING_FEE,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/va-funding-fee-finance-vs-pay-cash"

const faqs = [
  {
    question: "Is the funding fee always charged?",
    answer: VA_FUNDING_FEE.exemptionNote,
  },
  {
    question: "If I finance the fee, do I still pay it?",
    answer:
      "Yes. Financing adds it to the loan amount, so you pay interest on it. Paying cash raises cash to close and keeps the loan smaller. Neither choice is automatically “better.”",
  },
]

export const metadata = articleMetadata({
  path,
  title: "VA Funding Fee: Finance vs Pay Cash",
  description:
    "Worked examples of financing the VA funding fee versus paying it in cash. Snapshot percents, exemptions, and cash to close — not advice.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["VA funding fee finance vs cash", "VA funding fee Utah"],
  faqs,
})

export default function VaFundingFeePage() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH
  const feeRate = 0.0215
  const financedFee = Math.round(price * feeRate)
  const financedLoan = price + financedFee

  return (
    <ArticleShell
      meta={{
        path,
        title: "VA Funding Fee: Finance vs Pay Cash",
        description:
          "Worked examples of financing the VA funding fee versus paying it in cash. Snapshot percents, exemptions, and cash to close — not advice.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Financing the fee raises the loan. Paying cash raises cash to close. Run both.",
        faqs,
        keywords: ["VA funding fee", "finance VA funding fee"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Most VA purchases include a funding fee unless an exemption applies. You can often finance it into the loan or
        pay it in cash at closing. That is a cash-to-close versus loan-size tradeoff, not a trick to erase the fee.{" "}
        {EXAMPLE_NOTE} Snapshot as of {LENDING_FACTS_AS_OF} ({VA_FUNDING_FEE.source}).
      </p>

      <h2>Snapshot percents (confirm before anyone quotes)</h2>
      <ul>
        <li>First use, less than 5% down: {VA_FUNDING_FEE.firstUseLessThan5PercentDown}</li>
        <li>Subsequent use, less than 5% down: {VA_FUNDING_FEE.subsequentUseLessThan5PercentDown}</li>
        <li>First use, 5% to less than 10% down: {VA_FUNDING_FEE.firstUse5ToLessThan10PercentDown}</li>
        <li>First use, 10% or more down: {VA_FUNDING_FEE.firstUse10PercentOrMoreDown}</li>
      </ul>
      <p>
        {VA_FUNDING_FEE.exemptionNote} {VA_FUNDING_FEE.downPaymentNote}
      </p>

      <h2>Illustration: finance vs cash on a ${price.toLocaleString("en-US")} purchase</h2>
      <p>
        Assume first-use, less than 5% down, at the {VA_FUNDING_FEE.firstUseLessThan5PercentDown} snapshot, zero down,
        and that the schedule still applies. Fee ≈ ${financedFee.toLocaleString("en-US")}.
      </p>
      <ul>
        <li>
          <strong>Finance the fee.</strong> Loan amount ≈ ${financedLoan.toLocaleString("en-US")}. Monthly principal
          and interest is calculated on the higher balance. Cash to close is mostly closing costs and prepaids.
        </li>
        <li>
          <strong>Pay the fee in cash.</strong> Loan stays ≈ ${price.toLocaleString("en-US")}. Cash to close rises by
          about the fee plus the same costs and prepaids.
        </li>
      </ul>
      <p>
        Compare those two shapes on a Loan Estimate, not this paragraph. Use the{" "}
        <Link href="/calculators/mortgage-payment">payment calculator</Link> only as an illustration.
      </p>

      <h2>What happens next</h2>
      <p>
        Confirm exemption status and the current VA schedule. Then read{" "}
        <Link href="/blog/va-entitlement-second-va-loan">remaining entitlement</Link> if you already have a VA loan, and{" "}
        <Link href="/loans/va">the VA program page</Link> for occupancy and COE.
      </p>
    </ArticleShell>
  )
}
