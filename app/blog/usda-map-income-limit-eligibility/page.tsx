import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF, USDA_SNAPSHOT } from "@/lib/content"
import Link from "next/link"

const path = "/blog/usda-map-income-limit-eligibility"

const faqs = [
  {
    question: "If my city sounds rural, is it USDA-eligible?",
    answer: USDA_SNAPSHOT.mapNote,
  },
  {
    question: "Whose income counts?",
    answer: USDA_SNAPSHOT.incomeNote,
  },
]

export const metadata = articleMetadata({
  path,
  title: "USDA Map and Income Limit: Am I Even Eligible?",
  description:
    "USDA is address-specific and household-income-specific. How to use the official map and income tools before you assume zero-down is available.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["USDA map eligibility Utah", "USDA income limit lookup"],
  faqs,
})

export default function UsdaMapPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "USDA Map and Income Limit: Am I Even Eligible?",
        description:
          "USDA is address-specific and household-income-specific. How to use the official map and income tools before you assume zero-down is available.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Zero down only exists if the address and the household both pass USDA’s tests.",
        faqs,
        keywords: ["USDA eligible area", "USDA household income limit"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        USDA guaranteed loans can be zero down, but only after two gates: the property address is on the current
        USDA map, and household income is under the current area limit. A suburb that “feels rural” is not a map
        result. Snapshot as of {LENDING_FACTS_AS_OF} ({USDA_SNAPSHOT.source}).
      </p>

      <h2>Step 1 — map the address</h2>
      <p>{USDA_SNAPSHOT.mapNote}</p>
      <p>
        Use the official tool:{" "}
        <a href={USDA_SNAPSHOT.mapToolUrl} rel="noopener noreferrer">
          USDA eligibility map
        </a>
        . Run the exact property, not the city name. Infill on the Wasatch Front is often ineligible even when a
        neighboring pocket is eligible.
      </p>

      <h2>Step 2 — test household income</h2>
      <p>{USDA_SNAPSHOT.incomeNote}</p>
      <p>
        This page does not publish an AMI dollar figure. Those numbers change and differ by county and household
        size. If household income is over the limit, FHA or conventional is the usual next comparison — not a “USDA
        exception.”
      </p>

      <h2>Other gates that still apply</h2>
      <ul>
        <li>{USDA_SNAPSHOT.occupancy}</li>
        <li>{USDA_SNAPSHOT.creditNote}</li>
        <li>
          Guarantee fee snapshot: {USDA_SNAPSHOT.upfrontGuaranteeFee}; annual {USDA_SNAPSHOT.annualFee}.{" "}
          {USDA_SNAPSHOT.feeNote}
        </li>
      </ul>

      <h2>What happens next</h2>
      <p>
        Map the address, then talk with a loan officer before you write a USDA offer. Program page:{" "}
        <Link href="/loans/usda">USDA loans in Utah</Link>. If the map fails,{" "}
        <Link href="/loans/fha">FHA</Link> is often the fallback for low down payment — see{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>.
      </p>
    </ArticleShell>
  )
}
