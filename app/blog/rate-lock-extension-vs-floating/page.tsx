import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { APR_VS_RATE, LENDING_FACTS_AS_OF, LOCK_VS_FLOAT } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/rate-lock-extension-vs-floating"

const faqs = [
  {
    question: "If my lock expires before we close, do I automatically keep the same rate?",
    answer: LOCK_VS_FLOAT.extension,
  },
  {
    question: "If rates drop after I lock, do I get the lower rate?",
    answer: LOCK_VS_FLOAT.floatDown,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "lock", heading: "Lock" },
  { id: "float", heading: "Float" },
  { id: "extend", heading: "Extend" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      lock: LOCK_VS_FLOAT.lock,
      float: LOCK_VS_FLOAT.float,
      extend: LOCK_VS_FLOAT.extension,
    },
  },
  {
    id: "risk",
    criterion: "What can still move",
    cells: {
      lock: "File changes (score, LTV, occupancy, lock period) can still reprice. A lock is not CTC.",
      float: "The quoted rate can rise or fall until you lock. There is no published win for waiting.",
      extend: "Fee, worse pricing, or a relock at then-current market. This page does not quote a fee.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Rate Lock Extension vs Floating",
  description:
    "A lock holds a quoted rate for a window. Floating leaves it open. An extension is a cost if you miss the window. Not a live-rate table.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["mortgage rate lock extension", "float vs lock mortgage", "lock expiration before closing"],
  faqs,
})

export default function LockExtensionVsFloatingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Rate Lock Extension vs Floating",
        description:
          "A lock holds a quoted rate for a window. Floating leaves it open. An extension is a cost if you miss the window. Not a live-rate table.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "A lock is a window, not a promise that the market — or your file — cannot change.",
        faqs,
        keywords: ["rate lock vs float", "mortgage lock extension"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A rate lock holds a quoted rate and points for a stated number of days. Floating means you have not locked —
        the quote can move. If the lock expires before funding, an extension is usually a cost or a relock, not a free
        extra week. This page does not publish current rates. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{LOCK_VS_FLOAT.notARate}</p>

      <h2>Lock, float, extend</h2>
      <ComparisonTable
        caption={`Lock vs float vs extension as of ${LENDING_FACTS_AS_OF}. Confirm the lock-desk policy on your file.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Not a lock, not a quote, and not advice to float."
      />

      <h2>How this sits next to APR</h2>
      <p>
        Lock period is one of the things you have to hold constant when you compare lenders. {APR_VS_RATE.howToCompare}{" "}
        Deep guide: <Link href="/blog/apr-vs-rate-on-a-loan-estimate">APR vs rate on a Loan Estimate</Link>. Parent hub:{" "}
        <Link href="/buy/rates">why your quote is not the 30-year average</Link>.
      </p>
      <p>
        Discount points and lender credits change cash to close inside the same lock window:{" "}
        <Link href="/blog/discount-points-breakeven-without-sales-pitch">points breakeven</Link>. A temporary buydown
        changes the payment for a few years, not the lock itself:{" "}
        <Link href="/blog/temporary-buydown-who-pays-year-three">who pays, year 3</Link>.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>Closing is inside the lock.</strong> Stay on the conditions list. A new auto loan or a large deposit
          can still reprice the file even while the lock clock runs.
        </li>
        <li>
          <strong>Appraisal or title is late.</strong> Ask about extension cost before the lock expires. {LOCK_VS_FLOAT.extension}
        </li>
        <li>
          <strong>You are shopping two Loan Estimates.</strong> If one is locked 30 days and one is locked 60, you are
          not comparing the same product.
        </li>
      </ul>
      <p>{LOCK_VS_FLOAT.floatDown}</p>
      <p>
        If you already locked and the question is “rates dropped — now what?”, that is a different intent:{" "}
        <Link href="/blog/rate-lock-if-rates-drop">what a lock does if rates drop after you lock</Link>. This page stays
        lock vs float vs extension.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Match lock period across LEs. Read note rate, APR, points, and credits together.</li>
        <li>Ask what the extension policy is in writing before you treat a closing date as guaranteed.</li>
        <li>
          Illustration only: <Link href="/calculators/mortgage-payment">payment calculator</Link>. A typed rate there is
          not a lock.
        </li>
      </ol>
    </ArticleShell>
  )
}
