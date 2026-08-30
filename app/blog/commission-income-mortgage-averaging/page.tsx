import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { DTI_EDUCATION, LENDING_FACTS_AS_OF, VARIABLE_INCOME_LIKELY_TO_CONTINUE } from "@/lib/content"
import Link from "next/link"

const path = "/blog/commission-income-mortgage-averaging"

const faqs = [
  {
    question: "If last year was a down year, can we skip it?",
    answer:
      "Usually no. A down year is typically averaged in. A declining trend can reduce the qualifying average even if the most recent quarter recovered.",
  },
  {
    question: "Is commission-only harder than W-2 plus commission?",
    answer:
      "Often yes, because there is no base salary floor. Two years in the same line of work is a common ask. A brand-new 100% commission role is one of the harder files.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Commission-Only Sales: Averaging and a Down Year",
  description:
    "Commission income is typically averaged, and a down year usually counts. How 12- vs 24-month averages work.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["commission income mortgage", "commission only loan averaging down year"],
  faqs,
})

export default function CommissionIncomePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Commission-Only Sales: Averaging and a Down Year",
        description:
          "Commission income is typically averaged, and a down year usually counts. How 12- vs 24-month averages work.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "A recovered March does not erase a down year. The average is the product.",
        faqs,
        keywords: ["commission mortgage averaging", "sales commission down year underwriting"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Commission-only pay can support a mortgage when the history is documented. The underwriter is usually averaging
        12 or 24 months, not taking your best listing year. {VARIABLE_INCOME_LIKELY_TO_CONTINUE.commissionDownYear}{" "}
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>How the average is built</h2>
      <p>{DTI_EDUCATION.variableIncomeNote}</p>
      <p>A simple decision framework:</p>
      <ul>
        <li>
          <strong>Stable or rising two-year history.</strong> Many files average the two years (or year-to-date plus
          last year, depending on the guide and the trend).
        </li>
        <li>
          <strong>Down year.</strong> The low year usually stays in the math. You can explain it. You rarely get to
          delete it.
        </li>
        <li>
          <strong>New to commission.</strong> Time in the same line of work matters. Switching from salaried teaching
          to 100% commission real estate last month is not the same file as a decade of W-2 plus commission in the
          same industry.
        </li>
      </ul>

      <h2>Documents that usually show up</h2>
      <ul>
        <li>Two years of W-2s (if any base) and/or 1099s plus tax returns and transcripts.</li>
        <li>Year-to-date paystubs or a commission statement that matches deposits.</li>
        <li>A written explanation for a gap, a broker change, or a market down year.</li>
      </ul>
      <p>
        If you are 1099 rather than W-2, use the{" "}
        <Link href="/blog/1099-mortgage-documentation-checklist">1099 documentation checklist</Link>. Overtime on a W-2
        is a different “likely to continue” test:{" "}
        <Link href="/blog/w2-overtime-likely-to-continue">overtime guide</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Do not shop using last month’s commission check as monthly income. Run the{" "}
        <Link href="/calculators/income">income calculator</Link> with a conservative average, then talk with a loan
        officer about which average the investor will accept for your product. That conversation is not an approval.
      </p>
    </ArticleShell>
  )
}
