import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF, SELF_EMPLOYED_HISTORY } from "@/lib/content"
import Link from "next/link"

const path = "/blog/two-years-of-tax-returns-vs-one-year-mortgage"

const faqs = [
  {
    question: "Do Fannie and Freddie always require two years of self-employment?",
    answer: `${SELF_EMPLOYED_HISTORY.twoYearTypical} ${SELF_EMPLOYED_HISTORY.oneYearOverlay}`,
  },
  {
    question: "Does a CPA letter replace a missing year of returns?",
    answer:
      "Usually no. A letter can support stability. It does not replace transcripts and returns the investor requires. Ask before you shop as if one year is enough.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Two Years of Tax Returns vs One Year: When Overlays Allow",
  description:
    "Most agency self-employed files want two years of returns. Some overlays allow one year in the same line of work.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["self employed mortgage two years tax returns", "one year self employment overlay"],
  faqs,
})

export default function TwoYearReturnsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Two Years of Tax Returns vs One Year: When Overlays Allow",
        description:
          "Most agency self-employed files want two years of returns. Some overlays allow one year in the same line of work.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Two years is the usual agency ask. One year is an overlay conversation, not a right.",
        faqs,
        keywords: ["self employed mortgage two years", "one year tax returns mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you are self-employed or 1099, the file usually starts with two years of personal (and business) tax returns
        plus transcripts. A one-year file is not “caught up.” It is a different overlay, and many lenders will not make
        it. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>What two years is trying to prove</h2>
      <p>{SELF_EMPLOYED_HISTORY.twoYearTypical}</p>
      <p>
        Underwriters are not collecting souvenirs. They need a pattern of net income after expenses that they can
        average. One strong year after a W-2 career can still be thin if the business has no history of surviving a
        slow season. See{" "}
        <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link> for the W-2 vs 1099
        vs bank-statement stacks.
      </p>

      <h2>When a one-year overlay even enters the chat</h2>
      <p>{SELF_EMPLOYED_HISTORY.oneYearOverlay}</p>
      <p>Typical compensating pieces people bring — still not a promise:</p>
      <ul>
        <li>Same occupation and similar duties as the prior W-2 role (for example, a nurse who went 1099 in the same specialty).</li>
        <li>A full year of filed returns, matching transcripts, and a year-to-date profit and loss that a CPA will stand behind.</li>
        <li>Reserves, a stable contract, and DTI that is not already at the edge.</li>
      </ul>
      <p>
        If write-offs crush taxable income, the conversation may move to{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">bank-statement / Non-QM</Link>{" "}
        instead of “please ignore year two.” A CPA letter still does not replace the return stack:{" "}
        <Link href="/blog/cpa-letter-vs-tax-returns-underwriting">CPA letter vs tax returns</Link>. If the 1099 work
        only started last month, start with{" "}
        <Link href="/blog/just-went-1099-last-month">I just went 1099 last month</Link>, not this overlay.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Gather two years of returns and transcripts even if you hope an overlay applies.</li>
        <li>
          Use the <Link href="/calculators/income">income calculator</Link> with an average you can document, not last
          month’s deposits.
        </li>
        <li>
          Ask a loan officer which investor overlay, if any, can treat one year — before you write an offer that
          assumes it.
        </li>
      </ol>
    </ArticleShell>
  )
}
