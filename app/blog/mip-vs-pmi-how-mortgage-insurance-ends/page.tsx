import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  CONVENTIONAL_SNAPSHOT,
  FHA_SNAPSHOT,
  LENDING_FACTS_AS_OF,
  MORTGAGE_INSURANCE_EXIT,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/mip-vs-pmi-how-mortgage-insurance-ends"

const faqs = [
  {
    question: "If I build equity on FHA, does annual MIP drop off like PMI?",
    answer: MORTGAGE_INSURANCE_EXIT.fhaPost2013,
  },
  {
    question: "When does conventional PMI automatically end?",
    answer: `${MORTGAGE_INSURANCE_EXIT.conventionalHpa} ${MORTGAGE_INSURANCE_EXIT.notAppraisalPmi}`,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "mip", heading: "FHA MIP", href: "/loans/fha" },
  { id: "pmi", heading: "Conventional PMI", href: "/loans/conventional" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      mip: `Upfront MIP (${FHA_SNAPSHOT.upfrontMip}) plus annual MIP. ${FHA_SNAPSHOT.annualMipNote}`,
      pmi: "Private mortgage insurance when LTV is above the investor’s threshold (commonly when you put less than 20% down). Premium is not a single published percent.",
    },
  },
  {
    id: "ends",
    criterion: "How it usually ends",
    cells: {
      mip: MORTGAGE_INSURANCE_EXIT.fhaPost2013,
      pmi: MORTGAGE_INSURANCE_EXIT.conventionalHpa,
    },
  },
  {
    id: "equity",
    criterion: "Later equity / a new appraisal",
    cells: {
      mip: "Paying extra principal or a higher value does not cancel post-2013 annual MIP on the original schedule. Refinancing into conventional is the usual early exit.",
      pmi: MORTGAGE_INSURANCE_EXIT.notAppraisalPmi,
    },
  },
  {
    id: "not",
    criterion: "Not this page",
    cells: {
      mip: MORTGAGE_INSURANCE_EXIT.notWaitFor20,
      pmi: "Waiting until you can put 20% down on a purchase is a different first-time question. Automatic vs appraisal-based PMI removal is a later conventional topic.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "How MIP vs PMI Actually Leaves the Loan",
  description:
    "FHA annual MIP is timed from original LTV. Conventional PMI can often come off with equity. How each ends — not whether to wait for 20% down.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["MIP vs PMI", "FHA mortgage insurance cancellation", "when does PMI come off"],
  faqs,
})

export default function MipVsPmiPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "How MIP vs PMI Actually Leaves the Loan",
        description:
          "FHA annual MIP is timed from original LTV. Conventional PMI can often come off with equity. How each ends — not whether to wait for 20% down.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "MIP and PMI are different products with different off-ramps. Equity is not a universal cancel button.",
        faqs,
        keywords: ["FHA MIP vs conventional PMI", "mortgage insurance removal"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        FHA annual MIP and conventional PMI both add to the payment. They do not leave the loan the same way. On most
        post-2013 FHA loans with less than 10% down, annual MIP lasts for the life of the loan unless you refinance
        out of FHA. Conventional borrower-paid PMI can often come off with equity under the Homeowners Protection Act.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{MORTGAGE_INSURANCE_EXIT.notWaitFor20} The purchase question is{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">should I wait for 20% down</Link>. Servicer cancellation
        of conventional PMI (original value vs a new appraisal) is{" "}
        <Link href="/blog/pmi-removal-original-value-vs-new-appraisal">PMI removal mechanics</Link>.
      </p>

      <ComparisonTable
        caption={`How MIP and PMI typically end as of ${LENDING_FACTS_AS_OF}. Confirm your note and servicer.`}
        columns={columns}
        rows={rows}
        footnote="Lender-paid PMI, split-premium PMI, and USDA / VA fees are different products. VA uses a funding fee, not monthly PMI."
      />

      <h2>FHA: original LTV sets the clock</h2>
      <p>{MORTGAGE_INSURANCE_EXIT.fhaPost2013}</p>
      <p>
        Upfront MIP is often financed: {FHA_SNAPSHOT.upfrontMip}. Financing it raises the base loan. That is a Loan
        Estimate line, not a reason MIP will vanish later. Program overview: <Link href="/loans/fha">FHA loans</Link>.
        If you later refinance FHA-to-FHA, that may be a{" "}
        <Link href="/blog/fha-va-streamline-refinance-less-docs">streamline</Link> — it does not automatically delete
        annual MIP; the new FHA loan has its own MIP rules.
      </p>

      <h2>Conventional: original value vs a new appraisal</h2>
      <p>{CONVENTIONAL_SNAPSHOT.pmiRemoval}</p>
      <p>
        {MORTGAGE_INSURANCE_EXIT.conventionalHpa}         Asking the servicer to cancel based on a new appraisal of{" "}
        <em>current</em> value is allowed on some files and is a different path from automatic termination. That
        appraisal path is <Link href="/blog/pmi-removal-original-value-vs-new-appraisal">PMI removal: original value vs
        new appraisal</Link>, not this page’s main subject.
      </p>
      <p>
        Side-by-side program choice (credit, down payment, property):{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>. Conventional overview:{" "}
        <Link href="/loans/conventional">conventional loans</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Read the mortgage-insurance line on two Loan Estimates over a 5–7 year horizon, not the note rate alone.</li>
        <li>
          If you already have FHA MIP and want it gone before the 11-year / life-of-loan clock, ask about a
          conventional refinance and run <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even</Link>{" "}
          — MIP savings can be eaten by costs.
        </li>
        <li>
          Use the <Link href="/calculators/mortgage-payment">payment calculator</Link> as an illustration only; it
          cannot cancel MIP.
        </li>
      </ol>
    </ArticleShell>
  )
}
