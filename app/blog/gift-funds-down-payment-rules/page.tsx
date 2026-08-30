import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { FHA_SNAPSHOT, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/gift-funds-down-payment-rules"

const faqs = [
  {
    question: "Can a gift cover the entire down payment?",
    answer: `On many FHA files, yes, when the donor is eligible and the paper trail is complete. ${FHA_SNAPSHOT.giftFunds} Conventional and VA have their own donor and documentation rules. Overlays apply.`,
  },
  {
    question: "Can I just deposit cash from family before I apply?",
    answer:
      "Large undocumented cash is one of the fastest ways to stall a file. Lenders need a sourced, seasoned trail. Talk before you move money.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Gift Funds for a Down Payment: What Lenders Need to See",
  description:
    "Gift letters, paper trails, and program differences for FHA, conventional, and VA. Family help is common. Undocumented cash is not.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["gift funds down payment", "FHA gift letter", "down payment help from family"],
  faqs,
})

export default function GiftFundsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Gift Funds for a Down Payment: What Lenders Need to See",
        description:
          "Gift letters, paper trails, and program differences for FHA, conventional, and VA. Family help is common. Undocumented cash is not.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "A gift can be a legitimate source of funds. A mystery deposit is not.",
        faqs,
        keywords: ["gift funds down payment", "mortgage gift letter"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Family help on a down payment is common, especially for first-time buyers. Lenders still have to prove the
        money is a gift, from an eligible donor, and not an undisclosed loan. The paperwork is the product.
      </p>

      <h2>What the file typically contains (as of {LENDING_FACTS_AS_OF})</h2>
      <ul>
        <li>A gift letter that states the amount, the relationship, and that repayment is not required.</li>
        <li>Evidence the donor had the funds (statements) and that they left the donor’s account.</li>
        <li>Evidence they arrived in yours (or at closing via escrow instructions).</li>
      </ul>

      <h2>Program notes, not promises</h2>
      <p>
        FHA: {FHA_SNAPSHOT.giftFunds} Confirm the current HUD definition of an eligible donor. Conventional: donor
        relationships and large-deposit seasoning can be tighter depending on the AUS findings. VA: gift funds are
        allowed in many cases, but the occupancy and entitlement file still has to work. USDA has its own income and
        property-map tests that a gift does not override.
      </p>

      <h2>If your income is also variable</h2>
      <p>
        Gift funds solve cash to close. They do not replace qualifying income. Read{" "}
        <Link href="/learn/variable-income">variable income</Link> and{" "}
        <Link href="/blog/can-i-get-a-mortgage-if-my-income-changes-every-month">
          Can I get a mortgage if my income changes every month?
        </Link>
      </p>
      <p>
        Utah first-time and assistance programs are listed separately on{" "}
        <Link href="/buy/first-time/grants">housing grants</Link>. Those agencies have their own stacking rules with
        gifts. How DPA and an FHA gift can sit on the same file:{" "}
        <Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA stacked with an FHA gift</Link>. Who signs when a parent
        is the donor:{" "}
        <Link href="/blog/parent-gifting-down-payment-who-signs">parent gifting — who signs what</Link>.
      </p>
    </ArticleShell>
  )
}
