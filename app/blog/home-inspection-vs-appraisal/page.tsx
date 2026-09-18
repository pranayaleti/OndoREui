import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import { APPRAISAL_GAP, LENDING_FACTS_AS_OF, UTAH_REPC } from "@/lib/content"
import Link from "next/link"

const path = "/blog/home-inspection-vs-appraisal"

const columns: readonly ComparisonColumn[] = [
  { id: "inspection", heading: "Home inspection" },
  { id: "appraisal", heading: "Appraisal" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "who",
    criterion: "Who it is for",
    cells: {
      inspection: "You. It is your due diligence on the condition of the property.",
      appraisal: "The lender. It supports the value the loan is secured against.",
    },
  },
  {
    id: "question",
    criterion: "The question it answers",
    cells: {
      inspection: "What condition is this house in, and what will it need?",
      appraisal: "What is this property worth, based on comparable sales?",
    },
  },
  {
    id: "orders",
    criterion: "Who orders it",
    cells: {
      inspection: "You do, usually through your agent, during the due-diligence window.",
      appraisal: "The lender orders it through an appraisal management process you do not control.",
    },
  },
  {
    id: "deadline",
    criterion: "Which Utah deadline it sits under",
    cells: {
      inspection: "Due Diligence Deadline.",
      appraisal: "Financing & Appraisal Deadline — a separate, independent date.",
    },
  },
  {
    id: "outcome",
    criterion: "What a bad result does",
    cells: {
      inspection: "Gives you information and, if the condition is checked, a written cancel right by the deadline.",
      appraisal: "Can cap the loan amount, which becomes cash, a renegotiation, or a cancellation.",
    },
  },
]

const faqs = [
  {
    question: "Does the appraisal tell me if the house has problems?",
    answer:
      "Not the way an inspection does. An appraiser notes condition as it affects value, and some programs require certain repairs, but an appraisal is not a condition report and is not ordered for your benefit.",
  },
  {
    question: "Can I skip the inspection to make my offer stronger?",
    answer:
      "Buyers do, and it is a real trade. Waiving due diligence gives up your information and your cancel right on condition. It does not waive the appraisal or financing conditions, which sit on a separate deadline.",
  },
  {
    question: "The inspection found problems. Does that lower the appraised value?",
    answer:
      "Not automatically. The two reports are produced independently and for different audiences. Significant condition issues can affect value or trigger program repair requirements, but an inspection report is not an input the appraiser is waiting on.",
  },
  {
    question: "Can I use my inspection to renegotiate?",
    answer:
      "That is what the due-diligence window is for, and it is a negotiation, not a right to a price reduction. What you can do by which date is set by the contract you signed.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Home Inspection vs Appraisal: Two Reports, Two Audiences",
  description:
    "An inspection is your condition report. An appraisal is the lender's opinion of value. They run on separate Utah deadlines and neither substitutes for the other.",
  published: "2026-09-17",
  category: "First-Time Buyers",
  keywords: ["home inspection vs appraisal", "what does an appraiser check", "due diligence Utah"],
  faqs,
})

export default function InspectionVsAppraisalPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Home Inspection vs Appraisal: Two Reports, Two Audiences",
        description:
          "An inspection is your condition report. An appraisal is the lender's opinion of value. They run on separate Utah deadlines and neither substitutes for the other.",
        published: "2026-09-17",
        category: "First-Time Buyers",
        bannerSubtitle: "One answers what shape the house is in. The other answers what it is worth.",
        takeaways: [
          "An inspection is your due diligence on condition. An appraisal is the lender's opinion of value.",
          "You order and pay for the inspection; the lender orders the appraisal through a process you do not control.",
          "In Utah they sit under two independent deadlines, so clearing one does nothing for the other.",
          "Neither report substitutes for the other. A clean appraisal is not evidence the house is in good condition.",
        ],
        faqs,
        keywords: ["inspection vs appraisal", "Utah due diligence deadline"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        These two reports get confused constantly, usually at the worst moment — when one of them comes back badly and
        a buyer assumes the other covered it. They answer different questions for different people. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>

      <ComparisonTable
        caption={`Inspection and appraisal compared, as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Program repair requirements (for example, minimum property standards on some government loans) are a separate overlay on top of both."
      />

      <h2>Why the distinction matters in practice</h2>
      <p>
        The inspection exists to tell you what you are buying. The appraisal exists to tell the lender what it is
        lending against. A buyer who waives due diligence still gets an appraisal — and gets no condition report.
        A buyer whose appraisal comes in low still has whatever condition issues the inspection found.
      </p>
      <p>{APPRAISAL_GAP.lowerOfNote}</p>

      <ArticleCallout variant="pitfall" title="A clean appraisal is not a clean house">
        An appraiser is forming an opinion of value, not writing you a condition report. Treating an appraisal as
        reassurance about the roof, the furnace, or the foundation is the most expensive version of this mix-up.
      </ArticleCallout>

      <h2>Two deadlines, not one</h2>
      <p>{UTAH_REPC.fourDeadlines}</p>
      <p>
        Which is why the timing matters as much as the reports: see{" "}
        <Link href="/blog/utah-repc-deadlines">Utah REPC deadlines</Link>, and{" "}
        <Link href="/blog/appraisal-comes-in-low">when the appraisal comes in low</Link> for what happens when value is
        the problem.
      </p>

      <h2>What happens next</h2>
      <p>
        Put both dates on the calendar at acceptance and know which report answers which question before either one
        lands. If condition findings turn into a renegotiation, a seller credit may be part of the answer — within
        limits: <Link href="/blog/seller-concessions-what-they-cover">seller concessions</Link>.
      </p>
    </ArticleShell>
  )
}
