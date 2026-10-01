import { describe, expect, it } from "vitest"
import { metadata as layoutMetadata } from "./layout"
import { metadata as compareMetadata } from "./compare/page"
import { metadata as referralMetadata } from "../referral/page"

describe("/properties/ metadata", () => {
  it("describes a rentals-only site, not a for-sale search", () => {
    const text = JSON.stringify(layoutMetadata)
    expect(text).not.toMatch(/for sale|investment properties/i)
    expect(layoutMetadata.openGraph?.title).toMatch(/rental/i)
    expect(layoutMetadata.description).toMatch(/rental/i)
  })

  it("gives /properties/compare/ its own social preview fields", () => {
    expect(compareMetadata.openGraph?.title).toMatch(/compare listings/i)
    expect(compareMetadata.openGraph?.description).toBe(compareMetadata.description)
    expect(compareMetadata.twitter?.title).toMatch(/compare listings/i)
    expect(JSON.stringify(compareMetadata)).not.toMatch(/for sale/i)
  })
})

describe("/referral/ metadata", () => {
  it("is noindex,follow because it only makes sense with a ?ref= code", () => {
    expect(referralMetadata.robots).toEqual({ index: false, follow: true })
  })
})
