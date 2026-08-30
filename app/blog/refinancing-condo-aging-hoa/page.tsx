import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  CONDO_AGING_HOA,
  DTI_HOA,
  FHA_CONDO_ROSTER,
  HAZARD_HO3_HO6,
  LENDING_FACTS_AS_OF,
  TOWNHOME_VS_CONDO,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/refinancing-condo-aging-hoa"

const faqs = [
  {
    question: "Can an aging HOA block a refinance if my credit is fine?",
    answer: CONDO_AGING_HOA.what,
  },
  {
    question: "Is this the same as looking up the FHA condo roster?",
    answer: CONDO_AGING_HOA.notRosterClone,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "reserves", heading: "Reserves & assessments" },
  { id: "litigation", heading: "Litigation" },
  { id: "insurance", heading: "Master insurance", href: "/blog/hazard-vs-ho3-vs-ho6-condo-insurance" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "risk",
    criterion: "Project-risk shape",
    cells: {
      reserves: CONDO_AGING_HOA.reserves,
      litigation: CONDO_AGING_HOA.litigation,
      insurance: CONDO_AGING_HOA.insurance,
    },
  },
  {
    id: "unit",
    criterion: "Still a unit-level file",
    cells: {
      reserves: DTI_HOA.specialAssessment,
      litigation: "Your DTI and credit can be strong and the project still ineligible.",
      insurance: HAZARD_HO3_HO6.lender,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Refinancing a Condo with an Aging HOA",
  description:
    "Reserves, litigation, insurance, and Fannie project review can stall a condo refinance even when your credit is fine. Links FHA roster and HO-3 vs HO-6. Informational only.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["refinancing condo aging HOA", "condo project eligibility refinance", "HOA reserves litigation"],
  faqs,
})

export default function RefinancingCondoAgingHoaPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Refinancing a Condo with an Aging HOA",
        description:
          "Project risk — reserves, litigation, insurance — can stall a condo refinance. Not a clone of the FHA roster how-to.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Your tri-merge can be fine. The association’s questionnaire can still fail the project.",
        faqs,
        keywords: ["condo refinance HOA", "aging HOA mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Refinancing a condo with an aging HOA is a project-eligibility file: reserves, litigation, and master insurance
        can ineligible the building even when your credit, DTI, and equity look fine. Age is a clue, not a decline by
        itself. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{CONDO_AGING_HOA.notAPromise}</p>

      <h2>Unit file and project file</h2>
      <p>{CONDO_AGING_HOA.what}</p>
      <p>
        {TOWNHOME_VS_CONDO.legal} Docs:{" "}
        <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">townhome vs condo HOA docs</Link>. HOA dues still sit
        in DTI: <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end with HOA</Link>.
      </p>
      <ComparisonTable
        caption={`Aging-HOA project lines as of ${LENDING_FACTS_AS_OF}. Not legal or insurance advice.`}
        columns={columns}
        rows={rows}
        footnote="The HOA questionnaire, budget, and insurance certificates are the source documents — not a listing’s year built."
      />

      <h2>Fannie project review vs FHA roster</h2>
      <p>{CONDO_AGING_HOA.fannieProject}</p>
      <p>
        FHA purchase and FHA-to-FHA refinance still need current HUD project approval or a documented single-unit path:{" "}
        <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster / project approval</Link>.{" "}
        {FHA_CONDO_ROSTER.projectApproval}
      </p>
      <p>{CONDO_AGING_HOA.notRosterClone}</p>

      <h2>Insurance on an older building</h2>
      <p>
        {HAZARD_HO3_HO6.ho6} Master plus HO-6:{" "}
        <Link href="/blog/hazard-vs-ho3-vs-ho6-condo-insurance">hazard vs HO-3 vs HO-6</Link>.{" "}
        {HAZARD_HO3_HO6.notAdvice}
      </p>

      <h2>Checklist for a condo refinance</h2>
      <ul>
        <li>Current HOA questionnaire, budget, and reserve study (or a written explanation if none exists).</li>
        <li>Litigation disclosure — pending and threatened, not only “we won last year.”</li>
        <li>Master policy, deductible, and walls-in vs walls-out.</li>
        <li>Special assessments: amount, remaining term, and whether they are in DTI.</li>
        <li>If FHA is the new loan, look up the project on HUD’s list before you pay for a full refinance file.</li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Declare every 1980s building un-financeable, or every new building eligible.</li>
        <li>Memorize a Fannie review type as if it never changes.</li>
        <li>Describe who should live in the building. {TOWNHOME_VS_CONDO.notOccupant}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Ask the association (or your agent) for the questionnaire packet before you lock a refinance plan.</li>
        <li>
          Run <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even</Link> only after the project
          looks eligible — costs on an ineligible building are wasted.
        </li>
        <li>
          <Link href="/refinance">Refinance hub</Link> · <Link href="/loans/fha">FHA loans</Link> ·{" "}
          <Link href="/qualify">start a conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
