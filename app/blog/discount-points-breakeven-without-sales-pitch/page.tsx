import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  DISCOUNT_POINTS,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/discount-points-breakeven-without-sales-pitch"
const loanAmount = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.8)
const onePoint = Math.round(loanAmount * 0.01)
const monthlySavingsIllustration = 28
const breakevenMonths = Math.ceil(onePoint / monthlySavingsIllustration)

const faqs = [
  {
    question: "What is a discount point?",
    answer: DISCOUNT_POINTS.definition,
  },
  {
    question: "How do I know if buying points is worth it?",
    answer: DISCOUNT_POINTS.breakeven,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "points", heading: "Discount points", href: "/buy/rates" },
  { id: "buydown", heading: "Temporary buydown", href: "/blog/temporary-buydown-who-pays-year-three" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it changes",
    cells: {
      points: DISCOUNT_POINTS.definition,
      buydown: "A subsidy of the monthly payment for a stated period. The note rate is still the note rate.",
    },
  },
  {
    id: "when",
    criterion: "When the benefit ends",
    cells: {
      points: "When you refinance, sell, or the loan is paid off. Not on a calendar year-3 cliff.",
      buydown: "When the subsidy period ends (year 3 on a 2-1; year 4 on a 3-2-1). Then you pay the full note payment.",
    },
  },
  {
    id: "math",
    criterion: "How to compare",
    cells: {
      points: DISCOUNT_POINTS.breakeven,
      buydown: "Cost of the subsidy vs years of lower payment. Model it; do not assume it is “free from the builder.”",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Discount Points: Breakeven Without a Sales Pitch",
  description:
    "One point is typically 1% of the loan to lower the note. Break-even is cost divided by monthly P&I savings — not a temporary buydown.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["discount points breakeven", "should I buy mortgage points", "mortgage points vs buydown"],
  faqs,
})

export default function DiscountPointsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Discount Points: Breakeven Without a Sales Pitch",
        description:
          "One point is typically 1% of the loan to lower the note. Break-even is cost divided by monthly P&I savings — not a temporary buydown.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Points are prepaid interest. They are not a coupon for approval.",
        faqs,
        keywords: ["discount points", "mortgage points breakeven"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Discount points are optional prepaid interest: typically 1% of the loan amount per point, paid at closing to
        lower the note rate for the life of that loan. Whether that purchase pays off is a calendar question — months
        until the extra cash at closing is earned back in principal-and-interest savings — not a sales pitch about a
        headline rate. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{DISCOUNT_POINTS.notBestRate}</p>
      <p>{DISCOUNT_POINTS.notTempBuydown}</p>

      <h2>A worked break-even (illustration only)</h2>
      <p>{EXAMPLE_NOTE}</p>
      <p>
        On an 80% loan of ${loanAmount.toLocaleString("en-US")} against a ${EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")}{" "}
        illustration price, one point costs ${onePoint.toLocaleString("en-US")}. If monthly principal and interest were
        ${monthlySavingsIllustration} lower than the same loan with zero points (a typed illustration, not a quote),
        break-even is about {breakevenMonths} months. If you sell or refinance in year two, the points can lose. If you
        keep the loan twelve years, they can look cheap. The Loan Estimate has to show both files with the same lock
        period.
      </p>
      <p>{DISCOUNT_POINTS.breakeven}</p>
      <p>
        Put points in the cost box of the <Link href="/calculators/refinance">refinance calculator</Link> the same way —
        a lower note still loses after costs. Purchase pricing lives on{" "}
        <Link href="/buy/rates">why your quote is not the 30-year average</Link>.
      </p>

      <ComparisonTable
        caption={`Points vs a temporary buydown as of ${LENDING_FACTS_AS_OF}. Not a recommendation to buy either.`}
        columns={columns}
        rows={rows}
        footnote="Lender credits that raise the rate are the opposite trade of buying points. Compare cash to close and APR on the same LE."
      />

      <h2>What happens next</h2>
      <ol>
        <li>Ask for two Loan Estimates: zero points vs the point structure they are selling, same lock window.</li>
        <li>
          Divide point cost by monthly P&amp;I savings. If your expected hold period is shorter, skip the points or
          take a credit instead.
        </li>
        <li>
          If a builder is offering a 2-1 instead, that is{" "}
          <Link href="/blog/temporary-buydown-who-pays-year-three">temporary buydown: who pays, year 3</Link> — model
          it on the <Link href="/calculators/temporary-buydown">buydown calculator</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
