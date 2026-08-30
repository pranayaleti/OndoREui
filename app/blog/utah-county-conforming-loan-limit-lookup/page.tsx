import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { CONFORMING_LIMIT_NOTE, FHFA_LOOKUP, FHA_COUNTY_LIMIT_NOTE, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/utah-county-conforming-loan-limit-lookup"

const faqs = [
  {
    question: "Can I use last year’s Salt Lake number for a Park City purchase?",
    answer: FHFA_LOOKUP.utahNote,
  },
  {
    question: "Where is the official table?",
    answer: `${FHFA_LOOKUP.howTo} Official: ${FHFA_LOOKUP.officialUrl}`,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Utah County Conforming Limit Lookup (How-To)",
  description:
    "How to look up this year’s FHFA conforming limit for a Utah county. Summit is not Salt Lake. Do not reuse a stale dollar figure.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["Utah conforming loan limit by county", "FHFA Utah county lookup"],
  faqs,
})

export default function UtahCountyLimitPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Utah County Conforming Limit Lookup (How-To)",
        description:
          "How to look up this year’s FHFA conforming limit for a Utah county. Summit is not Salt Lake. Do not reuse a stale dollar figure.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Look up the county-year. Do not paste a blog number into an offer.",
        faqs,
        keywords: ["Utah FHFA loan limit", "Summit County vs Salt Lake conforming"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        To know whether a Utah purchase is conforming or jumbo, look up this year’s FHFA limit for the property
        county. {CONFORMING_LIMIT_NOTE} Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Utah how-to (no stale table)</h2>
      <ol>
        <li>Find the county on the tax notice or title commitment — not “Park City” vs “Heber” as a substitute.</li>
        <li>
          Open{" "}
          <a href={FHFA_LOOKUP.officialUrl} rel="noopener noreferrer">
            FHFA’s conforming loan limit page
          </a>{" "}
          for the current year.
        </li>
        <li>Read the one-unit limit for that county (2–4 unit limits differ if that is the property).</li>
        <li>
          Compare the base loan amount. If you are over, read{" "}
          <Link href="/blog/jumbo-vs-conforming-fhfa-county-limit">jumbo vs conforming</Link> and{" "}
          <Link href="/loans/jumbo">jumbo loans</Link>.
        </li>
      </ol>
      <p>{FHFA_LOOKUP.utahNote}</p>

      <h2>FHA is a different lookup</h2>
      <p>
        {FHA_COUNTY_LIMIT_NOTE} HUD’s table:{" "}
        <a href={FHFA_LOOKUP.hudFhaLimitsUrl} rel="noopener noreferrer">
          HUD FHA mortgage limits
        </a>
        .
      </p>

      <h2>City pages are not limit tables</h2>
      <p>
        <Link href="/loans/salt-lake-city">Salt Lake City</Link>, <Link href="/loans/lehi">Lehi</Link>,{" "}
        <Link href="/loans/provo">Provo</Link>, and <Link href="/loans/draper">Draper</Link> loans pages are local
        context. Limits still come from FHFA/HUD for the county-year. Rates context:{" "}
        <Link href="/buy/rates">rates hub</Link>.
      </p>
    </ArticleShell>
  )
}
