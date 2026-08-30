import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { CONFORMING_LIMIT_NOTE, FHFA_LOOKUP, FHA_COUNTY_LIMIT_NOTE, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/jumbo-vs-conforming-fhfa-county-limit"

const faqs = [
  {
    question: "Is there one jumbo limit for all of Utah?",
    answer: `${CONFORMING_LIMIT_NOTE} ${FHFA_LOOKUP.utahNote}`,
  },
  {
    question: "Is FHA’s limit the same as FHFA’s?",
    answer: FHA_COUNTY_LIMIT_NOTE,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Jumbo vs Conforming: Look Up This Year’s FHFA County Limit",
  description:
    "A jumbo loan is simply above the FHFA conforming limit for the property county. How to look the limit up without memorizing a stale number.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["jumbo vs conforming FHFA", "conforming loan limit lookup"],
  faqs,
})

export default function JumboFhfaPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Jumbo vs Conforming: Look Up This Year’s FHFA County Limit",
        description:
          "A jumbo loan is simply above the FHFA conforming limit for the property county. How to look the limit up without memorizing a stale number.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Jumbo is a county-year definition, not a lifestyle brand.",
        faqs,
        keywords: ["jumbo loan limit", "FHFA conforming limit"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A loan is jumbo when it exceeds the FHFA conforming limit for that property’s county in that year. It is not
        a permanent dollar printed on a marketing page. {FHFA_LOOKUP.howTo} Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>How to look it up</h2>
      <ol>
        <li>Identify the property county (not the city nickname).</li>
        <li>
          Open FHFA’s current-year table:{" "}
          <a href={FHFA_LOOKUP.officialUrl} rel="noopener noreferrer">
            FHFA conforming loan limits
          </a>
          .
        </li>
        <li>Compare the base loan amount you need (price minus down payment, plus financed fees if any) to that county’s limit.</li>
        <li>If you are over, you are in jumbo overlays: credit, reserves, and down payment are investor-specific.</li>
      </ol>
      <p>{FHFA_LOOKUP.utahNote}</p>
      <p>
        Utah-specific walkthrough:{" "}
        <Link href="/blog/utah-county-conforming-loan-limit-lookup">Utah county conforming limit how-to</Link>.
      </p>

      <h2>What jumbo is not</h2>
      <ul>
        <li>It is not automatically a worse rate than conforming. Compare Loan Estimates.</li>
        <li>It is not FHA. FHA has a different HUD table. {FHA_COUNTY_LIMIT_NOTE}</li>
        <li>It is not a promise that a piggyback (two-loan) structure will fit. That is a separate overlay.</li>
      </ul>

      <h2>What happens next</h2>
      <p>
        Look up the county, then read the <Link href="/loans/jumbo">jumbo program page</Link> for documentation and
        reserve overlays. Pricing context: <Link href="/buy/rates">rates hub</Link>.
      </p>
    </ArticleShell>
  )
}
