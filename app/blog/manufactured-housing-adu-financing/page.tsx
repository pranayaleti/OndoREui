import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { FHA_HOUSE_HACK, LENDING_FACTS_AS_OF, MANUFACTURED_AND_ADU, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/manufactured-housing-adu-financing"

const faqs = [
  {
    question: "Is an ADU the same as a manufactured home for a lender?",
    answer: MANUFACTURED_AND_ADU.distinct,
  },
  {
    question: "Can I use a HUD program code from a blog as the product?",
    answer: MANUFACTURED_AND_ADU.noInventedHudCode,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "mh", heading: "Manufactured home" },
  { id: "adu", heading: "ADU on a site-built house" },
  { id: "duplex", heading: "2–4 unit you occupy", href: "/blog/house-hacking-duplex-with-fha" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      mh: MANUFACTURED_AND_ADU.manufactured,
      adu: MANUFACTURED_AND_ADU.adu,
      duplex: FHA_HOUSE_HACK.occupancy,
    },
  },
  {
    id: "finance",
    criterion: "Typical financing question",
    cells: {
      mh: MANUFACTURED_AND_ADU.landHome,
      adu: MANUFACTURED_AND_ADU.aduIncome,
      duplex: FHA_HOUSE_HACK.duplexVs34,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Manufactured Housing and ADU Financing",
  description:
    "Manufactured homes and accessory dwellings are different property types with different overlays. No invented HUD codes as a permanent product. Informational only.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["manufactured home mortgage", "ADU financing", "HUD code manufactured home loan"],
  faqs,
})

export default function ManufacturedHousingAduPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Manufactured Housing and ADU Financing",
        description:
          "Two property types, two underwrites. Do not collapse them. Confirm the handbook in force — not a blog code.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A factory-built home on a chassis is not a granny flat over the garage.",
        faqs,
        keywords: ["manufactured housing loan", "accessory dwelling unit mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Manufactured-home financing and ADU financing are different files. One is about how the dwelling was built,
        titled, and attached to land. The other is about a second dwelling on a site-built parcel — zoning, occupancy,
        and whether any rent counts. This page does not invent a HUD program code as a permanent product name. Snapshot
        as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{MANUFACTURED_AND_ADU.notAQuote}</p>

      <h2>Keep the property types apart</h2>
      <p>{MANUFACTURED_AND_ADU.distinct}</p>
      <ComparisonTable
        caption={`Manufactured vs ADU vs occupied 2–4 unit as of ${LENDING_FACTS_AS_OF}. Overlay, not a promise.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the recorded legal description, title, and occupancy. The listing photo is not the underwrite."
      />

      <h2>Manufactured housing</h2>
      <p>{MANUFACTURED_AND_ADU.manufactured}</p>
      <p>{MANUFACTURED_AND_ADU.noInventedHudCode}</p>
      <p>{MANUFACTURED_AND_ADU.landHome}</p>
      <ul>
        <li>Foundation and whether the home is real property vs chattel.</li>
        <li>HUD label / data plate on a HUD-Code home — look at the unit; do not memorize a blog serial-number rule.</li>
        <li>Appraisal and property standards for the program (conventional, FHA, VA, USDA each differ).</li>
        <li>
          Occupancy still has to match use: <Link href="/blog/second-home-vs-investment-occupancy">occupancy types</Link>
          . {OCCUPANCY_TYPES.fraud}
        </li>
      </ul>

      <h2>Accessory dwelling units</h2>
      <p>{MANUFACTURED_AND_ADU.adu}</p>
      <p>{MANUFACTURED_AND_ADU.aduIncome}</p>
      <ul>
        <li>Zoning and a certificate of occupancy for the ADU, when the jurisdiction requires one.</li>
        <li>Whether the lender counts the ADU as part of a 1-unit with accessory income, or as another unit.</li>
        <li>
          If you occupy one unit of a true 2–4 unit building, that is a house-hack conversation:{" "}
          <Link href="/blog/house-hacking-duplex-with-fha">FHA duplex house-hack</Link> — not an ADU nickname.
        </li>
        <li>
          Existing rental history on a house you already own is{" "}
          <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E</Link>, not a listing’s “ADU rents for.”
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Publish a permanent HUD Title I / Title II product code as if it never changes.</li>
        <li>Collapse manufactured and ADU into one “unique property” slogan.</li>
        <li>Coach occupancy misrepresentation to fit a cheaper program.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Get the legal property type from title and the plat before you write an offer as if financing is obvious.</li>
        <li>
          Compare programs on the <Link href="/loans">loans hub</Link>. FHA property standards are their own list:{" "}
          <Link href="/loans/fha">FHA loans</Link>.
        </li>
        <li>
          Investment occupancy and DSCR are a different cluster:{" "}
          <Link href="/learn/investment">investment financing hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
