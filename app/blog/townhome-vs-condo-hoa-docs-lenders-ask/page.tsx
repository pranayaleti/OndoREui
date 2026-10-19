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

const path = "/blog/townhome-vs-condo-hoa-docs-lenders-ask"
const title =
  "Condos, Townhomes and HOAs: The Documents Lenders Ask For, Insurance, and Refinancing an Aging HOA"
const description =
  "Condo vs PUD townhome, the HOA documents lenders ask for, hazard vs HO-3 vs HO-6 next to the master policy, and why an aging HOA can stall a refinance."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "Loan Programs"
const keywords = [
  "townhome vs condo mortgage",
  "HOA questionnaire lender",
  "PUD vs condominium financing",
  "hazard vs HO-3 vs HO-6",
  "condo HO-6 master policy",
  "refinancing condo aging HOA",
  "condo project eligibility refinance",
]

const takeaways = [
  "Lenders underwrite the recorded plat and CC&Rs, not the word townhome in a listing. A townhome can be a fee-simple PUD or a condominium.",
  "Required HOA dues are housing expense in front-end DTI on a condo and on a PUD townhome alike.",
  "A condo file needs the association’s master policy plus a unit-owners policy, often an HO-6. A fee-simple townhome often binds an HO-3. Hazard insurance is the lender’s condition, not a third product.",
  "On a refinance, thin reserves, litigation, special assessments, and master-insurance gaps can make the project ineligible even when your credit, DTI, and equity are fine.",
  "FHA files need current HUD project approval or a single-unit path. Conventional project review is a different list with its own questions.",
] as const

const faqs = [
  {
    question: "If the listing says townhome, is it automatically not a condo?",
    answer: TOWNHOME_VS_CONDO.legal,
  },
  {
    question: "Do HOA dues count in DTI on a townhome that is not a condo?",
    answer: TOWNHOME_VS_CONDO.hoaDti,
  },
  {
    question: "Is “hazard insurance” a different product from an HO-3?",
    answer: HAZARD_HO3_HO6.hazard,
  },
  {
    question: "Does a condo file use the same policy as a house?",
    answer: HAZARD_HO3_HO6.condo,
  },
  {
    question: "What does walls-in vs walls-out mean for my HO-6?",
    answer:
      "It describes where the association’s master policy stops. A walls-in (sometimes called all-in) master usually covers the unit’s interior finishes as originally built. A walls-out (bare walls) master stops at the unit boundary, so the HO-6 has to carry cabinets, flooring, and fixtures. Read the master policy declarations, not a summary, and ask a licensed insurance producer to match the HO-6 to it.",
  },
  {
    question: "Can an aging HOA block a refinance if my credit is fine?",
    answer: CONDO_AGING_HOA.what,
  },
  {
    question: "Is a conventional condo project review the same as the FHA condo roster?",
    answer: CONDO_AGING_HOA.fannieProject,
  },
]

const regimeColumns: readonly ComparisonColumn[] = [
  { id: "condo", heading: "Condo regime", href: "/blog/fha-vs-conventional-loans-utah" },
  { id: "pud", heading: "Fee-simple / PUD townhome" },
]

const regimeRows: readonly ComparisonRow[] = [
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
      pud: "HUD’s condominium roster is a condo-project tool. A typical fee-simple townhome is not on that list, and a townhome that is legally a condo still is.",
    },
  },
  {
    id: "insurance",
    criterion: "Insurance stack",
    cells: {
      condo: "Association master policy on the building and common elements, plus a unit-owners policy (often HO-6) on the interior.",
      pud: "Often a single HO-3 on the dwelling you own, with the association insuring only shared areas. Confirm what the CC&Rs require.",
    },
  },
]

const insuranceColumns: readonly ComparisonColumn[] = [
  { id: "hazard", heading: "Hazard (lender condition)" },
  { id: "ho3", heading: "HO-3" },
  { id: "ho6", heading: "HO-6" },
]

