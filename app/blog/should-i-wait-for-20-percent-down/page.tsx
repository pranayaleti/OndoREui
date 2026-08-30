import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  WAIT_FOR_20_DOWN,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/should-i-wait-for-20-percent-down"
const price = EXAMPLE_PURCHASE_PRICE_UTAH
const down20 = Math.round(price * 0.2)
const down5 = Math.round(price * 0.05)
const down35 = Math.round(price * 0.035)
const gap20vs5 = down20 - down5

const faqs = [
  {
    question: "Does waiting for 20% down always save money?",
    answer:
      "No. You avoid conventional PMI, but you keep paying rent (or delaying a move) and the price, tax, and insurance lines can move while you save. Run two cash-to-close numbers and a timeline, not a slogan.",
  },
  {
    question: "If I buy with PMI now, can it come off later?",
    answer:
      "On many conventional loans, borrower-paid PMI can later come off with equity. That is a different page: original-value HPA vs a new appraisal. FHA annual MIP usually does not cancel the same way.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "wait", heading: "Wait until 20% cash" },
  { id: "sooner", heading: "Buy sooner with PMI / MIP" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "cash",
    criterion: "Cash at purchase (illustration)",
    cells: {
      wait: `On a $${price.toLocaleString("en-US")} price, 20% is $${down20.toLocaleString("en-US")} down — plus closing costs and prepaids.`,
      sooner: `5% is $${down5.toLocaleString("en-US")}; FHA 3.5% is $${down35.toLocaleString("en-US")}. The gap versus 20% is real cash you still have to source later or keep saving.`,
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
      sooner: "You may buy on a documented file now. PMI or MIP is a line on the payment until it ends under that product’s rules — not a life sentence on every loan.",
    },
  },
  {
    id: "not",
    criterion: "Not this page",
    cells: {
      wait: WAIT_FOR_20_DOWN.notMipExit,
      sooner: "How PMI already on a loan is cancelled (original value vs appraisal) is a later conventional topic. How FHA MIP is timed is a different product.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Should I Wait for 20% Down?",
  description:
    "Waiting for 20% can avoid conventional PMI. Buying sooner with PMI is a cash-and-timeline trade — not how MIP vs PMI later ends.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["should I wait for 20% down", "PMI vs 20 percent down", "buy now or save down payment"],
  faqs,
})

export default function WaitFor20DownPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Should I Wait for 20% Down?",
        description:
          "Waiting for 20% can avoid conventional PMI. Buying sooner with PMI is a cash-and-timeline trade — not how MIP vs PMI later ends.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "PMI is a payment line. Rent while you save is also a payment line. Neither is a character test.",
        faqs,
        keywords: ["wait for 20% down", "PMI tradeoff first-time buyer"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        You do not have to wait until you can put 20% down to buy. Waiting can avoid conventional PMI. Buying sooner
        with a smaller down payment usually means PMI (conventional) or MIP (FHA) until that product’s rules let it
        end. The honest comparison is cash, timeline, and what you pay for housing in the meantime — not a rule that
        20% is “responsible.” Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{WAIT_FOR_20_DOWN.tradeoff}</p>
      <p>{WAIT_FOR_20_DOWN.lowDownExists}</p>
      <p>{EXAMPLE_NOTE}</p>

      <ComparisonTable
        caption={`Wait vs buy-sooner cash illustration at $${price.toLocaleString("en-US")} as of ${LENDING_FACTS_AS_OF}. Not a quote.`}
        columns={columns}
        rows={rows}
        footnote="Closing costs, prepaids, and reserves sit on top of down payment. PMI and MIP percents are file-specific; this table does not invent a monthly premium."
      />

      <h2>The cash gap is the real number</h2>
      <p>
        On this illustration price, 20% minus 5% is ${gap20vs5.toLocaleString("en-US")}. That is often years of saving
        after rent, retirement, and an emergency fund. It is also the pile that{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash besides down payment</Link> still has to sit
        next to: earnest money, title, and prepaids. First-time map:{" "}
        <Link href="/learn/first-time">cash, assistance, and closing</Link>.
      </p>

      <h2>Three pages people mix up</h2>
      <ul>
        <li>
          <strong>This page.</strong> Purchase decision: wait for 20% vs buy sooner.
        </li>
        <li>
          <strong>
            <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">How MIP vs PMI actually leaves the loan</Link>.
          </strong>{" "}
          You already have insurance on the note. FHA’s clock is not conventional PMI.
        </li>
        <li>
          <strong>
            <Link href="/blog/pmi-removal-original-value-vs-new-appraisal">
              PMI removal: original value vs new appraisal
            </Link>
            .
          </strong>{" "}
          Servicer mechanics after you already bought conventional with PMI.
        </li>
      </ul>
      <p>{WAIT_FOR_20_DOWN.notMipExit}</p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Put PMI or MIP on two payment illustrations with the{" "}
          <Link href="/calculators/mortgage-payment">payment calculator</Link> and include HOA if the property has
          dues — see <Link href="/blog/dti-frontend-backend-with-hoa">DTI with HOA</Link>.
        </li>
        <li>
          Compare FHA vs conventional on insurance duration, not only the note rate:{" "}
          <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>.
        </li>
        <li>
          If family or an agency is filling the cash gap, read{" "}
          <Link href="/blog/gift-funds-down-payment-rules">gift funds</Link> before you wait another year to “do it
          yourself.”
        </li>
      </ol>
    </ArticleShell>
  )
}
