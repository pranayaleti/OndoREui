import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  CONVENTIONAL_SNAPSHOT,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  FHA_SNAPSHOT,
  LARGE_DEPOSITS,
  LENDING_FACTS_AS_OF,
  MORTGAGE_INSURANCE_EXIT,
  PARENT_GIFTING,
  PMI_REMOVAL,
  RESERVES_PITIA,
  WAIT_FOR_20_DOWN,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/should-i-wait-for-20-percent-down"
const title = "Down Payment, PMI and Gift Funds: Should You Wait for 20% Down?"
const description =
  "Wait for 20% or buy sooner with PMI? How PMI and FHA MIP end, gift fund rules, who signs when a parent gifts, the 60-day deposit trail, and reserves."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "First-Time Buyers"
const keywords = [
  "should I wait for 20% down",
  "PMI vs 20 percent down",
  "when does PMI come off",
  "FHA MIP vs PMI",
  "gift funds down payment",
  "gift letter who signs",
  "large deposits 60 day bank statements",
  "mortgage reserves PITIA",
]

const price = EXAMPLE_PURCHASE_PRICE_UTAH
const down20 = Math.round(price * 0.2)
const down10 = Math.round(price * 0.1)
const down5 = Math.round(price * 0.05)
const down35 = Math.round(price * 0.035)
const gap20vs5 = down20 - down5
const usd = (n: number) => `$${n.toLocaleString("en-US")}`

const takeaways = [
  "Waiting for 20% avoids conventional PMI, and it also means months or years of rent while the price, tax, and insurance lines move. Compare two cash-to-close numbers and a timeline, not a rule.",
  "Conventional borrower-paid PMI usually has an exit written into the Homeowners Protection Act. FHA annual MIP on post-2013 loans is timed from original LTV, and a higher home value does not turn it off.",
  "A family gift needs three pieces of paper: a letter saying repayment is not required, proof the donor had the money, and proof it moved. A parent who only gifts signs the letter, not the note.",
  "Underwriters read about 60 days of statements. Every large deposit in that window needs a source, and cash from family without a gift trail is one of the most common late stalls.",
  "Reserves are months of PITIA left in your accounts after closing, not a second check at the table. Gift funds often cannot fill that line, so emptying every account to reach 20% can weaken the file.",
]

const faqs = [
  {
    question: "Does waiting for 20% down always save money?",
    answer:
      "No. You avoid conventional PMI, but you keep paying rent (or delaying a move) and the price, tax, and insurance lines can move while you save. Run two cash-to-close numbers and a timeline, not a slogan.",
  },
  {
    question: "If I buy with PMI now, can it come off later?",
    answer:
      "On many conventional loans, yes. You can ask the servicer to cancel borrower-paid PMI at 80% of the original value, and it ends automatically at 78% if the loan is current. A cancellation based on a new appraisal of today’s value is a separate servicer path with its own seasoning and LTV rules, and it can be declined. Lender-paid PMI usually does not cancel this way.",
  },
  {
    question: "If I build equity on FHA, does annual MIP drop off like PMI?",
    answer:
      "No. On FHA loans with case numbers assigned on or after June 3, 2013, extra principal or a higher home value does not cancel annual MIP on its original schedule. Refinancing out of FHA is the usual early exit.",
  },
  {
    question: "Can a gift cover the entire down payment?",
    answer:
      "On many FHA files, yes, when the donor is eligible and the paper trail is complete. Conventional and VA have their own donor and documentation rules, and some conventional products want a minimum contribution from your own funds in certain cases. Overlays apply, so confirm the rule for your program before you count on it.",
  },
  {
    question: "Does a parent who gifts have to sign the mortgage?",
    answer:
      "Generally no. If they are only gifting, they sign the gift letter and provide donor statements. They sign the note only if they are also a borrower. Putting a parent on title as a workaround creates occupancy and program problems on a primary-residence file.",
  },
  {
    question: "How many days of bank statements do underwriters usually want, and what counts as a large deposit?",
    answer:
      "Purchase files usually include about 60 days of asset statements. On many conventional files a large deposit is a single deposit over about 50% of total monthly qualifying income; FHA, VA, USDA, and lender overlays can set a lower bar. Any deposit that trips the test needs paper on where it came from.",
  },
  {
    question: "Can I deposit cash from family and explain it later?",
    answer:
      "Large undocumented cash is one of the fastest ways to stall a file, and a letter written after the underwriter asks does not cure it. Family help should move by wire or cashier’s check with a gift letter and donor statements. Talk to your loan officer before you move money.",
  },
  {
    question: "Can gift funds count as reserves?",
    answer:
      "Often not. Gift funds are frequently limited or excluded as reserves, and money already used for the down payment or closing costs cannot count twice. Confirm the rule for your program.",
  },
]

