import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { JUST_WENT_1099, LENDING_FACTS_AS_OF, SELF_EMPLOYED_HISTORY } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/just-went-1099-last-month"

const faqs = [
  {
    question: "Can last month’s first 1099 invoice count as income?",
    answer: JUST_WENT_1099.seasoning,
  },
  {
    question: "Does my old W-2 in the same job help?",
    answer: JUST_WENT_1099.sameOccupation,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "now", heading: "Usually usable now", href: "/blog/how-underwriters-verify-income" },
  { id: "later", heading: "Usually not yet", href: "/blog/two-years-of-tax-returns-vs-one-year-mortgage" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "w2",
    criterion: "Remaining W-2 job",
    cells: {
      now: "Base pay, and overtime/bonus only with a history that is likely to continue.",
      later: "A job you already quit, unless a one-time payout is documented as non-continuing and excluded correctly.",
    },
  },
  {
    id: "new1099",
    criterion: "1099 work started last month",
    cells: {
      now: "Almost never as a full qualifying average. Contracts can support the story; they do not replace a tax-year history.",
      later: "After you have the history the investor requires — often two years, sometimes a one-year overlay in the same occupation.",
    },
  },
  {
    id: "spouse",
    criterion: "Spouse or co-borrower W-2",
    cells: {
      now: "Their documented W-2 can still count on a joint file.",
      later: "Their income does not season your new 1099.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "I Just Went 1099 Last Month",
  description:
    "A brand-new 1099 job is usually not yet a qualifying average. What still counts from W-2 history and when a one-year overlay even enters the chat.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["just went 1099 mortgage", "new contractor home loan", "W-2 to 1099 mortgage"],
  faqs,
})

export default function JustWent1099Page() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "I Just Went 1099 Last Month",
        description:
          "A brand-new 1099 job is usually not yet a qualifying average. What still counts from W-2 history and when a one-year overlay even enters the chat.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "A career change is not a documentation shortcut. The average still needs a history.",
        faqs,
        keywords: ["1099 last month mortgage", "contractor seasoning"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you left a W-2 last month and you are now on 1099s, the new contract income is usually not yet a number an
        underwriter can average. Remaining W-2 wages, a spouse’s W-2, and a documented history in the same occupation
        can still matter. Last month’s first invoice does not replace two tax years. Snapshot as of {LENDING_FACTS_AS_OF}
        .
      </p>

      <h2>Why “I just started” stalls the file</h2>
      <p>{JUST_WENT_1099.seasoning}</p>
      <p>
        {SELF_EMPLOYED_HISTORY.twoYearTypical} This is a different question from the{" "}
        <Link href="/blog/1099-mortgage-documentation-checklist">1099 documentation checklist</Link>, which is for
        people who already have a contract-income history.
      </p>

      <ComparisonTable
        caption={`What typically counts the month after you go 1099, as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Overlays differ. A loan officer has to apply the guide for the product, not this table."
      />

      <h2>When a one-year overlay even enters the chat</h2>
      <p>{JUST_WENT_1099.sameOccupation}</p>
      <p>
        {SELF_EMPLOYED_HISTORY.oneYearOverlay} Details:{" "}
        <Link href="/blog/two-years-of-tax-returns-vs-one-year-mortgage">two years vs one year</Link>.
      </p>
      <p>Typical compensating pieces — still not a promise:</p>
      <ul>
        <li>Same occupation and similar duties (for example, a nurse who went 1099 in the same specialty).</li>
        <li>A full year of filed returns is still the usual overlay ask, not 30 days of invoices.</li>
        <li>Contracts that show ongoing work, plus reserves and DTI that is not already at the edge.</li>
      </ul>

      <h2>What to do this month</h2>
      <ol>
        <li>Do not write an offer that assumes the new 1099 income will count.</li>
        <li>
          Bring W-2s, the last paystubs from the job you left, and any contracts — then ask which lines can be used{" "}
          <em>now</em>.
        </li>
        <li>
          Use the <Link href="/calculators/income">income calculator</Link> with income you can already document.
        </li>
        <li>
          If you must buy before a tax year of 1099s exists, the conversation may be a co-borrower, a smaller loan, or
          waiting — not a hidden exception.{" "}
          <Link href="/learn/variable-income">Variable income hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
