import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, LOCK_IF_RATES_DROP, LOCK_VS_FLOAT } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/rate-lock-if-rates-drop"

const faqs = [
  {
    question: "If I already locked and rates drop, do I automatically get the lower rate?",
    answer: LOCK_IF_RATES_DROP.notAutomatic,
  },
  {
    question: "Is a float-down the same as extending a lock that is about to expire?",
    answer: LOCK_IF_RATES_DROP.vsExtension,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "locked", heading: "You are locked", href: "/blog/rate-lock-extension-vs-floating" },
  { id: "drop", heading: "Market drops", href: "/buy/rates" },
  { id: "file", heading: "File still moves" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What happens",
    cells: {
      locked: LOCK_VS_FLOAT.lock,
      drop: LOCK_IF_RATES_DROP.floatDown,
      file: LOCK_IF_RATES_DROP.stillReprices,
    },
  },
  {
    id: "ask",
    criterion: "What to ask in writing",
    cells: {
      locked: "Lock period, note rate, points or credits, and whether a float-down exists at all.",
      drop: "One-time or not, minimum drop, fee or worse credit, and whether the product must stay the same.",
      file: "Whether a new credit pull, LTV, or occupancy change reprices even if a float-down is granted.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "What a Lock Does If Rates Drop After You Lock",
  description:
    "A lock does not automatically follow the market down. Float-down is a written lock-desk policy, distinct from extension vs floating. Not a live-rate table.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["mortgage lock rates drop", "float down after lock", "locked and rates fell"],
  faqs,
})

export default function LockIfRatesDropPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "What a Lock Does If Rates Drop After You Lock",
        description:
          "A lock does not automatically follow the market down. Float-down is a written lock-desk policy. Not a live-rate table.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "You locked a window. The headline average can still fall. That is not automatically yours.",
        faqs,
        keywords: ["float down mortgage lock", "rates dropped after lock"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you already locked and the 30-year average on the news falls, you do not automatically get the lower rate.
        A lock holds the quoted rate and points for the window on your confirmation. A float-down, if it exists, is a
        written lock-desk policy — not a blog right. This page does not publish current rates. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{LOCK_IF_RATES_DROP.notARate}</p>

      <h2>Locked, then the headline moves</h2>
      <ComparisonTable
        caption={`If rates fall after a lock, as of ${LENDING_FACTS_AS_OF}. Confirm the lock confirmation on your file.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Not a lock, not a quote, and not advice to wait for a drop."
      />
      <p>{LOCK_IF_RATES_DROP.floatDown}</p>

      <h2>Not the same as extension vs floating</h2>
      <p>
        {LOCK_IF_RATES_DROP.vsExtension} The companion page is{" "}
        <Link href="/blog/rate-lock-extension-vs-floating">lock extension vs floating</Link> — that file is about whether
        to lock, float, or pay to extend when the window is running out. This page is the borrower question after you
        already locked: the market improved, now what?
      </p>
      <p>
        Why neither number is the TV average: <Link href="/buy/rates">why your quote is not the 30-year average</Link>
        . How to read the LE next to a lock:{" "}
        <Link href="/blog/apr-vs-rate-on-a-loan-estimate">APR vs rate on a Loan Estimate</Link>.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>Your lock confirmation is silent on float-down.</strong> Assume you keep the locked rate unless the
          lock desk writes something else. Asking is the next step, not a news screenshot.
        </li>
        <li>
          <strong>There is a one-time float-down with a minimum drop.</strong> A small move may not qualify. A rewrite
          can still change points or credits. {LOCK_IF_RATES_DROP.notARate}
        </li>
        <li>
          <strong>You also changed the file.</strong> {LOCK_IF_RATES_DROP.stillReprices} A new auto loan or a lower
          appraised value is a different conversation from a market drop.
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Publish this week’s rates, a basis-point trigger, or a float-down fee.</li>
        <li>Tell you to float because “rates always drop.”</li>
        <li>Treat a lock as a commitment to lend or as clear to close.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the lock confirmation. If float-down is not written there, it is not yours by default.</li>
        <li>
          Hold lock period constant when you compare LEs. Points and credits:{" "}
          <Link href="/blog/discount-points-breakeven-without-sales-pitch">discount points breakeven</Link>.
        </li>
        <li>
          Illustration only: <Link href="/calculators/mortgage-payment">payment calculator</Link>. A typed rate there is
          not a lock and not a float-down.
        </li>
      </ol>
    </ArticleShell>
  )
}
