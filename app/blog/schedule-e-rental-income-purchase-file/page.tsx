import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, SCHEDULE_E_RENTAL } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/schedule-e-rental-income-purchase-file"

const faqs = [
  {
    question: "Does depreciation on Schedule E get added back?",
    answer:
      "On many agency files, yes: depreciation and some other non-cash expenses are added back when the underwriter calculates rental income from Schedule E. That is a guide calculation, not a promise that every add-back will be allowed on your product.",
  },
  {
    question: "Can I count rent on a house I have not bought yet?",
    answer: SCHEDULE_E_RENTAL.subjectProperty,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "existing", heading: "Rentals you already own", href: "/learn/variable-income" },
  { id: "subject", heading: "The house in this purchase", href: "/calculators/dscr" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "source",
    criterion: "Where the number comes from",
    cells: {
      existing: "Schedule E history, often with depreciation added back, then averaged.",
      subject:
        "If you will occupy it, this is a housing payment, not rental income. If it will be a rental, proposed rent is a different, tighter calculation.",
    },
  },
  {
    id: "history",
    criterion: "History the file usually wants",
    cells: {
      existing: SCHEDULE_E_RENTAL.history,
      subject: "A lease plus market rent support — not a screenshot of a listing — and occupancy has to match the program.",
    },
  },
  {
    id: "debts",
    criterion: "What still counts as a debt",
    cells: {
      existing: "PITI, HOA, and the mortgage on each rental still sit in DTI unless the calculation nets them per the guide.",
      subject: "The new PITI is housing (front-end) if you will live there, or a rental obligation if you will not.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Rental Income on Schedule E in a Purchase File",
  description:
    "How existing rental income on Schedule E is averaged on a purchase, and why proposed rent is a different calculation.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["Schedule E rental income mortgage", "depreciation add back mortgage", "rental income purchase loan"],
  faqs,
})

export default function ScheduleERentalPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Rental Income on Schedule E in a Purchase File",
        description:
          "How existing rental income on Schedule E is averaged on a purchase, and why proposed rent is a different calculation.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Schedule E is history on properties you already own. Proposed rent is not that history.",
        faqs,
        keywords: ["Schedule E mortgage", "rental income qualifying"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you already own rentals, a purchase file usually starts from Schedule E — not from last month’s deposits
        or a “it will rent for” note on the house you are buying. {SCHEDULE_E_RENTAL.method} Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Two different calculations</h2>
      <p>{SCHEDULE_E_RENTAL.subjectProperty}</p>
      <ComparisonTable
        caption={`Schedule E vs proposed rent as of ${LENDING_FACTS_AS_OF}. Confirm the investor worksheet.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Occupancy and program rules change which column applies."
      />

      <h2>What the underwriter typically does with Schedule E</h2>
      <ul>
        <li>Take the rental income and expenses from the Schedule E for each property.</li>
        <li>Add back depreciation and other non-cash items the guide allows. Dedicated guide:{" "}
        <Link href="/blog/depreciation-add-back-schedule-e">depreciation add-back</Link>.</li>
        <li>Average the result, often across two years when both years are in the file.</li>
        <li>Net that against PITI and HOA, or count the full housing on that rental, depending on the worksheet.</li>
      </ul>
      <p>
        A one-year spike after a vacancy, a 1031 year, or a property that was personal use for part of the year can
        shrink the average. {SCHEDULE_E_RENTAL.history}
      </p>

      <h2>W-2 plus rentals</h2>
      <p>
        Many files are a W-2 (or 1099) primary job plus Schedule E on the side. The W-2 is still verified the usual
        way — see <Link href="/blog/how-underwriters-verify-income">income verification</Link>. The rentals do not
        replace a missing job history. If the rentals are in an entity, you may also have{" "}
        <Link href="/blog/k-1-income-what-usually-counts">K-1 income</Link> instead of, or in addition to, Schedule E.
      </p>
      <p>
        A DSCR or investor product that qualifies on the property’s rent is a different stack. The{" "}
        <Link href="/calculators/dscr">DSCR calculator</Link> is an illustration for that path, not a substitute for
        Schedule E on an agency purchase of your primary residence.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Bring two years of returns with every Schedule E, plus current leases and mortgage statements on those rentals.</li>
        <li>
          Use the <Link href="/calculators/income">income calculator</Link> with an average you can document.
        </li>
        <li>
          Tell the loan officer whether the new property is a home you will occupy or another rental — occupancy
          changes the worksheet.
        </li>
      </ol>
    </ArticleShell>
  )
}
