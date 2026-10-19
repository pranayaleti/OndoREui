import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ESCROW_CUSHION, ESCROW_SHORTAGE, ESCROW_WAIVER, LENDING_FACTS_AS_OF, UTAH_TAX_CALENDAR } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/escrow-shortage-after-first-year"
const title = "Escrow and Utah Property Taxes: Cushion, Shortages, Waiving Impounds and the First Analysis"
const description =
  "How the escrow cushion is capped, why Utah's November tax bill makes the first analysis surprise, shortage options, and when impounds can be waived."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "First-Time Buyers"
const keywords = [
  "escrow shortage after first year",
  "escrow cushion RESPA",
  "impounds vs waiving escrow",
  "Utah property tax due date",
  "first escrow analysis Utah",
  "Utah primary residential exemption",
  "annual escrow analysis",
]

const takeaways = [
  "The cushion is a federal ceiling, generally 1/6 of estimated annual disbursements (about two months), not a number every servicer uses.",
  "Utah counties bill property tax once a year, typically due November 30, so the first analysis after closing works from a real bill where closing worked from an estimate.",
  "A shortage is money the account is short for the next 12 months of bills. The cushion is extra the servicer may hold. Both can sit on the same notice.",
  "The notice typically offers a lump sum or spreading the shortage over the next 12 payments. The monthly escrow portion can change either way.",
  "A conventional escrow waiver is an investor overlay, not a right at 20% down. FHA, VA and USDA files commonly require impounds.",
] as const

const faqs = [
  {
    question: "Is the two-month cushion required on every loan?",
    answer:
      "No. Federal aggregate accounting caps the cushion at 1/6 of estimated annual tax and insurance disbursements, which is where the two-month shorthand comes from. A servicer or loan contract can require less. Ask the servicer which cushion your analysis used.",
  },
  {
    question: "Is an escrow shortage the same as the cushion?",
    answer:
      "No. A shortage is the gap between what the account holds and what it needs for the next 12 months of projected bills plus any allowed cushion. The cushion is the extra balance the servicer may keep. They are related lines on the same notice, not the same thing.",
  },
  {
    question: "Do I have to pay a shortage in a lump sum?",
    answer:
      "Usually not. The annual analysis notice typically offers a lump sum or spreading the shortage across the next 12 monthly payments. Either way, the monthly escrow portion can still change because next year's bills were re-projected.",
  },
  {
    question: "Why was my first escrow analysis higher than the Loan Estimate?",
    answer:
      "Your escrow year starts at closing, and Utah's tax year does not. Closing collected an estimate of the months until the next November tax payment plus a cushion. The first analysis uses the tax and insurance bills that were actually paid, then projects the next 12 months from them.",
  },
  {
    question: "When are Utah property taxes typically due?",
    answer:
      "Typically November 30, billed once a year by the county treasurer. If that date falls on a weekend or holiday, the next business day usually applies. Confirm the treasurer for the county where the property sits.",
  },
  {
    question: "Does a rental qualify for Utah's primary residential exemption?",
    answer:
      "It can. The exemption follows the occupant, not the owner. A long-term rental a tenant occupies as a primary residence for at least 183 consecutive days generally qualifies. Nightly rentals, vacation homes and second homes do not, and are taxed on 100% of market value. Confirm with the county assessor.",
  },
  {
    question: "Can I waive escrow if I put 20% down?",
    answer:
      "Sometimes, on a conventional loan, if the investor offers a waiver and you meet its tests. It is an overlay, often tied to equity around 80% LTV, housing history and sometimes a fee or pricing adjustment. It is not automatic at 20% and not available on every product.",
  },
  {
    question: "Do FHA and VA loans let me skip impounds?",
    answer:
      "Plan on escrow. FHA, VA and USDA files commonly require the servicer to collect taxes and insurance monthly. A conventional borrower's waiver does not transfer to a government-backed loan.",
  },
] as const

const calendarColumns: readonly ComparisonColumn[] = [
  { id: "county", heading: "County tax calendar" },
  { id: "escrow", heading: "Mortgage escrow year" },
]

