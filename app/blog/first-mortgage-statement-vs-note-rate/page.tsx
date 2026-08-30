import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  ESCROW_CUSHION,
  FIRST_STATEMENT_VS_NOTE,
  LENDING_FACTS_AS_OF,
  UTAH_TAX_CALENDAR,
  WEEK_AFTER_FUNDING,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/first-mortgage-statement-vs-note-rate"

const faqs = [
  {
    question: "Why is my first bill higher than the note-rate P&I I memorized?",
    answer: FIRST_STATEMENT_VS_NOTE.whyDifferent,
  },
  {
    question: "Did the lender change my rate?",
    answer: FIRST_STATEMENT_VS_NOTE.notARateChange,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "note", heading: "Note rate P&I" },
  { id: "statement", heading: "First statement total" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      note: "Principal and interest calculated from the note rate, loan amount, and term.",
      statement: FIRST_STATEMENT_VS_NOTE.whyDifferent,
    },
  },
  {
    id: "odd",
    criterion: "Odd days / first due date",
    cells: {
      note: FIRST_STATEMENT_VS_NOTE.oddDays,
      statement: WEEK_AFTER_FUNDING.firstPayment,
    },
  },
  {
    id: "escrow",
    criterion: "Escrow line",
    cells: {
      note: "Not in the note-rate P&I figure.",
      statement: FIRST_STATEMENT_VS_NOTE.escrow,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "First Mortgage Statement vs Note Rate",
  description:
    "The first bill is usually PITI plus odd-days timing — not a secret rate change. Escrow and prepaid interest explain most of the gap. Not tax advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["first mortgage statement vs note rate", "first mortgage bill higher", "odd days interest"],
  faqs,
})

export default function FirstStatementVsNoteRatePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "First Mortgage Statement vs Note Rate",
        description:
          "The first statement is usually PITI and odd-days timing, not a rate change. Not tax advice.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "If the P&I line matches the note, the extra is usually escrow — not a bait-and-switch rate.",
        faqs,
        keywords: ["first mortgage statement", "note rate vs payment"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        The first mortgage statement can look different from the note rate because the bill is usually PITI (principal,
        interest, taxes, and insurance) and because odd-days interest was already collected at closing — not because the
        lender quietly changed the rate. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{FIRST_STATEMENT_VS_NOTE.notAdvice}</p>

      <h2>Note rate vs the coupon you pay</h2>
      <ComparisonTable
        caption={`Note P&I vs first statement as of ${LENDING_FACTS_AS_OF}. Not your payment.`}
        columns={columns}
        rows={rows}
        footnote="Compare the P&I line on the statement to the note. Then look at escrow and mortgage insurance lines separately."
      />
      <p>{FIRST_STATEMENT_VS_NOTE.notARateChange}</p>

      <h2>Odd days at closing</h2>
      <p>{FIRST_STATEMENT_VS_NOTE.oddDays}</p>
      <p>
        Calendar after funding: <Link href="/blog/week-after-mortgage-funding">the week after funding</Link>.
      </p>

      <h2>Escrow is why the total is larger</h2>
      <p>{FIRST_STATEMENT_VS_NOTE.escrow}</p>
      <p>
        {UTAH_TAX_CALENDAR.escrowMismatch}{" "}
        <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">
          Utah tax calendar vs first escrow analysis
        </Link>
        . Cushion: <Link href="/blog/escrow-cushion-how-it-is-set">how the cushion is set</Link>.{" "}
        {ESCROW_CUSHION.maxCushion}
      </p>
      <p>
        Waiving impounds is a different trade:{" "}
        <Link href="/blog/impounds-vs-waiving-escrow">impounds vs waiving escrow</Link>.
      </p>

      <h2>Scenario: “My rate was 6% but the bill is huge”</h2>
      <p>
        A 6% note on a given balance produces a P&amp;I figure. The statement adds escrow and, if applicable, PMI or MIP.
        If those lines explain the gap, the rate did not change. If the P&amp;I line itself is wrong, that is a servicing
        error to dispute with the note in hand — not a blog formula.
      </p>
      <p>
        APR vs note rate on the Loan Estimate is a different document:{" "}
        <Link href="/blog/apr-vs-rate-on-a-loan-estimate">APR vs rate on a Loan Estimate</Link>.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Quote your first payment or a rate.</li>
        <li>Tell you the servicer made a mistake without seeing the statement and the note.</li>
        <li>Give tax advice about deducting the escrow line.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Line up CD projected payments, note P&amp;I, and the statement’s P&amp;I vs escrow lines.</li>
        <li>
          After the first year, a shortage is a different letter:{" "}
          <Link href="/blog/escrow-shortage-after-first-year">escrow shortage after the first year</Link>.
        </li>
        <li>
          Questions: <Link href="/faq/escrow-faqs">escrow FAQs</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
