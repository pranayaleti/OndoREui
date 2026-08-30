import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { CPA_LETTER_VS_RETURNS, LENDING_FACTS_AS_OF, SELF_EMPLOYED_HISTORY } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/cpa-letter-vs-tax-returns-underwriting"

const faqs = [
  {
    question: "Does a CPA letter replace two years of tax returns?",
    answer: CPA_LETTER_VS_RETURNS.whatDoesNot,
  },
  {
    question: "When does a CPA letter actually help?",
    answer: CPA_LETTER_VS_RETURNS.whatHelps,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "returns", heading: "Tax returns + transcripts", href: "/blog/two-years-of-tax-returns-vs-one-year-mortgage" },
  { id: "cpa", heading: "CPA letter / YTD P&L" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "moves",
    criterion: "What usually moves agency income",
    cells: {
      returns: CPA_LETTER_VS_RETURNS.typical,
      cpa: CPA_LETTER_VS_RETURNS.whatHelps,
    },
  },
  {
    id: "cannot",
    criterion: "What it cannot do",
    cells: {
      returns: "A missing year is still a missing year. Some overlays allow one year in the same line of work — that is not a CPA shortcut.",
      cpa: CPA_LETTER_VS_RETURNS.whatDoesNot,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "CPA Letter vs Tax Returns: What Actually Moves Underwriting",
  description:
    "Agency self-employed files are usually moved by returns and transcripts. A CPA letter supports; it does not replace the stack.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["CPA letter mortgage underwriting", "self employed tax returns vs CPA letter", "1099 P&L mortgage"],
  faqs,
})

export default function CpaLetterVsReturnsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "CPA Letter vs Tax Returns: What Actually Moves Underwriting",
        description:
          "Agency self-employed files are usually moved by returns and transcripts. A CPA letter supports; it does not replace the stack.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "A letter that states income is not a transcript. The return stack is still the engine.",
        faqs,
        keywords: ["CPA letter vs tax returns", "self employed mortgage documentation"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        On most conventional and FHA self-employed files, signed tax returns and IRS transcripts are what actually move
        the income calculation. A CPA letter can support that stack. It does not replace it. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}. This is not tax advice.
      </p>
      <p>{CPA_LETTER_VS_RETURNS.typical}</p>

      <h2>Returns vs letter</h2>
      <ComparisonTable
        caption={`What typically moves an agency self-employed file as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Overlays differ. A loan officer still applies the guide in force for the product."
      />

      <h2>Where a CPA package is useful</h2>
      <ul>
        <li>Year-to-date profit and loss while the current year is still open.</li>
        <li>Confirmation that the business exists and you are self-employed in that line of work.</li>
        <li>
          Support for a{" "}
          <Link href="/blog/two-years-of-tax-returns-vs-one-year-mortgage">one-year overlay conversation</Link> — next
          to a full year of filed returns, not instead of them. {SELF_EMPLOYED_HISTORY.oneYearOverlay}
        </li>
      </ul>
      <p>{CPA_LETTER_VS_RETURNS.k1Note} Deep guide: <Link href="/blog/k-1-income-what-usually-counts">K-1 income</Link>.</p>

      <h2>Where it stalls the file</h2>
      <ul>
        <li>
          “My CPA says I make $X” with no matching 1040, K-1, or transcripts. Underwriters are not collecting
          testimonials.
        </li>
        <li>
          Using a letter to paper over{" "}
          <Link href="/blog/just-went-1099-last-month">a 1099 job that started last month</Link>. Last month’s first
          invoice is still not a history.
        </li>
        <li>
          Co-mingled deposits that the P&amp;L cannot explain:{" "}
          <Link href="/blog/business-vs-personal-bank-co-mingling">business vs personal co-mingling</Link>.
        </li>
      </ul>

      <h2>If write-offs crush taxable income</h2>
      <p>
        {CPA_LETTER_VS_RETURNS.nonQm} Start with{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">bank-statement loans</Link> and the{" "}
        <Link href="/learn/non-qm">Non-QM hub</Link> — not a stronger letterhead.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Gather two years of personal (and business) returns plus transcripts even if you hope a letter helps.</li>
        <li>
          Use the <Link href="/calculators/income">income calculator</Link> with a documented average, not the CPA’s
          round number.
        </li>
        <li>
          Map: <Link href="/learn/variable-income">variable income hub</Link>. How the stacks are verified:{" "}
          <Link href="/blog/how-underwriters-verify-income">W-2 vs 1099 vs bank</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
