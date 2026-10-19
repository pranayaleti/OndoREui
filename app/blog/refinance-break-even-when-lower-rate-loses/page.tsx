import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { BreakEvenTable } from "@/components/content/break-even-table"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ProsCons } from "@/components/content/pros-cons"
import {
  BIWEEKLY_VS_REFI,
  DISCOUNT_POINTS,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  NO_CLOSING_COST_REFI,
  RECAST_VS_REFI,
  STREAMLINE_REFI,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/refinance-break-even-when-lower-rate-loses"
const title = "Should You Refinance? Break-Even, Points, No-Closing-Cost, Recast and Streamline"
const description =
  "Refinance break-even with points and origination, the no-closing-cost rate trade, recast vs refinance, extra principal, and FHA and VA streamlines."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "Refinance"
const keywords = [
  "refinance break even",
  "refinance closing costs points origination",
  "no closing cost refinance",
  "discount points breakeven",
  "recast vs refinance",
  "biweekly mortgage vs refinance",
  "mortgage payoff tips",
  "FHA streamline refinance",
  "VA IRRRL requirements",
]

// Discount-point illustration, typed numbers, not a quote.
const loanAmount = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.8)
const onePoint = Math.round(loanAmount * 0.01)
const monthlySavingsIllustration = 28
const pointBreakevenMonths = Math.ceil(onePoint / monthlySavingsIllustration)

const takeaways = [
  "Break-even months ≈ total cash costs ÷ the monthly principal-and-interest saving. Discount points, origination, title, and prepaid interest all belong in the cost side; lender credits come out of it.",
  "A lower note rate is not a saving until those costs are earned back, and only if you keep the loan that long. Some refinances are still worth doing for other reasons, such as leaving an ARM.",
  "A no-closing-cost refinance moves the cost into the rate. Discount points move it the other way. Compare two Loan Estimates with the same lock period, not a headline rate.",
  "If you like your current rate, extra principal or a recast changes the payoff or the payment without a new note or new closing costs.",
  "FHA Streamline and VA IRRRL shorten the document list. Occupancy, payment history, and a net-benefit test still apply, and costs still exist.",
] as const

const faqs = [
  {
    question: "Is break-even just closing costs divided by the new payment?",
    answer:
      "Use monthly principal-and-interest savings, and put points, origination, title, and prepaid interest in the cost side. A lender credit reduces costs. Ignoring points understates the months to earn the refinance back.",
  },
  {
    question: "If I might move in two years, does a lower rate still help?",
    answer:
      "Only if break-even is shorter than you will keep the loan. A lower rate that takes 36 months to earn back loses if you sell in month 18.",
  },
  {
    question: "Is a no-closing-cost refinance actually free?",
    answer: NO_CLOSING_COST_REFI.tradeoff,
  },
  {
    question: "What is a discount point?",
    answer: DISCOUNT_POINTS.definition,
  },
  {
    question: "Does a recast lower the interest rate?",
    answer: RECAST_VS_REFI.recast,
  },
  {
    question: "Is extra principal the same as refinancing?",
    answer: BIWEEKLY_VS_REFI.vsRefi,
  },
  {
    question: "Is an FHA Streamline a no-document refinance?",
    answer: STREAMLINE_REFI.fha,
  },
  {
    question: "Is a VA IRRRL the same as a cash-out?",
    answer: `${STREAMLINE_REFI.va} Cash-out is a different product with a full underwrite.`,
  },
]

const creditColumns: readonly ComparisonColumn[] = [
  { id: "credit", heading: "Lender-credit / “no closing cost”" },
  { id: "pay", heading: "Pay costs, lower note" },
]

const creditRows: readonly ComparisonRow[] = [
  {
    id: "cash",
    criterion: "Cash at closing",
    cells: {
      credit: NO_CLOSING_COST_REFI.stillCash,
      pay: "You bring more cash (or roll costs into the loan). The note is typically lower than the credit file.",
    },
  },
  {
    id: "rate",
    criterion: "Note rate",
    cells: {
      credit: "Usually higher than the same file with fewer credits. The cost moved into the rate.",
      pay: "Usually lower. Points that buy the rate down still belong in the break-even numerator.",
    },
  },
  {
    id: "keep",
    criterion: "If you keep the loan a long time",
    cells: {
      credit: NO_CLOSING_COST_REFI.vsBreakEven,
      pay: "Break-even months ≈ cash costs ÷ monthly P&I savings. After that month, the lower note can win in this simple model.",
    },
  },
]

