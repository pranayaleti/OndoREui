import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { CROSS_COLLATERAL, LENDING_FACTS_AS_OF, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/cross-collateral-equity-to-buy-another-house"

const faqs = [
  {
    question: "Can I use my current house as collateral to buy another one on a standard Fannie loan?",
    answer: CROSS_COLLATERAL.notInvented,
  },
  {
    question: "Is cross-collateral the same as a cash-out or a HELOC?",
    answer: CROSS_COLLATERAL.vsCashOut,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "cross", heading: "Cross-collateral / blanket", href: "/learn/investment" },
  { id: "cash", heading: "Cash-out then purchase", href: "/blog/cash-out-to-buy-a-rental" },
  { id: "heloc", heading: "HELOC draw", href: "/blog/heloc-vs-cash-out-refinance" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "tie",
    criterion: "What is tied together",
    cells: {
      cross: CROSS_COLLATERAL.what,
      cash: "Cash comes out of one house. The new purchase is a separate loan and occupancy.",
      heloc: "A second lien on the first house. The new purchase is still a separate loan unless an investor blankets both.",
    },
  },
  {
    id: "risk",
    criterion: "Default risk",
    cells: {
      cross: "Default on the shared debt can put both properties at risk.",
      cash: "Each loan stands on its own collateral after the cash moves.",
      heloc: "Default on the HELOC is a second-lien problem on the first house, not automatically a lien on the second house.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Cross-Collateral and Using Equity to Buy Another House",
  description:
    "Pledging more than one property versus cash-out or a HELOC. Educational only — not a published product you can assume.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["cross collateral mortgage", "using equity to buy another house", "blanket mortgage rental"],
  faqs,
})

export default function CrossCollateralPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Cross-Collateral and Using Equity to Buy Another House",
        description:
          "Pledging more than one property versus cash-out or a HELOC. Educational only — not a published product you can assume.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Tying two houses together is a risk conversation, not a standard agency purchase.",
        faqs,
        keywords: ["cross-collateral", "equity to buy another house"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Using equity to buy another house usually means taking cash out or drawing a HELOC — not pledging both
        properties on one blanket loan. Cross-collateral exists on some portfolio and private files. It is not a
        published Fannie, Freddie, FHA, VA, or USDA purchase product you can assume. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{CROSS_COLLATERAL.notInvented}</p>
      <p>{OCCUPANCY_TYPES.fraud}</p>

      <h2>Three ways people mean “use the equity”</h2>
      <ComparisonTable
        caption={`Cross-collateral vs cash-out vs HELOC as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Product availability is an overlay. This page does not invent that Ondo will originate a blanket loan."
      />
      <p>{CROSS_COLLATERAL.vsCashOut}</p>
      <p>{CROSS_COLLATERAL.occupancy}</p>

      <h2>If you still live in the first house</h2>
      <p>
        Occupancy on the new property is still a separate answer:{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">
          first rental occupancy if you still live there
        </Link>
        . Parent map: <Link href="/learn/investment">investment financing</Link>.
      </p>
      <ul>
        <li>
          Cash-out traps (two LTVs, two occupancies):{" "}
          <Link href="/blog/cash-out-to-buy-a-rental">cash-out to buy a rental</Link>.
        </li>
        <li>
          When you can even ask after a recent closing:{" "}
          <Link href="/blog/heloc-after-year-two-vs-cash-out">HELOC after year two vs cash-out</Link>.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Say whether you will occupy the new house. Occupancy decides the purchase program more than “I have equity.”</li>
        <li>Ask whether any investor in the conversation actually offers pledged additional collateral. Do not write an offer as if they do.</li>
        <li>
          If the rental will qualify on rent, see <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
