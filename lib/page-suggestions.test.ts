import { describe, it, expect } from "vitest"
import { extractPageIndexEntry, rankPageSuggestions, type PageIndexEntry } from "@/lib/page-suggestions"

const index: PageIndexEntry[] = [
  { p: "/", t: "Utah Real Estate" },
  { p: "/about/", t: "About Ondo" },
  { p: "/about/team/", t: "Our Team" },
  { p: "/calculators/mortgage-payment/", t: "Mortgage Payment Calculator" },
  { p: "/calculators/affordability/", t: "Home Affordability Calculator" },
  { p: "/locations/lehi/", t: "Lehi, UT: Cost of Living" },
  { p: "/loans/lehi/", t: "Lehi Home Loans" },
  { p: "/blog/how-to-buy-a-house-in-utah/", t: "How to Buy a House in Utah" },
  { p: "/blog/utah-property-taxes/", t: "Utah Property Taxes" },
  { p: "/sell/", t: "Sell Your Home" },
]

const paths = (requested: string) => rankPageSuggestions(requested, index).map((entry) => entry.p)

describe("rankPageSuggestions", () => {
  it("catches a typo in the last segment", () => {
    expect(paths("/calculators/mortage-payment/")[0]).toBe("/calculators/mortgage-payment/")
    expect(paths("/blog/how-to-by-a-house-in-utah")[0]).toBe("/blog/how-to-buy-a-house-in-utah/")
  })

  it("finds a page name that lives under another section", () => {
    expect(paths("/lehi/")).toEqual(expect.arrayContaining(["/locations/lehi/", "/loans/lehi/"]))
  })

  it("matches close variants of a top-level page", () => {
    expect(paths("/about-us")[0]).toBe("/about/")
  })

  it("ignores case, encoding, query strings and doubled slashes", () => {
    expect(paths("//Calculators/Mortgage%2DPayment/?utm_source=x")[0]).toBe("/calculators/mortgage-payment/")
  })

  it("offers nothing for unrelated paths or the home page", () => {
    expect(paths("/wp-login.php")).toEqual([])
    expect(paths("/")).toEqual([])
  })

  it("never returns more than the limit", () => {
    expect(rankPageSuggestions("/lehi", index, 1)).toHaveLength(1)
  })
})

describe("extractPageIndexEntry", () => {
  it("keeps indexable pages and strips the brand from the title", () => {
    expect(extractPageIndexEntry("<title>Sell Your Home | Ondo RE | Ondo RE</title>", "/sell/")).toEqual({ p: "/sell/", t: "Sell Your Home" })
    expect(extractPageIndexEntry("<title>Rentals &amp; Homes | Ondo RE</title>", "/properties/")).toEqual({
      p: "/properties/",
      t: "Rentals & Homes",
    })
  })

  it("drops redirect pages, noindex pages and untitled pages", () => {
    expect(extractPageIndexEntry('<meta http-equiv="refresh" content="0;url=/about/"><title>Redirecting</title>', "/about-us/")).toBeNull()
    expect(extractPageIndexEntry('<meta name="robots" content="noindex, follow"/><title>Sample deal</title>', "/investments/x/")).toBeNull()
    expect(extractPageIndexEntry("<p>no title</p>", "/x/")).toBeNull()
  })
})
