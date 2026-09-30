/**
 * Renders public/links-og.jpg, the 1200x630 link preview for /links, from an HTML template
 * in headless Chromium so it uses the site's real fonts (Outfit, Inter). JPEG, not WebP:
 * LinkedIn and some messaging apps drop WebP previews, and this page is shared exactly there.
 *
 *   node scripts/generate-links-og.mjs
 */
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const avatar = `file://${path.join(root, "public", "links-avatar.webp")}`
const out = path.join(root, "public", "links-og.jpg")

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #0e1117; color: #f2f2f2; font-family: Inter, sans-serif;
         display: flex; align-items: center; padding: 0 88px; gap: 64px; }
  .ring { flex: none; width: 300px; height: 300px; border-radius: 50%; padding: 8px;
          background: linear-gradient(135deg, #f97316, #991b1b); }
  .ring img { width: 100%; height: 100%; border-radius: 50%; border: 8px solid #0e1117; object-fit: cover; display: block; }
  h1 { font-family: Outfit, sans-serif; font-weight: 700; font-size: 76px; letter-spacing: -1.5px; line-height: 1.02; }
  .tag { margin-top: 18px; font-size: 32px; line-height: 1.35; color: #b3b8c2; max-width: 640px; }
  .chips { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; }
  .chip { border: 2px solid rgba(249,115,22,.75); border-radius: 999px; padding: 8px 20px; font-size: 24px; font-weight: 500; }
  .url { margin-top: 34px; font-size: 28px; font-weight: 600; color: #f97316; }
</style></head><body>
  <div class="ring"><img src="${avatar}" alt=""></div>
  <div>
    <h1>Ondo Real Estate</h1>
    <p class="tag">Buy, sell and finance a home in Utah. Property management too.</p>
    <div class="chips"><span class="chip">Buy</span><span class="chip">Sell</span><span class="chip">Home loans</span><span class="chip">Rentals</span></div>
    <p class="url">ondorealestate.com/links</p>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: "png" })
await browser.close()
const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out)
console.log(`links-og: ${info.width}x${info.height}, ${info.size} bytes -> public/links-og.jpg`)
