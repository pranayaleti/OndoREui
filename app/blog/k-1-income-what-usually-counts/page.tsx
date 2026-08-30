import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { K1_INCOME, LENDING_FACTS_AS_OF, SELF_EMPLOYED_HISTORY } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/k-1-income-what-usually-counts"

const faqs = [
  {
    question: "Can I qualify on K-1 distributions instead of the income line?",
    answer:
      "Usually no. Underwriters typically start from the K-1 income that matches the tax returns, not from cash you took out of the company. Distributions that exceed documented income often need a different explanation.",
  },
  {
    question: "Do I need two years of K-1s?",
    answer: `${SELF_EMPLOYED_HISTORY.twoYearTypical} ${K1_INCOME.declining}`,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "counts", heading: "Often counted", href: "/learn/variable-income" },
  { id: "limited", heading: "Often limited", href: "/blog/how-underwriters-verify-income" },
  { id: "excluded", heading: "Often excluded", href: "/blog/two-years-of-tax-returns-vs-one-year-mortgage" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "ordinary",
    criterion: "Ordinary business income on a K-1",
    cells: {
      counts: "When it is recurring, documented on two years of returns, and the borrower can actually access it.",
      limited: "When the trend is declining or the ownership share is small.",
      excluded: "One-time items, guaranteed-payment substitutes that do not match the returns, or income the partnership agreement does not let you take.",
    },
  },
  {
    id: "guaranteed",
    criterion: "Guaranteed payments (partnership)",
    cells: {
      counts: "When they appear consistently on the K-1 and match the return.",
      limited: "When they started in the most recent year with no history.",
      excluded: "When they are really a distribution labeled as a payment.",
    },
  },
  {
    id: "w2",
    criterion: "W-2 wages from the same S-corp",
    cells: {
      counts: "W-2 wages from the entity are a separate line from the K-1. Both can count when documented.",
      limited: "A sudden W-2 increase in an election year with no matching history.",
      excluded: "W-2 that does not match payroll records or the business return.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "K-1 Income: What Usually Counts",
  description:
    "Partnership and S-corp K-1 income is taken from the form and matching returns, not from distributions alone.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["K-1 income mortgage", "S-corp partnership qualifying income", "Schedule K-1 home loan"],
  faqs,
})

export default function K1IncomePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "K-1 Income: What Usually Counts",
        description:
          "Partnership and S-corp K-1 income is taken from the form and matching returns, not from distributions alone.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The K-1 is a tax form. Qualifying income is the pattern an underwriter can average.",
        faqs,
        keywords: ["K-1 mortgage income", "S-corp K-1 qualifying"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you are a partner or S-corp owner, underwriters usually count K-1 income that shows up on the tax returns
        and that you can actually take — not the cash that hit your personal account last quarter. Distributions by
        themselves are not a qualifying method. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>What the file is trying to prove</h2>
      <p>{K1_INCOME.typical}</p>
      <p>
        {K1_INCOME.liquidity} See{" "}
        <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link> for how this stack
        sits next to W-2 and 1099 files.
      </p>

      <ComparisonTable
        caption={`What usually counts on a K-1 file as of ${LENDING_FACTS_AS_OF}. Overlays apply.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot, not a credit decision. Confirm the investor guide in force for your product."
      />

      <h2>Two years, a down year, and a new entity</h2>
      <p>{K1_INCOME.declining}</p>
      <p>
        A brand-new LLC or S-election last year is closer to{" "}
        <Link href="/blog/just-went-1099-last-month">I just went 1099 last month</Link> than to a seasoned partner
        file. History in the same line of work:{" "}
        <Link href="/blog/two-years-of-tax-returns-vs-one-year-mortgage">two years of returns vs one year</Link>.
      </p>

      <h2>Documents to gather</h2>
      <ul>
        <li>Two years of personal returns with all K-1s, plus business returns for the entity.</li>
        <li>IRS transcripts when the lender orders them — they have to match what was filed.</li>
        <li>Year-to-date profit and loss if you are in a new tax year, and a YTD K-1 or equivalent if the CPA will issue one.</li>
        <li>The operating agreement or bylaws if ownership percentage or distribution rights are in question.</li>
        <li>
          W-2s and paystubs if you also take a salary from the S-corp. That is not a substitute for the K-1; it is
          another line.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Average the income you can document, not last quarter’s distribution.</li>
        <li>
          Use the <Link href="/calculators/income">income calculator</Link> with that average.
        </li>
        <li>
          If write-offs crush taxable income while deposits look strong, that is a{" "}
          <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">bank-statement / Non-QM</Link>{" "}
          conversation, not “please ignore the K-1.”
        </li>
      </ol>
    </ArticleShell>
  )
}
