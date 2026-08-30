import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { DEPRECIATION_ADD_BACK, LENDING_FACTS_AS_OF, SCHEDULE_E_RENTAL } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/depreciation-add-back-schedule-e"

const faqs = [
  {
    question: "Does every agency file add depreciation back?",
    answer: DEPRECIATION_ADD_BACK.what,
  },
  {
    question: "Is an add-back extra cash I can spend?",
    answer:
      "No. It is a qualifying worksheet adjustment on tax-return rental income. It does not put depreciation back into your checking account.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "agency", heading: "Agency Schedule E", href: "/blog/schedule-e-rental-income-purchase-file" },
  { id: "k1", heading: "K-1 rental", href: "/blog/k-1-income-what-usually-counts" },
  { id: "dscr", heading: "DSCR", href: "/blog/dscr-vs-full-doc-rental-loan" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "engine",
    criterion: "What typically qualifies",
    cells: {
      agency: SCHEDULE_E_RENTAL.method,
      k1: "Entity K-1 lines and matching returns — not a personal Schedule E add-back you can copy across.",
      dscr: "Rent versus the proposed payment. Depreciation on your 1040 is not the DSCR engine.",
    },
  },
  {
    id: "dep",
    criterion: "Depreciation treatment",
    cells: {
      agency: DEPRECIATION_ADD_BACK.typicalAdds,
      k1: "Partnership and S-corp depreciation sits on the entity return. It is not automatically the same add-back as personal Schedule E.",
      dscr: "Not used as qualifying income. Property cash flow is the test.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Depreciation Add-Back: What Agency Files Allow",
  description:
    "How underwriters add depreciation back on Schedule E for rental qualifying. Distinct from the Schedule E overview. Not tax advice.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["depreciation add back mortgage", "Schedule E depreciation qualifying", "rental income add back"],
  faqs,
})

export default function DepreciationAddBackPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Depreciation Add-Back: What Agency Files Allow",
        description:
          "How underwriters add depreciation back on Schedule E for rental qualifying. Distinct from the Schedule E overview. Not tax advice.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "An add-back is a worksheet, not cash and not tax advice.",
        faqs,
        keywords: ["depreciation add-back", "Schedule E mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        On many agency purchase and refinance files, depreciation on Schedule E is added back when the underwriter
        calculates net rental income. That is a qualifying worksheet, not extra cash, and not the same as how you report
        income to the IRS. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{DEPRECIATION_ADD_BACK.notTaxAdvice}</p>
      <p>
        Parent guide:{" "}
        <Link href="/blog/schedule-e-rental-income-purchase-file">rental income on Schedule E in a purchase file</Link>{" "}
        — history on properties you already own versus proposed rent.
      </p>

      <h2>What usually gets added back</h2>
      <p>{DEPRECIATION_ADD_BACK.what}</p>
      <p>{DEPRECIATION_ADD_BACK.typicalAdds}</p>
      <p>{DEPRECIATION_ADD_BACK.notAlways}</p>

      <h2>Three rental stacks (do not mix the worksheets)</h2>
      <ComparisonTable
        caption={`Schedule E add-back vs K-1 vs DSCR as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the selling guide in force. Overlays differ."
      />
      <p>
        K-1 income is a different form: <Link href="/blog/k-1-income-what-usually-counts">what usually counts on a K-1</Link>.
        Property-qualifies versus borrower-qualifies:{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link>.
      </p>

      <h2>Checklist the file still needs</h2>
      <ul>
        <li>Personal returns and transcripts that include the Schedule E pages.</li>
        <li>{SCHEDULE_E_RENTAL.history}</li>
        <li>PITI, HOA, and mortgages on those rentals still sit in the file unless the worksheet nets them per the guide.</li>
        <li>Proposed rent on a house you do not own yet is not this add-back. {SCHEDULE_E_RENTAL.subjectProperty}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>If you already own rentals, bring the Schedule E pages — not a depreciation summary slide.</li>
        <li>
          Occupancy on the house in this purchase still has to match use:{" "}
          <Link href="/blog/first-rental-occupancy-if-you-still-live-there">first rental occupancy</Link>.
        </li>
        <li>
          Ask a loan officer which worksheet the product uses. A blog add-back list is not your qualifying income.
        </li>
      </ol>
    </ArticleShell>
  )
}