const calendarRows: readonly ComparisonRow[] = [
  {
    id: "bill",
    criterion: "How often the bill hits",
    cells: {
      county: "Once a year, with valuation and tax notice dates that differ by county.",
      escrow: "The servicer collects every month, then disburses when the tax and insurance bills come due.",
    },
  },
  {
    id: "clock",
    criterion: "Whose calendar",
    cells: {
      county: "Typically November 30, or the next business day.",
      escrow: "Starts on your closing date, so the monthly collection and the annual bill do not line up.",
    },
  },
  {
    id: "basis",
    criterion: "What the number is based on",
    cells: {
      county: "The assessor's current market value, the exemption status and this year's combined rate.",
      escrow: "At closing, an estimate from the last bill the lender could see. After a year, the bills actually paid.",
    },
  },
]

const balanceColumns: readonly ComparisonColumn[] = [
  { id: "shortage", heading: "Shortage", href: "/faq/buying-selling-faqs" },
  { id: "cushion", heading: "Cushion" },
  { id: "surplus", heading: "Surplus" },
]

const balanceRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      shortage: "The account will not cover the next 12 months of projected bills plus the allowed cushion.",
      cushion: "Extra balance the servicer may hold so the account is not empty the day a large bill posts. Federally capped.",
      surplus: "The account holds more than the next 12 months of bills plus any allowed cushion.",
    },
  },
  {
    id: "next",
    criterion: "Typical next step",
    cells: {
      shortage: "Pay it in a lump sum or let the servicer spread it over the next 12 payments. Both options are on the notice.",
      cushion: "Nothing to pay separately. It is rebuilt or trimmed through the new monthly escrow portion.",
      surplus: "Often a refund, or a credit against future escrow deposits for a small amount. The notice states which applies.",
    },
  },
]

const waiverColumns: readonly ComparisonColumn[] = [
  { id: "impound", heading: "Impounds on" },
  { id: "waive", heading: "Waiver (when it exists)" },
]