const waitColumns: readonly ComparisonColumn[] = [
  { id: "wait", heading: "Wait until 20% cash" },
  { id: "sooner", heading: "Buy sooner with PMI / MIP" },
]

const waitRows: readonly ComparisonRow[] = [
  {
    id: "cash",
    criterion: "Cash at purchase (illustration)",
    cells: {
      wait: `On a ${usd(price)} price, 20% is ${usd(down20)} down, plus closing costs and prepaids.`,
      sooner: `5% is ${usd(down5)}; FHA 3.5% is ${usd(down35)}. The gap versus 20% is real cash you still have to source later or keep saving.`,
    },
  },
  {
    id: "insurance",
    criterion: "Mortgage insurance",
    cells: {
      wait: "Conventional PMI is typically not required at 20% down. That is the usual reason people wait.",
      sooner: WAIT_FOR_20_DOWN.pmiIsTemporaryOften,
    },
  },
  {
    id: "time",
    criterion: "Time and rent",
    cells: {
      wait: "Months or years of saving. Rent (or staying put) continues. The house you wanted may not still be at this illustration price.",
      sooner: "You may buy on a documented file now. PMI or MIP is a line on the payment until it ends under that product’s rules, not a life sentence on every loan.",
    },
  },
  {
    id: "reserves",
    criterion: "What is left after closing",
    cells: {
      wait: "If reaching 20% drains every account, you may close with no reserves. Some programs and overlays care about that.",
      sooner: "A smaller down payment can leave months of PITIA in the bank. That is a different kind of safety than a lower LTV.",
    },
  },
]

const miColumns: readonly ComparisonColumn[] = [
  { id: "mip", heading: "FHA MIP", href: "/loans/fha" },
  { id: "pmi", heading: "Conventional PMI", href: "/loans/conventional" },
]

const miRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      mip: `Upfront MIP (${FHA_SNAPSHOT.upfrontMip}) plus annual MIP. ${FHA_SNAPSHOT.annualMipNote}`,
      pmi: "Private mortgage insurance when LTV is above the investor’s threshold (commonly when you put less than 20% down). The premium is tiered by LTV and credit score, not a single published percent.",
    },
  },
  {
    id: "ends",
    criterion: "How it usually ends",
    cells: {
      mip: "11 years if original LTV is 90% or less, otherwise the remaining loan term (up to 30 years).",
      pmi: "Request removal at 80% of original value. It terminates automatically at 78% if you are current.",
    },
  },
  {
    id: "equity",
    criterion: "Later equity or a new appraisal",
    cells: {
      mip: "Paying extra principal or a higher value does not cancel post-2013 annual MIP on the original schedule. Refinancing into conventional is the usual early exit.",
      pmi: "A new appraisal of current value is a separate request to the servicer from automatic termination on original value.",
    },
  },
]

const parentColumns: readonly ComparisonColumn[] = [
  { id: "gift", heading: "Gift only" },
  { id: "title", heading: "Parent on title, not the loan", href: "/learn/first-time" },
  { id: "coborrower", heading: "Parent is a co-borrower", href: "/qualify" },
]

