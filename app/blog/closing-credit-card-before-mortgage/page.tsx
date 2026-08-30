import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { CLOSING_CREDIT_CARD, LENDING_FACTS_AS_OF, TRI_MERGE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/closing-credit-card-before-mortgage"

const faqs = [
  {
    question: "Will closing a card raise my mortgage score?",
    answer: CLOSING_CREDIT_CARD.notARaise,
  },
  {
    question: "Does AUS care if I never use the card?",
    answer: CLOSING_CREDIT_CARD.aus,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "open", heading: "Leave open, pay down", href: "/blog/what-a-tri-merge-credit-report-shows" },
  { id: "close", heading: "Close the account" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "util",
    criterion: "Utilization",
    cells: {
      open: "Denominator (available credit) stays. Paying the balance can lower utilization.",
      close: CLOSING_CREDIT_CARD.utilization,
    },
  },
  {
    id: "age",
    criterion: "Age of accounts",
    cells: {
      open: "The tradeline can keep aging on the tri-merge.",
      close: CLOSING_CREDIT_CARD.age,
    },
  },
  {
    id: "file",
    criterion: "During a mortgage file",
    cells: {
      open: TRI_MERGE.duringUw,
      close: CLOSING_CREDIT_CARD.duringFile,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Closing a Credit Card Before You Apply",
  description:
    "Closing a card can raise utilization by shrinking available credit. AUS reads the tri-merge. Not a score-raise method.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["closing credit card before mortgage", "credit utilization AUS", "available credit mortgage"],
  faqs,
})

export default function ClosingCreditCardPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Closing a Credit Card Before You Apply",
        description:
          "Closing a card can raise utilization by shrinking available credit. AUS reads the tri-merge. Not a score-raise method.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Available credit is the denominator. Closing the card shrinks it.",
        faqs,
        keywords: ["close credit card mortgage application", "revolving utilization"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Closing a credit card before you apply can raise revolving utilization even if the balance does not change,
        because available credit is the denominator. Mortgage AUS reads a tri-merge, not a consumer-app tip about
        “cutting up cards.” This page does not quote a score change. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{CLOSING_CREDIT_CARD.notARaise}</p>
      <p>{CLOSING_CREDIT_CARD.fairHousing}</p>

      <h2>Utilization vs available credit</h2>
      <ComparisonTable
        caption={`Pay down vs close, as of ${LENDING_FACTS_AS_OF}. Not a score-raise method.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Overlays and classic FICO models still apply."
      />
      <p>{CLOSING_CREDIT_CARD.utilization}</p>
      <p>
        What the report actually shows: <Link href="/blog/what-a-tri-merge-credit-report-shows">tri-merge</Link>.{" "}
        {TRI_MERGE.middleScore}
      </p>

      <h2>AUS is not a monitoring app</h2>
      <p>{CLOSING_CREDIT_CARD.aus}</p>
      <p>
        New installment debt is a different stall:{" "}
        <Link href="/blog/new-auto-loan-during-underwriting">auto loan during underwriting</Link>. First-time file
        mistakes (including this one):{" "}
        <Link href="/blog/first-time-buyer-file-mistakes">file mistakes</Link>.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>You close a high-limit card you never use.</strong> Utilization can jump. Ask before you close it
          in the 60 days around application.
        </li>
        <li>
          <strong>You close the oldest card.</strong> {CLOSING_CREDIT_CARD.age}
        </li>
        <li>
          <strong>You close a card mid-underwrite.</strong> {CLOSING_CREDIT_CARD.duringFile}
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Say closing a card will raise or lower a score by a number of points.</li>
        <li>Advise you to keep high-limit revolving debt you cannot manage.</li>
        <li>Treat a credit-monitoring number as the mortgage middle score.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>If a card is about to close or you want it closed, ask the loan officer before the next credit refresh.</li>
        <li>
          Medical collections are a different bureau story:{" "}
          <Link href="/blog/medical-collections-after-fico-model-change">medical collections</Link>.
        </li>
        <li>
          Conversation: <Link href="/qualify">what we will ask</Link>. A conversation does not pull credit until you
          authorize it.
        </li>
      </ol>
    </ArticleShell>
  )
}
