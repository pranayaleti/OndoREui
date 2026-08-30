import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { FHA_CONDO_ROSTER, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/fha-condo-roster-project-approval"

const faqs = [
  {
    question: "Is every Utah condo FHA-eligible if I qualify as a borrower?",
    answer:
      "No. The project has to be currently approved on HUD’s list, or your lender has to obtain single-unit approval. Your credit does not override an expired or rejected project.",
  },
  {
    question: "What if the HUD list says expired?",
    answer: `${FHA_CONDO_ROSTER.recertification} ${FHA_CONDO_ROSTER.singleUnit}`,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "project", heading: "Project approval (roster)", href: "/loans/fha" },
  { id: "sua", heading: "Single-unit approval", href: "/loans/fha" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      project: FHA_CONDO_ROSTER.projectApproval,
      sua: FHA_CONDO_ROSTER.singleUnit,
    },
  },
  {
    id: "who",
    criterion: "Who starts it",
    cells: {
      project: "HOA or sponsor / DE lender through HUD’s project process. Recertification is on a timer.",
      sua: "Your lender submits HUD’s single-unit questionnaire with the case. You do not apply to HUD yourself.",
    },
  },
  {
    id: "fail",
    criterion: "Common fails",
    cells: {
      project: "Expired status, litigation, insurance gaps, owner-occupancy or concentration tests, incomplete recertification.",
      sua: "HOA will not produce budgets and insurance, project too small, manufactured housing, or HUD concentration limits already hit.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "FHA Condo Roster / Project Approval",
  description:
    "Look up the project on HUD’s condominium list before you write an FHA offer. Expired approval is not current approval.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["FHA condo roster", "HUD approved condominium", "FHA single unit approval"],
  faqs,
})

export default function FhaCondoRosterPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "FHA Condo Roster / Project Approval",
        description:
          "Look up the project on HUD’s condominium list before you write an FHA offer. Expired approval is not current approval.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "FHA finances a unit in an approved project — or a unit HUD agrees to review. Not every condo.",
        faqs,
        keywords: ["FHA approved condo", "HUD condo list"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        An FHA loan on a condominium needs the <em>project</em> to work, not only the borrower. Look the building up
        on HUD’s current condominium list before you write an FHA offer. Expired, withdrawn, or missing is not
        approved. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>How to look it up</h2>
      <ol>
        <li>
          Open HUD’s condominium search (opens HUD.gov in a new tab):{" "}
          <a
            href={FHA_CONDO_ROSTER.rosterUrl}
            className="underline underline-offset-4"
            rel="noopener noreferrer"
            target="_blank"
          >
            HUD condominium approval search
          </a>
          . Confirm it is still the published tool; HUD moves URLs.
        </li>
        <li>Search by project name, city, or state. Match the legal project name, not the marketing name on Zillow.</li>
        <li>Status must be currently approved. Expired, rejected, and withdrawn are different statuses.</li>
      </ol>
      <p>{FHA_CONDO_ROSTER.recertification}</p>

      <ComparisonTable
        caption={`Project roster vs single-unit approval as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="HUD handbook tests change. This is a map, not a project underwrite."
      />

      <h2>What the HOA still has to produce</h2>
      <ul>
        <li>Budget, reserves, and insurance certificates (including fidelity coverage when required). Condo unit-owners coverage is typically HO-6 next to the master —{" "}
          <Link href="/blog/hazard-vs-ho3-vs-ho6-condo-insurance">hazard vs HO-3 vs HO-6</Link>.</li>
        <li>Litigation disclosure. Active construction-defect or HOA lawsuits stall both paths.</li>
        <li>Owner-occupancy and FHA-concentration facts. A building full of FHA units can fail concentration even if the roster was once approved.</li>
      </ul>
      <p>
        Conventional condo overlays exist too, but they are not this HUD list. If FHA is the reason you wanted the
        building, compare{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link> only after the project is even
        eligible. MIP vs how insurance ends:{" "}
        <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">MIP vs PMI</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Run the HUD search before you waive the financing contingency in your head.</li>
        <li>Ask the listing agent for the legal project name and HOA questionnaire early.</li>
        <li>
          If the project is not approved, ask a loan officer whether single-unit approval is even possible — before
          you spend inspection money. A late condo fail is a common{" "}
          <Link href="/blog/declined-after-pre-approval">decline after pre-approval</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
