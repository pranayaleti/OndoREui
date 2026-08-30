import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, PMI_REMOVAL } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/pmi-removal-original-value-vs-new-appraisal"

const faqs = [
  {
    question: "Is automatic PMI termination based on original value or current value?",
    answer: PMI_REMOVAL.originalValue,
  },
  {
    question: "Can I order a new appraisal to cancel PMI because the house is worth more now?",
    answer: PMI_REMOVAL.newAppraisal,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "hpa", heading: "Original value (HPA path)" },
  { id: "appraisal", heading: "New appraisal (current value)" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "basis",
    criterion: "What value is used",
    cells: {
      hpa: "Original purchase value (or the original appraised value used at origination). Scheduled principal paydown, not Zillow.",
      appraisal: "A new appraisal of current market value, ordered under the servicer/investor rules. Not automatic.",
    },
  },
  {
    id: "typical",
    criterion: "Typical trigger",
    cells: {
      hpa: PMI_REMOVAL.originalValue,
      appraisal: PMI_REMOVAL.newAppraisal,
    },
  },
  {
    id: "who",
    criterion: "Who starts it",
    cells: {
      hpa: "You can request cancellation at the 80% original-value mark. Automatic termination at 78% is a servicer duty on many borrower-paid loans if you are current.",
      appraisal: "You (or your servicer, if they allow it) request a current-value review. You usually pay for the appraisal. The investor can say no.",
    },
  },
  {
    id: "not",
    criterion: "Not this path",
    cells: {
      hpa: PMI_REMOVAL.notWaitFor20,
      appraisal: PMI_REMOVAL.notFhaMip,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Removing PMI: Original Value vs New Appraisal",
  description:
    "HPA cancellation uses original value. A new appraisal of current value is a separate investor path — not FHA MIP and not the wait-for-20% question.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["PMI removal", "cancel PMI appraisal", "Homeowners Protection Act 80% 78%"],
  faqs,
})

export default function PmiRemovalPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Removing PMI: Original Value vs New Appraisal",
        description:
          "HPA cancellation uses original value. A new appraisal of current value is a separate investor path — not FHA MIP and not the wait-for-20% question.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Two off-ramps. Original value is a statute clock. Current value is an investor maybe.",
        faqs,
        keywords: ["PMI cancellation original value", "PMI cancellation new appraisal"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Conventional borrower-paid PMI can come off in two different ways. The Homeowners Protection Act path uses{" "}
        <em>original</em> value and scheduled amortization (commonly a request at 80% and automatic termination at
        78% if the loan is current). Asking the servicer to cancel based on a <em>new appraisal of current value</em>{" "}
        is a separate overlay: seasoning, a tighter LTV test, and a paid appraisal. Snapshot as of {LENDING_FACTS_AS_OF}
        .
      </p>

      <p>{PMI_REMOVAL.notWaitFor20}</p>
      <p>{PMI_REMOVAL.notFhaMip}</p>

      <ComparisonTable
        caption={`How conventional PMI cancellation is usually framed as of ${LENDING_FACTS_AS_OF}. Confirm your note and servicer.`}
        columns={columns}
        rows={rows}
        footnote="Lender-paid PMI, split-premium PMI, and some investor products do not follow borrower-paid HPA cancellation. USDA and VA use different fees, not monthly PMI."
      />

      <h2>Call the servicer with the right question</h2>
      <p>
        Ask whether they are measuring original value (HPA) or whether they even offer a current-value appraisal
        cancellation — and what seasoning they require. A “you have 22% equity on a website estimate” screenshot is
        not either test. Program overview: <Link href="/loans/conventional">conventional loans</Link>.
      </p>

      <h2>If the loan is FHA</h2>
      <p>
        Stop. Annual MIP is timed from original LTV. Read{" "}
        <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">how MIP vs PMI actually leaves the loan</Link>. A
        conventional refinance can be the early-exit conversation; run{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after costs</Link> before you treat
        MIP savings as free.
      </p>

      <h2>Still deciding whether to put 20% down on a purchase?</h2>
      <p>
        That is <Link href="/blog/should-i-wait-for-20-percent-down">should I wait for 20% down</Link> — a first-time
        cash-and-timeline question, not a servicer cancellation form.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Read the PMI disclosure and the note. Lender-paid PMI often cannot be cancelled the HPA way.</li>
        <li>Ask the servicer in writing: original-value percent remaining, and whether current-value cancellation exists on this product.</li>
        <li>
          Keep the loan current. HPA automatic termination typically requires that. Late payments are a different
          problem than a low appraisal.
        </li>
      </ol>
    </ArticleShell>
  )
}
