/// <reference types="vite/client" />
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"
import {
  AUTHORIZED_USER_TRADELINES,
  CLOSING_CREDIT_CARD,
  CONFORMING_LIMIT_NOTE,
  DELAYED_FINANCING,
  ESCROW_WAIVER,
  FIRST_RENTAL_OCCUPANCY,
  FTHB_FILE_MISTAKES,
  HILL_AFB_VA,
  INTEREST_ONLY,
  ITIN_DOCUMENTATION,
  LOCK_IF_RATES_DROP,
  MANUFACTURED_AND_ADU,
  NEWS_AVERAGE_VS_QUOTE,
  RECAST_VS_REFI,
  RURAL_VETERAN_COMPARE,
  USDA_SNAPSHOT,
  VA_ENTITLEMENT_RESTORATION,
} from "./lending-facts"

/**
 * What a reader of the lending posts actually sees. These render the page and check the
 * visible text and links, so a copy edit that keeps the behavior does not break them, and a
 * removed fact, dropped link or invented number does.
 */
const pages = import.meta.glob(["/app/blog/*/page.tsx", "/app/buy/rates/page.tsx", "/app/loans/jumbo/page.tsx"])

type Rendered = { text: string; hrefs: string[]; hasTable: boolean }

const squash = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")

async function renderPage(route: string): Promise<Rendered> {
  const load = pages[`/app/${route}/page.tsx`]
  if (!load) throw new Error(`No page at app/${route}/page.tsx`)
  const mod = (await load()) as { default: (props: object) => ReactElement | Promise<ReactElement> }
  const { container } = render(await mod.default({}))
  const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")!)
  const hasTable = container.querySelector("table") !== null
  container.querySelectorAll("script, style").forEach((el) => el.remove())
  return { text: squash(container.textContent ?? ""), hrefs, hasTable }
}

type Case = {
  route: string
  /** Shared lending facts the page must show. */
  shows?: readonly string[]
  /** Other text the page must contain. */
  contains?: readonly (string | RegExp)[]
  /** Posts the page must link to (blog slugs). */
  linksTo?: readonly string[]
  /** Text that must not appear. */
  never?: readonly RegExp[]
  table?: boolean
}

