import { describe, expect, it } from "vitest"
import type { ReactElement } from "react"
import CityRoute from "@/app/buy-sell/[city]/page"
import SubServiceRoute from "@/app/buy-sell/[city]/[subservice]/page"
import ZipRoute from "@/app/buy-sell/zip/[zip]/page"
import { SITE_URL } from "@/lib/site"

type Crumb = { name: string; item: string }
type RouteTree = ReactElement<{ children: ReactElement<{ jsonLd?: { itemListElement: Crumb[] } }>[] }>

/** The BreadcrumbList a route hands to <SEO>. */
async function breadcrumbs(route: Promise<unknown>): Promise<Crumb[]> {
  const tree = (await route) as RouteTree
  const seo = tree.props.children.find((child) => child?.props && "jsonLd" in child.props)!
  return seo.props.jsonLd!.itemListElement
}

// /buy-sell/ is only a legacy redirect to /buy/, so structured data names the hub page itself.
describe("buy-sell breadcrumb structured data", () => {
  it.each([
    { page: "city", route: () => CityRoute({ params: Promise.resolve({ city: "lehi" }) }) },
    {
      page: "sub-service",
      route: () => SubServiceRoute({ params: Promise.resolve({ city: "lehi", subservice: "first-time-buyers" }) }),
    },
    { page: "ZIP", route: () => ZipRoute({ params: Promise.resolve({ zip: "84043" }) }) },
  ])("$page page points the Buy & Sell crumb at /buy/", async ({ route }) => {
    const crumbs = await breadcrumbs(route())
    expect(crumbs[1]).toMatchObject({ name: "Buy & Sell", item: `${SITE_URL}/buy/` })
    expect(crumbs.map((crumb) => crumb.item)).not.toContain(`${SITE_URL}/buy-sell/`)
  })
})
