import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { FHA_COUNTY_LIMIT_NOTE, FHA_HOUSE_HACK, FHA_SNAPSHOT, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/house-hacking-duplex-with-fha"

const faqs = [
  {
    question: "Does the FHA self-sufficiency test apply to a duplex?",
    answer: FHA_HOUSE_HACK.duplexVs34,
  },
  {
    question: "Can I use FHA if I will not live in either unit?",
    answer: FHA_HOUSE_HACK.occupancy,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "duplex", heading: "2-unit (duplex) you occupy", href: "/loans/fha" },
  { id: "tri", heading: "3–4 unit you occupy", href: "/loans/fha" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "occ",
    criterion: "Occupancy",
    cells: {
      duplex: "Principal residence: you occupy one unit as your home.",
      tri: "Same occupancy rule. FHA is not an investment-occupancy purchase on 3–4 units either.",
    },
  },
  {
    id: "self",
    criterion: "Self-sufficiency test",
    cells: {
      duplex: "Does not apply to a typical two-unit. A rental-income worksheet on the other unit still can.",
      tri: "Applies. Adjusted market rent on all units must cover the proposed PITIA per HUD’s current handbook.",
    },
  },
  {
    id: "limits",
    criterion: "Loan limits",
    cells: {
      duplex: FHA_HOUSE_HACK.limits,
      tri: "3- and 4-unit FHA limits are a different HUD column for the same county. Look them up. Do not memorize a blog dollar figure.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "House-Hacking a Duplex with FHA",
  description:
    "FHA can finance a 2–4 unit if you occupy one unit as your home. Self-sufficiency is a 3–4 unit test. Not a condo-roster file.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["FHA duplex house hack", "FHA 2 unit occupancy", "FHA self-sufficiency test"],
  faqs,
})

export default function FhaHouseHackPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "House-Hacking a Duplex with FHA",
        description:
          "FHA can finance a 2–4 unit if you occupy one unit as your home. Self-sufficiency is a 3–4 unit test, not a duplex test.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "You live in one unit. That occupancy is the product. A vacant investment duplex is not FHA.",
        faqs,
        keywords: ["FHA house hack", "FHA duplex"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        House-hacking a duplex with FHA means you buy a two-unit property and occupy one unit as your principal
        residence. The other unit’s rent may help qualify. It is not an FHA investment loan, and it is not a promise
        that any duplex in Utah will fit this year’s county limit. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Occupancy is the product rule</h2>
      <p>
        {FHA_HOUSE_HACK.occupancy} {FHA_SNAPSHOT.occupancy}. If you will not live there, look at{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">occupancy types</Link> and{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link> instead of relabeling the file. If you
        already occupy a home and the new house will be rented, that is{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">first-rental occupancy</Link> — not this
        duplex house-hack.
      </p>

      <h2>Duplex vs 3–4 units</h2>
      <p>{FHA_HOUSE_HACK.duplexVs34}</p>
      <ComparisonTable
        caption={`FHA 2-unit vs 3–4 unit as of ${LENDING_FACTS_AS_OF}. Confirm HUD 4000.1.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Appraiser market rent, not a listing screenshot, drives the worksheet."
      />

      <h2>Limits change; do not memorize a dollar figure</h2>
      <p>
        {FHA_COUNTY_LIMIT_NOTE} Two-unit limits are a different column from one-unit on HUD’s table. Confirm the
        property county before you write an offer as if last year’s number still applies.
      </p>
      <p>
        Down payment and MIP still follow FHA rules: {FHA_SNAPSHOT.minDownPayment580Plus} down at 580+ under HUD
        policy (overlays often sit higher). Compare{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link> and{" "}
        <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">how MIP vs PMI ends</Link>.
      </p>

      <h2>This is usually not a condo file</h2>
      <p>
        {FHA_HOUSE_HACK.notCondo} The{" "}
        <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster guide</Link> is for condominium projects,
        not a typical duplex on its own parcel.
      </p>
      <IsThisRightForMe table="purchase" programs={["fha", "conventional"]} highlight="fha" />

      <h2>What happens next</h2>
      <ol>
        <li>Confirm you will occupy one unit as your home — that is the occupancy question, not a slogan.</li>
        <li>Look up this year’s HUD 2-unit limit for the county. Do not reuse a blog dollar amount.</li>
        <li>
          Bring leases or ask how proposed rent on the other unit is counted. Existing rentals you already own still use{" "}
          <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
