import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ESCROW_CUSHION, LENDING_FACTS_AS_OF, UTAH_CLOSING_NOTES, UTAH_TAX_CALENDAR } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/utah-property-tax-calendar-first-escrow-analysis"

const faqs = [
  {
    question: "When are Utah property taxes typically due?",
    answer: UTAH_TAX_CALENDAR.dueDate,
  },
  {
    question: "Why was my first escrow analysis higher than the Loan Estimate?",
    answer: UTAH_TAX_CALENDAR.escrowMismatch,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "county", heading: "County tax calendar", href: "/blog/utah-closing-costs-title-origination-prepaids" },
  { id: "escrow", heading: "Mortgage escrow year", href: "/blog/escrow-cushion-how-it-is-set" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "bill",
    criterion: "How often the bill hits",
    cells: {
      county: UTAH_TAX_CALENDAR.annualBill,
      escrow: "The servicer collects monthly, then disburses when the tax and insurance bills are due.",
    },
  },
  {
    id: "clock",
    criterion: "Whose calendar",
    cells: {
      county: UTAH_TAX_CALENDAR.dueDate,
      escrow: UTAH_TAX_CALENDAR.escrowMismatch,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Utah Property Tax Calendar vs Your First Escrow Analysis",
  description:
    "Utah taxes are typically due November 30, billed once a year. Why the first mortgage escrow analysis can surprise. Not tax advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: [
    "Utah property tax due date",
    "first escrow analysis Utah",
    "November 30 property tax Utah",
  ],
  faqs,
})

export default function UtahTaxCalendarEscrowPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Utah Property Tax Calendar vs Your First Escrow Analysis",
        description:
          "Utah taxes are typically due November 30, billed once a year. Why the first mortgage escrow analysis can surprise. Not tax advice.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "County tax year and mortgage escrow year are not the same clock.",
        faqs,
        keywords: ["Utah property tax calendar", "first escrow analysis"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Utah property taxes are typically due November 30 and billed once a year. Your mortgage escrow account collects
        monthly on a different clock, so the first analysis after closing can surprise you even when the Loan Estimate
        was honest. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{UTAH_TAX_CALENDAR.notAdvice}</p>
      <p>{UTAH_CLOSING_NOTES.taxCalendar}</p>

      <h2>The county calendar (unique to Utah practice)</h2>
      <p>{UTAH_TAX_CALENDAR.dueDate}</p>
      <p>{UTAH_TAX_CALENDAR.annualBill}</p>
      <ul>
        <li>Confirm the treasurer for the property county — Salt Lake, Utah, Davis, Weber, Washington, and Summit are not identical mail dates.</li>
        <li>Valuation notices (often mid-year) are not the tax bill you pay in November.</li>
        <li>A protest or exemption deadline is a treasurer/assessor process. This page does not calendar it for you.</li>
      </ul>

      <h2>Why the first escrow analysis can surprise</h2>
      <ComparisonTable
        caption={`County tax calendar vs escrow year as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Not a quote of your next impound payment."
      />
      <p>
        At closing, title and the lender collect an estimate of months until the next tax disbursement, plus a cushion.
        If you close in spring, a large November bill may still be coming. If you close in late fall, the next
        November may be a year away. Either way, the first annual analysis uses actual bills, not the closing
        projection. How that cushion is capped:{" "}
        <Link href="/blog/escrow-cushion-how-it-is-set">how the escrow cushion is set</Link>.
      </p>
      <p>
        Shortage options after an analysis are a servicing notice — spread versus lump sum — not origination pricing.
        Sequel: <Link href="/blog/escrow-shortage-after-first-year">escrow shortage after the first year</Link>. Related
        FAQ: <Link href="/faq/escrow-faqs">escrow FAQs</Link>.
      </p>

      <h2>Worked timing (illustration, not your file)</h2>
      <ul>
        <li>
          <strong>Close in March.</strong> Closing may collect several months toward November. The first analysis
          after a year of actual tax and insurance can still show a shortage if the new bill rose.
        </li>
        <li>
          <strong>Close in October.</strong> The November bill may be paid at or right after closing. The next full
          year of collections can look “high” monthly because the annual bill is concentrated in one disbursement.
        </li>
      </ul>
      <p>
        Title, origination, and prepaid ranges:{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>. Cash besides down
        payment: <Link href="/blog/utah-cash-to-close-besides-down-payment">cash to close</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Read the county treasurer site for the property — due date and notice schedule — not a national “semi-annual” assumption.</li>
        <li>Keep the first escrow analysis letter. Shortage and surplus options are on that notice.</li>
        <li>
          Ask a loan officer how prepaid taxes were estimated on your Loan Estimate. This page is not your next
          payment.
        </li>
      </ol>
    </ArticleShell>
  )
}