const parentRows: readonly ComparisonRow[] = [
  {
    id: "who-signs-letter",
    criterion: "Gift letter",
    cells: {
      gift: "Parent (donor) signs. States amount, relationship, and that repayment is not required.",
      title: "Still needed if any money is a gift. Title vesting does not replace the letter.",
      coborrower: "Usually not a gift file. Their income and credit are in the application.",
    },
  },
  {
    id: "who-signs-note",
    criterion: "Note and mortgage / deed of trust",
    cells: {
      gift: "Child (borrower) only.",
      title: "Borrower signs the loan. Parent on title is a separate deed conversation and a common overlay issue.",
      coborrower: "Parent and child both sign.",
    },
  },
  {
    id: "occupancy",
    criterion: "Occupancy",
    cells: {
      gift: "Child occupies as primary residence. Parent does not move in as a workaround to get on the loan.",
      title: "If the parent will live there, this may be a co-borrower or non-occupant co-borrower file, not a quiet gift.",
      coborrower: "Who occupies must match the program. Non-occupant co-borrower rules differ by FHA vs conventional.",
    },
  },
  {
    id: "repc",
    criterion: "Utah REPC / purchase contract",
    cells: {
      gift: "Buyers on the contract should match the borrowers. A parent who is only gifting usually stays off the REPC.",
      title: "If the parent is taking title, they often need to be on the contract. That is not a gift-only file.",
      coborrower: "All borrowers who will take title should be on the contract.",
    },
  },
]

const depositColumns: readonly ComparisonColumn[] = [
  { id: "ok", heading: "Often acceptable when documented" },
  { id: "stall", heading: "Often a stall", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
]

const depositRows: readonly ComparisonRow[] = [
  {
    id: "payroll",
    criterion: "Payroll or known recurring deposits",
    cells: {
      ok: "Matches paystubs or 1099 deposits already in the income file.",
      stall: "A one-off ‘bonus’ that does not match the employer or the return.",
    },
  },
  {
    id: "gift",
    criterion: "Gift from an eligible donor",
    cells: {
      ok: "Gift letter, donor statements, and evidence the funds moved, before or as they hit your account.",
      stall: "Cash in an envelope, then a letter written after the underwriter asks.",
    },
  },
  {
    id: "sale",
    criterion: "Sale of an asset",
    cells: {
      ok: "Bill of sale, proof you owned it, and the deposit matching the proceeds.",
      stall: "A large wire with no paper on what was sold.",
    },
  },
  {
    id: "transfer",
    criterion: "Transfer between your own accounts",
    cells: {
      ok: "Statements on both accounts showing the same money moved. Seasoning still applies to the source account.",
      stall: "A new account opened last week and filled from an undocumented source.",
    },
  },
]

const reserveColumns: readonly ComparisonColumn[] = [
  { id: "ctc", heading: "Cash to close", href: "/blog/utah-closing-costs-title-origination-prepaids" },
  { id: "res", heading: "Reserves (months of PITIA)" },
]

const reserveRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      ctc: "Down payment, remaining earnest, closing costs, and prepaids due at the table (minus credits).",
      res: "Liquid assets still in your accounts after the table, counted in months of the full housing payment.",
    },
  },
  {
    id: "where",
    criterion: "Where the money sits",
    cells: {
      ctc: "Leaves your accounts at closing (or was already earnest).",
      res: "Stays in documented accounts after closing. It is still sourced.",
    },
  },
  {
    id: "gift",
    criterion: "Can a gift fill it?",
    cells: {
      ctc: "Often yes, when the donor is eligible and the trail is complete.",
      res: "Often limited or excluded. Confirm the program before you count a gift as reserves.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Down Payment, PMI and Gift Funds: Wait for 20% Down?",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  faqs,
})

