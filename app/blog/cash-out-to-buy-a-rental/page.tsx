import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { CASH_OUT_TO_RENTAL, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/cash-out-to-buy-a-rental"

const faqs = [
  {
    question: "Can I cash out my primary and use the money as a rental down payment?",
    answer:
      "Often that is two separate loans: an owner-occupied cash-out, then an investment purchase. Each has its own occupancy and LTV. It is not automatic, and it is not tax advice.",
  },
  {
    question: "Is a HELOC better for this than cash-out?",
    answer: CASH_OUT_TO_RENTAL.vsHeloc,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "first", heading: "The house you cash out", href: "/refinance/cash-out" },
  { id: "rental", heading: "The rental you buy", href: "/blog/dscr-vs-full-doc-rental-loan" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "occ",
    criterion: "Occupancy on that note",
    cells: {
      first: "If you still live there, this is typically owner-occupied cash-out. If you will move out, say so before the refinance.",
      rental: "Investment occupancy unless you will occupy it as a primary or a true second home.",
    },
  },
  {
    id: "ltv",
    criterion: "LTV conversation",
    cells: {
      first: CASH_OUT_TO_RENTAL.ltvTrap,
      rental: "Investment purchase down payment is a separate overlay — often more cash than a primary.",
    },
  },
  {
    id: "qualify",
    criterion: "How the new payment is qualified",
    cells: {
      first: "Your DTI includes the new (usually larger) first-lien payment after cash-out.",
      rental: "Full-doc DTI plus rental worksheet, or DSCR on the property. Two different stacks.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Cash-Out to Buy a Rental: Occupancy and LTV Traps",
  description:
    "Cash-out on the home you occupy is one occupancy and LTV. The rental you buy with the proceeds is another. Not a HELOC clone.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["cash out refinance to buy rental", "using equity to buy investment property"],
  faqs,
})

export default function CashOutToRentalPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Cash-Out to Buy a Rental: Occupancy and LTV Traps",
        description:
          "Cash-out on the home you occupy is one occupancy and LTV. The rental you buy with the proceeds is another.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Two properties, two occupancy answers, two LTV tests.",
        faqs,
        keywords: ["cash-out investment property", "equity to buy rental"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Using a cash-out refinance to fund a rental down payment is two transactions, not one clever occupancy. The
        refinance is underwritten on the house that already has your name on it. The purchase is underwritten as
        whatever occupancy that rental actually is. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The occupancy trap</h2>
      <p>{CASH_OUT_TO_RENTAL.occupancyTrap}</p>
      <p>
        Read <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment occupancy</Link> before
        anyone treats the rental as a second home on paper. Occupancy fraud is not a pricing tactic.
      </p>
      <ComparisonTable
        caption={`Two files as of ${LENDING_FACTS_AS_OF}. Confirm investor overlays.`}
        columns={columns}
        rows={rows}
        footnote="Not tax advice. Interest deductibility on cash-out proceeds depends on use; ask a tax professional."
      />

      <h2>The LTV trap</h2>
      <p>{CASH_OUT_TO_RENTAL.ltvTrap}</p>
      <p>
        Closing costs on the cash-out still have a break-even:{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">when a lower rate still loses after costs</Link>.
        Streamline refinances generally are not cash-out.
      </p>

      <h2>HELOC vs cash-out for the down payment</h2>
      <p>
        {CASH_OUT_TO_RENTAL.vsHeloc} The comparison that is <em>not</em> this page is{" "}
        <Link href="/blog/heloc-vs-cash-out-refinance">payment, lien position, and tax questions</Link>. This page is
        what happens when the proceeds buy a rental. If the house you just bought was all cash and you want a mortgage
        on that same house later, that is{" "}
        <Link href="/blog/delayed-financing-after-cash-purchase">delayed financing</Link> — a different fact pattern.
      </p>
      <IsThisRightForMe table="equity" highlight="refinance" />

      <h2>How the rental itself is qualified</h2>
      <p>
        Full-doc uses your DTI and a rental worksheet. DSCR uses the property’s rent versus the payment. Start at{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link> and the{" "}
        <Link href="/learn/investment">investment hub</Link>. Illustrate coverage on the{" "}
        <Link href="/calculators/dscr">DSCR calculator</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Say whether you will still occupy the house you are cashing out.</li>
        <li>Model cash-out costs on the <Link href="/calculators/refinance">refinance calculator</Link> before you count proceeds as down payment.</li>
        <li>
          Ask which stack can see the rental — agency investment, DSCR, or something else. That is a conversation, not
          a commitment to lend.
        </li>
      </ol>
    </ArticleShell>
  )
}
