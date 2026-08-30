import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, NO_CLOSING_COST_REFI, STREAMLINE_REFI } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/no-closing-cost-refinance-rate-credit-tradeoff"

const faqs = [
  {
    question: "Is a no-closing-cost refinance actually free?",
    answer: NO_CLOSING_COST_REFI.tradeoff,
  },
  {
    question: "Is that the same as an FHA Streamline or VA IRRRL?",
    answer: NO_CLOSING_COST_REFI.vsStreamline,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "credit", heading: "Lender-credit / “no closing cost”" },
  { id: "pay", heading: "Pay costs, lower note", href: "/blog/refinance-break-even-when-lower-rate-loses" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "cash",
    criterion: "Cash at closing",
    cells: {
      credit: NO_CLOSING_COST_REFI.stillCash,
      pay: "You bring more cash (or roll costs into the loan). The note is typically lower than the credit file.",
    },
  },
  {
    id: "rate",
    criterion: "Note rate",
    cells: {
      credit: "Usually higher than the same file with fewer credits. The cost moved into the rate.",
      pay: "Usually lower. Points that buy the rate down still belong in the break-even numerator.",
    },
  },
  {
    id: "keep",
    criterion: "If you keep the loan a long time",
    cells: {
      credit: NO_CLOSING_COST_REFI.vsBreakEven,
      pay: "Break-even months ≈ cash costs ÷ monthly P&I savings. After that month, the lower note can win in this simple model.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "“No Closing Cost” Refinance: The Cost Is in the Rate",
  description:
    "A lender credit that covers fees is usually paid for with a higher note rate. Run break-even. Not a free refinance.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["no closing cost refinance", "lender credit vs rate", "refinance lender credit tradeoff"],
  faqs,
})

export default function NoClosingCostRefiPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "“No Closing Cost” Refinance: The Cost Is in the Rate",
        description:
          "A lender credit that covers fees is usually paid for with a higher note rate. Run break-even. Not a free refinance.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "If nobody writes a check at the table, the pricing sheet still did.",
        faqs,
        keywords: ["no closing cost refi", "lender credit refinance"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A “no closing cost” refinance usually means a lender credit covers most origination and many third-party fees.
        That credit is typically paid for with a higher note rate. The cost is in the rate, not gone. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}. This is not a recommendation to refinance.
      </p>
      <p>{NO_CLOSING_COST_REFI.tradeoff}</p>

      <h2>Credit file vs pay-costs file</h2>
      <ComparisonTable
        caption={`Same loan amount, two pricing choices as of ${LENDING_FACTS_AS_OF}. Not a quote.`}
        columns={columns}
        rows={rows}
        footnote="Compare two Loan Estimates with the same lock period. Neither is “the best rate.”"
      />

      <h2>What can still show as cash</h2>
      <p>{NO_CLOSING_COST_REFI.stillCash} Prepaids are not a marketing slogan.</p>

      <h2>Run break-even anyway</h2>
      <p>
        {NO_CLOSING_COST_REFI.vsBreakEven} The reusable math lives on{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">when a lower rate still loses after costs</Link>.
        Put the higher payment of the credit file in the comparison, not only “$0 due at closing.”
      </p>
      <p>
        Discount points are the other direction — you pay more cash for a lower note:{" "}
        <Link href="/blog/discount-points-breakeven-without-sales-pitch">points without a sales pitch</Link>.
      </p>

      <h2>Not the same as a streamline</h2>
      <p>
        {NO_CLOSING_COST_REFI.vsStreamline} {STREAMLINE_REFI.stillRequires} Guide:{" "}
        <Link href="/blog/fha-va-streamline-refinance-less-docs">FHA Streamline and VA IRRRL</Link>.
      </p>

      <h2>Illustration (not your quote)</h2>
      <p>
        Suppose two otherwise similar rate-and-term files: one uses a credit so cash to close is near zero and the note
        is higher; one has $4,000 in costs and a lower note that saves $40 of principal and interest per month. The
        pay-costs file’s simple break-even is 100 months. If you expect to move in year three, the credit file can win
        in this toy model. If you keep the loan twelve years, the higher rate can cost more than the $4,000. Taxes,
        remaining term, and a later refinance change the story — that is a loan-officer model, not this paragraph.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Ask for two Loan Estimates: credit vs paying costs, same lock period. Read note rate, APR, and cash to close
          together.
        </li>
        <li>
          Put both into the <Link href="/calculators/refinance">refinance calculator</Link> with points and origination
          in the cost box.
        </li>
        <li>
          Hub: <Link href="/refinance">refinance in Utah</Link>. Rate-and-term vs cash-out is a different fork.
        </li>
      </ol>
    </ArticleShell>
  )
}
