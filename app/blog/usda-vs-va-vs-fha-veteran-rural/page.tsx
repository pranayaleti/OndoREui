import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import {
  FHA_SNAPSHOT,
  LENDING_FACTS_AS_OF,
  RURAL_VETERAN_COMPARE,
  USDA_SNAPSHOT,
  VA_FUNDING_FEE,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/usda-vs-va-vs-fha-veteran-rural"

const faqs = [
  {
    question: "Should a veteran always pick VA over USDA in a rural tract?",
    answer: RURAL_VETERAN_COMPARE.notAPick,
  },
  {
    question: "Does a rural city name mean USDA is available?",
    answer: USDA_SNAPSHOT.mapNote,
  },
]

export const metadata = articleMetadata({
  path,
  title: "USDA vs VA vs FHA for a Veteran in a Rural Tract",
  description:
    "Comparison of typical tests when a veteran is buying in a USDA-map area. Not a recommendation to take one program. Fee percents are dated snapshots.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["USDA vs VA vs FHA", "veteran USDA rural", "VA or FHA rural purchase"],
  faqs,
})

export default function UsdaVaFhaRuralPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "USDA vs VA vs FHA for a Veteran in a Rural Tract",
        description:
          "Comparison of typical tests when a veteran is buying in a USDA-map area. Not a recommendation to take one program.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Map, entitlement, and MIP are different tests. None of them is a pricing slogan.",
        faqs,
        keywords: ["USDA vs VA", "veteran rural loan"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A veteran buying in a rural census tract may have three primary-residence conversations — VA, USDA, and FHA —
        but this page does not pick one. Run the USDA map, remaining VA entitlement, and HUD occupancy as separate
        tests. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{RURAL_VETERAN_COMPARE.notAPick}</p>
      <p>{RURAL_VETERAN_COMPARE.fairHousing}</p>

      <h2>Start with the tests, not a slogan</h2>
      <ul>
        <li>
          <strong>VA.</strong> {RURAL_VETERAN_COMPARE.vaFirst} Funding fee (first use, less than 5% down snapshot):{" "}
          {VA_FUNDING_FEE.firstUseLessThan5PercentDown}. {VA_FUNDING_FEE.exemptionNote}{" "}
          <Link href="/loans/va">VA loans</Link>.{" "}
          <Link href="/blog/va-funding-fee-finance-vs-pay-cash">Finance vs pay the funding fee</Link>.
        </li>
        <li>
          <strong>USDA.</strong> {RURAL_VETERAN_COMPARE.usdaMap} Upfront guarantee fee snapshot:{" "}
          {USDA_SNAPSHOT.upfrontGuaranteeFee}; annual {USDA_SNAPSHOT.annualFee}. {USDA_SNAPSHOT.feeNote}{" "}
          <Link href="/loans/usda">USDA loans</Link>.{" "}
          <Link href="/blog/usda-map-income-limit-eligibility">Map and income how-to</Link>.
        </li>
        <li>
          <strong>FHA.</strong> {RURAL_VETERAN_COMPARE.fhaFallback} Down payment at 580+:{" "}
          {FHA_SNAPSHOT.minDownPayment580Plus}. {FHA_SNAPSHOT.upfrontMip} {FHA_SNAPSHOT.occupancy}{" "}
          <Link href="/loans/fha">FHA loans</Link>.{" "}
          <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>.
        </li>
      </ul>

      <IsThisRightForMe
        table="purchase"
        programs={["va", "usda", "fha"]}
        highlight="va"
        heading="Typical overlays — not a recommendation"
        intro="Use this as a map of occupancy, down payment, and fee snapshots. A loan officer still applies the guide in force. Fee percents are dated; confirm before anyone prices a file."
      />

      <h2>Scenarios (file facts, not advice)</h2>
      <ul>
        <li>
          <strong>COE and remaining entitlement fit, property is primary.</strong> VA is often the first conversation.
          USDA’s household income cap and map can still fail even if VA would work.
        </li>
        <li>
          <strong>Entitlement is tied up, USDA map and income pass.</strong> USDA may be in the conversation. It is
          still primary occupancy — not an investment. {USDA_SNAPSHOT.occupancy}
        </li>
        <li>
          <strong>Map fails or household income is over the USDA limit, and VA does not fit.</strong> FHA may be the
          remaining low-down primary path. MIP is not a VA funding fee and not a USDA guarantee fee.
        </li>
      </ul>
      <p>{VA_FUNDING_FEE.downPaymentNote}</p>
      <p>{USDA_SNAPSHOT.incomeNote}</p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Run the address on USDA’s published map — use the{" "}
          <Link href={USDA_SNAPSHOT.mapToolUrl}>official eligibility tool</Link>, not a city name.
        </li>
        <li>
          Ask a lender to pull or update the COE. Entitlement restoration after a sale is a different page:{" "}
          <Link href="/blog/selling-with-va-loan-entitlement-restoration">VA entitlement restoration</Link>.
        </li>
        <li>Compare two Loan Estimates if two programs both fit. This page is not a quote or a lock.</li>
      </ol>
    </ArticleShell>
  )
}
