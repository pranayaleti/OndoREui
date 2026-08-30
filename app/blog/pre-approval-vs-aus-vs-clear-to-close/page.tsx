import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, PREAPPROVAL_STAGES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/pre-approval-vs-aus-vs-clear-to-close"

const faqs = [
  {
    question: "Is a pre-approval the same as automated underwriting approval?",
    answer: PREAPPROVAL_STAGES.notTheSame,
  },
  {
    question: "What does clear to close actually mean?",
    answer: PREAPPROVAL_STAGES.ctc,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "letter", heading: "Pre-approval letter" },
  { id: "aus", heading: "AUS findings" },
  { id: "ctc", heading: "Clear to close" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "job",
    criterion: "Job",
    cells: {
      letter: PREAPPROVAL_STAGES.preApproval,
      aus: PREAPPROVAL_STAGES.aus,
      ctc: PREAPPROVAL_STAGES.ctc,
    },
  },
  {
    id: "property",
    criterion: "Does it know the house?",
    cells: {
      letter: "Often not. Many letters are written before an accepted offer. Property type can still be assumed wrong.",
      aus: "Usually run on a specific program, LTV, and often a property type. Condo and manufactured overlays still matter.",
      ctc: "Yes. Appraisal, title, insurance, and program rules for this address have been conditioned and cleared as of that date.",
    },
  },
  {
    id: "promise",
    criterion: "What it is not",
    cells: {
      letter: "Not a lock, not CTC, not a commitment to lend.",
      aus: "Not CTC. Approve/Eligible can still fail on conditions, appraisal, or a file change.",
      ctc: "Not a promise that funding cannot be delayed if the CD, insurance, or your job changes before the wire.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Pre-Approval Letter vs AUS Findings vs Clear to Close",
  description:
    "Three documents, three jobs. A letter is a snapshot, AUS is an engine result, CTC is an underwriter sign-off — not a guarantee you will fund.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["pre-approval vs underwriting", "AUS findings", "clear to close meaning"],
  faqs,
})

export default function PreapprovalStagesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Pre-Approval Letter vs AUS Findings vs Clear to Close",
        description:
          "Three documents, three jobs. A letter is a snapshot, AUS is an engine result, CTC is an underwriter sign-off — not a guarantee you will fund.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Sellers want a letter. The file needs findings. Closing needs CTC.",
        faqs,
        keywords: ["pre-approval vs AUS vs CTC", "what is clear to close"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A pre-approval letter, AUS findings, and a clear-to-close are three different artifacts. The letter helps you
        shop. Automated underwriting (often Fannie Mae DU or Freddie Mac LPA) tests a specific program against the
        credit file. CTC is an underwriter stating that conditions for this property are satisfied as of that date.
        Mixing them up is how “I was approved” turns into a stalled closing. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{PREAPPROVAL_STAGES.notTheSame}</p>

      <ComparisonTable
        caption={`Three stages of a purchase file as of ${LENDING_FACTS_AS_OF}. Not a timeline promise.`}
        columns={columns}
        rows={rows}
        footnote="GUS (USDA) and TOTAL Scorecard (FHA) are different engines with the same idea: an automated result is not a human CTC."
      />

      <h2>Where files usually break</h2>
      <ul>
        <li>
          <Link href="/blog/new-auto-loan-during-underwriting">New auto loan during underwriting</Link> — DTI and the
          next credit pull.
        </li>
        <li>
          <Link href="/blog/large-deposits-60-day-paper-trail">Large deposits</Link> — assets the letter never saw.
        </li>
        <li>
          Job or income change after the letter —{" "}
          <Link href="/blog/how-underwriters-verify-income">how income is verified</Link>.
        </li>
        <li>
          Property: condo roster, appraisal, occupancy. Typical late fails:{" "}
          <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>.
        </li>
      </ul>

      <h2>What you will be asked (and not promised)</h2>
      <p>
        The first conversation is scoped on the <Link href="/qualify">qualify page</Link> and the supporting guide{" "}
        <Link href="/blog/what-a-mortgage-conversation-asks">what a mortgage conversation asks</Link>. A conversation
        is not any of the three stages above.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Treat the letter as permission to shop, not as a property or rate lock.</li>
        <li>Ask whether AUS has actually been run on this program and this LTV — and what the findings were.</li>
        <li>Do not schedule movers off a letter. CTC plus a CD that matches is closer to a closing date.</li>
      </ol>
    </ArticleShell>
  )
}
