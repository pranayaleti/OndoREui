import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { DTI_EDUCATION, EXAMPLE_NOTE, EXAMPLE_PURCHASE_PRICE_UTAH, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/can-i-get-a-mortgage-if-my-income-changes-every-month"

const faqs = [
  {
    question: "Will a lender use my best month?",
    answer:
      "Usually no. Variable income is typically averaged over a documented period. A spike without a history is more likely to be treated as non-qualifying or limited.",
  },
  {
    question: "What if I just switched from W-2 to 1099?",
    answer:
      "A short history in the new structure is one of the harder files. Some programs want two years in the same line of work. Ask before you shop as if last year’s W-2 still counts the same way.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Can I Get a Mortgage If My Income Changes Every Month?",
  description:
    "Yes, if you can document a pattern. Underwriters typically average 12–24 months of variable income rather than last month’s paycheck.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["variable income mortgage", "commission mortgage", "overtime mortgage qualification"],
  faqs,
})

export default function VariableIncomeArticlePage() {
  const examplePrice = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title: "Can I Get a Mortgage If My Income Changes Every Month?",
        description:
          "Yes, if you can document a pattern. Underwriters typically average 12–24 months of variable income rather than last month’s paycheck.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "A changing paycheck is common. An undocumented spike is not a qualifying method.",
        faqs,
        keywords: ["variable income mortgage", "commission mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Yes. Many people with overtime, bonus, commission, tips, or 1099 income get mortgages. The underwriter is
        usually asking whether the average is durable, not whether you had a strong March. {EXAMPLE_NOTE}
      </p>

      <h2>The short version</h2>
      <p>{DTI_EDUCATION.variableIncomeNote}</p>
      <p>
        Snapshot as of {LENDING_FACTS_AS_OF}. Your lender’s overlay can be stricter than the investor guide. That is
        normal.
      </p>

      <h2>A worked example (illustration only)</h2>
      <p>
        Suppose you are looking at a ${examplePrice} purchase in Utah. Your base W-2 is steady, and overtime shows on
        two years of W-2s plus year-to-date paystubs. An underwriter may average the overtime and add it to base pay,
        then run DTI on that average. If overtime disappeared this year, that average can drop even if you “feel”
        like you still earn it.
      </p>
      <p>
        Run the same price through the{" "}
        <Link href="/calculators/income">required income calculator</Link> and the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> to see how sensitive the illustration
        is. Those tools do not know your overtime history.
      </p>

      <h2>What usually helps the file</h2>
      <ul>
        <li>Same line of work for a documented period (often two years for self-employed or commission).</li>
        <li>Paystubs, W-2s, and (for 1099) tax returns plus transcripts that match.</li>
        <li>A written explanation for gaps, job changes, or a drop in the most recent year.</li>
      </ul>

      <h2>What usually does not help</h2>
      <ul>
        <li>Cash that never hit a statement.</li>
        <li>A verbal promise of future overtime.</li>
        <li>Moving large gifts without a paper trail. See{" "}
          <Link href="/blog/gift-funds-down-payment-rules">gift-fund documentation</Link>.
        </li>
      </ul>

      <h2>If tax returns understate cash flow</h2>
      <p>
        That is a different product conversation:{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">
          bank-statement loans
        </Link>
        . It is not a conventional loophole, and it is not automatically “better.”
      </p>
    </ArticleShell>
  )
}
