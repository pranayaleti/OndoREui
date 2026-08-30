import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { DTI_EDUCATION, EXAMPLE_NOTE, EXAMPLE_PURCHASE_PRICE_UTAH, LENDING_FACTS_AS_OF, VARIABLE_INCOME_LIKELY_TO_CONTINUE } from "@/lib/content"
import Link from "next/link"

const path = "/blog/w2-overtime-likely-to-continue"

const faqs = [
  {
    question: "Will the lender use my current overtime rate?",
    answer:
      "Usually they average a history (often 12 or 24 months) and only include it if it looks durable. A new overtime assignment without a matching W-2 history is frequently limited or excluded.",
  },
  {
    question: "What if overtime stopped this year?",
    answer:
      "The average can drop even if you “feel” like you still earn it. A written explanation and year-to-date paystubs matter more than a verbal promise that it will come back.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Overtime on a W-2: What “Likely to Continue” Means",
  description:
    "Underwriters usually average overtime over a documented history and ask whether it is likely to continue.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["W-2 overtime mortgage", "overtime likely to continue underwriting"],
  faqs,
})

export default function W2OvertimePage() {
  const examplePrice = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title: "Overtime on a W-2: What “Likely to Continue” Means",
        description:
          "Underwriters usually average overtime over a documented history and ask whether it is likely to continue.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Overtime can count. Last week’s extra shift usually does not, by itself.",
        faqs,
        keywords: ["W-2 overtime mortgage qualification", "likely to continue overtime"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Overtime on a W-2 can be qualifying income. The test is not whether you worked extra last month. It is whether
        the history shows a pattern that is likely to continue. {VARIABLE_INCOME_LIKELY_TO_CONTINUE.overtime} Snapshot
        as of {LENDING_FACTS_AS_OF}. {EXAMPLE_NOTE}
      </p>

      <h2>How the average is usually built</h2>
      <p>{DTI_EDUCATION.variableIncomeNote}</p>
      <p>
        On a ${examplePrice} purchase illustration, base hourly pay is the easy part. Overtime is pulled from W-2s
        and year-to-date paystubs, then averaged. If this year’s overtime collapsed, the average falls even if your
        offer letter still lists an overtime pool.
      </p>

      <h2>What “likely to continue” is asking</h2>
      <ul>
        <li>Two years of W-2s that show overtime in the same job or line of work, not a one-off project.</li>
        <li>Year-to-date paystubs that do not contradict the story (a sudden zero is a red flag).</li>
        <li>An employer that still offers the overtime — VOE language matters more than a text from a supervisor.</li>
      </ul>
      <p>
        Bonus is a cousin of overtime and is often averaged the same way. Commission is a different file: see{" "}
        <Link href="/blog/commission-income-mortgage-averaging">commission averaging and a down year</Link>.
      </p>

      <h2>What usually does not help</h2>
      <ul>
        <li>A verbal “we always have overtime in Q4.”</li>
        <li>Overtime that started after you applied, with no history.</li>
        <li>Counting overtime at the current high week and ignoring the slow winter.</li>
      </ul>

      <h2>What happens next</h2>
      <p>
        Run an illustration in the <Link href="/calculators/affordability">affordability calculator</Link> using the
        average you can document, then read{" "}
        <Link href="/learn/variable-income">variable income</Link> if bonus or 1099 is mixed in. Bring W-2s and
        paystubs to a loan officer before you treat overtime as guaranteed payment fuel.
      </p>
    </ArticleShell>
  )
}
