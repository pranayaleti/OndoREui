/**
 * Derives the web copies of the Ondo mark (the fire portrait inside the brush ring) from the
 * in-repo master public/ondo-mark.png, alpha preserved. The transparency is load-bearing: the
 * face interior is negative space and must show the page behind it.
 *
 *   node scripts/derive-ondo-mark.mjs
 */
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const master = path.join(root, "public", "ondo-mark.png")

for (const [name, width] of [
  ["ondo-mark.webp", 1024],
  ["ondo-mark-512.webp", 512],
]) {
  const out = path.join(root, "public", name)
  const info = await sharp(master)
    .ensureAlpha()
    .resize(width, width, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(out)
  console.log(`${name}: ${info.width}x${info.height}, ${info.size} bytes`)
}
