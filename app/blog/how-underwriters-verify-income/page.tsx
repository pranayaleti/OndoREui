import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { DTI_EDUCATION, LENDING_FACTS_AS_OF, SELF_EMPLOYED_HISTORY } from "@/lib/content"
import Link from "next/link"

const path = "/blog/how-underwriters-verify-income"

const faqs = [
  {
    question: "Is a verbal VOE enough for W-2 overtime?",
    answer:
      "Usually you still need W-2s and year-to-date paystubs. VOE supports that the job and overtime are likely to continue. It does not replace the average.",
  },
  {
    question: "When do bank statements replace tax returns?",
    answer:
      "On some Non-QM products, not on a typical agency file. Taxable income is still the starting point for most conventional and FHA self-employed files.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "How Underwriters Verify Income (W-2 vs 1099 vs Bank)",
  description:
    "W-2, 1099, and bank-statement files are verified differently: paystubs and VOE vs returns and transcripts vs deposits.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["how underwriters verify income", "W-2 vs 1099 vs bank statement mortgage"],
  faqs,
})

export default function VerifyIncomePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "How Underwriters Verify Income (W-2 vs 1099 vs Bank)",
        description:
          "W-2, 1099, and bank-statement files are verified differently: paystubs and VOE vs returns and transcripts vs deposits.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Each stack is proving a durable average, not a good week.",
        faqs,
        keywords: ["underwriter income verification", "W-2 1099 bank statement"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Underwriters verify income to support an average that can be used in DTI, not to rubber-stamp last month’s
        deposit. W-2, 1099, and bank-statement files prove that average with different paper. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>

      <h2>W-2</h2>
      <p>
        Typical stack: paystubs, W-2s, and a verification of employment. Base pay is the easy line. Overtime, bonus,
        and commission need a history that is{" "}
        <Link href="/blog/w2-overtime-likely-to-continue">likely to continue</Link>. {DTI_EDUCATION.variableIncomeNote}
      </p>

      <h2>1099 / tax returns</h2>
      <p>{SELF_EMPLOYED_HISTORY.twoYearTypical}</p>
      <p>
        Transcripts have to match what was filed. YTD profit and loss supports the current year. A CPA letter does not
        replace returns. Checklist:{" "}
        <Link href="/blog/1099-mortgage-documentation-checklist">1099 documentation</Link>. One-year overlays:{" "}
        <Link href="/blog/two-years-of-tax-returns-vs-one-year-mortgage">two years vs one year</Link>. K-1 partners:{" "}
        <Link href="/blog/k-1-income-what-usually-counts">what usually counts</Link>. Existing rentals:{" "}
        <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E on a purchase file</Link>.
      </p>

      <h2>Bank statements</h2>
      <p>
        Some Non-QM programs count eligible deposits instead of taxable income when write-offs crush the return.
        That is a different product, pricing, and overlay. It is not a conventional shortcut.{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">Bank-statement loans</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Bring the stack that matches how you are paid, then use the{" "}
        <Link href="/calculators/income">income calculator</Link> with a documented average. If a pre-approval later
        fails, the usual reasons are in{" "}
        <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>. Large unexplained deposits:{" "}
        <Link href="/blog/large-deposits-60-day-paper-trail">60-day paper trail</Link>.
      </p>
    </ArticleShell>
  )
}
