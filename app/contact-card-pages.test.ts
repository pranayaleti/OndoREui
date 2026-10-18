import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"

const AGENT = ["app/buy/page.tsx", "app/buy/first-time/page.tsx", "app/buy/quiz/page.tsx", "app/buy/second-home/page.tsx", "app/sell/page.tsx"]
const LOAN = [
  "app/buy/15-year/page.tsx", "app/buy/30-year/page.tsx", "app/buy/adjustable-rate/page.tsx", "app/buy/fixed-rate/page.tsx",
  "app/buy/rates/page.tsx", "app/buy/first-time/grants/page.tsx", "app/loans/page.tsx", "app/loans/conventional/page.tsx",
  "app/loans/fha/page.tsx", "app/loans/heloc/page.tsx", "app/loans/jumbo/page.tsx", "app/loans/reverse/page.tsx",
  "app/loans/second-look/page.tsx", "app/loans/usda/page.tsx", "app/loans/va/page.tsx", "app/refinance/page.tsx",
  "app/refinance/blog/page.tsx", "app/refinance/cash-out/page.tsx", "app/refinance/process/page.tsx",
  "app/refinance/rate-term/page.tsx", "app/refinance/watch/page.tsx",
]

describe("buy, sell, loan and refinance pages name one contact", () => {
  it.each([...AGENT.map((f) => [f, "agent"]), ...LOAN.map((f) => [f, "loan"])])(
    "%s renders the %s contact card inside <main> and marks the founder as reviewer",
    (file, kind) => {
      const source = readFileSync(file, "utf8")
      expect(source).toContain(`<YourContactCard kind="${kind}" />`)
      expect(source.indexOf("<YourContactCard")).toBeLessThan(source.indexOf("</main>"))
      // Pages without <SEO> (the two lending lead forms) have no WebPage node to carry a reviewer.
      if (source.includes("<SEO")) expect(source).toContain("reviewedBy={FOUNDER_PERSON_ID}")
      expect(source).not.toContain("<LoanOfficerLine")
    },
  )
})
