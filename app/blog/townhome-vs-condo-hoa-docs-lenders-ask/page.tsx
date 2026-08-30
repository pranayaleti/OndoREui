import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { DTI_HOA, FHA_CONDO_ROSTER, LENDING_FACTS_AS_OF, TOWNHOME_VS_CONDO } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/townhome-vs-condo-hoa-docs-lenders-ask"

const faqs = [
  {
    question: "If the listing says townhome, is it automatically not a condo?",
    answer: TOWNHOME_VS_CONDO.legal,
  },
  {
    question: "Do HOA dues count in DTI on a townhome that is not a condo?",
    answer: TOWNHOME_VS_CONDO.hoaDti,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "condo", heading: "Condo regime", href: "/blog/fha-condo-roster-project-approval" },
  { id: "pud", heading: "Fee-simple / PUD townhome" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "legal",
    criterion: "What you typically own",
    cells: {
      condo: "The unit plus an interest in common elements. The land under the building is usually association-owned.",
      pud: "Often the unit and the land under it, with CC&Rs and an association for shared areas. Confirm the plat.",
    },
  },
  {
    id: "docs",
    criterion: "Docs a lender commonly asks for",
    cells: {
      condo: TOWNHOME_VS_CONDO.condoDocs,
      pud: TOWNHOME_VS_CONDO.pudDocs,
    },
  },
  {
    id: "fha",
    criterion: "FHA project test",
    cells: {
      condo: FHA_CONDO_ROSTER.projectApproval,
      pud: "HUD’s condominium roster is a condo-project tool. A typical fee-simple townhome is not that list — and a townhome that is legally a condo still is.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Townhome vs Condo: HOA Docs a Lender Will Ask For",
  description:
    "Lenders underwrite the legal regime, not the listing photo. Not every townhome is a condo. HOA dues still sit in DTI either way.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["townhome vs condo mortgage", "HOA questionnaire lender", "PUD vs condominium financing"],
  faqs,
})

export default function TownhomeVsCondoHoaDocsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Townhome vs Condo: HOA Docs a Lender Will Ask For",
        description:
          "Lenders underwrite the legal regime, not the listing photo. Not every townhome is a condo. HOA dues still sit in DTI either way.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "“Townhome” on Zillow is marketing. The plat is the underwrite.",
        faqs,
        keywords: ["townhome HOA docs", "condo vs PUD lender"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A lender does not underwrite the listing photo. A “townhome” can be a fee-simple planned-unit development or a
        condominium. Do not treat every townhome as a condo — and do not assume a townhome skips HOA documents. Snapshot
        as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{TOWNHOME_VS_CONDO.legal}</p>
      <p>{TOWNHOME_VS_CONDO.notOccupant}</p>

      <h2>Condo regime vs fee-simple townhome</h2>
      <ComparisonTable
        caption={`Legal structure vs documents as of ${LENDING_FACTS_AS_OF}. Confirm the recorded plat.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Conventional condo overlays exist too; they are not this HUD list."
      />

      <h2>HOA dues still sit in DTI</h2>
      <p>
        {TOWNHOME_VS_CONDO.hoaDti} {DTI_HOA.frontEnd} Deep guide:{" "}
        <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end with HOA</Link>.
      </p>

      <h2>If it is actually a condo</h2>
      <p>
        FHA needs current project approval or a single-unit path:{" "}
        <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster / project approval</Link>. Look the
        project up before you write an FHA offer as if the building is eligible. {FHA_CONDO_ROSTER.recertification}
      </p>
      <p>
        A side-by-side duplex on its own parcel is a different file from a condo:{" "}
        <Link href="/blog/house-hacking-duplex-with-fha">FHA duplex house-hack</Link>.
      </p>

      <h2>Checklist to ask for early</h2>
      <ul>
        <li>Recorded plat / legal description: condo vs PUD vs townhouse lot.</li>
        <li>HOA questionnaire, budget, and insurance certificates (master plus HO-6 on a condo; often HO-3 on a fee-simple townhome). See{" "}
          <Link href="/blog/hazard-vs-ho3-vs-ho6-condo-insurance">hazard vs HO-3 vs HO-6</Link>.</li>
        <li>Litigation and special assessments. {DTI_HOA.specialAssessment}</li>
        <li>Monthly dues and what they include (so DTI is not missing a line).</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Get the legal project name from the listing agent, not only the marketing name.</li>
        <li>If FHA is the reason you wanted the building, run the HUD search on a condo regime first.</li>
        <li>
          Program overview: <Link href="/loans/fha">FHA loans in Utah</Link>. First-time cash stack:{" "}
          <Link href="/learn/first-time">first-time hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
