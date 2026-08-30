import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ESCROW_CUSHION, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/escrow-cushion-how-it-is-set"

const faqs = [
  {
    question: "Is the two-month cushion required on every loan?",
    answer: ESCROW_CUSHION.maxCushion,
  },
  {
    question: "Is a shortage the same as the cushion?",
    answer: ESCROW_CUSHION.shortageVsCushion,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "cushion", heading: "Cushion", href: "/faq/escrow-faqs" },
  { id: "shortage", heading: "Shortage / surplus", href: "/blog/utah-property-tax-calendar-first-escrow-analysis" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      cushion: ESCROW_CUSHION.maxCushion,
      shortage: ESCROW_CUSHION.shortageVsCushion,
    },
  },
  {
    id: "why",
    criterion: "Why it changes",
    cells: {
      cushion: ESCROW_CUSHION.whyItMoves,
      shortage: "A new tax bill or insurance premium, or the first year of actual disbursements versus the closing estimate.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Escrow: How the Cushion Is Set, Why It Changes",
  description:
    "RESPA aggregate analysis generally caps the cushion at about two months of disbursements. Servicers may require less. Not a universal formula.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["escrow cushion RESPA", "mortgage escrow analysis", "impound account cushion"],
  faqs,
})

export default function EscrowCushionPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Escrow: How the Cushion Is Set, Why It Changes",
        description:
          "RESPA aggregate analysis generally caps the cushion at about two months of disbursements. Servicers may require less. Not a universal formula.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "A federal ceiling, not a servicer slogan you can copy from a blog.",
        faqs,
        keywords: ["escrow cushion", "RESPA aggregate analysis"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Federal aggregate escrow rules generally let a servicer keep a cushion of no more than about two months of
        estimated tax and insurance disbursements. That is a ceiling, not a requirement that every servicer use two
        months, and it is not a universal formula for your next payment. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ESCROW_CUSHION.notUniversal}</p>

      <h2>What RESPA-ish education actually says</h2>
      <p>{ESCROW_CUSHION.maxCushion}</p>
      <p>
        The analysis looks at the next twelve months of bills, the monthly collection, and a cushion so the account is
        not empty the day a large bill hits. Servicers run this on an aggregate (whole-account) method under Regulation
        X. This page does not reprint the CFPB worksheet as if it were your statement.
      </p>

      <h2>Cushion vs shortage</h2>
      <ComparisonTable
        caption={`Cushion vs shortage as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Shortage options (spread vs lump sum) are on the servicing analysis notice."
      />
      <p>{ESCROW_CUSHION.whyItMoves}</p>

      <h2>Utah makes the first analysis noisier</h2>
      <p>
        Utah typically bills property tax once a year, due around November 30. Monthly collections plus a cushion still
        have to meet that single disbursement. Why the calendars clash:{" "}
        <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">
          Utah tax calendar vs first escrow analysis
        </Link>
        .
      </p>
      <p>
        Related questions: <Link href="/faq/escrow-faqs">escrow FAQs</Link>. Closing prepaids:{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Publish a servicer’s exact months of cushion as if every investor used it.</li>
        <li>Tell you to waive escrow, or that waiving is always allowed.</li>
        <li>Quote your next impound payment.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the initial escrow disclosure at closing and the first annual analysis — they are different documents.</li>
        <li>If there is a shortage, the notice lists spread versus lump-sum options. That is servicing, not a new loan. Sequel:{" "}
          <Link href="/blog/escrow-shortage-after-first-year">escrow shortage after the first year</Link>.</li>
        <li>Ask the servicer which cushion they used. Do not assume two months.</li>
      </ol>
    </ArticleShell>
  )
}
