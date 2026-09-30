/**
 * Draws the print-ready QR kit in public/qr/ from lib/qr-placements.json: for every QR
 * placement, a vector SVG (any print size) and a 2048px PNG that carry
 * https://www.ondorealestate.com/go/<id>/ with error correction H and the Ondo mark in the
 * middle. Also refreshes public/links-qr.svg, the small logo-free code shown on the site
 * (footer and contact page), as the "web" placement.
 *
 * Every file is decoded again before the script finishes, at full size and at a small
 * size, and the script exits non-zero if any code does not read back as its exact URL.
 *
 *   node scripts/generate-qr-kit.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import QRCode from "qrcode"
import jsQR from "jsqr"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const placements = JSON.parse(fs.readFileSync(path.join(root, "lib", "qr-placements.json"), "utf8"))
// Must match QR_ORIGIN in lib/qr-placements.ts: printed codes always carry the production host.
const ORIGIN = "https://www.ondorealestate.com"
const QUIET_ZONE = 4
const outDir = path.join(root, "public", "qr")

const shortUrl = (id) => `${ORIGIN}/go/${id}/`

async function markJpegBase64() {
  // Flattened onto white: the badge is white anyway, and JPEG keeps each SVG small.
  const jpeg = await sharp(path.join(outDir, "ondo-mark.png"))
    .resize(256, 256)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer()
  return jpeg.toString("base64")
}

function qrSvg(text, { level, logo }) {
  const qr = QRCode.create(text, { errorCorrectionLevel: level })
  const size = qr.modules.size
  const total = size + QUIET_ZONE * 2
  let d = ""
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (qr.modules.get(y, x)) d += `M${x + QUIET_ZONE} ${y + QUIET_ZONE}h1v1h-1z`
    }
  }
  let badge = ""
  if (logo) {
    // About 24% of the symbol width (under 6% of its area), well inside what level H recovers.
    const badgeSize = Math.round(size * 0.24)
    const offset = (total - badgeSize) / 2
    const pad = badgeSize * 0.08
    badge =
      `<rect x="${offset}" y="${offset}" width="${badgeSize}" height="${badgeSize}" rx="${badgeSize * 0.18}" fill="#fff"/>` +
      `<image x="${offset + pad}" y="${offset + pad}" width="${badgeSize - pad * 2}" height="${badgeSize - pad * 2}" ` +
      `href="data:image/jpeg;base64,${logo}"/>`
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">` +
    `<title>${text}</title><rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="${d}"/>${badge}</svg>`
  return { svg, modules: size }
}

async function decodes(input, expected, px) {
  const { data, info } = await sharp(input, { density: 300 })
    .resize(px, px)
    .flatten({ background: "#ffffff" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data === expected
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  const logo = await markJpegBase64()
  const failures = []

  for (const placement of placements.filter((p) => p.medium === "qr")) {
    const url = shortUrl(placement.id)
    const { svg, modules } = qrSvg(url, { level: "H", logo })
    const svgPath = path.join(outDir, `ondo-links-${placement.id}.svg`)
    const pngPath = path.join(outDir, `ondo-links-${placement.id}.png`)
    fs.writeFileSync(svgPath, svg)
    await sharp(Buffer.from(svg), { density: 600 }).resize(2048, 2048, { kernel: "nearest" }).png().toFile(pngPath)
    for (const px of [1024, 240]) {
      if (!(await decodes(pngPath, url, px))) failures.push(`${pngPath} at ${px}px`)
    }
    console.log(`qr-kit: ${placement.id.padEnd(9)} ${modules}x${modules} modules  ${url}`)
  }

  const web = shortUrl("web")
  const { svg: siteSvg } = qrSvg(web, { level: "M", logo: null })
  const sitePath = path.join(root, "public", "links-qr.svg")
  fs.writeFileSync(sitePath, siteSvg)
  if (!(await decodes(sitePath, web, 240))) failures.push(`${sitePath} at 240px`)
  console.log(`qr-kit: site code  public/links-qr.svg  ${web}`)

  if (failures.length > 0) {
    console.error(`qr-kit: these codes did not decode back to their URL:\n  ${failures.join("\n  ")}`)
    process.exit(1)
  }
  console.log("qr-kit: every code decodes back to its exact URL")
}

await main()