const waiverRows: readonly ComparisonRow[] = [
  {
    id: "monthly",
    criterion: "Monthly draft",
    cells: {
      impound: "Principal, interest, and a monthly share of taxes and insurance in one payment.",
      waive: "Principal and interest only. Taxes and insurance stay on you.",
    },
  },
  {
    id: "cash",
    criterion: "Cash at closing",
    cells: {
      impound: "Months of taxes and insurance plus an allowed cushion are collected as prepaids.",
      waive: "No initial escrow deposit. You keep that cash until the treasurer and the carrier bill you.",
    },
  },
  {
    id: "after",
    criterion: "After the first year",
    cells: {
      impound: "An annual escrow analysis, and possibly a shortage or surplus notice.",
      waive: "No analysis. You still owe the treasurer by November 30 and the insurer on its renewal date.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Escrow Shortages and Utah Property Taxes Explained",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  takeaways,
  faqs,
})

export default function EscrowShortagePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "The county tax year, your escrow year and the first annual analysis are three different clocks.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Your mortgage escrow account, Utah&rsquo;s once-a-year property tax bill, and the servicer&rsquo;s first annual
        analysis run on three different clocks. This guide puts them in one place: how the cushion is capped, why the
        first analysis after closing often looks nothing like the Loan Estimate, what a shortage is and how it gets
        paid, and when an escrow waiver exists at all. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>
        This is education about servicing math and calendar timing. It is not tax advice, not a protest-deadline
        guide, and not a quote of your next escrow payment. Your analysis notice and your county treasurer are the
        documents of record.
      </p>

      <h2 id="what-an-escrow-account-does">What an escrow account does</h2>
      <p>{ESCROW_WAIVER.impounds}</p>
      <p>
        Three documents describe that account over the first year, and they are easy to confuse because each one
        shows a monthly tax-and-insurance figure.
      </p>
      <ul>
        <li>
          <strong>The Loan Estimate</strong> shows a projected escrow payment and the prepaids the lender expects to
          collect at closing. It is a projection built from the last tax bill and insurance quote the lender could
          see.
        </li>
        <li>
          <strong>The initial escrow account statement</strong> is delivered at or shortly after closing. It lists the
          starting deposit, the expected disbursements for the first 12 months, and the monthly collection.
        </li>
        <li>
          <strong>The annual escrow analysis</strong> arrives after about 12 months. It compares what was collected to
          what was actually paid out, projects the next 12 months, and announces a new monthly collection along with
          any shortage or surplus.
        </li>
      </ul>
      <p>
        The third document is where most surprises land, and the rest of this guide explains the three inputs that
        feed it: the cushion rule, the Utah tax calendar, and the gap between the closing estimate and real bills.
      </p>

      <h2 id="how-the-cushion-is-set">How the cushion is set: federal aggregate accounting</h2>
      <p>{ESCROW_CUSHION.maxCushion}</p>
      <p>
        The rule comes from RESPA and Regulation X (12 CFR 1024.17). Under the aggregate method the servicer looks at
        the account as a whole rather than bill by bill. It lists every tax and insurance disbursement expected over
        the next 12 months, sets the monthly deposit at one-twelfth of that total, then runs a month-by-month trial
        balance. The lowest point that trial balance reaches is not allowed to sit below the cushion, and the cushion
        itself cannot exceed one-sixth of the annual disbursements. That trial balance is what produces the target
        balance printed on your notice.
      </p>
      <p>
        Two things follow from that. First, the two-month figure is a maximum. A servicer, an investor, or your loan
        contract can call for a smaller cushion, and some do. Second, because the deposit is one-twelfth of the
        projected bills, any change in the bills changes the deposit even if the cushion rule never moves.
      </p>
      <p>{ESCROW_CUSHION.whyItMoves}</p>
      <p>{ESCROW_CUSHION.notUniversal}</p>

      <h2 id="utah-property-tax-calendar">The Utah property tax calendar</h2>
      <p>{UTAH_TAX_CALENDAR.dueDate}</p>
      <p>{UTAH_TAX_CALENDAR.annualBill}</p>
      <p>
        Two county offices are involved, and they do different jobs. The county assessor sets the market value of the
        property each year and decides whether the residential exemption applies. The county treasurer sends the tax
        notice, collects the payment and marks it delinquent if it is late. Salt Lake, Utah, Davis, Weber, Washington
        and Summit counties do not mail on identical dates, so the treasurer site for the county where the property
        sits is the calendar to trust.
      </p>

      <h3 id="how-the-bill-is-computed">How the bill is computed</h3>
      <p>
        The assessor estimates fair market value every year. For a home that qualifies as a primary residence, Utah
        applies a 45% residential exemption, so the taxable value is 55% of market value. The tax owed is that taxable
        value multiplied by the combined rate of every taxing entity that overlaps the parcel: county, city, school
        district, water and other special districts. Combined rates differ from city to city inside the same county,
        which is why two similar homes a few miles apart can carry different bills. The current year&rsquo;s bill and
        rate are on the county treasurer&rsquo;s site, and that is the number to pull before you make an offer.
      </p>

      <h3 id="truth-in-taxation">Truth in Taxation notices</h3>
      <p>
        Utah&rsquo;s Truth in Taxation law (Utah Code &sect; 59-2-919) requires a taxing entity that plans to collect
        more property tax revenue than the prior year to notify owners and hold a public hearing. The notice usually
        arrives in August or September. It is not the tax bill. It tells you that one or more of your taxing entities
        is proposing a rate increase and that you can attend the hearing and comment. The practical consequence is that
        your bill can rise even in a year when your assessed value holds flat, because a school district or city voted
        to raise its levy.
      </p>

      <h3 id="primary-residential-exemption">The primary residential exemption and the 183-day rule</h3>
      <p>
        The 45% exemption applies to a home that is someone&rsquo;s primary residence, and that someone can be a
        tenant. A long-term rental that a tenant occupies as their primary residence for at least 183 consecutive days
        generally qualifies. Nightly and short-term rentals, vacation homes and second homes do not qualify and are
        taxed on 100% of market value. The difference is a meaningful line in any underwriting of a second home or a
        short-term rental, and it is also a reason a buyer&rsquo;s first tax bill can differ from the seller&rsquo;s
        last one when the use of the home changes. Counties may ask the owner to sign a residential declaration
        confirming the use. Ask the assessor how the exemption is applied to a specific parcel, and verify the current
        bill in the county database before closing. The rules themselves are published by the{" "}
        <a href="https://tax.utah.gov/" rel="noopener noreferrer">
          Utah State Tax Commission
        </a>{" "}
        (tax.utah.gov).
      </p>

      <h3 id="appealing-the-assessment">Appealing the assessment</h3>
      <p>
        If you believe the assessor&rsquo;s market value is above what the home would sell for, you can petition the
        County Board of Equalization, typically by September 15 of the tax year. Bring closed comparable sales, not
        listing prices. Most counties offer an informal review before a formal appeal. In fast-rising markets
        assessments can lag; in correcting markets they can overshoot. An appeal is an assessor and Board of
        Equalization process. Your servicer is not part of it and will pay whatever the treasurer bills, so a
        successful appeal shows up in your escrow account only at the next analysis.
      </p>

      <h2 id="why-the-first-escrow-analysis-surprises">Why the first escrow analysis surprises</h2>
      <p>{UTAH_TAX_CALENDAR.escrowMismatch}</p>
      <ComparisonTable
        caption={`County tax calendar vs mortgage escrow year as of ${LENDING_FACTS_AS_OF}.`}
        columns={calendarColumns}
        rows={calendarRows}
        footnote="Illustration of timing. Not a quote of your next impound payment."
      />
      <p>
        At closing, the title company and the lender collect an estimate of the months until the next tax
        disbursement, plus a cushion. If you close in spring, a large November bill is still coming and the account
        has only a few months of deposits to meet it. If you close in late fall, the next November is almost a year
        away and the account looks comfortable. Either way the first analysis replaces the closing projection with
        the bills that were actually paid, and projects the following year from those.
      </p>
      <p>Three things make that first real bill different from the estimate more often than buyers expect.</p>
      <ul>
        <li>
          <strong>The estimate came from an old bill.</strong> The lender used the most recent tax bill it could see,
          which reflected last year&rsquo;s value and last year&rsquo;s rate. The treasurer bills this year&rsquo;s.
        </li>
        <li>
          <strong>The exemption status may have changed.</strong> If the seller held the primary residential exemption
          and the home is now a second home or a short-term rental, the taxable value moves from 55% to 100% of market
          value and the bill follows.
        </li>
        <li>
          <strong>New construction.</strong> On a newly built home the last bill the lender could see may have covered
          the lot alone or a partial year of improvements, so the estimate was built on a smaller number than the
          finished home will carry.
        </li>
      </ul>

      <h3 id="worked-timing">Worked timing (illustration, not your file)</h3>
      <ul>
        <li>
          <strong>Close in March.</strong> Closing may collect several months toward November. After a year of actual
          tax and insurance disbursements, the first analysis can still show a shortage if the new bill or the
          insurance renewal came in higher than the estimate.
        </li>
        <li>
          <strong>Close in October.</strong> The November bill may be paid at or right after closing out of the initial
          deposit. The following year of collections can look high month to month because the entire annual bill is
          concentrated in one disbursement.
        </li>
      </ul>

      <h2 id="shortage-cushion-and-surplus">Shortage, cushion and surplus</h2>
      <p>{ESCROW_SHORTAGE.howItAppears}</p>
      <ComparisonTable
        caption={`Shortage, cushion and surplus as of ${LENDING_FACTS_AS_OF}. Confirm the analysis notice.`}
        columns={balanceColumns}
        rows={balanceRows}
        footnote="Educational snapshot. Not a quote of your next impound payment."
      />
      <p>{ESCROW_SHORTAGE.vsCushion}</p>
      <p>
        Two more terms show up on notices. A <strong>deficiency</strong> means the account actually went below zero
        at some point, usually because a bill posted before enough deposits had arrived; it is treated separately
        from a shortage, which only means the projected balance is below target. A <strong>surplus</strong> means the
        account holds more than it needs. Federal rules generally require the servicer to refund a surplus of $50 or
        more within 30 days when the loan is current, and allow a smaller surplus to be refunded or credited against
        future deposits. The notice states which applies to your account.
      </p>

      <h2 id="pay-now-or-spread">Pay the shortage now or spread it</h2>
      <p>{ESCROW_SHORTAGE.options}</p>
      <ul>
        <li>
          <strong>Lump sum.</strong> You send the shortage amount now. The monthly escrow portion may still change,
          because the shortage and the new projection for next year&rsquo;s bills are two separate lines on the
          notice.
        </li>
        <li>
          <strong>Spread.</strong> One-twelfth of the shortage is added to each of the next 12 escrow deposits. Your
          total payment can rise even though the note rate did not move, which is the most common reason a
          first-year homeowner thinks the rate changed.
        </li>
      </ul>
      <p>
        Neither option changes the loan. A shortage is a servicing matter under the same note and deed of trust, and
        it says nothing about whether you qualified. Once the shortage is repaid and the new bills are settled, the
        next analysis starts from the real numbers and tends to move less.
      </p>

      <h2 id="impounds-vs-waiving-escrow">Impounds vs waiving escrow: an overlay, not a right</h2>
      <p>{ESCROW_WAIVER.waiver}</p>
      <p>{ESCROW_WAIVER.government}</p>
      <ComparisonTable
        caption={`Impounds vs waiver as of ${LENDING_FACTS_AS_OF}. Overlay, not a statute.`}
        columns={waiverColumns}
        rows={waiverRows}
        footnote="FHA, VA and USDA commonly require escrow. Conventional waiver tests are investor-specific."
      />
      <p>{ESCROW_WAIVER.tradeoff}</p>
      <p>Where the question usually comes up:</p>
      <ul>
        <li>
          <strong>Conventional, lower LTV, you want a lower monthly draft.</strong> Ask whether a waiver exists on that
          investor and what it costs in price or fee. The Loan Estimate shows whether escrow is required and whether a
          waiver fee appears.
        </li>
        <li>
          <strong>FHA, VA or USDA.</strong> Plan on impounds and build the monthly figure into your budget from day
          one.
        </li>
        <li>
          <strong>You waive and then miss the November bill.</strong> That is a treasurer and possible lien problem,
          not an escrow analysis. Deeds of trust commonly allow the servicer to establish an escrow account if taxes
          or insurance go unpaid, so a waiver is not permanent if the bills are not kept current.
        </li>
      </ul>
      <p>
        A shortage letter is not an argument for or against waiving. Shortages and surpluses happen on impounded
        loans because projections miss; a waived loan avoids the analysis by putting the full November bill on you
        instead.
      </p>

      <h2 id="what-this-guide-will-not-do">What this guide will not do</h2>
      <ul>
        <li>Tell you which shortage option is cheaper in dollars on your file.</li>
        <li>Publish a servicer&rsquo;s exact months of cushion as if every investor used it.</li>
        <li>Promise you can waive escrow at any LTV, or quote a waiver fee or pricing adjustment.</li>
        <li>Advise you to protest a tax bill, skip insurance, or calendar an appeal deadline for your county.</li>
        <li>Quote your next impound payment.</li>
      </ul>

      <h2 id="what-happens-next">What happens next</h2>
      <ol>
        <li>
          Read the annual escrow analysis notice. The shortage or surplus, the cushion the servicer used, and the new
          monthly collection are all on that letter.
        </li>
        <li>
          Pull the current tax notice from the county treasurer for the property and check whether the residential
          exemption is applied. If something looks off, the assessor is the office to call.
        </li>
        <li>
          Ask the servicer which bills it projected and which cushion it applied. Do not assume two months.
        </li>
        <li>
          Still shopping? How prepaids are estimated on a Loan Estimate:{" "}
          <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>. Why the first
          statement differs from the note rate:{" "}
          <Link href="/blog/first-mortgage-statement-vs-note-rate">first statement vs note rate</Link>. More
          questions: <Link href="/faq/buying-selling-faqs">escrow FAQs</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
