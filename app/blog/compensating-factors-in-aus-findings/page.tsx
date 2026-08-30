import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { COMPENSATING_FACTORS, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/compensating-factors-in-aus-findings"

const faqs = [
  {
    question: "If I have extra reserves, will findings automatically approve?",
    answer: COMPENSATING_FACTORS.notAGuarantee,
  },
  {
    question: "Can I omit HOA from DTI and call it a compensating factor?",
    answer: COMPENSATING_FACTORS.notHiddenIncome,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "aus", heading: "AUS findings", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
  { id: "manual", heading: "Manual underwrite", href: "/blog/declined-after-pre-approval" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "job",
    criterion: "What the factor is doing",
    cells: {
      aus: "Messages and overlays on an automated result (often DU or LPA). They comment on a file that already ran.",
      manual: "Published lists (FHA high-DTI compensating factors are the usual example) a human underwriter may apply when AUS is not the path.",
    },
  },
  {
    id: "examples",
    criterion: "What actually appears",
    cells: {
      aus: COMPENSATING_FACTORS.typical,
      manual: "Often the same themes — reserves, residual, payment shock, unused income — with a written test, not a vibe.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Compensating Factors That Appear in Findings",
  description:
    "Reserves, residual income, and other strengths that show up in AUS or manual underwriting. Not a guarantee that findings will flip.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["compensating factors mortgage", "AUS findings compensating factors", "FHA compensating factors"],
  faqs,
})

export default function CompensatingFactorsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Compensating Factors That Appear in Findings",
        description:
          "Reserves, residual income, and other strengths that show up in AUS or manual underwriting. Not a guarantee that findings will flip.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Documented strengths in the file — not a second score that overrides a decline.",
        faqs,
        keywords: ["compensating factors", "AUS findings"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Compensating factors are documented strengths that can appear in automated underwriting findings or a manual
        underwrite when DTI, reserves, or another test is tight. They are comments and overlays, not a promise that a
        borderline file will clear. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{COMPENSATING_FACTORS.what}</p>
      <p>{COMPENSATING_FACTORS.notAGuarantee}</p>

      <h2>Findings vs a letter vs clear to close</h2>
      <p>
        A pre-approval letter is not findings. Findings are not clear to close. See{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. A decline after a
        letter is usually a later condition fail —{" "}
        <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link> — not a missing pep talk in
        the findings.
      </p>
      <ComparisonTable
        caption={`Where compensating factors show up as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the guide and the findings in force for the product."
      />

      <h2>Factors that actually show up</h2>
      <p>{COMPENSATING_FACTORS.typical}</p>
      <ul>
        <li>
          <strong>Reserves after cash to close.</strong>{" "}
          <Link href="/blog/mortgage-reserves-months-of-pitia">Months of PITIA</Link> — remaining assets, not extra
          closing costs.
        </li>
        <li>
          <strong>DTI that includes HOA.</strong> A “modest payment” that omitted dues is not a factor. See{" "}
          <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end with HOA</Link>.
        </li>
        <li>
          <strong>VA residual income.</strong> A separate test from DTI —{" "}
          <Link href="/blog/va-residual-income-vs-dti">residual vs DTI</Link>. This page does not quote residual
          dollars.
        </li>
        <li>
          <strong>Unused income.</strong> Overtime or bonus that was not used to qualify can appear only if it is
          documented and likely to continue.
        </li>
      </ul>
      <p>{COMPENSATING_FACTORS.notHiddenIncome}</p>

      <h2>What happens next</h2>
      <ol>
        <li>If findings are tight, ask which messages actually printed — not which slogan to add to the letter.</li>
        <li>Document reserves, housing history, and unused income the guide will accept. Informal stories do not count.</li>
        <li>
          A conversation still does not approve you: <Link href="/qualify">what a mortgage conversation asks</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