const NO_PERCENT_RATE = /\d\.\d{2}%/
// The pages quote this phrase only to say they do not teach it.
const NO_OCCUPANCY_COACHING = /(?<!do not coach anyone to ")live there (14|15) days/i

const CASES: readonly Case[] = [
  {
    route: "blog/usda-vs-va-vs-fha-veteran-rural",
    shows: [RURAL_VETERAN_COMPARE.notAPick, USDA_SNAPSHOT.upfrontGuaranteeFee],
  },
  {
    route: "blog/first-rental-occupancy-if-you-still-live-there",
    shows: [FIRST_RENTAL_OCCUPANCY.notHouseHack],
    linksTo: ["house-hacking-duplex-with-fha", "second-home-vs-investment-occupancy"],
    never: [NO_OCCUPANCY_COACHING],
  },
  {
    route: "blog/itin-non-us-citizen-mortgage-documentation",
    shows: [ITIN_DOCUMENTATION.notNationalOrigin],
    never: [/(?<!does not say a file is )easier if you(?:'re| are)/i, /prefer (?:borrowers|clients) from/i],
  },
  {
    route: "blog/selling-with-va-loan-entitlement-restoration",
    shows: [VA_ENTITLEMENT_RESTORATION.notADollar],
    linksTo: ["va-entitlement-second-va-loan"],
    never: [/\$\d{2,3},\d{3}/],
  },
  {
    route: "buy/rates",
    shows: [NEWS_AVERAGE_VS_QUOTE.notATable],
    linksTo: ["rate-lock-if-rates-drop"],
    never: [NO_PERCENT_RATE],
  },
  {
    route: "blog/rate-lock-if-rates-drop",
    shows: [LOCK_IF_RATES_DROP.notAutomatic],
    linksTo: ["rate-lock-extension-vs-floating"],
    never: [NO_PERCENT_RATE],
  },
  {
    route: "blog/hill-afb-va-coe-occupancy",
    shows: [HILL_AFB_VA.bah],
    linksTo: ["va-entitlement-second-va-loan", "va-funding-fee-finance-vs-pay-cash"],
    never: [NO_OCCUPANCY_COACHING, /BAH is \$\d/],
  },
  {
    route: "blog/delayed-financing-after-cash-purchase",
    shows: [DELAYED_FINANCING.notInvented],
    contains: [/B2-1\.3-03/, "selling-guide exception, not a statute"],
    linksTo: ["heloc-after-year-two-vs-cash-out", "cash-out-to-buy-a-rental"],
    never: [NO_OCCUPANCY_COACHING],
  },
  {
    route: "blog/first-time-buyer-file-mistakes",
    shows: [FTHB_FILE_MISTAKES.notLifestyle],
    linksTo: ["new-auto-loan-during-underwriting", "large-deposits-60-day-paper-trail", "second-home-vs-investment-occupancy"],
  },
  {
    route: "blog/closing-credit-card-before-mortgage",
    shows: [CLOSING_CREDIT_CARD.notARaise],
    contains: ["will raise or lower a score by a number of points"],
  },
  {
    route: "blog/authorized-user-tradelines-mortgage",
    shows: [AUTHORIZED_USER_TRADELINES.notPiggyback],
    never: [/buy seasoned tradelines to raise/i],
  },
  {
    route: "blog/interest-only-mortgages-who-they-are-for",
    shows: [INTEREST_ONLY.notTeaser],
    never: [NO_PERCENT_RATE],
  },
  {
    route: "blog/manufactured-housing-adu-financing",
    shows: [MANUFACTURED_AND_ADU.noInventedHudCode],
  },
  {
    route: "blog/refinance-break-even-when-lower-rate-loses",
    linksTo: ["recast-vs-refinance"],
    table: true,
  },
  {
    route: "blog/recast-vs-refinance",
    shows: [RECAST_VS_REFI.whoAllows],
    table: true,
  },
  {
    route: "blog/impounds-vs-waiving-escrow",
    shows: [ESCROW_WAIVER.notAPromise],
    linksTo: ["escrow-cushion-how-it-is-set", "escrow-shortage-after-first-year"],
  },
  {
    // The dollar limit changes every year; these pages point to the lookup instead of printing one.
    route: "loans/jumbo",
    shows: [CONFORMING_LIMIT_NOTE],
    never: [/\$\d{3},\d{3}\s*(conforming|loan limit|Utah conforming)/i],
  },
  {
    route: "blog/fha-vs-conventional-loans-utah",
    shows: [CONFORMING_LIMIT_NOTE],
    never: [/\$\d{3},\d{3}\s*(conforming|loan limit|Utah conforming)/i],
  },
  {
    route: "blog/jumbo-vs-conforming-fhfa-county-limit",
    never: [/\$\d{3},\d{3}/],
  },
]

describe("rendered lending pages", () => {
  it.each(CASES.map((c) => [c.route, c] as const))("%s", async (_route, c) => {
    const page = await renderPage(c.route)
    for (const fact of c.shows ?? []) expect(page.text, `missing fact: ${fact}`).toContain(squash(fact))
    for (const piece of c.contains ?? []) {
      if (typeof piece === "string") expect(page.text).toContain(piece)
      else expect(page.text).toMatch(piece)
    }
    for (const slug of c.linksTo ?? []) {
      expect(page.hrefs.some((href) => href.replace(/\/$/, "").endsWith(`/${slug}`)), `no link to ${slug}`).toBe(true)
    }
    for (const pattern of c.never ?? []) expect(page.text).not.toMatch(pattern)
    if (c.table) expect(page.hasTable).toBe(true)
  })
})
