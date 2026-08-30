import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { FHA_CONDO_ROSTER, HAZARD_HO3_HO6, LENDING_FACTS_AS_OF, TOWNHOME_VS_CONDO } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/hazard-vs-ho3-vs-ho6-condo-insurance"

const faqs = [
  {
    question: "Is “hazard insurance” a different product from an HO-3?",
    answer: HAZARD_HO3_HO6.hazard,
  },
  {
    question: "Does a condo file use the same policy as a house?",
    answer: HAZARD_HO3_HO6.condo,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "hazard", heading: "Hazard (lender condition)" },
  { id: "ho3", heading: "HO-3", href: "/blog/townhome-vs-condo-hoa-docs-lenders-ask" },
  { id: "ho6", heading: "HO-6", href: "/blog/fha-condo-roster-project-approval" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      hazard: HAZARD_HO3_HO6.hazard,
      ho3: HAZARD_HO3_HO6.ho3,
      ho6: HAZARD_HO3_HO6.ho6,
    },
  },
  {
    id: "who",
    criterion: "Typical property",
    cells: {
      hazard: "The coverage the mortgagee requires on the collateral, whatever form the policy takes.",
      ho3: "Often a fee-simple house or a PUD townhome you own including the land — confirm the plat.",
      ho6: "Condo unit plus master policy on the building and common elements.",
    },
  },
  {
    id: "lender",
    criterion: "What underwriting still asks",
    cells: {
      hazard: HAZARD_HO3_HO6.lender,
      ho3: "Binder, mortgagee clause, coverage amount, deductible. Occupancy must match the application.",
      ho6: "Master certificate plus unit-owners policy. Walls-in vs walls-out on the master changes what the HO-6 must cover.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Hazard vs HO-3 vs HO-6",
  description:
    "What lenders mean by hazard insurance, when an HO-3 fits a house, and when a condo needs an HO-6 plus the master policy. Not insurance advice.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["hazard vs HO-3 vs HO-6", "condo HO-6 mortgage", "HOA master policy insurance"],
  faqs,
})

export default function HazardHo3Ho6Page() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Hazard vs HO-3 vs HO-6",
        description:
          "What lenders mean by hazard insurance, when an HO-3 fits a house, and when a condo needs an HO-6 plus the master. Not insurance advice.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "The listing photo does not pick the ISO form. The plat and the master policy do.",
        faqs,
        keywords: ["hazard insurance mortgage", "HO-6 condo", "HO-3 homeowners"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        In a mortgage file, “hazard insurance” is the dwelling coverage the lender requires so the collateral can be
        rebuilt. HO-3 is the common homeowners form for many houses. HO-6 is the common unit-owners form for a
        condo, sitting next to the association’s master policy. They are not interchangeable labels. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{HAZARD_HO3_HO6.notAdvice}</p>

      <h2>Three names, two jobs</h2>
      <ComparisonTable
        caption={`Hazard vs HO-3 vs HO-6 as of ${LENDING_FACTS_AS_OF}. Not an insurance quote.`}
        columns={columns}
        rows={rows}
        footnote="Ask a licensed insurance producer for a binder. This page is a map for the loan condition."
      />

      <h2>Condo and HOA files</h2>
      <p>{HAZARD_HO3_HO6.condo}</p>
      <p>
        {TOWNHOME_VS_CONDO.legal} Docs a lender asks for:{" "}
        <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">townhome vs condo HOA docs</Link>. FHA still needs
        project eligibility: <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster</Link>.{" "}
        {FHA_CONDO_ROSTER.projectApproval}
      </p>
      <p>
        HOA dues still sit in DTI either way:{" "}
        <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end with HOA</Link>.
      </p>

      <h2>Why CTC stalls on insurance</h2>
      <p>{HAZARD_HO3_HO6.lender}</p>
      <ul>
        <li>Wrong occupancy on the binder (investment vs primary).</li>
        <li>Master policy missing, expired, or walls-out when the HO-6 assumed walls-in.</li>
        <li>Mortgagee clause or coverage amount that does not match investor overlay.</li>
      </ul>
      <p>
        Related servicing questions after you close: <Link href="/faq/escrow-faqs">escrow, taxes, and insurance FAQs</Link>
        .
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Pick a carrier, deductible, or coverage limit.</li>
        <li>Treat every townhome as a condo, or every condo as an HO-3 house.</li>
        <li>Describe who should live in the building. {TOWNHOME_VS_CONDO.notOccupant}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Get the legal regime from the plat (condo vs PUD) before you bind a form.</li>
        <li>If FHA is the product, confirm the project on HUD’s list, then bind master plus HO-6 as the lender requires.</li>
        <li>
          Program: <Link href="/loans/fha">FHA loans</Link>. First-time cash:{" "}
          <Link href="/learn/first-time">first-time hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
