import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { HELOC_SEASONING, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/heloc-after-year-two-vs-cash-out"

const faqs = [
  {
    question: "Do I have to wait two years after closing to tap equity?",
    answer: HELOC_SEASONING.notAFederalWait,
  },
  {
    question: "Is this the same as HELOC vs cash-out as a structure?",
    answer: HELOC_SEASONING.vsStructure,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "now", heading: "Just closed", href: "/loans/heloc" },
  { id: "later", heading: "After seasoning overlays", href: "/refinance/cash-out" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "ask",
    criterion: "Typical conversation",
    cells: {
      now: HELOC_SEASONING.justClosed,
      later: HELOC_SEASONING.yearTwo,
    },
  },
  {
    id: "alt",
    criterion: "A different fact pattern",
    cells: {
      now: HELOC_SEASONING.delayedFinancing,
      later: "Once overlays are met, compare structure — second lien vs replacing the first — on the HELOC vs cash-out page.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "HELOC After Year Two vs Cash-Out",
  description:
    "When you can tap equity after a recent closing. Seasoning overlays, not a remake of HELOC vs cash-out structure. Not a federal two-year wait.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["HELOC seasoning", "cash out after purchase", "when can I tap equity"],
  faqs,
})

export default function HelocAfterYearTwoPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "HELOC After Year Two vs Cash-Out",
        description:
          "When you can tap equity after a recent closing. Seasoning overlays, not a remake of HELOC vs cash-out structure.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Timing and overlays — not a remake of lien position.",
        faqs,
        keywords: ["HELOC after closing", "equity seasoning"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you just closed, tapping equity again is a seasoning and occupancy conversation — often six to twelve months
        of ownership, sometimes described as after year one or into year two. It is not a federal two-year waiting
        period, and it is not a remake of HELOC versus cash-out as a structure. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{HELOC_SEASONING.vsStructure}</p>
      <p>
        Structure (lien, payment, tax questions):{" "}
        <Link href="/blog/heloc-vs-cash-out-refinance">cash-out vs HELOC</Link>. Using cash-out proceeds to buy a
        rental: <Link href="/blog/cash-out-to-buy-a-rental">cash-out to buy a rental</Link>.
      </p>

      <h2>Just closed versus seasoned</h2>
      <ComparisonTable
        caption={`Timing overlays as of ${LENDING_FACTS_AS_OF}. Not a statute.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the first-lien investor and the HELOC/cash-out overlay. This is not tax advice."
      />
      <p>{HELOC_SEASONING.notAFederalWait}</p>

      <h2>What people mean by “year two”</h2>
      <p>{HELOC_SEASONING.yearTwo}</p>
      <ul>
        <li>Title seasoning and occupancy of the house you will encumber.</li>
        <li>Combined LTV (first plus HELOC) versus cash-out LTV if you replace the first lien.</li>
        <li>Whether the first-lien investor allows a second. Some do not in the first months.</li>
      </ul>
      <p>{HELOC_SEASONING.delayedFinancing}</p>
      <p>
        Deep guide (cash purchase, then a mortgage later):{" "}
        <Link href="/blog/delayed-financing-after-cash-purchase">delayed financing after a cash purchase</Link>.
      </p>

      <IsThisRightForMe
        table="equity"
        heading="Once seasoning fits, which structure are you comparing?"
        intro="This table is lien position and payment shape — not a recommendation to tap equity, and not a waiting-period calculator."
      />

      <h2>What happens next</h2>
      <ol>
        <li>If the closing was recent, ask what overlay the HELOC or cash-out investor actually uses — do not calendar “year two” from a blog.</li>
        <li>
          If the goal is another house, occupancy still has to match:{" "}
          <Link href="/blog/first-rental-occupancy-if-you-still-live-there">first rental occupancy</Link> and{" "}
          <Link href="/blog/cross-collateral-equity-to-buy-another-house">cross-collateral</Link>.
        </li>
        <li>
          Model costs on the <Link href="/calculators/refinance">refinance calculator</Link> if cash-out is the
          structure. A HELOC illustration is not a cash-out quote.
        </li>
      </ol>
    </ArticleShell>
  )
}
