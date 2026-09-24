import { describe, it, expect } from "vitest"
import { socialPlatformFor } from "./social-icons"

describe("socialPlatformFor", () => {
  it.each([
    ["https://www.instagram.com/OnDoRealEstate", "Instagram"],
    ["https://www.facebook.com/OnDoRealEstate", "Facebook"],
    ["https://m.facebook.com/OnDoRealEstate", "Facebook"],
    ["https://www.linkedin.com/company/OnDoRealEstate", "LinkedIn"],
    ["https://www.tiktok.com/@OndoRealEstate", "TikTok"],
    ["https://www.youtube.com/@OnDoRealEstate", "YouTube"],
    ["https://youtu.be/dQw4w9WgXcQ", "YouTube"],
    ["https://x.com/OnDoRealEstate", "X"],
    ["https://twitter.com/OnDoRealEstate", "X"],
    ["https://www.pinterest.com/ondorealestate", "Pinterest"],
    ["https://yelp.com/biz/ondo-real-estate-lehi", "Yelp"],
    ["https://linktr.ee/ondorealestate", "Linktree"],
    ["https://g.page/r/CabcDEF/review", "Google Business"],
    ["https://www.google.com/maps/place/Ondo+Real+Estate", "Google Business"],
  ])("names %s as %s", (url, name) => {
    expect(socialPlatformFor(url)?.name).toBe(name)
  })

  // Substring matching labeled these as X ("x.com") and would render the wrong icon.
  it.each([
    "https://www.netflix.com/",
    "https://www.dropbox.com/s/abc/x.com",
    "https://www.google.com/search?q=ondo",
    "not a url",
  ])("does not claim %s is a known platform", (url) => {
    expect(socialPlatformFor(url)).toBeNull()
  })
})
