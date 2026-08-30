import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { APR_VS_RATE, DISCOUNT_POINTS, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/apr-vs-rate-on-a-loan-estimate"

const faqs = [
  {
    question: "Is a lower APR always the cheaper loan?",
    answer: APR_VS_RATE.howToCompare,
  },
  {
    question: "Does this site publish today’s rates?",
    answer: APR_VS_RATE.notATable,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "rate", heading: "Interest rate (note rate)", href: "/buy/rates" },
  { id: "apr", heading: "APR", href: "/buy/rates" },
  { id: "pay", heading: "Monthly payment", href: "/calculators/mortgage-payment" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it measures",
    cells: {
      rate: APR_VS_RATE.noteRate,
      apr: APR_VS_RATE.apr,
      pay: "Principal and interest from the note, plus taxes, insurance, HOA, and PMI/MIP when they apply. APR is not this number.",
    },
  },
  {
    id: "points",
    criterion: "Discount points",
    cells: {
      rate: "Points can lower the note. That cost is prepaid interest, not a fee that “gets you approved.”",
      apr: "Borrower-paid points are typically inside APR. A lower note with points can still show a higher APR than a no-point file.",
      pay: "P&I falls if the note falls. Cash to close rises by the point cost unless someone else pays it.",
    },
  },
  {
    id: "compare",
    criterion: "How to compare two lenders",
    cells: {
      rate: "Same lock period or you are not comparing the same product.",
      apr: "Read APR with cash to close. APR assumes you keep the loan for the full term.",
      pay: "Match occupancy, loan amount, and impounds. A payment screenshot without an LE is not a comparison.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "APR vs Rate on a Loan Estimate",
  description:
    "The note rate prices principal and interest. APR folds in most lender prepaid finance charges. Not a live-rate table.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["APR vs interest rate Loan Estimate", "how to compare Loan Estimates", "mortgage APR explained"],
  faqs,
})

export default function AprVsRatePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "APR vs Rate on a Loan Estimate",
        description:
          "The note rate prices principal and interest. APR folds in most lender prepaid finance charges. Not a live-rate table.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Page 1 of the LE shows both numbers for a reason. Neither one is a news average.",
        faqs,
        keywords: ["Loan Estimate APR", "note rate vs APR"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        On a Loan Estimate, the interest rate is the note rate used to calculate principal and interest. APR is a
        broader TILA cost measure that includes most lender prepaid finance charges. They answer different questions.
        Neither one is today’s headline 30-year average, and this page is not a live-rate table. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{APR_VS_RATE.notATable}</p>

      <h2>Three numbers people mix up</h2>
      <ComparisonTable
        caption={`Rate vs APR vs payment as of ${LENDING_FACTS_AS_OF}. Confirm the LE in front of you.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Title, recording, and many third-party fees often sit outside APR."
      />

      <h2>How to read two Loan Estimates</h2>
      <p>{APR_VS_RATE.howToCompare}</p>
      <p>
        Discount points are a separate math problem: {DISCOUNT_POINTS.breakeven} See{" "}
        <Link href="/blog/discount-points-breakeven-without-sales-pitch">discount points without a sales pitch</Link>.
        A temporary 2-1 buydown changes the payment for a few years, not the note —{" "}
        <Link href="/blog/temporary-buydown-who-pays-year-three">who pays, year 3</Link>. ARM caps limit the note, not
        the tax line: <Link href="/blog/arm-caps-in-plain-english">ARM caps in plain English</Link>.
      </p>

      <h2>The rates hub is the parent, not a table</h2>
      <p>
        Why a quote is not the 30-year average on the news lives on{" "}
        <Link href="/buy/rates">the rates hub</Link>. Use the{" "}
        <Link href="/calculators/mortgage-payment">payment calculator</Link> for an illustration. A typed rate there is
        not APR and is not a lock.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Hold loan amount, occupancy, property type, and lock period constant across lenders.</li>
        <li>Read note rate, APR, points, credits, and cash to close on the same page.</li>
        <li>Ask questions about a specific LE. A conversation still does not lock a rate from this article.</li>
      </ol>
    </ArticleShell>
  )
}
