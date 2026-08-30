import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { DTI_EDUCATION, LENDING_FACTS_AS_OF, VA_RESIDUAL_INCOME } from "@/lib/content"
import Link from "next/link"

const path = "/blog/va-residual-income-vs-dti"

const faqs = [
  {
    question: "If my DTI is under 41%, do I skip residual income?",
    answer:
      "No. Residual income is a separate VA test. A DTI that looks comfortable can still fail residual, depending on family size, region, and the proposed payment.",
  },
  {
    question: "Where do I find the dollar table?",
    answer: VA_RESIDUAL_INCOME.utahRegionNote,
  },
]

export const metadata = articleMetadata({
  path,
  title: "VA Residual Income vs DTI",
  description:
    "VA residual income is cash left after PITI and debts. It can fail when DTI looks fine, and pass when DTI looks high.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["VA residual income vs DTI", "VA residual income Utah"],
  faqs,
})

export default function VaResidualPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "VA Residual Income vs DTI",
        description:
          "VA residual income is cash left after PITI and debts. It can fail when DTI looks fine, and pass when DTI looks high.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "DTI is a ratio. Residual income is leftover cash. VA looks at both.",
        faqs,
        keywords: ["VA residual income", "VA DTI residual"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        VA residual income is not DTI with a different name. {VA_RESIDUAL_INCOME.method} Snapshot as of{" "}
        {LENDING_FACTS_AS_OF} ({VA_RESIDUAL_INCOME.source}).
      </p>

      <h2>DTI vs residual, in one pass</h2>
      <p>
        {DTI_EDUCATION.frontendNote} {DTI_EDUCATION.backendNote} Residual starts after those housing and debt numbers,
        then subtracts estimated maintenance and utilities. What is left has to clear the published table for region,
        loan amount, and family size.
      </p>
      <p>{VA_RESIDUAL_INCOME.utahRegionNote}</p>

      <h2>Why a “fine” DTI can still fail</h2>
      <ul>
        <li>Large family size raises the residual requirement.</li>
        <li>High taxes, insurance, or HOA inflate PITI even when the note rate looks ordinary.</li>
        <li>Counted debts (including student loans as the investor requires) shrink leftover cash.</li>
      </ul>
      <p>
        Compensating factors can matter on residual just as they do on DTI. They are findings, not a slogan. Income
        still has to be verified:{" "}
        <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Do not memorize a residual dollar figure from this site. Ask a loan officer to run residual on the actual
        proposed PITI and family size, then compare with{" "}
        <Link href="/calculators/affordability">affordability</Link> as an illustration only. VA overview:{" "}
        <Link href="/loans/va">VA loans</Link>.
      </p>
    </ArticleShell>
  )
}
