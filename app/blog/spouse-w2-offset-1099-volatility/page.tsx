import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, SPOUSE_INCOME_OFFSET } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/spouse-w2-offset-1099-volatility"

const faqs = [
  {
    question: "Can my spouse’s W-2 count if they are not on the loan?",
    answer: SPOUSE_INCOME_OFFSET.nonBorrowing,
  },
  {
    question: "Is Utah a community-property state for mortgages?",
    answer: SPOUSE_INCOME_OFFSET.utahNotCommunityProperty,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "joint", heading: "Both people apply" },
  { id: "nonborrow", heading: "Non-borrowing spouse" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "income",
    criterion: "1099 + W-2 mix",
    cells: {
      joint: SPOUSE_INCOME_OFFSET.jointApplication,
      nonborrow: SPOUSE_INCOME_OFFSET.nonBorrowing,
    },
  },
  {
    id: "credit",
    criterion: "Credit and DTI",
    cells: {
      joint: "Both credit files and both counted debts are in the DTI. A strong W-2 can support a volatile 1099 average — and a thin credit file on the second applicant can also constrain pricing.",
      nonborrow: "The non-applicant is usually not a qualifying-income source. Community-property debt rules in some other states are not Utah’s default.",
    },
  },
  {
    id: "people",
    criterion: "Who this is about",
    cells: {
      joint: SPOUSE_INCOME_OFFSET.fairHousing,
      nonborrow: "Unmarried co-borrowers, married co-borrowers, and single applicants are underwritten on the file. Marital status is not a product.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Using a Spouse’s W-2 to Offset 1099 Volatility",
  description:
    "A steadier W-2 helps when that person is a co-borrower. A non-borrowing spouse’s paycheck does not automatically average in. Utah is not a community-property state.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["spouse W-2 mortgage 1099", "non-borrowing spouse income", "joint application variable income"],
  faqs,
})

export default function SpouseW2OffsetPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Using a Spouse’s W-2 to Offset 1099 Volatility",
        description:
          "A steadier W-2 helps when that person is a co-borrower. A non-borrowing spouse’s paycheck does not automatically average in. Utah is not a community-property state.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The W-2 counts when that person is a borrower. Marriage is not a qualifying method.",
        faqs,
        keywords: ["spouse income mortgage", "joint application 1099"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A steadier W-2 can support a 1099 or commission average — when the person who earns the W-2 is on the
        application as a borrower. A spouse (or partner) who is not on the note does not automatically donate their
        paycheck to your qualifying income. Utah is not a community-property state, and this page is not a doorway
        into Texas or Arizona homestead or community-property law. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{SPOUSE_INCOME_OFFSET.fairHousing}</p>

      <ComparisonTable
        caption={`Joint application vs non-borrowing spouse as of ${LENDING_FACTS_AS_OF}. Overlay still applies.`}
        columns={columns}
        rows={rows}
        footnote="Title vesting is a separate conversation from who is on the note. Occupancy still has to match the program."
      />

      <h2>What “offset” actually means</h2>
      <p>
        Underwriters average variable income. They do not subtract a W-2 from a 1099 like a spreadsheet trick. On a
        joint file, both qualifying incomes are added after each is calculated, and both counted debts are in DTI. See{" "}
        <Link href="/blog/can-i-get-a-mortgage-if-my-income-changes-every-month">income that changes every month</Link>{" "}
        and the <Link href="/blog/1099-mortgage-documentation-checklist">1099 checklist</Link>.
      </p>
      <p>
        {SPOUSE_INCOME_OFFSET.utahNotCommunityProperty} If you are applying from another licensed state, ask the loan
        officer which guide applies to the <em>property</em> and the <em>borrowers</em> — do not import a blog paragraph
        from a different state’s family-property statute.
      </p>

      <h2>If the W-2 earner should not be on the loan</h2>
      <p>
        Then you are usually qualifying on the 1099 (or mixed) file alone. That may still work with a documented
        average. It is not “using their W-2.” Adding a co-borrower is a credit pull, DTI, and title decision. Gift
        funds from family are a different tool: <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link>
        .
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Decide who will be on the note before you shop as if two incomes are available.</li>
        <li>
          Average the 1099 on a 12–24 month basis; do not plug last month’s invoice into the{" "}
          <Link href="/calculators/income">income calculator</Link>.
        </li>
        <li>
          Map the rest of the file on the <Link href="/learn/variable-income">variable-income hub</Link>, then start a{" "}
          <Link href="/qualify">conversation</Link> — not a promise of approval.
        </li>
      </ol>
    </ArticleShell>
  )
}