const pointsColumns: readonly ComparisonColumn[] = [
  { id: "points", heading: "Discount points", href: "/buy/rates" },
  { id: "buydown", heading: "Temporary buydown", href: "/blog/rate-lock-if-rates-drop" },
]

const pointsRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it changes",
    cells: {
      points: DISCOUNT_POINTS.definition,
      buydown: "A subsidy of the monthly payment for a stated period. The note rate is still the note rate.",
    },
  },
  {
    id: "when",
    criterion: "When the benefit ends",
    cells: {
      points: "When you refinance, sell, or the loan is paid off. Not on a calendar year-3 cliff.",
      buydown: "When the subsidy period ends (year 3 on a 2-1; year 4 on a 3-2-1). Then you pay the full note payment.",
    },
  },
  {
    id: "math",
    criterion: "How to compare",
    cells: {
      points: DISCOUNT_POINTS.breakeven,
      buydown: "Cost of the subsidy vs years of lower payment. Model it; do not assume it is “free from the builder.”",
    },
  },
]

const paydownColumns: readonly ComparisonColumn[] = [
  { id: "bi", heading: "Biweekly / extra principal" },
  { id: "refi", heading: "Refinance" },
]

const paydownRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What changes",
    cells: {
      bi: BIWEEKLY_VS_REFI.biweekly,
      refi: "Note rate, term, and closing costs. The payment can fall or rise depending on term.",
    },
  },
  {
    id: "same",
    criterion: "Same dollars, different machine",
    cells: {
      bi: BIWEEKLY_VS_REFI.extraPrincipal,
      refi: "Costs have to be earned back first. A lower note rate can still lose if you move before break-even.",
    },
  },
]

const streamlineColumns: readonly ComparisonColumn[] = [
  { id: "fha", heading: "FHA Streamline", href: "/loans/fha" },
  { id: "va", heading: "VA IRRRL", href: "/loans/va" },
  { id: "full", heading: "Full credit-qualifying refi", href: "/refinance/rate-term" },
]

