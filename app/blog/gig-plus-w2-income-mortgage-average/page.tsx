import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { GIG_PLUS_W2, LENDING_FACTS_AS_OF, VARIABLE_INCOME_LIKELY_TO_CONTINUE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/gig-plus-w2-income-mortgage-average"

const faqs = [
  {
    question: "Can I use last month’s best gig week plus my W-2 salary?",
    answer: GIG_PLUS_W2.gigLeg,
  },
  {
    question: "Does my spouse’s W-2 automatically cover a volatile gig?",
    answer: GIG_PLUS_W2.joint,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "w2", heading: "W-2 stream", href: "/blog/w2-overtime-likely-to-continue" },
  { id: "gig", heading: "Gig / 1099 stream", href: "/blog/just-went-1099-last-month" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "how",
    criterion: "How it is typically averaged",
    cells: {
      w2: GIG_PLUS_W2.w2Leg,
      gig: GIG_PLUS_W2.gigLeg,
    },
  },
  {
    id: "mix",
    criterion: "How the two are combined",
    cells: {
      w2: "Base W-2 plus any overtime/bonus/commission that survives the likely-to-continue test.",
      gig: GIG_PLUS_W2.method,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Gig Plus W-2 Mix: How the Average Is Built",
  description:
    "Gig or 1099 income and W-2 wages are usually averaged as separate streams, then added. A peak gig month is not the qualifying method.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["gig economy W-2 mortgage", "side hustle plus salary loan", "1099 and W-2 income average"],
  faqs,
})

export default function GigPlusW2IncomePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Gig Plus W-2 Mix: How the Average Is Built",
        description:
          "Gig or 1099 income and W-2 wages are usually averaged as separate streams, then added. A peak gig month is not the qualifying method.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Two engines, two histories, then add. Not last week’s app deposits plus salary.",
        faqs,
        keywords: ["gig plus W-2 mortgage", "hybrid income underwriting"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you have a W-2 job and gig or 1099 income, underwriters typically average each stream on its own history,
        then add them. The W-2 does not automatically cover an undocumented side hustle, and a strong gig month does not
        replace W-2 overtime rules. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{GIG_PLUS_W2.method}</p>

      <h2>Two streams</h2>
      <ComparisonTable
        caption={`W-2 vs gig legs as of ${LENDING_FACTS_AS_OF}. Confirm the guide in force.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. A conversation does not average your file."
      />

      <h2>The W-2 leg</h2>
      <p>
        {GIG_PLUS_W2.w2Leg} {VARIABLE_INCOME_LIKELY_TO_CONTINUE.overtime} Deep guide:{" "}
        <Link href="/blog/w2-overtime-likely-to-continue">overtime, likely to continue</Link>. Commission on the W-2 is
        still commission:{" "}
        <Link href="/blog/commission-income-mortgage-averaging">averaging and a down year</Link>.
      </p>

      <h2>The gig / 1099 leg</h2>
      <p>
        {GIG_PLUS_W2.gigLeg} If the gig started last month, that leg is usually not yet an average:{" "}
        <Link href="/blog/just-went-1099-last-month">I just went 1099 last month</Link>. Documentation:{" "}
        <Link href="/blog/1099-mortgage-documentation-checklist">1099 checklist</Link>.
      </p>
      <p>
        A CPA letter does not turn app deposits into two years of returns:{" "}
        <Link href="/blog/cpa-letter-vs-tax-returns-underwriting">CPA letter vs tax returns</Link>.
      </p>

      <h2>Joint files</h2>
      <p>
        {GIG_PLUS_W2.joint}{" "}
        <Link href="/blog/spouse-w2-offset-1099-volatility">Using a spouse’s W-2 to offset 1099 volatility</Link> is a
        co-borrower decision, not a hidden extra paycheck. Utah is not a community-property state.
      </p>

      <h2>Worked shape (illustration)</h2>
      <p>
        W-2 base that is documented on the last two W-2s can be a stable core. Gig 1099s that show $40,000 then $22,000
        are usually averaged (or limited if the trend is declining) — the $4,000 app month in the file window does not
        replace that average. This paragraph is a shape, not your qualifying income.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Separate the paystubs/W-2s from the 1099s and gig statements. Do not blend them into one spreadsheet total.</li>
        <li>
          Enter a documented combined average in the <Link href="/calculators/income">income calculator</Link>, not the
          best month.
        </li>
        <li>
          Map: <Link href="/learn/variable-income">variable income hub</Link>. How stacks are verified:{" "}
          <Link href="/blog/how-underwriters-verify-income">W-2 vs 1099 vs bank</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
