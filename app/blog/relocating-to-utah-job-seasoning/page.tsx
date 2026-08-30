import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, RELOCATION_SEASONING, UTAH_CLOSING_NOTES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/relocating-to-utah-job-seasoning"

const faqs = [
  {
    question: "Can I close on a Utah house if my new job starts in 60 days?",
    answer: RELOCATION_SEASONING.question60Days,
  },
  {
    question: "Does an offer letter work if the new job is 1099?",
    answer: RELOCATION_SEASONING.not1099,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "w2", heading: "W-2 offer, start within the investor window", href: "/moving-to-utah" },
  { id: "other", heading: "New 1099, commission-only, or start date too far out", href: "/blog/just-went-1099-last-month" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "income",
    criterion: "What can count",
    cells: {
      w2: RELOCATION_SEASONING.fannieOption2,
      other: "Future self-employment or commission from a job that has not started is usually not this offer-letter path.",
    },
  },
  {
    id: "reserves",
    criterion: "Reserves when there is no paystub yet",
    cells: {
      w2: RELOCATION_SEASONING.reserves,
      other: "A missing average is the problem, not only reserves. See two-year vs one-year overlays.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Relocating to Utah: Income Seasoning When the Job Starts in 60 Days",
  description:
    "An offer letter can sometimes qualify a conventional purchase before the first paycheck. Sixty days is a common question, not a published 60-day rule.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["relocating to Utah mortgage", "job offer letter mortgage seasoning", "start date 60 days closing"],
  faqs,
})

export default function RelocatingUtahPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Relocating to Utah: Income Seasoning When the Job Starts in 60 Days",
        description:
          "An offer letter can sometimes qualify a conventional purchase before the first paycheck. Sixty days is not a published Fannie Mae rule.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "The REPC clock still runs. The first Utah paycheck does not have to hit before every closing.",
        faqs,
        keywords: ["Utah relocation mortgage", "employment offer letter Fannie Mae"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you are relocating to Utah and the new job starts in about 60 days, some conventional purchase files can use
        a fully executed, non-contingent offer letter as qualifying income — when the investor’s future-employment tests
        are met. Sixty days is a common borrower question. It is not a published “60-day rule.” Snapshot as of{" "}
        {LENDING_FACTS_AS_OF} ({RELOCATION_SEASONING.source}).
      </p>

      <h2>What Fannie Mae’s offer-letter path actually requires</h2>
      <p>{RELOCATION_SEASONING.question60Days}</p>
      <p>{RELOCATION_SEASONING.fannieOption2}</p>
      <p>{RELOCATION_SEASONING.reserves}</p>
      <ComparisonTable
        caption={`Future employment vs a new 1099 as of ${LENDING_FACTS_AS_OF}. Freddie, FHA, and VA overlays differ.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the selling guide in force. This is not a lock, approval, or a 60-day promise."
      />
      <p>{RELOCATION_SEASONING.not1099}</p>

      <h2>What is actually unique about Utah</h2>
      <p>{RELOCATION_SEASONING.utahNote}</p>
      <p>
        {UTAH_CLOSING_NOTES.closingVenue} {UTAH_CLOSING_NOTES.instrument} The purchase contract still has 5:00 p.m.
        Mountain Time deadlines even if payroll has not started —{" "}
        <Link href="/blog/utah-repc-deadline-and-your-loan">what a Utah REPC deadline does to your loan</Link>. Cash
        besides down payment does not shrink because you are new in town:{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash to close</Link>.
      </p>
      <p>
        Commute, rent, and city context belong on{" "}
        <Link href="/moving-to-utah">New to Utah</Link> — not on cloned city doorway pages.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Bring the signed offer: employer, position, pay type, start date, and any remaining conditions.</li>
        <li>Ask whether the start date sits inside the investor window (often through 90 days after the note — confirm).</li>
        <li>
          Line the REPC Financing & Appraisal Deadline up with underwriting, not with your first paycheck fantasy date.
        </li>
      </ol>
    </ArticleShell>
  )
}