const streamlineRows: readonly ComparisonRow[] = [
  {
    id: "who",
    criterion: "Who it is for",
    cells: {
      fha: "You already have an FHA loan and want FHA-to-FHA with less documentation.",
      va: "You already have a VA loan and want a VA-to-VA rate reduction (IRRRL).",
      full: "Any program change, cash-out, occupancy change, or a file that cannot pass net-benefit / payment-history tests.",
    },
  },
  {
    id: "docs",
    criterion: "What “less docs” still requires",
    cells: {
      fha: STREAMLINE_REFI.fha,
      va: STREAMLINE_REFI.va,
      full: "Full income, assets, appraisal (unless waived), and credit, the usual refinance stack. Break-even math applies in full.",
    },
  },
  {
    id: "still",
    criterion: "Still in the file",
    cells: {
      fha: STREAMLINE_REFI.stillRequires,
      va: "Occupancy certification, title, a new note, and often a recoupment test. Overlays may still pull credit.",
      full: "Everything a purchase-style underwrite would want, plus the current mortgage being paid off.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Should You Refinance? Break-Even, Points and Recast",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  faqs,
})

export default function RefiBreakevenPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "A lower note rate is not a savings until costs are earned back. One page for the whole decision.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A lower interest rate still loses if closing costs (including discount points and origination) take longer to
        earn back than you will keep the loan. That one sentence covers most refinance decisions, and the rest of this
        guide is the detail: how to run break-even, what a “no closing cost” offer really trades, when discount points
        pay off, when a recast or extra principal does the job without a new note, and what an FHA Streamline or VA
        IRRRL still requires. {EXAMPLE_NOTE} Snapshot as of {LENDING_FACTS_AS_OF}. This is educational content, not a
        commitment to lend and not a recommendation to refinance.
      </p>

      <h2>The break-even formula</h2>
      <p>
        Break-even months ≈ cash costs ÷ monthly principal-and-interest savings. That is the whole formula, and the two
        halves are where people go wrong.
      </p>
      <ul>
        <li>
          <strong>Numerator.</strong> Appraisal, title, recording, prepaid interest, origination, and discount points.
          Subtract lender credits. If a cost is on the Loan Estimate and you would not pay it by keeping your current
          loan, it belongs here.
        </li>
        <li>
          <strong>Denominator.</strong> Old P&amp;I minus new P&amp;I. Do not treat a tax-and-insurance change as
          “savings.” Escrow moves with the county and the insurer, not with the note.
        </li>
      </ul>
      <p>
        Illustration: $6,000 in costs (including one point) and $150 less P&amp;I is 40 months, the middle column
        below. The same table appears on the refinance hub and the refinance calculator, so the numbers match wherever
        you meet them.
      </p>
      <BreakEvenTable table="stay-scenarios" />
      <p>
        Two things this simple model leaves out, on purpose. First, resetting to a new 30-year term can lower the
        payment while raising total interest paid, because you are stretching the balance over more years; a shorter
        remaining term on the old loan makes that gap bigger. Second, the cash you spend on costs had another use, and
        a loan officer can model the opportunity cost and taxes for your file. Neither changes the first question,
        which is whether you will still hold the loan at the break-even month.
      </p>

      <h2>When a refinance still makes sense, and when a lower rate loses</h2>
      <ProsCons
        prosHeading="People still refinance when"
        consHeading="A lower rate still loses when"
        pros={[
          "They are removing a risky ARM reset, even if break-even is long.",
          "They are changing term, 30 to 15, say, for a payoff goal rather than a payment cut.",
          "There is a cash-out need, after comparing a HELOC rather than assuming cash-out is cheaper.",
        ]}
        cons={[
          "Break-even runs longer than they will keep the loan.",
          "Discount points and origination were left out of the cost side.",
          "The “saving” was a tax or insurance change, not a lower principal-and-interest payment.",
        ]}
      />
      <p>
        Comparing a second lien instead of a new first mortgage:{" "}
        <Link href="/blog/heloc-vs-cash-out-refinance">HELOC vs cash-out refinance</Link>.
      </p>

      <h2>No-closing-cost refinance: the cost is in the rate</h2>
      <p>{NO_CLOSING_COST_REFI.tradeoff}</p>
      <p>
        If nobody writes a check at the table, the pricing sheet still did. A lender credit is the mirror image of
        discount points: instead of paying cash for a lower rate, you accept a higher rate in exchange for cash toward
        fees. The same break-even arithmetic applies, with the sign flipped.
      </p>
      <ComparisonTable
        caption={`Same loan amount, two pricing choices as of ${LENDING_FACTS_AS_OF}. Not a quote.`}
        columns={creditColumns}
        rows={creditRows}
        footnote="Compare two Loan Estimates with the same lock period. Neither is “the best rate.”"
      />
      <h3>What can still show as cash</h3>
      <p>{NO_CLOSING_COST_REFI.stillCash} Prepaids are not a marketing slogan.</p>
      <h3>Run break-even anyway</h3>
      <p>
        {NO_CLOSING_COST_REFI.vsBreakEven} Put the higher payment of the credit file into the comparison, not only “$0
        due at closing.”
      </p>
      <p>
        Illustration (not your quote): two otherwise similar rate-and-term files. One uses a credit so cash to close is
        near zero and the note is higher. The other has $4,000 in costs and a lower note that saves $40 of principal
        and interest per month. The pay-costs file’s simple break-even is 100 months. If you expect to move in year
        three, the credit file can win in this toy model. If you keep the loan twelve years, the higher rate can cost
        more than the $4,000. Taxes, remaining term, and a later refinance change the story.
      </p>
      <p>
        A no-closing-cost offer is also not the same thing as a streamline. {NO_CLOSING_COST_REFI.vsStreamline} The
        streamline section below covers what those programs do and do not skip.
      </p>

      <h2>Discount points: paying for a lower rate</h2>
      <p>
        Discount points are optional prepaid interest: typically 1% of the loan amount per point, paid at closing to
        lower the note rate for the life of that loan. Whether that purchase pays off is a calendar question, months
        until the extra cash at closing is earned back in principal-and-interest savings, not a sales pitch about a
        headline rate.
      </p>
      <p>{DISCOUNT_POINTS.notBestRate}</p>
      <p>{DISCOUNT_POINTS.notTempBuydown}</p>
      <h3>A worked break-even (illustration only)</h3>
      <p>
        On an 80% loan of ${loanAmount.toLocaleString("en-US")} against a $
        {EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")} illustration price, one point costs $
        {onePoint.toLocaleString("en-US")}. If monthly principal and interest were ${monthlySavingsIllustration} lower
        than the same loan with zero points (a typed illustration, not a quote), break-even is about{" "}
        {pointBreakevenMonths} months. If you sell or refinance in year two, the points can lose. If you keep the loan
        twelve years, they can look cheap. The Loan Estimate has to show both files with the same lock period.
      </p>
      <p>{DISCOUNT_POINTS.breakeven}</p>
      <ComparisonTable
        caption={`Points vs a temporary buydown as of ${LENDING_FACTS_AS_OF}. Not a recommendation to buy either.`}
        columns={pointsColumns}
        rows={pointsRows}
        footnote="Lender credits that raise the rate are the opposite trade of buying points. Compare cash to close and APR on the same LE."
      />
      <p>
        If a builder is offering a 2-1 instead of points, that is a{" "}
        <Link href="/blog/rate-lock-if-rates-drop">temporary buydown</Link>; model it on the{" "}
        <Link href="/calculators/temporary-buydown">buydown calculator</Link>. Purchase pricing and why your quote is
        not the news average: <Link href="/buy/rates">rates hub</Link>.
      </p>

      <h2>Recast vs refinance</h2>
      <p>
        Recast versus refinance is a cost-and-rate question: a recast keeps your note rate and lowers the required
        payment after you send a principal curtailment; a refinance buys a different rate or term and has to earn its
        closing costs back. {RECAST_VS_REFI.notAQuote}
      </p>
      <h3>What a recast does</h3>
      <p>{RECAST_VS_REFI.recast}</p>
      <p>{RECAST_VS_REFI.whoAllows}</p>
      <h3>What a refinance does</h3>
      <p>{RECAST_VS_REFI.refinance}</p>
      <BreakEvenTable table="recast-vs-refi" />
      <p>{RECAST_VS_REFI.feeVsCosts}</p>
      <h3>Checklist before you ask for either</h3>
      <ul>
        <li>Do you like the current note rate? If yes, recast or extra principal is usually the first conversation.</li>
        <li>Will the servicer recast this investor and this product? Ask in writing.</li>
        <li>If you want a lower rate, put points and origination into break-even, not just the appraisal.</li>
        <li>A lump sum that you need later for reserves or another purchase is not “free” recast money.</li>
      </ul>
      <p>
        This section does not quote a recast fee, a new rate, or interest saved, and it does not promise that every
        servicer recasts FHA, VA, or ARM notes.
      </p>

      <h2>Biweekly and extra principal vs refinancing</h2>
      <p>
        A true biweekly schedule is 26 half-payments a year, one extra full payment compared with 12 monthly payments.
        A refinance changes the note. They are different tools, and the extra-principal tools are the ones to look at
        first when you already like your rate. {BIWEEKLY_VS_REFI.noPromise}
      </p>
      <ComparisonTable
        caption={`Paydown vs refinance as of ${LENDING_FACTS_AS_OF}. Illustrate with your balance.`}
        columns={paydownColumns}
        rows={paydownRows}
        footnote="Confirm the servicer applies extra amounts to principal and does not charge a biweekly vendor fee that eats the extra."
      />
      <h3>When extra principal is the conversation</h3>
      <ul>
        <li>You like the current rate and want faster payoff without new closing costs.</li>
        <li>
          You can send extra principal the servicer will apply. Ask; do not assume a third-party biweekly company is
          required.
        </li>
        <li>
          You have a lump sum and want a lower required payment. That is the recast case above, not a refinance.
        </li>
      </ul>
      <h3>When refinance is the conversation</h3>
      <ul>
        <li>You want a different rate or term, and you will stay long enough to earn the costs back.</li>
        <li>You want out of an ARM before a reset, or you need cash out and have already priced a HELOC.</li>
        <li>“No closing cost” is on the table and you have run the higher payment through break-even, as above.</li>
      </ul>
      <p>
        Use the <Link href="/calculators/mortgage-payment">mortgage payment calculator</Link> to see extra principal on
        the current note, and the <Link href="/calculators/refinance">refinance calculator</Link> to include costs on
        a new note. Neither output is a quote.
      </p>

      <h2>Paydown tactics, and when not to prepay</h2>
      <p>
        A mortgage front-loads interest: in the early years, most of each payment is interest, not principal. Anything
        that adds to principal early has the largest effect on lifetime interest, but the right move depends on your
        rate and your alternatives.
      </p>
      <h3>Tactics that work</h3>
      <ul>
        <li>
          <strong>Extra principal, early.</strong> A modest recurring extra payment in the first third of the term does
          the most, because it removes balance while the interest share of each payment is highest.
        </li>
        <li>
          <strong>Biweekly payments.</strong> Half the monthly amount every two weeks is 26 half-payments, one extra
          full payment a year. Confirm the servicer applies it as described above.
        </li>
        <li>
          <strong>Round up.</strong> Rounding a $1,840 payment to $2,000 is an automatic principal boost with no
          paperwork.
        </li>
        <li>
          <strong>Recast after a lump sum.</strong> Same rate and term, lower payment, a servicer fee rather than closing
          costs, if the investor allows it.
        </li>
        <li>
          <strong>Refinance when the math works.</strong> A lower rate or shorter term can cut total interest, after
          closing costs are weighed against break-even.
        </li>
      </ul>
      <h3>When not to pay down</h3>
      <ul>
        <li>
          <strong>Low fixed rate.</strong> If your rate is well below what safe investments return, extra dollars may
          work harder invested than prepaying. Prepaying is a return equal to your note rate, no more and no less.
        </li>
        <li>
          <strong>No emergency fund.</strong> Liquidity first. You cannot easily pull cash back out of a paid-down
          mortgage without a refinance or a HELOC.
        </li>
        <li>
          <strong>Higher-interest debt.</strong> Clear credit cards and other high-rate balances before prepaying a
          mortgage.
        </li>
        <li>
          <strong>Investor cash flow.</strong> On a rental, prepaying lowers the loan balance and can lower your{" "}
          <Link href="/blog/cash-on-cash-return-explained">cash-on-cash return</Link>, a deliberate trade of yield for
          safety.
        </li>
      </ul>

      <h2>FHA Streamline and VA IRRRL</h2>
      <p>
        A streamline refinance is FHA-to-FHA or VA-to-VA with a shorter document list, not a generic “no closing cost,
        no docs” refinance. Occupancy, recent payment history, and a net-benefit or recoupment test still apply.
      </p>
      <ComparisonTable
        caption={`FHA Streamline vs VA IRRRL vs a full refinance as of ${LENDING_FACTS_AS_OF}.`}
        columns={streamlineColumns}
        rows={streamlineRows}
        footnote="Conventional limited-cash-out refinances are a different investor product. They are not FHA Streamline or IRRRL."
      />
      <h3>FHA Streamline</h3>
      <p>{STREAMLINE_REFI.fha}</p>
      <p>
        Credit-qualifying and non-credit-qualifying streamlines are different files. Skipping income docs on a
        non-credit-qualifying path is allowed only when HUD and the lender overlay say so, and the net-tangible-benefit
        test still has to pass. MIP on the new FHA loan follows FHA rules; it is not automatically deleted. How
        mortgage insurance ends: <Link href="/blog/should-i-wait-for-20-percent-down">MIP vs PMI</Link>.
      </p>
      <h3>VA IRRRL</h3>
      <p>{STREAMLINE_REFI.va}</p>
      <p>
        Funding-fee treatment on an IRRRL is a separate snapshot:{" "}
        <Link href="/blog/va-loan-assumption-entitlement">VA funding fee</Link>. Residual income is not re-quoted
        as a dollar figure here; occupancy still has to match VA rules.
      </p>
      <h3>What “less docs” does not skip</h3>
      <p>{STREAMLINE_REFI.stillRequires}</p>
      <ul>
        <li>You generally cannot take cash out on a true streamline.</li>
        <li>Late payments in the lookback usually push you to a full refinance, or no refinance.</li>
        <li>
          Costs still exist. Run break-even including points and origination even when the appraisal is waived. A
          lower note rate can still lose.
        </li>
        <li>Confirm the current loan is FHA or VA. Conventional-to-conventional is not this product.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>
          Decide which question you are asking. Lower rate or different term: refinance, run break-even. Lower payment
          at the same rate after a lump sum: recast. Faster payoff at the same rate: extra principal.
        </li>
        <li>
          If it is a refinance, ask for two Loan Estimates with the same lock period: one paying costs, one with a
          credit. Read note rate, APR, and cash to close together.
        </li>
        <li>
          Put points and origination into the <Link href="/calculators/refinance">refinance calculator</Link>, then
          check the break-even month against how long you expect to keep the loan.
        </li>
        <li>
          If the current loan is FHA or VA, ask whether a streamline or{" "}
          <Link href="/refinance/rate-term">rate-and-term</Link> applies before assuming either.
        </li>
        <li>
          Program hub: <Link href="/refinance">refinance in Utah</Link>. A conversation is not an approval:{" "}
          <Link href="/qualify">start a mortgage conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
