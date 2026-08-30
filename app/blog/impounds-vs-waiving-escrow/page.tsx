import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  ESCROW_CUSHION,
  ESCROW_SHORTAGE,
  ESCROW_WAIVER,
  LENDING_FACTS_AS_OF,
  UTAH_TAX_CALENDAR,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/impounds-vs-waiving-escrow"

const faqs = [
  {
    question: "Can I waive escrow if I put 20% down?",
    answer: ESCROW_WAIVER.waiver,
  },
  {
    question: "Do FHA and VA loans let me skip impounds?",
    answer: ESCROW_WAIVER.government,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "impound", heading: "Impounds on", href: "/faq/escrow-faqs" },
  { id: "waive", heading: "Waiver (when it exists)" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      impound: ESCROW_WAIVER.impounds,
      waive: ESCROW_WAIVER.waiver,
    },
  },
  {
    id: "cash",
    criterion: "Cash vs monthly",
    cells: {
      impound: ESCROW_WAIVER.tradeoff,
      waive: "You keep the tax and insurance cash until the bills are due. Utah taxes are typically due November 30.",
    },
  },
  {
    id: "after",
    criterion: "After the first year",
    cells: {
      impound: ESCROW_SHORTAGE.howItAppears,
      waive: "No annual escrow analysis — you still owe the treasurer and the carrier on their calendars.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Impounds vs Waiving Escrow",
  description:
    "When an escrow waiver exists, it is an overlay — not a promise at 20% down. Cash-to-close vs monthly tradeoff. Links cushion and shortage. Informational only.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["impounds vs waiving escrow", "escrow waiver 20 percent", "mortgage impound account"],
  faqs,
})

export default function ImpoundsVsWaivingEscrowPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Impounds vs Waiving Escrow",
        description:
          "Waiver is an overlay, not a right. Cash-to-close versus monthly draft. Not a promise you can waive.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Twenty percent down is a common conversation, not a federal waiver switch.",
        faqs,
        keywords: ["waive escrow", "impound account mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Impounds versus waiving escrow is a cash-flow overlay: keeping an impound account spreads taxes and insurance
        into the monthly draft; a waiver, when it exists, leaves those bills on you. It is not a promise that 20% down
        turns escrow off. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ESCROW_WAIVER.notAPromise}</p>

      <h2>Impounds on vs waiver</h2>
      <ComparisonTable
        caption={`Impounds vs waiver as of ${LENDING_FACTS_AS_OF}. Overlay, not a statute.`}
        columns={columns}
        rows={rows}
        footnote="FHA, VA, and USDA commonly require escrow. Conventional waiver tests are investor-specific."
      />
      <p>{ESCROW_WAIVER.government}</p>

      <h2>Cash to close and the cushion</h2>
      <p>
        At origination, an impounded loan often collects months of taxes and insurance plus an allowed cushion.{" "}
        {ESCROW_CUSHION.maxCushion}{" "}
        <Link href="/blog/escrow-cushion-how-it-is-set">How the cushion is set</Link>.
      </p>
      <p>
        {UTAH_TAX_CALENDAR.dueDate}{" "}
        <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">
          Utah tax calendar vs first escrow analysis
        </Link>
        .
      </p>

      <h2>Shortage is not the waiver question</h2>
      <p>
        {ESCROW_SHORTAGE.vsCushion} After the first year:{" "}
        <Link href="/blog/escrow-shortage-after-first-year">escrow shortage after the first year</Link>. A shortage
        letter is not a new loan and not a reason this page can tell you to waive escrow.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>Conventional, lower LTV, you want a lower monthly draft</strong> — ask whether a waiver exists on
          that investor, and what it costs in price or fee. Not automatic.
        </li>
        <li>
          <strong>FHA, VA, or USDA</strong> — plan on impounds. {ESCROW_WAIVER.government}
        </li>
        <li>
          <strong>You waive and then miss a November tax bill</strong> — that is a treasurer and possible lien problem,
          not an escrow analysis. Not tax advice.
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Promise you can waive escrow at any LTV.</li>
        <li>Quote a waiver fee or a pricing adjustment.</li>
        <li>Tell you which option is cheaper on your file.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the Loan Estimate for whether escrow is required and whether a waiver fee appears.</li>
        <li>
          Related: <Link href="/faq/escrow-faqs">escrow FAQs</Link>. First statement vs note:{" "}
          <Link href="/blog/first-mortgage-statement-vs-note-rate">first statement vs note rate</Link>.
        </li>
        <li>
          Closing costs:{" "}
          <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah title, origination, prepaids</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
