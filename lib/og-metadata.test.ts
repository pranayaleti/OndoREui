import { describe, expect, it, vi } from "vitest"

vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter", variable: "--font-inter" }),
  Outfit: () => ({ className: "outfit", variable: "--font-outfit" }),
}))

import { pageCanonicalMetadata } from "./page-canonical"
import { SITE_NAME, SITE_URL, pageTitle } from "./site"

import { metadata as rootMetadata } from "@/app/layout"
import { metadata as compareMetadata } from "@/app/compare/page"
import { metadata as solutionsMetadata } from "@/app/solutions/page"
import { metadata as faqMetadata } from "@/app/faq/page"
import { metadata as secondLookMetadata } from "@/app/loans/second-look/page"
import { metadata as rateWatchMetadata } from "@/app/refinance/watch/page"

const origin = SITE_URL.replace(/\/$/, "")

describe("root layout openGraph", () => {
  it("does not hard-code an og:url that child pages would inherit", () => {
    const og = rootMetadata.openGraph as Record<string, unknown> | null | undefined
    expect(og).toBeTruthy()
    expect(og).not.toHaveProperty("url")
  })
})

describe("pageCanonicalMetadata social cards", () => {
  it("carries the page title and description into og and twitter, not the homepage's", () => {
    const meta = pageCanonicalMetadata("/about/", {
      title: pageTitle("About Ondo"),
      description: "About the company.",
    })
    const og = meta.openGraph as Record<string, unknown>
    expect(og.title).toBe("About Ondo | Ondo RE")
    expect(og.description).toBe("About the company.")
    expect(og.type).toBe("website")
    expect(og.siteName).toBe(SITE_NAME)
    const tw = meta.twitter as Record<string, unknown>
    expect(tw.title).toBe("About Ondo | Ondo RE")
    expect(tw.description).toBe("About the company.")
  })

  it("lets an explicit openGraph title or type win", () => {
    const meta = pageCanonicalMetadata("/blog/post/", {
      title: "Post",
      openGraph: { type: "article", title: "Custom" },
    })
    const og = meta.openGraph as Record<string, unknown>
    expect(og.type).toBe("article")
    expect(og.title).toBe("Custom")
  })
})

describe("flagship pages: og:url equals the canonical", () => {
  const pages: Array<[string, typeof compareMetadata, string]> = [
    ["/compare/", compareMetadata, "compare"],
    ["/solutions/", solutionsMetadata, "solutions"],
    ["/faq/", faqMetadata, "faq"],
    ["/loans/second-look/", secondLookMetadata, "second look"],
    ["/refinance/watch/", rateWatchMetadata, "rate watch"],
  ]
  it.each(pages)("%s", (path, meta) => {
    const canonical = `${origin}${path}`
    expect(meta.alternates?.canonical).toBe(canonical)
    expect((meta.openGraph as { url?: string }).url).toBe(canonical)
    expect((meta.openGraph as { type?: string }).type).toBe("website")
    expect((meta.openGraph as { title?: string }).title).toBeTruthy()
  })
})
