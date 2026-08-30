import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, STREAMLINE_REFI } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/fha-va-streamline-refinance-less-docs"

const faqs = [
  {
    question: "Is an FHA Streamline a no-document refinance?",
    answer: STREAMLINE_REFI.fha,
  },
  {
    question: "Is a VA IRRRL the same as a cash-out?",
    answer: `${STREAMLINE_REFI.va} Cash-out is a different product with a full underwrite.`,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "fha", heading: "FHA Streamline", href: "/loans/fha" },
  { id: "va", heading: "VA IRRRL", href: "/loans/va" },
  { id: "full", heading: "Full credit-qualifying refi", href: "/refinance/rate-term" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "who",
    criterion: "Who it is for",
    cells: {
      fha: "You already have an FHA loan and want FHA-to-FHA with less documentation.",
      va: "You already have a VA loan and want a VA-to-VA rate reduction (IRRRL).",
      full: "Any program change, cash-out, occupancy change, or a file that cannot pass net-benefit / payment-history tests.",
    },
  },
  {
    id: "docs",
    criterion: "What “less docs” still requires",
    cells: {
      fha: STREAMLINE_REFI.fha,
      va: STREAMLINE_REFI.va,
      full: "Full income, assets, appraisal (unless waived), and credit — the usual refinance stack. See break-even math.",
    },
  },
  {
    id: "still",
    criterion: "Still in the file",
    cells: {
      fha: STREAMLINE_REFI.stillRequires,
      va: "Occupancy certification, title, a new note, and often a recoupment test. Overlays may still pull credit.",
      full: "Everything a purchase-style underwrite would want, plus the current mortgage being paid off.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Streamline Refi: What “Less Docs” Still Requires",
  description:
    "FHA Streamline and VA IRRRL reduce documentation. Occupancy, payment history, and a net-benefit test still apply.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["FHA streamline refinance", "VA IRRRL requirements", "less docs refinance"],
  faqs,
})

export default function StreamlineRefiPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Streamline Refi: What “Less Docs” Still Requires",
        description:
          "FHA Streamline and VA IRRRL reduce documentation. Occupancy, payment history, and a net-benefit test still apply.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Less documentation is not no underwrite. Occupancy and net benefit still have to work.",
        faqs,
        keywords: ["FHA streamline", "VA IRRRL", "streamline refinance documents"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A streamline refinance is FHA-to-FHA or VA-to-VA with a shorter document list — not a generic “no closing
        cost, no docs” refinance. Occupancy, recent payment history, and a net-benefit or recoupment test still apply.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <ComparisonTable
        caption={`FHA Streamline vs VA IRRRL vs a full refinance as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Conventional limited-cash-out refinances are a different investor product. They are not FHA Streamline or IRRRL."
      />

      <h2>FHA Streamline</h2>
      <p>{STREAMLINE_REFI.fha}</p>
      <p>
        Credit-qualifying vs non-credit-qualifying streamlines are different files. Skipping income docs on a
        non-credit-qualifying path is allowed only when HUD and the lender overlay say so — and the net-tangible-benefit
        test still has to pass. MIP on the new FHA loan follows FHA rules; it is not automatically deleted. See{" "}
        <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">how MIP vs PMI ends</Link>.
      </p>

      <h2>VA IRRRL</h2>
      <p>{STREAMLINE_REFI.va}</p>
      <p>
        Funding-fee treatment on an IRRRL is a separate snapshot on{" "}
        <Link href="/blog/va-funding-fee-finance-vs-pay-cash">VA funding fee</Link>. Residual income is not re-quoted
        as a dollar figure on this page; occupancy still has to match VA rules.
      </p>

      <h2>What “less docs” does not skip</h2>
      <p>{STREAMLINE_REFI.stillRequires}</p>
      <ul>
        <li>You generally cannot take cash out on a true streamline.</li>
        <li>Late payments in the lookback usually push you to a full refinance — or no refinance.</li>
        <li>
          Costs still exist. Run{" "}
          <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even including points and origination</Link>{" "}
          even when the appraisal is waived. A lower note rate can still lose.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Confirm the current loan is FHA or VA. Conventional-to-conventional is not this product.</li>
        <li>
          Use the <Link href="/calculators/refinance">refinance calculator</Link> with all costs, then talk through
          whether streamline or <Link href="/refinance/rate-term">rate-and-term</Link> even applies.
        </li>
        <li>
          Hub: <Link href="/refinance">refinance in Utah</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
