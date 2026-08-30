import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/second-home-vs-investment-occupancy"

const faqs = [
  {
    question: "Can I call a rental a second home to get a better rate?",
    answer: OCCUPANCY_TYPES.fraud,
  },
  {
    question: "Is FHA available for a second home?",
    answer:
      "FHA purchase occupancy is a primary residence. A vacation home you will not occupy as your principal home is not an FHA second-home product. House-hacking a duplex you will live in is a different, primary-residence file.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "primary", heading: "Primary", href: "/loans" },
  { id: "second", heading: "Second home", href: "/buy/second-home" },
  { id: "inv", heading: "Investment", href: "/learn/investment" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "use",
    criterion: "How you will actually use it",
    cells: {
      primary: OCCUPANCY_TYPES.primary,
      second: OCCUPANCY_TYPES.secondHome,
      inv: OCCUPANCY_TYPES.investment,
    },
  },
  {
    id: "programs",
    criterion: "Programs that typically allow it",
    cells: {
      primary: "Conventional, FHA, VA, USDA (when other tests pass).",
      second: "Often conventional or jumbo with overlays. Not FHA, VA, or USDA purchase occupancy.",
      inv: "Conventional investment, jumbo, or Non-QM / DSCR. FHA is not an investment-occupancy purchase.",
    },
  },
  {
    id: "pricing",
    criterion: "What usually changes",
    cells: {
      primary: "Owner-occupied pricing when the file fits. Still not a pricing slogan.",
      second: "Typically more down payment and different pricing than a primary. Exclusive-use overlays apply.",
      inv: "Typically more down payment and higher pricing than owner-occupied. Rent is the point of the occupancy.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Second Home vs Investment Occupancy",
  description:
    "Primary, second home, and investment occupancy are different. Misstating occupancy is fraud, not a strategy. Educational only.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["second home vs investment occupancy", "occupancy fraud mortgage", "vacation home financing"],
  faqs,
})

export default function OccupancyPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Second Home vs Investment Occupancy",
        description:
          "Primary, second home, and investment occupancy are different. Misstating occupancy is fraud, not a strategy.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Occupancy is how you will use the house. It is not a pricing coupon.",
        faqs,
        keywords: ["second home occupancy", "investment property occupancy"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Second-home occupancy and investment occupancy are different answers on the application. A vacation place you
        will use is not the same file as a rental you will not occupy. Choosing the cheaper label is not a strategy.{" "}
        {OCCUPANCY_TYPES.fraud} Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{OCCUPANCY_TYPES.fairHousing}</p>

      <h2>Three occupancy types</h2>
      <ComparisonTable
        caption={`Occupancy types as of ${LENDING_FACTS_AS_OF}. Confirm investor overlays.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. This table does not tell you which occupancy to claim."
      />

      <h2>What second home usually means</h2>
      <p>
        {OCCUPANCY_TYPES.secondHome} Exclusive use, a reasonable distance from the primary in many overlays, and limits
        on treating the property as a rental business are typical tests — they are investor overlays, not a checklist
        for how to “make it look like” a second home. The commercial overview is{" "}
        <Link href="/buy/second-home">buying a second home</Link>.
      </p>

      <h2>What investment occupancy means</h2>
      <p>
        {OCCUPANCY_TYPES.investment} Qualification may be full-doc or DSCR — see{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link>. Using cash-out from the house you live
        in to buy a rental is two files:{" "}
        <Link href="/blog/cash-out-to-buy-a-rental">occupancy and LTV traps</Link>.
      </p>
      <p>
        Living in one unit of a duplex and renting the other is usually a <em>primary</em> FHA or conventional
        house-hack, not investment occupancy. Read{" "}
        <Link href="/blog/house-hacking-duplex-with-fha">house-hacking a duplex with FHA</Link>. Buying a separate
        rental while you still occupy your current home is{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">first-rental occupancy</Link>. VA remaining
        entitlement is still an occupancy conversation, not a second-home product — see{" "}
        <Link href="/blog/va-entitlement-second-va-loan">a second VA loan</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>State how you will actually use the property before anyone shops a rate.</li>
        <li>Expect down payment, reserves, and pricing to change with occupancy. Compare two Loan Estimates, not slogans.</li>
        <li>
          A first mortgage conversation will ask occupancy. It will not promise a program. See{" "}
          <Link href="/qualify">what a conversation asks</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
