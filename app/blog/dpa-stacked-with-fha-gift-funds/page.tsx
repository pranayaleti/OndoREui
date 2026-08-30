import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { FHA_SNAPSHOT, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/dpa-stacked-with-fha-gift-funds"

const faqs = [
  {
    question: "Can a gift and DPA both be used on the same FHA down payment?",
    answer: `Often, when each source is eligible and documented. ${FHA_SNAPSHOT.giftFunds} DPA is usually a second lien or grant with its own note, occupancy, and income tests. It is not a gift letter.`,
  },
  {
    question: "Does UHC publish one stacking rule that never changes?",
    answer:
      "No. Utah Housing Corporation and other agencies change products, income limits, and first-lien pairings. Confirm the current agency guide. This page is the logic, not this year’s dollar amount.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "UHC / DPA Stacked with an FHA Gift: How They Work Together",
  description:
    "Down payment assistance is often a second lien. A gift is not. Stacking them on FHA is common and still has paper-trail and agency rules.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["UHC down payment assistance FHA gift", "stack DPA gift funds FHA"],
  faqs,
})

export default function DpaGiftPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "UHC / DPA Stacked with an FHA Gift: How They Work Together",
        description:
          "Down payment assistance is often a second lien. A gift is not. Stacking them on FHA is common and still has paper-trail and agency rules.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "A gift is sourced money. DPA is usually a second loan. The file has to show both.",
        faqs,
        keywords: ["FHA gift funds DPA", "Utah Housing Corporation stacking"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Family gift funds and a down payment assistance (DPA) program can sit on the same FHA purchase. They are not
        the same source of funds. The gift needs a donor paper trail. DPA needs the agency’s note, disclosures, and
        first-lien pairing. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Two different instruments</h2>
      <ul>
        <li>
          <strong>Gift.</strong> Eligible donor, gift letter, evidence the money left the donor and arrived with you or
          at closing. Not repayable. Details:{" "}
          <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link>.
        </li>
        <li>
          <strong>DPA (including many Utah Housing Corporation products).</strong> Often a second mortgage, a
          silent second, or a grant with recapture. Income, purchase-price, education class, and occupancy tests
          apply. Look at the{" "}
          <Link href="/buy/first-time/grants">grants page</Link> for the map, then confirm the live agency guide.
        </li>
      </ul>

      <h2>How stacking usually works on FHA</h2>
      <p>{FHA_SNAPSHOT.giftFunds}</p>
      <ol>
        <li>The first lien is FHA (or another program the DPA allows). Not every DPA pairs with every first lien.</li>
        <li>The DPA fills part of the down payment or closing costs per that product’s formula.</li>
        <li>A gift can fill the remainder when the donor and paper trail meet FHA and the DPA overlay.</li>
        <li>Layered liens still have to fit CLTV and any subordinate-financing rules. That is an underwriting test.</li>
      </ol>
      <p>
        Do not move family money into your account “to look stronger” before the DPA underwriter has a sourcing plan.
        Large undocumented deposits stall both layers.
      </p>

      <h2>What this page will not do</h2>
      <p>
        It will not list this year’s UHC dollar amounts, rate sheets, or income limits. Those go stale. It will not
        tell you that you will receive assistance. Ask a loan officer which first-lien and DPA pairing is even being
        offered this month, then read{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash besides down payment</Link> so you still fund
        prepaids.
      </p>
    </ArticleShell>
  )
}
