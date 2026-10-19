import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import {
  CASH_OUT_TO_RENTAL,
  CROSS_COLLATERAL,
  DELAYED_FINANCING,
  HELOC_SEASONING,
  LENDING_FACTS_AS_OF,
  OCCUPANCY_TYPES,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/heloc-vs-cash-out-refinance"
const title = "HELOC vs Cash-Out Refinance: Tapping Equity, Buying a Rental and Delayed Financing"
const description =
  "How a HELOC and a cash-out refinance differ in lien, payment and tax questions, when you can tap equity after closing, buying a rental, and delayed financing."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "Refinance"
const keywords = [
  "HELOC vs cash-out refinance",
  "cash-out vs home equity line",
  "HELOC seasoning",
  "when can I tap equity",
  "cash out refinance to buy rental",
  "using equity to buy another house",
  "cross collateral mortgage",
  "delayed financing exception",
]

const takeaways = [
  "A HELOC adds a second lien and leaves your first-mortgage rate alone. A cash-out replaces the first lien, resets the term, and reprices the whole balance.",
  "There is no federal two-year wait to tap equity. Ownership and occupancy overlays, commonly six to twelve months, decide when a HELOC or cash-out is available after a recent closing.",
  "Cash-out to buy a rental is two loans with two occupancy answers and two LTV tests. Occupancy on each note has to match use.",
  "Cross-collateral, one debt secured by two houses, is a portfolio or private-lender overlay, not a standard agency purchase product.",
  "Delayed financing is a published agency exception for a cash-out after a cash purchase. The loan is typically capped at the documented cash you put in plus permitted costs, not at the new appraised value.",
]

const faqs = [
  {
    question: "Does a HELOC reset my first-mortgage rate?",
    answer:
      "No. The first lien stays where it is. That is the usual reason people compare a HELOC when the existing rate is worth keeping.",
  },
  {
    question: "Is HELOC interest always tax-deductible?",
    answer:
      "It depends on how the funds are used and on current tax law. Ask a tax professional. This page is not tax advice.",
  },
  {
    question: "Do I have to wait two years after closing to tap equity?",
    answer: HELOC_SEASONING.notAFederalWait,
  },
  {
    question: "Can I cash out my primary and use the money as a rental down payment?",
    answer:
      "Often that is two separate loans: an owner-occupied cash-out, then an investment purchase. Each has its own occupancy and LTV. It is not automatic, and it is not tax advice.",
  },
  {
    question: "Is a HELOC better than a cash-out for a rental down payment?",
    answer: CASH_OUT_TO_RENTAL.vsHeloc,
  },
  {
    question: "Can I use my current house as collateral to buy another one on a standard Fannie loan?",
    answer: CROSS_COLLATERAL.notInvented,
  },
  {
    question: "Is delayed financing a federal waiting period I can calendar as a right?",
    answer: DELAYED_FINANCING.what,
  },
  {
    question: "Is delayed financing the same as tapping a HELOC after year two on a financed purchase?",
    answer: DELAYED_FINANCING.vsSeasoning,
  },
]

const seasoningColumns: readonly ComparisonColumn[] = [
  { id: "now", heading: "Just closed", href: "/loans/heloc" },
  { id: "later", heading: "After seasoning overlays", href: "/refinance/cash-out" },
]

const seasoningRows: readonly ComparisonRow[] = [
  {
    id: "ask",
    criterion: "Typical conversation",
    cells: {
      now: HELOC_SEASONING.justClosed,
      later: HELOC_SEASONING.yearTwo,
    },
  },
  {
    id: "alt",
    criterion: "A different fact pattern",
    cells: {
      now: HELOC_SEASONING.delayedFinancing,
      later: "Once overlays are met, the question goes back to structure: a second lien behind the first, or replacing the first.",
    },
  },
]

const rentalColumns: readonly ComparisonColumn[] = [
  { id: "first", heading: "The house you cash out", href: "/refinance/cash-out" },
  { id: "rental", heading: "The rental you buy", href: "/blog/dscr-vs-full-doc-rental-loan" },
]

const rentalRows: readonly ComparisonRow[] = [
  {
    id: "occ",
    criterion: "Occupancy on that note",
    cells: {
      first: "If you still live there, this is typically owner-occupied cash-out. If you will move out, say so before the refinance.",
      rental: "Investment occupancy unless you will occupy it as a primary or a true second home.",
    },
  },
  {
    id: "ltv",
    criterion: "LTV conversation",
    cells: {
      first: CASH_OUT_TO_RENTAL.ltvTrap,
      rental: "Investment purchase down payment is a separate overlay, often more cash than a primary.",
    },
  },
  {
    id: "qualify",
    criterion: "How the new payment is qualified",
    cells: {
      first: "Your DTI includes the new (usually larger) first-lien payment after cash-out.",
      rental: "Full-doc DTI plus rental worksheet, or DSCR on the property. Two different stacks.",
    },
  },
]

const crossColumns: readonly ComparisonColumn[] = [
  { id: "cross", heading: "Cross-collateral / blanket", href: "/learn/investment" },
  { id: "cash", heading: "Cash-out then purchase", href: "/refinance/cash-out" },
  { id: "heloc", heading: "HELOC draw", href: "/loans/heloc" },
]

const crossRows: readonly ComparisonRow[] = [
  {
    id: "tie",
    criterion: "What is tied together",
    cells: {
      cross: CROSS_COLLATERAL.what,
      cash: "Cash comes out of one house. The new purchase is a separate loan and occupancy.",
      heloc: "A second lien on the first house. The new purchase is still a separate loan unless an investor blankets both.",
    },
  },
  {
    id: "risk",
    criterion: "Default risk",
    cells: {
      cross: "Default on the shared debt can put both properties at risk.",
      cash: "Each loan stands on its own collateral after the cash moves.",
      heloc: "Default on the HELOC is a second-lien problem on the first house, not automatically a lien on the second house.",
    },
  },
]

const delayedColumns: readonly ComparisonColumn[] = [
  { id: "delayed", heading: "Delayed financing", href: "/refinance/cash-out" },
  { id: "seasoned", heading: "HELOC after seasoning", href: "/loans/heloc" },
  { id: "rental", heading: "Cash-out to buy a rental", href: "/learn/investment" },
]

const delayedRows: readonly ComparisonRow[] = [
  {
    id: "fact",
    criterion: "Fact pattern",
    cells: {
      delayed: DELAYED_FINANCING.what,
      seasoned: HELOC_SEASONING.yearTwo,
      rental: "You already have a financed primary. You take cash out (or a HELOC) to buy another house as a rental.",
    },
  },
  {
    id: "lien",
    criterion: "What is on the house you just bought",
    cells: {
      delayed: "Typically no mortgage on that purchase. Title should show no existing liens on the subject.",
      seasoned: "You already have a first lien from the purchase. Seasoning overlays apply to a second or a cash-out.",
      rental: "The rental is a second property. Occupancy on each note has to match use.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "HELOC vs Cash-Out Refinance: Tapping Home Equity",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  faqs,
})

export default function HelocVsCashoutPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "Same equity. Different lien, payment, timing, and occupancy questions.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A cash-out refinance replaces your first mortgage with a larger one and wires you the difference. A HELOC
        leaves the first mortgage in place and adds a second lien you draw against. Both tap equity. They do not share
        the same payment shape, lien position, rate risk, or tax questions. The timing after a recent closing, the
        occupancy of whatever you buy with the money, and a cash purchase you want to finance later each change the
        conversation again. This guide covers all of it in one place. Snapshot as of {LENDING_FACTS_AS_OF}. It is
        education, not tax advice, and not a recommendation to take cash out.
      </p>

      <IsThisRightForMe table="equity" />

      <h2>Lien position, payment, and rate risk</h2>
      <p>
        A cash-out refinance is a new first lien. The new rate applies to the entire balance, including the part you
        were not borrowing against before. You get one payment, a new term, and closing costs calculated on the whole
        loan amount. If your existing first-lien rate is lower than what is available today, a cash-out reprices all of
        it, not just the cash you take. That single fact is why many homeowners with a low purchase-era rate stop at the
        HELOC comparison first.
      </p>
      <p>
        A HELOC is a second lien that sits behind the existing first mortgage. The rate on most lines is variable, set
        from an index plus a margin, and the line usually has a draw period followed by a repayment period. The payment
        depends on what you have drawn, so an illustration can look small while the balance is low and climb once you
        use the line. Some lines allow interest-only payments during the draw period; when repayment begins the payment
        can step up. Because the HELOC payment moves with the index and your draws, a HELOC illustration is not a
        cash-out quote, and a cash-out quote is not a HELOC illustration.
      </p>
      <p>
        The loan-to-value test is different too. A HELOC lender measures the first lien plus the line against the
        home’s value, a combined LTV. A cash-out lender measures the new single loan against value, and cash-out LTV is
        often tighter than a rate-and-term refinance. Which structure costs less over time depends on how much you
        draw, for how long, where the index goes, and how long you plan to keep the house.
      </p>

      <h2>Decision framework</h2>
      <ul>
        <li>
          <strong>Keep a low first-lien rate, need draws over time.</strong> A HELOC is usually the comparison.{" "}
          <Link href="/loans/heloc">HELOC overview</Link>.
        </li>
        <li>
          <strong>Want one payment and a new first-lien rate or term.</strong> Cash-out, or rate-and-term if you do not
          need cash. <Link href="/refinance/cash-out">Cash-out refinance</Link>.
        </li>
        <li>
          <strong>Need a lump sum larger than a comfortable second lien.</strong> Cash-out LTV overlays still apply, so
          the lump sum is limited by value, not by how much equity you feel you have.
        </li>
        <li>
          <strong>Plan to sell or refinance again within a few years.</strong> Closing costs on a cash-out may not have
          time to recover. A HELOC often costs less to open but carries annual fees and rate exposure.
        </li>
        <li>
          <strong>Want a lower rate and no cash.</strong> That is{" "}
          <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even math</Link>, not this comparison.
        </li>
      </ul>

      <h2>Tax questions</h2>
      <p>
        Whether interest on a HELOC or on cash-out proceeds is deductible depends on how the money is used and on the
        tax law in force for that year. Money spent on the home that secures the loan is treated differently from money
        spent on a rental, a business, or consumer debt, and the rules change. Keep a record of where the proceeds went
        so your tax professional can apply the right treatment. Nothing on this page is tax advice.
      </p>

      <h2>HELOC after year two vs a cash-out: when you can ask after a recent closing</h2>
      <p>
        If you just closed, tapping equity again is a seasoning and occupancy conversation before it is a structure
        conversation. {HELOC_SEASONING.yearTwo}
      </p>
      <ComparisonTable
        caption={`Timing overlays as of ${LENDING_FACTS_AS_OF}. Not a statute.`}
        columns={seasoningColumns}
        rows={seasoningRows}
        footnote="Confirm the first-lien investor and the HELOC or cash-out overlay. This is not tax advice."
      />
      <p>{HELOC_SEASONING.notAFederalWait}</p>
      <p>What people usually mean by “year two” is a bundle of three checks, each of which has its own answer:</p>
      <ul>
        <li>Title seasoning and occupancy of the house you will encumber.</li>
        <li>Combined LTV (first plus HELOC) versus cash-out LTV if you replace the first lien.</li>
        <li>Whether the first-lien investor allows a second lien at all. Some do not in the first months.</li>
      </ul>
      <p>
        Do not calendar “year two” from a blog, including this one. Ask what overlay the HELOC or cash-out investor
        actually uses for your file. {HELOC_SEASONING.delayedFinancing} That exception is covered in its own section
        below.
      </p>

      <h2>Cash-out to buy a rental: occupancy and LTV traps</h2>
      <p>
        Using a cash-out refinance to fund a rental down payment is two transactions, not one clever occupancy. The
        refinance is underwritten on the house that already has your name on it. The purchase is underwritten as
        whatever occupancy that rental actually is.
      </p>
      <h3>The occupancy trap</h3>
      <p>{CASH_OUT_TO_RENTAL.occupancyTrap}</p>
      <p>
        Read <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment occupancy</Link> before
        anyone treats the rental as a second home on paper. {OCCUPANCY_TYPES.fraud}
      </p>
      <ComparisonTable
        caption={`Two files as of ${LENDING_FACTS_AS_OF}. Confirm investor overlays.`}
        columns={rentalColumns}
        rows={rentalRows}
        footnote="Not tax advice. Interest deductibility on cash-out proceeds depends on use; ask a tax professional."
      />
      <h3>The LTV trap</h3>
      <p>{CASH_OUT_TO_RENTAL.ltvTrap}</p>
      <p>
        Closing costs on the cash-out still have a break-even, and the proceeds are smaller than the gross loan
        increase once those costs are paid. Streamline refinances generally are not cash-out, so an FHA or VA streamline
        does not fund a down payment.
      </p>
      <h3>HELOC or cash-out for the down payment</h3>
      <p>
        {CASH_OUT_TO_RENTAL.vsHeloc} If you draw a HELOC for the down payment, expect the purchase lender to source
        those funds and to count the new HELOC payment in your debt-to-income ratio. If you take a cash-out, the larger
        first-lien payment is counted the same way. Either path adds a payment before the rental adds any rent.
      </p>
      <h3>How the rental itself is qualified</h3>
      <p>
        Full-doc uses your DTI and a rental worksheet. DSCR uses the property’s rent versus the payment. Start at{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link> and the{" "}
        <Link href="/learn/investment">investment hub</Link>, and illustrate coverage on the{" "}
        <Link href="/calculators/dscr">DSCR calculator</Link>. Which stack fits the rental, agency investment, DSCR,
        or something else, is a conversation, not a commitment to lend.
      </p>

      <h2>Cross-collateral: using equity to buy another house without cashing out first</h2>
      <p>
        Using equity to buy another house usually means taking cash out or drawing a HELOC, not pledging both
        properties on one blanket loan. {CROSS_COLLATERAL.what}
      </p>
      <p>{CROSS_COLLATERAL.notInvented}</p>
      <ComparisonTable
        caption={`Cross-collateral vs cash-out vs HELOC as of ${LENDING_FACTS_AS_OF}.`}
        columns={crossColumns}
        rows={crossRows}
        footnote="Product availability is an overlay. This page does not state that Ondo will originate a blanket loan."
      />
      <p>{CROSS_COLLATERAL.vsCashOut}</p>
      <p>
        {CROSS_COLLATERAL.occupancy} If you still live in the first house and the new house will be the rental,
        occupancy on the new property is still a separate answer:{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">
          first rental occupancy if you still live there
        </Link>
        . Occupancy decides the purchase program more than “I have equity” does.
      </p>

      <h2>Delayed financing after a cash purchase</h2>
      <p>
        Delayed financing is the agency conversation when you bought a house with cash, no mortgage on that purchase,
        and later want a cash-out on the same property. Fannie Mae publishes a delayed-financing exception in Selling
        Guide B2-1.3-03, and Freddie Mac publishes a related exception. That is a selling-guide exception, not a statute,
        and lender overlays can be tighter.
      </p>
      <p>{DELAYED_FINANCING.what}</p>
      <h3>What the exception asks for</h3>
      <p>{DELAYED_FINANCING.docs}</p>
      <p>{DELAYED_FINANCING.loanAmount}</p>
      <p>{DELAYED_FINANCING.giftsAndBorrowed}</p>
      <p>{DELAYED_FINANCING.stillCashOut}</p>
      <h3>Not HELOC seasoning, not cash-out to buy a rental</h3>
      <p>
        {DELAYED_FINANCING.vsSeasoning} The seasoning section above is the page for a financed purchase. If the
        cash-out is meant to fund another house, the rental section above applies to the second loan.
      </p>
      <ComparisonTable
        caption={`Delayed financing vs nearby equity conversations as of ${LENDING_FACTS_AS_OF}.`}
        columns={delayedColumns}
        rows={delayedRows}
        footnote="Confirm the investor in force. This is not tax advice."
      />
      <h3>Scenarios</h3>
      <ul>
        <li>
          <strong>You paid cash from seasoned accounts, arm’s length, and want to replenish reserves.</strong> The
          exception conversation is about documented investment plus costs, not pulling out a new appraisal windfall.
        </li>
        <li>
          <strong>A parent gifted the purchase funds.</strong> Gift money used to buy the house typically cannot be
          reimbursed through the new loan. Keep the gift paper trail either way:{" "}
          <Link href="/blog/should-i-wait-for-20-percent-down">gift funds</Link>.
        </li>
        <li>
          <strong>You already financed the purchase.</strong> Delayed financing is the wrong section. Use the seasoning
          overlays above.
        </li>
      </ul>

      <h2>What this guide will not do</h2>
      <ul>
        <li>Treat six months, twelve months, or “year two” as a federal right you can calendar without the guide and the investor overlay.</li>
        <li>Quote a cash-out LTV percent as if every file used the same number.</li>
        <li>Coach occupancy misrepresentation so a rental prices like a primary or a second home.</li>
        <li>Assume that Ondo or any named investor will originate a blanket or cross-collateral loan.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>
          Say which fact pattern you are in: financed purchase and want a second lien or a cash-out, cash purchase and
          want a mortgage later, or equity on one house to buy another.
        </li>
        <li>
          Say whether you will still occupy the house you are encumbering, and whether you will occupy the house you
          are buying. Both answers go on the file.
        </li>
        <li>
          If the closing was recent, ask what seasoning overlay the HELOC or cash-out investor uses. If the purchase was
          cash, keep the purchase Closing Disclosure and the source-of-funds statements.
        </li>
        <li>
          Model the payment change in the <Link href="/calculators/refinance">refinance calculator</Link> for a
          first-lien refinance. A HELOC payment depends on the draw and the index, so ask for a structured comparison
          of both rather than a single illustration.
        </li>
      </ol>
    </ArticleShell>
  )
}
