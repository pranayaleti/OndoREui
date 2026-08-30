import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LARGE_DEPOSITS, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/large-deposits-60-day-paper-trail"

const faqs = [
  {
    question: "How many days of bank statements do underwriters usually want?",
    answer: LARGE_DEPOSITS.window,
  },
  {
    question: "Can I deposit cash from family and explain it later?",
    answer: LARGE_DEPOSITS.cash,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "ok", heading: "Often acceptable when documented", href: "/blog/gift-funds-down-payment-rules" },
  { id: "stall", heading: "Often a stall", href: "/blog/declined-after-pre-approval" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "payroll",
    criterion: "Payroll or known recurring deposits",
    cells: {
      ok: "Matches paystubs or 1099 deposits already in the income file.",
      stall: "A one-off ‘bonus’ that does not match the employer or the return.",
    },
  },
  {
    id: "gift",
    criterion: "Gift from an eligible donor",
    cells: {
      ok: "Gift letter, donor statements, and evidence the funds moved — before or as they hit your account.",
      stall: "Cash in an envelope, then a letter written after the underwriter asks.",
    },
  },
  {
    id: "sale",
    criterion: "Sale of an asset",
    cells: {
      ok: "Bill of sale, proof you owned it, and the deposit matching the proceeds.",
      stall: "A large wire with no paper on what was sold.",
    },
  },
  {
    id: "transfer",
    criterion: "Transfer between your own accounts",
    cells: {
      ok: "Statements on both accounts showing the same money moved. Seasoning still applies to the source account.",
      stall: "A new account opened last week and filled from an undocumented source.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Large Deposits: 60-Day Paper Trail",
  description:
    "About 60 days of statements, and large deposits in that window have to be sourced. Cash from family without a gift letter is a common stall.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["large deposits mortgage underwriting", "60 day bank statements", "source of funds mortgage"],
  faqs,
})

export default function LargeDepositsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Large Deposits: 60-Day Paper Trail",
        description:
          "About 60 days of statements, and large deposits in that window have to be sourced. Cash from family without a gift letter is a common stall.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The statements are a movie, not a screenshot. Every large incoming line needs a source.",
        faqs,
        keywords: ["large deposit mortgage", "source of funds 60 days"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Underwriters typically read about 60 days of asset statements. A large deposit in that window has to be
        sourced — payroll, a documented gift, sale of an asset, or a transfer between your own accounts. Undocumented
        cash is one of the fastest ways a pre-approval fails later. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>What “large” usually means</h2>
      <p>{LARGE_DEPOSITS.window}</p>
      <p>{LARGE_DEPOSITS.conventionalThreshold}</p>
      <p>
        FHA, VA, and USDA have their own asset guides. Overlays can treat smaller deposits as large. If you are not
        sure, ask before the money moves.
      </p>

      <ComparisonTable
        caption={`Common large-deposit stories as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Earnest money already in escrow still has to trace back to a sourced account."
      />

      <h2>Do not create a mystery in the 60-day window</h2>
      <p>{LARGE_DEPOSITS.cash}</p>
      <p>
        Parent help belongs on a gift letter and donor trail —{" "}
        <Link href="/blog/parent-gifting-down-payment-who-signs">who signs what</Link> and{" "}
        <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link> — not a ATM deposit two weeks
        before closing. How income is verified is a different stack:{" "}
        <Link href="/blog/how-underwriters-verify-income">W-2 vs 1099 vs bank</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Leave accounts as they are unless a loan officer tells you how to source a coming deposit.</li>
        <li>Keep PDF statements with the bank’s name, not cropped mobile screenshots.</li>
        <li>
          If a condition already failed, read{" "}
          <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link> before you move more cash.
        </li>
      </ol>
    </ArticleShell>
  )
}
