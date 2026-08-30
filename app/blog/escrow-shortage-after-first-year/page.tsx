import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ESCROW_CUSHION, ESCROW_SHORTAGE, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/escrow-shortage-after-first-year"

const faqs = [
  {
    question: "Is an escrow shortage the same as the cushion?",
    answer: ESCROW_SHORTAGE.vsCushion,
  },
  {
    question: "Do I have to pay a shortage in a lump sum?",
    answer: ESCROW_SHORTAGE.options,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "shortage", heading: "Shortage", href: "/faq/escrow-faqs" },
  { id: "cushion", heading: "Cushion", href: "/blog/escrow-cushion-how-it-is-set" },
  { id: "surplus", heading: "Surplus" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      shortage: ESCROW_SHORTAGE.howItAppears,
      cushion: ESCROW_CUSHION.maxCushion,
      surplus: "The account collected more than the next 12 months of bills plus any allowed cushion. Surplus rules are on the same analysis notice.",
    },
  },
  {
    id: "next",
    criterion: "Typical next step",
    cells: {
      shortage: ESCROW_SHORTAGE.options,
      cushion: ESCROW_CUSHION.whyItMoves,
      surplus: "Often a refund or a credit against future escrow deposits, subject to the notice and federal surplus tests. Confirm the letter — not this page.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Escrow Shortage After the First Year",
  description:
    "How a shortage appears on the first annual analysis, and typical options to pay or spread. Sequel to the Utah tax calendar and cushion guides. Not tax advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["escrow shortage after first year", "impound shortage pay or spread", "annual escrow analysis"],
  faqs,
})

export default function EscrowShortagePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Escrow Shortage After the First Year",
        description:
          "How a shortage appears on the first annual analysis, and typical options to pay or spread. Not tax advice.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "The first annual analysis is a different document from the closing estimate.",
        faqs,
        keywords: ["escrow shortage", "mortgage impound shortage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        An escrow shortage after the first year means the servicer’s annual analysis says the account would not cover
        the next twelve months of tax and insurance bills plus any allowed cushion. It is not a new loan, not a
        penalty for buying, and not the same line as the cushion. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ESCROW_SHORTAGE.notAdvice}</p>

      <h2>How a shortage shows up</h2>
      <p>{ESCROW_SHORTAGE.howItAppears}</p>
      <p>
        Closing collected an estimate. The first analysis uses actual disbursements and a new projection. Why Utah’s
        once-a-year tax bill makes that first letter noisy:{" "}
        <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">
          Utah tax calendar vs first escrow analysis
        </Link>
        . How the cushion is capped:{" "}
        <Link href="/blog/escrow-cushion-how-it-is-set">how the escrow cushion is set</Link>.
      </p>

      <h2>Shortage vs cushion vs surplus</h2>
      <ComparisonTable
        caption={`Shortage, cushion, and surplus as of ${LENDING_FACTS_AS_OF}. Confirm the analysis notice.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Not a quote of your next impound payment."
      />
      <p>{ESCROW_SHORTAGE.vsCushion}</p>

      <h2>Pay now or spread</h2>
      <p>{ESCROW_SHORTAGE.options}</p>
      <ul>
        <li>
          <strong>Lump sum.</strong> You send the shortage now. Monthly escrow may still change because the projection
          for next year’s bills changed.
        </li>
        <li>
          <strong>Spread.</strong> The shortage is added to the next twelve escrow deposits. The monthly payment can
          rise even if your note rate did not.
        </li>
      </ul>
      <p>{ESCROW_SHORTAGE.utahNote}</p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Tell you which option is cheaper in dollars on your file.</li>
        <li>Advise you to waive escrow, protest the tax bill, or skip insurance.</li>
        <li>Quote a universal servicer formula. {ESCROW_CUSHION.notUniversal}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the annual escrow analysis notice — shortage, surplus, and new monthly collection are on that letter.</li>
        <li>
          Related questions: <Link href="/faq/escrow-faqs">escrow FAQs</Link>. Closing prepaids:{" "}
          <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>.
        </li>
        <li>Ask the servicer which cushion they used and which bills they projected. This page is not your next payment.</li>
      </ol>
    </ArticleShell>
  )
}
