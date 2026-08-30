import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { DTI_EDUCATION, DTI_HOA, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/dti-frontend-backend-with-hoa"

const faqs = [
  {
    question: "Is HOA part of front-end or back-end DTI?",
    answer: `${DTI_HOA.frontEnd} ${DTI_HOA.backEnd}`,
  },
  {
    question: "Does a high HOA automatically kill a condo file?",
    answer:
      "It can break DTI even when principal and interest look fine. It can also be a project-eligibility issue (special assessments, litigation) that is separate from the ratio. Confirm both.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "front", heading: "Front-end (housing)" },
  { id: "back", heading: "Back-end (all counted debts)" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "includes",
    criterion: "What is in the ratio",
    cells: {
      front: DTI_EDUCATION.frontendNote,
      back: DTI_EDUCATION.backendNote,
    },
  },
  {
    id: "hoa",
    criterion: "Where HOA sits",
    cells: {
      front: DTI_HOA.frontEnd,
      back: DTI_HOA.backEnd,
    },
  },
  {
    id: "not",
    criterion: "What it is not",
    cells: {
      front: DTI_HOA.notPmi,
      back: "Student loans, auto loans, and revolving minimums are typically back-end lines, not HOA. Count them where the investor says.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "DTI: Front-End vs Back-End with HOA",
  description:
    "HOA dues are housing expense in front-end DTI, then roll into back-end with other debts. A modest PITI plus a large HOA can still fail the ratio.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["DTI HOA", "front-end vs back-end DTI", "condo HOA mortgage ratio"],
  faqs,
})

export default function DtiHoaPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "DTI: Front-End vs Back-End with HOA",
        description:
          "HOA dues are housing expense in front-end DTI, then roll into back-end with other debts. A modest PITI plus a large HOA can still fail the ratio.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Put HOA in housing expense. Do not hide it in “other.”",
        faqs,
        keywords: ["HOA debt to income", "front end DTI condo"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Front-end DTI is the housing payment — principal, interest, taxes, insurance, and HOA when the property has
        dues — divided by gross monthly income. Back-end DTI is that housing payment plus the other debts the investor
        counts. A townhome or condo with a “cheap” note payment can still fail because HOA is housing, not a footnote.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <ComparisonTable
        caption={`How HOA usually enters DTI as of ${LENDING_FACTS_AS_OF}. Confirm the guide for the product.`}
        columns={columns}
        rows={rows}
        footnote="Affordability calculators that omit HOA will overstate a condo budget. Enter the association’s current dues, not a guess of zero."
      />

      <h2>Why condos surprise people</h2>
      <p>
        {DTI_HOA.specialAssessment} FHA condos also need project approval —{" "}
        <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster</Link> — which is not a DTI test but can
        kill the same contract.
      </p>
      <p>
        Variable income is averaged <em>before</em> these ratios are run: {DTI_EDUCATION.variableIncomeNote} Student
        loans have their own counting rules:{" "}
        <Link href="/blog/student-loans-dti-idr-save">IDR / SAVE and DTI</Link>.
      </p>

      <h2>How to use the calculator without lying to yourself</h2>
      <p>
        The <Link href="/calculators/affordability">affordability calculator</Link> is an illustration. Put HOA in the
        housing box. The <Link href="/calculators/mortgage-payment">payment calculator</Link> should include the same
        dues if you are comparing a condo to a single-family house. Neither tool is underwriting.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Ask the listing or HOA for the current monthly dues and whether a special assessment is pending.</li>
        <li>Re-run DTI with PITI + HOA as housing, plus car and student loans as counted debts.</li>
        <li>
          If the building is a condo and you hoped for FHA, look up the project before you write the offer. Then talk
          with a loan officer — that conversation is not a credit decision.
        </li>
      </ol>
    </ArticleShell>
  )
}