export default function WaitFor20DownPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle:
          "PMI is a payment line. Rent while you save is also a payment line. Neither is a character test.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        You do not have to wait until you can put 20% down to buy. Waiting can avoid conventional PMI. Buying sooner
        with a smaller down payment usually means PMI (conventional) or MIP (FHA) until that product’s rules let it
        end. The comparison that matters is cash, timeline, and what you pay for housing in the meantime, not a rule
        that 20% is “responsible.” This guide also answers the questions that follow that decision: how the insurance
        leaves the loan, how a family gift has to be documented, who signs what when a parent helps, why a large
        deposit in the last 60 days needs a source, and what lenders mean by reserves. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>

      <p>{WAIT_FOR_20_DOWN.tradeoff}</p>
      <p>{WAIT_FOR_20_DOWN.lowDownExists}</p>
      <p>{EXAMPLE_NOTE} This page is education, not a commitment to lend.</p>

      <ComparisonTable
        caption={`Wait vs buy-sooner cash illustration at ${usd(price)} as of ${LENDING_FACTS_AS_OF}. Not a quote.`}
        columns={waitColumns}
        rows={waitRows}
        footnote="Closing costs, prepaids, and reserves sit on top of down payment. PMI and MIP percents are file-specific; this table does not invent a monthly premium."
      />

      <h2>The cash gap is the real number</h2>
      <p>
        On this illustration price, 20% minus 5% is {usd(gap20vs5)}. That is often years of saving after rent,
        retirement, and an emergency fund. It is also the pile that{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">cash besides down payment</Link> still has to sit
        next to: earnest money, title, and prepaids. Earnest, down payment, and closing costs are three separate lines
        that come from the same accounts, so read{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">how the three cash lines differ</Link>{" "}
        before you decide how much of your savings is really available for the down payment. First-time map:{" "}
        <Link href="/learn/first-time">cash, assistance, and closing</Link>.
      </p>

      <h2>What waiting buys you, and what it costs</h2>
      <p>
        Waiting for 20% buys three things on a conventional loan: no PMI line, a smaller loan balance, and often
        better pricing, because conventional loan-level pricing is tiered by LTV and credit score. All three show up
        on the Loan Estimate, and all three are real.
      </p>
      <p>
        Waiting also costs three things. Rent or your current housing cost continues every month you save. The
        purchase price can move in either direction while you wait, and this page does not predict which. And every
        month you are not amortizing a loan is a month of principal paydown you do not get back. None of that makes
        waiting wrong. It makes waiting a trade you should price, not a default.
      </p>
      <p>
        There is also a middle path. On this illustration, 10% down is {usd(down10)}, roughly half the 20% pile. On
        conventional loans the PMI premium at 10% down is typically lower than at 5%. On FHA, 10% or more down is the
        line that moves annual MIP from the life of the loan to an 11-year schedule, which matters more than most
        buyers realize when they compare the two programs on note rate alone.
      </p>

      <h2>How mortgage insurance leaves the loan: FHA MIP vs conventional PMI</h2>
      <p>
        FHA annual MIP and conventional PMI both add to the payment. They do not leave the loan the same way. On most
        post-2013 FHA loans with less than 10% down, annual MIP lasts for the life of the loan unless you refinance
        out of FHA. Conventional borrower-paid PMI can often come off with equity under the Homeowners Protection Act.
        If you are choosing between the two programs today, insurance duration belongs in the comparison next to the
        rate.
      </p>

      <ComparisonTable
        caption={`How MIP and PMI typically end as of ${LENDING_FACTS_AS_OF}. Confirm your note and servicer.`}
        columns={miColumns}
        rows={miRows}
        footnote="Lender-paid PMI, split-premium PMI, and USDA / VA fees are different products. VA uses a funding fee, not monthly PMI."
      />

      <h3>FHA: original LTV sets the clock</h3>
      <p>{MORTGAGE_INSURANCE_EXIT.fhaPost2013}</p>
      <p>
        Upfront MIP is often financed: {FHA_SNAPSHOT.upfrontMip}. Financing it raises the base loan. That is a Loan
        Estimate line, not a reason MIP will vanish later. If you later refinance FHA-to-FHA, that may be a{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">streamline</Link>, but it does not delete annual MIP;
        the new FHA loan has its own MIP rules. The usual early exit is a conventional refinance once equity and
        credit support it, and{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after costs</Link> decides whether
        that is worth doing, because MIP savings can be eaten by closing costs and a higher rate.
      </p>

      <h3>Conventional PMI: the Homeowners Protection Act uses original value</h3>
      <p>{PMI_REMOVAL.originalValue}</p>
      <p>
        For a purchase, original value means the lesser of the sales price and the appraised value when you closed.
        The 80% request is yours to make, in writing, and the servicer can ask for a good payment history, a
        certification that there are no subordinate liens, and evidence that the value has not fallen below original
        value. The 78% termination is the servicer’s duty on many borrower-paid loans as long as you are current. The
        statute also has a final backstop: if the loan is current, PMI ends at the midpoint of the amortization
        schedule even if you never reached 78%.
      </p>

      <h3>A new appraisal of current value is a separate path</h3>
      <p>{PMI_REMOVAL.newAppraisal}</p>
      <p>
        When you call the servicer, ask two questions in order. First, what percent of original value is left on the
        HPA clock. Second, whether this product allows a current-value cancellation at all, and what seasoning and LTV
        it requires. A “you have 22% equity on a website estimate” screenshot is not either test. Read the PMI
        disclosure and the note before you call; lender-paid PMI usually cannot be canceled the HPA way, and the only
        exit on that product is a refinance.
      </p>

      <h2>Gift funds: what the file has to contain</h2>
      <p>
        Family help on a down payment is common, especially for first-time buyers, and it is often the fastest way to
        close the cash gap above. Lenders still have to prove the money is a gift, from an eligible donor, and not an
        undisclosed loan. The paperwork is the product.
      </p>
      <p>As of {LENDING_FACTS_AS_OF}, the file typically contains:</p>
      <ul>
        <li>A gift letter that states the amount, the relationship, and that repayment is not required.</li>
        <li>Evidence the donor had the funds (statements) and that they left the donor’s account.</li>
        <li>Evidence they arrived in yours, or at closing through escrow instructions.</li>
      </ul>

      <h3>Program notes, not promises</h3>
      <p>
        FHA: {FHA_SNAPSHOT.giftFunds} Confirm the current HUD definition of an eligible donor. Conventional:{" "}
        {CONVENTIONAL_SNAPSHOT.giftFunds} Donor relationships and large-deposit seasoning can be tighter depending on
        the AUS findings. VA: gift funds are allowed in many cases, but the occupancy and entitlement file still has
        to work. USDA has its own income and property-map tests that a gift does not override.
      </p>

      <ArticleCallout variant="pitfall">
        A gift that is quietly expected to be repaid is not treated as a gift. Lenders underwrite a repayable advance
        as a debt, and the gift letter asks the donor to state that repayment is not expected. If there is an
        expectation of repayment, say so. Disclosed, it is usually just another monthly obligation in the DTI.
        Undisclosed, it is the kind of thing that unwinds a file late.
      </ArticleCallout>

      <p>
        Gift funds solve cash to close. They do not replace qualifying income. If your income is also variable, read{" "}
        <Link href="/learn/variable-income">variable income</Link> and{" "}
        <Link href="/blog/how-underwriters-verify-income">
          Can I get a mortgage if my income changes every month?
        </Link>
      </p>
      <p>
        Utah first-time and assistance programs are listed separately on{" "}
        <Link href="/buy/first-time/grants">housing grants</Link>. Those agencies have their own stacking rules with
        gifts. How DPA and an FHA gift can sit on the same file:{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">DPA stacked with an FHA gift</Link>.
      </p>

      <h2>When a parent is gifting: who signs what</h2>
      <p>{PARENT_GIFTING.occupancy}</p>
      <p>{PARENT_GIFTING.signatures}</p>
      <ComparisonTable
        caption={`Who typically signs as of ${LENDING_FACTS_AS_OF}. Program overlays still apply.`}
        columns={parentColumns}
        rows={parentRows}
        footnote="This is not a closing instruction. Title companies and investors can require additional affidavits."
      />

      <h3>Which document each person touches</h3>
      <ul>
        <li>
          <strong>Gift letter</strong>: the donor signs. Amount, relationship, no repayment.
        </li>
        <li>
          <strong>Donor statements</strong>: show the money was theirs, then left. Screenshots without a bank header
          stall files.
        </li>
        <li>
          <strong>Wire or cashier’s check</strong>: to escrow, with instructions that match the letter. A cash deposit
          into the buyer’s account is the large-deposit problem covered below, not a gift.
        </li>
        <li>
          <strong>Notary</strong>: some lenders want the gift letter notarized. That is an overlay, not a federal
          ritual.
        </li>
      </ul>
      <p>
        Decide whether the parent is a donor, a co-borrower, or taking title, pick one story, and keep it. The
        note-vs-title-vs-gift distinction is laid out in{" "}
        <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link>. A second-lien DPA is not a gift and has
        its own signatures (note, deed of trust, agency affidavits).
      </p>

      <h2>Large deposits and the 60-day paper trail</h2>
      <p>
        Underwriters typically read about 60 days of asset statements as a movie, not a screenshot. Every large
        incoming line in that window has to be sourced: payroll, a documented gift, sale of an asset, or a transfer
        between your own accounts. Undocumented cash is one of the fastest ways a pre-approval fails later.
      </p>
      <p>{LARGE_DEPOSITS.window}</p>
      <p>{LARGE_DEPOSITS.conventionalThreshold}</p>
      <p>
        FHA, VA, and USDA have their own asset guides. Overlays can treat smaller deposits as large. If you are not
        sure, ask before the money moves.
      </p>

      <ComparisonTable
        caption={`Common large-deposit stories as of ${LENDING_FACTS_AS_OF}.`}
        columns={depositColumns}
        rows={depositRows}
        footnote="Earnest money already in escrow still has to trace back to a sourced account."
      />

      <p>{LARGE_DEPOSITS.cash}</p>
      <p>
        Parent help belongs on a gift letter and donor trail, not an ATM deposit two weeks before closing. Leave your
        accounts as they are unless a loan officer tells you how to source a coming deposit, and keep PDF statements
        with the bank’s name rather than cropped mobile screenshots. How income is verified is a different stack:{" "}
        <Link href="/blog/how-underwriters-verify-income">W-2 vs 1099 vs bank statements</Link>. If a condition has
        already failed, read <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">declined after pre-approval</Link> before
        you move more cash.
      </p>

      <h2>Reserves: months of PITIA, not a second check</h2>
      <p>{RESERVES_PITIA.what}</p>
      <p>
        You do not write a check for reserves at the table. They are documented assets that remain in your accounts
        after closing, and they are the reason the 20% decision is not only about LTV. A buyer who drains every
        account to reach 20% closes with a lower payment and nothing behind it. A buyer who puts 5% down and keeps
        several months of PITIA in savings closes with PMI and a cushion. Programs and overlays weigh those two files
        differently, and neither is automatically the stronger one.
      </p>
      <p>{RESERVES_PITIA.howMany}</p>

      <ComparisonTable
        caption={`Two different cash questions as of ${LENDING_FACTS_AS_OF}.`}
        columns={reserveColumns}
        rows={reserveRows}
        footnote="Earnest money that already left your account is not also reserves."
      />

      <h3>What usually counts</h3>
      <p>{RESERVES_PITIA.counted}</p>
      <ul>
        <li>Checking and savings in the borrower’s name, seasoned and sourced.</li>
        <li>Brokerage accounts, often with a haircut on stocks.</li>
        <li>Retirement accounts, often with a larger haircut if accessible.</li>
        <li>Not: the same dollars already used for down payment, and often not undocumented cash.</li>
      </ul>

      <h3>When the months go up</h3>
      <ul>
        <li>
          Investment occupancy and 2–4 unit files commonly need more months than a primary 1-unit. Guide:{" "}
          <Link href="/learn/investment">investment financing</Link>.
        </li>
        <li>
          Some future-employment and relocation paths with no paystub yet add reserve tests, often six months of
          PITIA or enough liquid assets to cover the months before the start date plus one. Confirm the guide in
          force:{" "}
          <Link href="/blog/how-underwriters-verify-income">job seasoning when work starts in 60 days</Link>.
        </li>
        <li>Non-QM overlays (DSCR, asset-depletion, bank-statement) often set their own reserve months.</li>
      </ul>
      <p>
        Two habits protect this line. Keep two months of statements, because large deposits in that window still have
        to be sourced. And do not spend the reserve account down on furniture after you are under contract without
        asking first. HOA dues are part of PITIA, so if the property has an association, put them in the payment
        before you count months: <Link href="/blog/dti-frontend-backend-with-hoa">DTI with HOA</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Put PMI or MIP on two payment illustrations with the{" "}
          <Link href="/calculators/mortgage-payment">payment calculator</Link>, one at the down payment you have now
          and one at 20%, and include HOA if the property has dues.
        </li>
        <li>
          Compare FHA vs conventional on insurance duration over a 5 to 7 year horizon, not only the note rate:{" "}
          <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>.
        </li>
        <li>
          If family is filling the cash gap, line up the gift letter and donor statements before any money moves,
          rather than waiting another year to “do it yourself.”
        </li>
        <li>
          Freeze the asset picture for 60 days: no new accounts, no cash deposits, no transfers you cannot paper.
        </li>
        <li>
          Count what is left after cash to close in months of PITIA, and ask which programs care about that number
          on your file. Affordability illustrations:{" "}
          <Link href="/calculators/affordability">affordability calculator</Link>.
        </li>
        <li>
          If you already own with PMI, skip the purchase math and call the servicer with the two questions above. If
          you already own with FHA MIP, the conversation is a refinance and a break-even, not a cancellation form.
        </li>
      </ol>
    </ArticleShell>
  )
}
