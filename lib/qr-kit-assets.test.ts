// @vitest-environment node
import { describe, it, expect } from "vitest"
import { join } from "node:path"
import jsQR from "jsqr"
import sharp from "sharp"
import { QR_PLACEMENTS, qrShortUrl } from "@/lib/qr-placements"

const PUBLIC = join(__dirname, "..", "public")

/** Renders a committed QR file at a modest size, as a phone camera would see a print, and reads it. */
async function scan(file: string): Promise<string | undefined> {
  const { data, info } = await sharp(file, { density: 300 })
    .resize(400, 400)
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data
}

describe("printed QR kit (regenerate with node scripts/generate-qr-kit.mjs)", () => {
  const printed = QR_PLACEMENTS.filter((placement) => placement.medium === "qr").map(({ id }) => id)

  it.each(printed)("the %s code, SVG and PNG, scans to its short link", async (id) => {
    expect(await scan(join(PUBLIC, "qr", `ondo-links-${id}.svg`))).toBe(qrShortUrl(id))
    expect(await scan(join(PUBLIC, "qr", `ondo-links-${id}.png`))).toBe(qrShortUrl(id))
  })

  it("the small code in the footer and on the contact page scans to the web short link", async () => {
    expect(await scan(join(PUBLIC, "links-qr.svg"))).toBe(qrShortUrl("web"))
  })
})
