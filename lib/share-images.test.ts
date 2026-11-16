import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { SHARE_IMAGES, isRetiredStockArt, shareImageKeyForPath, shareImagePath } from "./share-images"
import { DEFAULT_OG_IMAGES, OG_IMAGES, OG_IMAGE_URLS, pageCanonicalMetadata } from "./page-canonical"

describe("share images", () => {
  it("ships every card as a JPEG in public/og", () => {
    for (const path of Object.values(SHARE_IMAGES)) {
      expect(path).toMatch(/^\/og\/[a-z-]+\.jpg$/)
      expect(existsSync(join(process.cwd(), "public", path))).toBe(true)
    }
  })

  it("replaces a missing image or retired stock art, and leaves real images alone", () => {
    expect(shareImagePath(undefined)).toBe(SHARE_IMAGES.default)
    expect(shareImagePath("/modern-office-building.webp")).toBe(SHARE_IMAGES.default)
    expect(shareImagePath("/property-manager-meeting.png", "guides")).toBe(SHARE_IMAGES.guides)
    expect(shareImagePath("https://www.ondorealestate.com/suburban-house-garden.png", "buy")).toBe(SHARE_IMAGES.buy)
    expect(shareImagePath("/founders-letter-og.jpg")).toBe("/founders-letter-og.jpg")
    expect(shareImagePath("https://cdn.example.com/listing/123.jpg")).toBe("https://cdn.example.com/listing/123.jpg")
    expect(isRetiredStockArt("/banners/utah-mount-timpanogos.webp")).toBe(false)
  })

  it("picks the card by the first path segment", () => {
    expect(shareImageKeyForPath("/")).toBe("default")
    expect(shareImageKeyForPath("/properties/")).toBe("rent")
    expect(shareImageKeyForPath("/buy/first-time/")).toBe("buy")
    expect(shareImageKeyForPath("/whats-my-home-worth/")).toBe("sell")
    expect(shareImageKeyForPath("/property-management/lehi/")).toBe("manage")
    expect(shareImageKeyForPath("/loans/fha/")).toBe("loans")
    expect(shareImageKeyForPath("/refinance/cash-out/")).toBe("loans")
    expect(shareImageKeyForPath("/notary/")).toBe("notary")
    expect(shareImageKeyForPath("/blog/appraisal-comes-in-low/")).toBe("guides")
    expect(shareImageKeyForPath("https://www.ondorealestate.com/calculators/")).toBe("guides")
    expect(shareImageKeyForPath("/locations/lehi/")).toBe("default")
  })

  it("gives a page with no image of its own the card for its section, on both card types", () => {
    const loans = pageCanonicalMetadata("/loans/fha/", { title: "FHA loans" })
    expect(loans.openGraph?.images).toEqual(OG_IMAGES.loans)
    expect(loans.twitter?.images).toEqual([OG_IMAGE_URLS.loans])

    const other = pageCanonicalMetadata("/about/", { title: "About" })
    expect(other.openGraph?.images).toEqual(DEFAULT_OG_IMAGES)

    const own = pageCanonicalMetadata("/founders-letter/", {
      openGraph: { images: [{ url: "https://www.ondorealestate.com/founders-letter-og.jpg" }] },
    })
    expect(own.twitter?.images).toEqual(["https://www.ondorealestate.com/founders-letter-og.jpg"])
  })

  it("keeps retired stock art out of every absolute (shared) image URL in the source", () => {
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name)
        if (statSync(full).isDirectory()) walk(full)
        else if (/\.(ts|tsx)$/.test(name) && !/\.test\./.test(name)) {
          const text = readFileSync(full, "utf8")
          if (/(SITE_URL\}|toAbsoluteSiteUrl\(")\/(modern-office-building|modern-apartment-balcony|modern-townhouse-garage|suburban-house-garden|property-manager-meeting)\./.test(text)) {
            offenders.push(full)
          }
        }
      }
    }
    for (const dir of ["app", "lib", "components"]) walk(join(process.cwd(), dir))
    expect(offenders).toEqual([])
  })
})
