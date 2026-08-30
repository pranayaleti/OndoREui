import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { FIRST_RENTAL_OCCUPANCY, LENDING_FACTS_AS_OF, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/first-rental-occupancy-if-you-still-live-there"

const faqs = [
  {
    question: "If I still live in my house, is the rental I buy a second home?",
    answer: FIRST_RENTAL_OCCUPANCY.notSecondHome,
  },
  {
    question: "Is this the same as house-hacking a duplex with FHA?",
    answer: FIRST_RENTAL_OCCUPANCY.notHouseHack,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "stay", heading: "Stay in current home", href: "/learn/investment" },
  { id: "move", heading: "Move into the new house", href: "/blog/second-home-vs-investment-occupancy" },
  { id: "hack", heading: "Occupy one unit of 2–4", href: "/blog/house-hacking-duplex-with-fha" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "new",
    criterion: "Occupancy on the new loan",
    cells: {
      stay: FIRST_RENTAL_OCCUPANCY.stayPut,
      move: FIRST_RENTAL_OCCUPANCY.moveIn,
      hack: "Primary, if you will live in one unit. That is a house-hack file, not this page.",
    },
  },
  {
    id: "old",
    criterion: "Occupancy on the home you already own",
    cells: {
      stay: "Stays primary while you still occupy it as your principal residence.",
      move: "Becomes a rental occupancy when you no longer live there. Tell the servicer.",
      hack: "You may not already own a separate primary. This path is the unit you will occupy.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "First Rental: Occupancy If You Still Live in Your Home",
  description:
    "If you keep occupying your current home, the rental you buy is typically investment occupancy. Distinct from a duplex house-hack. Not occupancy coaching.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: [
    "first rental occupancy",
    "buy rental while living in my house",
    "investment occupancy primary residence",
  ],
  faqs,
})

export default function FirstRentalOccupancyPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "First Rental: Occupancy If You Still Live in Your Home",
        description:
          "If you keep occupying your current home, the rental you buy is typically investment occupancy. Distinct from a duplex house-hack.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Two houses, two occupancy answers. Do not relabel the rental to get a cheaper rate.",
        faqs,
        keywords: ["first rental occupancy", "investment property while occupying primary"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you will keep living in your current home and the next house will be rented, the new loan is typically
        investment occupancy. That is a first-rental file, not a duplex house-hack and not a second-home label. Snapshot
        as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{OCCUPANCY_TYPES.fairHousing}</p>
      <p>{FIRST_RENTAL_OCCUPANCY.fraud}</p>
      <p>{OCCUPANCY_TYPES.fraud}</p>

      <h2>Three files people mix up</h2>
      <ComparisonTable
        caption={`Stay-put rental vs move-in vs house-hack as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Occupancy has to match how you will actually use each property. These pages do not coach misrepresentation."
      />
      <p>{FIRST_RENTAL_OCCUPANCY.notHouseHack}</p>
      <p>
        Occupancy types in one place:{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment occupancy</Link>. FHA duplex
        you will live in: <Link href="/blog/house-hacking-duplex-with-fha">house-hacking a duplex with FHA</Link>.
      </p>

      <h2>Scenario A — you are not moving</h2>
      <p>{FIRST_RENTAL_OCCUPANCY.stayPut}</p>
      <ul>
        <li>Expect investment pricing, down payment, and reserves on the new loan.</li>
        <li>
          Qualifying is often full-doc (your income plus{" "}
          <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E</Link> history if you already have
          rentals) or <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link> on the new property.
        </li>
        <li>
          Using equity in the home you occupy is a separate structure:{" "}
          <Link href="/blog/cash-out-to-buy-a-rental">cash-out to buy a rental</Link> or{" "}
          <Link href="/blog/cross-collateral-equity-to-buy-another-house">cross-collateral</Link>. Neither changes
          occupancy on the rental. If you paid cash for the house you now occupy and want a mortgage on that same
          house later, that is{" "}
          <Link href="/blog/delayed-financing-after-cash-purchase">delayed financing</Link> — a different fact pattern.
        </li>
      </ul>

      <h2>Scenario B — you will move and rent the old house</h2>
      <p>{FIRST_RENTAL_OCCUPANCY.moveIn}</p>
      <ul>
        <li>The purchase occupancy is primary if that is where you will live.</li>
        <li>The old loan’s occupancy is no longer primary once you move. That is a servicing and insurance conversation, not a way to keep owner-occupied pricing on a house you vacated.</li>
        <li>Do not tell the new lender you will occupy the rental if you will not.</li>
      </ul>

      <h2>What this page will not tell you</h2>
      <ul>
        <li>How many nights to “live there” so a rental can be called a primary.</li>
        <li>How to list a rental as a vacation home on the application.</li>
        <li>That investment occupancy is a paperwork preference instead of a program rule.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Write down where you will actually sleep most of the year after closing. That sentence is occupancy.</li>
        <li>
          If the new house is a rental, start on the <Link href="/learn/investment">investment hub</Link> — not FHA
          purchase occupancy.
        </li>
        <li>
          Bring how you will use each property to a conversation. Asking is not a credit decision:{" "}
          <Link href="/qualify">qualify</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
