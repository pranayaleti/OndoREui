import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, TRI_MERGE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/what-a-tri-merge-credit-report-shows"

const faqs = [
  {
    question: "Is my Credit Karma score the mortgage score?",
    answer: TRI_MERGE.models,
  },
  {
    question: "Which of the three scores does underwriting use?",
    answer: TRI_MERGE.middleScore,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "app", heading: "Consumer app / one bureau" },
  { id: "tri", heading: "Mortgage tri-merge" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      app: "Often one bureau and a newer FICO or VantageScore. Useful for monitoring. Not the file.",
      tri: TRI_MERGE.what,
    },
  },
  {
    id: "score",
    criterion: "Which number is used",
    cells: {
      app: "Whatever that app displays. It can be higher or lower than the mortgage middle score.",
      tri: TRI_MERGE.middleScore,
    },
  },
  {
    id: "model",
    criterion: "Typical model",
    cells: {
      app: "Often FICO 8/9/10 or VantageScore.",
      tri: TRI_MERGE.models,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "What a Tri-Merge Credit Report Actually Shows",
  description:
    "Equifax, Experian, and TransUnion together. Mortgage files often use classic FICO and the middle score. Not a consumer-app score.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["tri-merge credit report mortgage", "middle FICO score underwriting", "Equifax Experian TransUnion mortgage"],
  faqs,
})

export default function TriMergeCreditReportPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "What a Tri-Merge Credit Report Actually Shows",
        description:
          "Equifax, Experian, and TransUnion together. Mortgage files often use classic FICO and the middle score. Not a consumer-app score.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Three bureaus, classic mortgage scores, middle number. Not a monitoring-app screenshot.",
        faqs,
        keywords: ["tri-merge mortgage", "middle credit score"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A tri-merge is a credit report that pulls Equifax, Experian, and TransUnion together. Mortgage underwriting
        typically uses that combined file and, when three classic FICO scores are present, the middle score — not the
        average, not the highest, and not the number on a monitoring app. Snapshot as of {LENDING_FACTS_AS_OF}. This
        page does not promise that paying a collection will raise a score.
      </p>
      <p>{TRI_MERGE.fairHousing}</p>

      <h2>App score vs the file</h2>
      <ComparisonTable
        caption={`Consumer monitoring vs a mortgage tri-merge as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Confirm the report actually in the file."
      />

      <h2>What the pages of the report usually contain</h2>
      <p>{TRI_MERGE.shows}</p>
      <ul>
        <li>Tradelines: installment loans, revolving accounts, mortgages, authorized-user lines.</li>
        <li>Balances, credit limits, and payment history as each bureau reports them.</li>
        <li>Inquiries. A cluster of new auto or card inquiries during underwriting is a common re-pull surprise.</li>
        <li>Public records and collections — including medical collections, which have their own reporting snapshot.</li>
      </ul>
      <p>
        Medical collections after bureau reporting changes:{" "}
        <Link href="/blog/medical-collections-after-fico-model-change">medical collections after the FICO model change</Link>
        . Thin file with rent and utilities instead of cards:{" "}
        <Link href="/blog/no-traditional-credit-alternative-credit">alternative credit</Link>.
      </p>

      <h2>Why a letter can fail after a refresh</h2>
      <p>
        {TRI_MERGE.duringUw} That path is documented in{" "}
        <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link> and{" "}
        <Link href="/blog/new-auto-loan-during-underwriting">a new auto loan during underwriting</Link>. Pre-approval,
        AUS, and CTC are still three documents:{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">stages guide</Link>.
      </p>

      <h2>Checklist before you apply</h2>
      <ul>
        <li>Do not close a card or open a car loan “to build score” the week of application without asking.</li>
        <li>If two bureaus disagree on a collection, that disagreement can sit on the tri-merge. Bring the paper.</li>
        <li>A spouse’s credit is in the file when that person is a borrower — not as a hidden extra score.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Treat a monitoring-app screenshot as a hint, not the underwrite.</li>
        <li>Ask which scores and model the lender actually pulled.</li>
        <li>
          If the file is thin rather than weak, read alternative credit. If it is medical collections, read that dated
          snapshot. Neither is a Fair Housing steering path.
        </li>
      </ol>
    </ArticleShell>
  )
}