const insuranceRows: readonly ComparisonRow[] = [
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
      ho3: "Often a fee-simple house or a PUD townhome you own including the land. Confirm the plat.",
      ho6: "Condo unit plus the master policy on the building and common elements.",
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

const agingColumns: readonly ComparisonColumn[] = [
  { id: "reserves", heading: "Reserves & assessments" },
  { id: "litigation", heading: "Litigation" },
  { id: "insurance", heading: "Master insurance" },
]

const agingRows: readonly ComparisonRow[] = [
  {
    id: "risk",
    criterion: "Project-risk shape",
    cells: {
      reserves: CONDO_AGING_HOA.reserves,
      litigation: CONDO_AGING_HOA.litigation,
      insurance:
        "Master policy, fidelity coverage, and walls-in vs walls-out still apply on a refinance. A non-renewed master policy or a very large deductible on an older building is a project issue, not a unit issue.",
    },
  },
  {
    id: "unit",
    criterion: "Still a unit-level file",
    cells: {
      reserves: "An assessment payment you owe can sit in your DTI at the same time the assessment raises a project question.",
      litigation: "Your DTI and credit can be strong and the project still ineligible.",
      insurance: "Your HO-6 binder still has to match the master deductible and the occupancy on the application.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Condo and Townhome Loans: HOA Documents Lenders Ask For",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  takeaways,
  faqs,
})

export default function TownhomeVsCondoHoaDocsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "The plat decides the regime. The questionnaire decides the project. The binder has to match both.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A lender does not underwrite the listing photo. A “townhome” can be a fee-simple planned-unit development or a
        condominium, and that legal regime decides which HOA documents the file needs, which insurance form sits next to
        the association’s master policy, and what can stall a refinance years after you buy. This guide covers all three
        in one place. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{TOWNHOME_VS_CONDO.legal}</p>
      <p>
        The difference shows up in three places: the document list, the project test, and the insurance stack. A
        fee-simple townhome with an HOA still has CC&Rs and often a questionnaire, but it usually does not face condo
        project review the same way. A townhome that is legally a condo faces all of it, on the purchase and again on
        every refinance.
      </p>

      <h2>Condo regime vs fee-simple townhome</h2>
      <ComparisonTable
        caption={`Legal structure vs documents as of ${LENDING_FACTS_AS_OF}. Confirm the recorded plat.`}
        columns={regimeColumns}
        rows={regimeRows}
        footnote="Educational snapshot. Conventional condo overlays exist too; they are not this HUD list."
      />
      <p>
        Get the legal project name and the recorded plat from the listing agent or the county recorder, not only the
        marketing name. Utah county recorders keep plat records public, and the plat title often says condominium,
        subdivision, or planned unit development on its face. When the listing and the plat disagree, the plat wins.
      </p>

      <h2>The HOA documents a lender asks for</h2>
      <p>
        {TOWNHOME_VS_CONDO.condoDocs} {TOWNHOME_VS_CONDO.pudDocs}
      </p>
      <p>Ask for this packet early, on a purchase or a refinance:</p>
      <ul>
        <li>Recorded plat and legal description: condo vs PUD vs townhouse lot.</li>
        <li>
          HOA questionnaire on the lender’s or the agency’s form, completed by the management company or the board, not
          by the seller.
        </li>
        <li>Current budget and the most recent reserve study, or a written explanation if none exists.</li>
        <li>
          Insurance certificates: on a condo, the master policy with its deductible, walls-in vs walls-out, and fidelity
          coverage where required, plus your unit-owners binder; on a fee-simple townhome, often a single HO-3 binder.
          The <a href="#hazard-vs-ho-3-vs-ho-6-next-to-the-master-policy">insurance section below</a> sorts the forms.
        </li>
        <li>Litigation disclosure, pending and threatened, not only “we won last year.”</li>
        <li>
          Special assessments: amount, remaining term, and whether the payment is in DTI. {DTI_HOA.specialAssessment}
        </li>
        <li>Monthly dues and what they include, so DTI is not missing a line.</li>
        <li>Occupancy mix and ownership concentration, which matter most on a condo regime.</li>
      </ul>
      <p>
        Management companies often charge a fee for the questionnaire and can take days or weeks to return it. The
        answers on it decide project eligibility. A strong borrower cannot fix a weak questionnaire, so it belongs at the
        front of the timeline, not after the appraisal is paid for.
      </p>

      <h2>HOA dues still sit in DTI</h2>
      <p>
        {TOWNHOME_VS_CONDO.hoaDti} {DTI_HOA.frontEnd}
      </p>
      <p>
        {DTI_HOA.backEnd} {DTI_HOA.notPmi} Deep guide:{" "}
        <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end DTI with HOA</Link>.
      </p>

      <h2>If it is actually a condo: project approval</h2>
      <p>
        {FHA_CONDO_ROSTER.projectApproval} {FHA_CONDO_ROSTER.singleUnit} {FHA_CONDO_ROSTER.recertification} The lookup
        and the single-unit path are covered in{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA condo roster and project approval</Link>.
      </p>
      <p>{CONDO_AGING_HOA.fannieProject}</p>
      <p>
        A side-by-side duplex on its own parcel is a different file from a condo:{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA duplex house-hack</Link>.
      </p>

      <h2>Hazard vs HO-3 vs HO-6 next to the master policy</h2>
      <p>
        {HAZARD_HO3_HO6.hazard} {HAZARD_HO3_HO6.ho3} {HAZARD_HO3_HO6.ho6} They are not interchangeable labels, and the
        listing photo does not pick the form. The plat and the master policy do.
      </p>
      <ComparisonTable
        caption={`Hazard vs HO-3 vs HO-6 as of ${LENDING_FACTS_AS_OF}. Not an insurance quote.`}
        columns={insuranceColumns}
        rows={insuranceRows}
        footnote="Ask a licensed insurance producer for a binder. This table is a map for the loan condition."
      />
      <p>{HAZARD_HO3_HO6.condo}</p>
      <p>
        Walls-in vs walls-out in plain terms: a walls-in (sometimes called all-in) master policy usually covers the
        unit’s interior finishes as originally built. A walls-out (bare walls) master stops at the unit boundary, so the
        HO-6 has to carry the cabinets, flooring, and fixtures. Read the master policy declarations, not the HOA’s
        one-page summary, before anyone binds the HO-6.
      </p>
      <h3>Why clear to close stalls on insurance</h3>
      <p>{HAZARD_HO3_HO6.lender}</p>
      <ul>
        <li>Wrong occupancy on the binder (investment vs primary).</li>
        <li>Master policy missing, expired, or walls-out when the HO-6 assumed walls-in.</li>
        <li>Mortgagee clause or coverage amount that does not match the investor overlay.</li>
        <li>Master deductible larger than the investor allows without a matching HO-6 line.</li>
      </ul>
      <p>
        This guide does not pick a carrier, a deductible, or a coverage limit. Ask a licensed insurance producer for a
        binder that matches the plat and the occupancy on your application. Not insurance advice. Servicing questions
        after you close, including escrow for taxes and insurance, are in the{" "}
        <Link href="/faq/buying-selling-faqs">buying and selling FAQs</Link>.
      </p>

      <h2>Refinancing a condo in an aging HOA</h2>
      <p>
        {CONDO_AGING_HOA.what} {CONDO_AGING_HOA.notAPromise}
      </p>
      <ComparisonTable
        caption={`Aging-HOA project lines on a refinance as of ${LENDING_FACTS_AS_OF}. Not legal advice.`}
        columns={agingColumns}
        rows={agingRows}
        footnote="The HOA questionnaire, budget, and insurance certificates are the source documents, not a listing’s year built."
      />
      <h3>Reserves and special assessments</h3>
      <p>
        A reserve study estimates when roofs, siding, elevators, and parking structures will need replacement and
        whether the association is saving toward it. A budget that funds reserves at a fraction of the study’s
        recommendation, or no study at all, invites a project-level question. A special assessment is the usual
        symptom: the work came due and the reserves were not there. The assessment can sit in your DTI and in project
        eligibility at the same time, so ask for the amount, the remaining term, and whether it is paid in full or in
        installments.
      </p>
      <h3>Litigation</h3>
      <p>
        Construction-defect suits, disputes with a former board, and insurance-claim litigation are the common shapes.
        What the lender wants is the nature of the suit, the amount in controversy, who is named, and whether insurance
        covers it, usually from the questionnaire and an attorney letter. Minor matters are sometimes an exception path.
        Pending defect litigation on the structure usually is not. Threatened litigation counts too, so a board that
        says “nothing filed yet” has not answered the question.
      </p>
      <h3>Owner-occupancy and ownership questions</h3>
      <p>
        The questionnaire also asks how the building is owned and used: how many units are owner-occupied, second homes,
        or rentals; whether one person or entity owns a large share of the units; whether the developer still controls
        the board or holds unsold inventory; and whether commercial space sits in the project. Those answers are project
        questions, and they can change which review path applies, especially when the unit you are refinancing is an
        investment property or a second home. The lender is testing the building, not deciding who belongs in your unit.
      </p>
      <h3>Order of operations on a condo refinance</h3>
      <ol>
        <li>Ask the association or your agent for the questionnaire packet before you lock a refinance plan.</li>
        <li>Read reserves, litigation, and the master policy first. If any of the three fails, the rest of the file is moot.</li>
        <li>
          Run <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even</Link> only after the project looks
          eligible. Appraisal and application costs on an ineligible building are wasted.
        </li>
        <li>
          If the new loan is FHA, look up the project on HUD’s list before you pay for anything. An FHA-to-FHA refinance
          still needs current project approval or a documented single-unit path.
        </li>
      </ol>

      <h2>What this guide will not do</h2>
      <ul>
        <li>Treat every townhome as a condo, or every condo as an HO-3 house.</li>
        <li>Declare every 1980s building un-financeable, or every new building eligible.</li>
        <li>Memorize a Fannie review type as if it never changes.</li>
        <li>Describe who should live in the building. {TOWNHOME_VS_CONDO.notOccupant}</li>
        <li>Approve a loan. This guide is education. It is not a commitment to lend, a quote, or a credit decision.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Get the legal project name and the plat from the listing agent or the recorder, not only the marketing name.</li>
        <li>If FHA is the reason you wanted the building, run the HUD search on a condo regime first.</li>
        <li>On a refinance, request the questionnaire packet before you order anything that costs money.</li>
        <li>
          Program overview: <Link href="/loans/fha">FHA loans in Utah</Link>. First-time cash stack:{" "}
          <Link href="/learn/first-time">first-time hub</Link>. Refinance: <Link href="/refinance">refinance hub</Link> or{" "}
          <Link href="/qualify">start a conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
