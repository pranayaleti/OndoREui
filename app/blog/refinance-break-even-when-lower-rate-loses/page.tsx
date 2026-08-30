import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { BreakEvenTable } from "@/components/content/break-even-table"
import { EXAMPLE_NOTE, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/refinance-break-even-when-lower-rate-loses"

const faqs = [
  {
    question: "Is break-even just closing costs divided by the new payment?",
    answer:
      "Use monthly principal-and-interest savings, and put points, origination, title, and prepaid interest in the cost side. A lender credit reduces costs. Ignoring points understates the months to earn the refinance back.",
  },
  {
    question: "If I might move in two years, does a lower rate still help?",
    answer:
      "Only if break-even is shorter than you will keep the loan. A lower rate that takes 36 months to earn back loses if you sell in month 18.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "When a Lower Rate Still Loses After Costs",
  description:
    "Break-even months include points and origination, not just the appraisal. A lower note rate can still lose if you move first.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["refinance break even", "refinance closing costs points origination"],
  faqs,
})

export default function RefiBreakevenPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "When a Lower Rate Still Loses After Costs",
        description:
          "Break-even months include points and origination, not just the appraisal. A lower note rate can still lose if you move first.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "A lower note rate is not a savings until costs are earned back.",
        faqs,
        keywords: ["refinance break-even months", "refinance points origination"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A lower interest rate still loses if closing costs (including discount points and origination) take longer to
        earn back than you will keep the loan. {EXAMPLE_NOTE} Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The reusable table</h2>
      <p>
        Break-even months ≈ cash costs ÷ monthly P&amp;I savings. Same table on the refinance hub, the recast
        comparison, and the refinance calculator.
      </p>
      <BreakEvenTable table="stay-scenarios" />
      <ul>
        <li>
          <strong>Numerator.</strong> Appraisal, title, recording, prepaid interest, origination, and discount points.
          Subtract lender credits.
        </li>
        <li>
          <strong>Denominator.</strong> Old P&amp;I minus new P&amp;I. Do not treat a tax-and-insurance change as
          “savings.”
        </li>
      </ul>
      <p>
        Illustration: $6,000 in costs (including one point) and $150 less P&amp;I is 40 months — the middle column.
        Taxes, opportunity cost of cash, and a shorter remaining term can change the story — that is a loan-officer
        model, not this paragraph. Recast instead of refinancing:{" "}
        <Link href="/blog/recast-vs-refinance">recast vs refinance</Link>.
      </p>

      <h2>When people still refinance anyway</h2>
      <ul>
        <li>Removing a risky ARM reset, even if break-even is long.</li>
        <li>Changing term (for example, 30 to 15) for a payoff goal, not a payment cut.</li>
        <li>Cash-out needs — then compare a <Link href="/blog/heloc-vs-cash-out-refinance">HELOC</Link> instead of
          assuming cash-out is cheaper.</li>
      </ul>

      <h2>What happens next</h2>
      <p>
        Put points and origination into the{" "}
        <Link href="/calculators/refinance">refinance calculator</Link>, then compare two Loan Estimates. FHA-to-FHA or
        VA-to-VA with a shorter doc list is a different product:{" "}
        <Link href="/blog/fha-va-streamline-refinance-less-docs">streamline refinance</Link>. Program hub:{" "}
        <Link href="/refinance">refinance</Link>. Why the news average is not your quote:{" "}
        <Link href="/buy/rates">rates hub</Link>.
      </p>
    </ArticleShell>
  )
}
