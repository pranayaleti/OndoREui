import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { BIWEEKLY_VS_REFI, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/biweekly-extra-principal-vs-refinance"

const faqs = [
  {
    question: "Does biweekly always save a quoted amount of interest?",
    answer: BIWEEKLY_VS_REFI.noPromise,
  },
  {
    question: "Is extra principal the same as refinancing?",
    answer: BIWEEKLY_VS_REFI.vsRefi,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "bi", heading: "Biweekly / extra principal", href: "/blog/mortgage-paydown-hacks" },
  { id: "refi", heading: "Refinance", href: "/blog/refinance-break-even-when-lower-rate-loses" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What changes",
    cells: {
      bi: BIWEEKLY_VS_REFI.biweekly,
      refi: "Note rate, term, and closing costs. The payment can fall or rise depending on term.",
    },
  },
  {
    id: "same",
    criterion: "Same dollars, different machine",
    cells: {
      bi: BIWEEKLY_VS_REFI.extraPrincipal,
      refi: "Costs have to be earned back. See break-even — a lower note rate can still lose if you move first.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Biweekly Extra Principal vs Refinance",
  description:
    "One extra payment a year versus changing the note. Illustrate — this page does not quote interest saved. Link break-even and pay-down tactics.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["biweekly mortgage vs refinance", "extra principal vs refinance", "one extra payment a year"],
  faqs,
})

export default function BiweeklyVsRefinancePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Biweekly Extra Principal vs Refinance",
        description:
          "One extra payment a year versus changing the note. Illustrate — this page does not quote interest saved.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Amortization arithmetic versus a new note. No savings promise.",
        faqs,
        keywords: ["biweekly vs refinance", "extra principal"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A true biweekly schedule is 26 half-payments a year — one extra full payment compared with 12 monthly payments.
        A refinance changes the note. They are different tools. This page does not quote a dollar of interest saved or a
        number of years shaved. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{BIWEEKLY_VS_REFI.noPromise}</p>

      <h2>Biweekly, extra principal, refinance</h2>
      <ComparisonTable
        caption={`Paydown vs refinance as of ${LENDING_FACTS_AS_OF}. Illustrate with your balance.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the servicer applies extra amounts to principal and does not charge a biweekly vendor fee that eats the extra."
      />
      <p>
        Tactics overview (biweekly, recast, round-up):{" "}
        <Link href="/blog/mortgage-paydown-hacks">mortgage pay-down hacks</Link>. If the question is a lower rate:{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">when a lower rate still loses after costs</Link>.
      </p>

      <h2>When extra principal is the conversation</h2>
      <ul>
        <li>You like the current rate and want faster payoff without new closing costs.</li>
        <li>You can send extra principal the servicer will apply — ask, do not assume a third-party biweekly company.</li>
        <li>
          A recast after a lump sum is another servicing tool; it is not a refinance.{" "}
          <Link href="/blog/recast-vs-refinance">Recast vs refinance</Link>.
        </li>
      </ul>

      <h2>When refinance is the conversation</h2>
      <ul>
        <li>You want a different rate or term, and you will stay long enough to earn the costs back.</li>
        <li>
          “No closing cost” still has a rate trade:{" "}
          <Link href="/blog/no-closing-cost-refinance-rate-credit-tradeoff">no-closing-cost refinance</Link>.
        </li>
      </ul>

      <h2>Illustrate — do not memorize a blog savings number</h2>
      <p>
        Use the <Link href="/calculators/mortgage-payment">mortgage payment calculator</Link> to see extra principal on
        the current note, and the <Link href="/calculators/refinance">refinance calculator</Link> to include costs on a
        new note. Neither output is a quote.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Ask your servicer how extra principal and biweekly drafts are applied.</li>
        <li>If you are shopping a refinance, run break-even including points and origination.</li>
        <li>
          A conversation is not an approval: <Link href="/qualify">start a mortgage conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
