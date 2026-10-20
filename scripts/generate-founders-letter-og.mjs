/**
 * Renders public/founders-letter-og.jpg, the 1200x630 link preview for /founders-letter/, from
 * an HTML template in headless Chromium so it uses the page's real faces (Fraunces, Outfit, Inter)
 * and the real mark. JPEG, not WebP: LinkedIn and some messaging apps drop WebP previews. One-off,
 * committed; rerun after the headline changes.
 *
 *   node scripts/generate-founders-letter-og.mjs
 */
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const mark = `file://${path.join(root, "public", "ondo-mark.png")}`
const out = path.join(root, "public", "founders-letter-og.jpg")

const headline = "I came to the United States to study computer science. I stayed to build something of my own."

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&family=Inter:wght@400;500&family=Outfit:wght@800&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #150c08; color: #f2f2f2; font-family: Inter, sans-serif;
         display: flex; align-items: center; padding: 0 80px 0 64px; gap: 48px; overflow: hidden; }
  .stage { position: relative; flex: none; width: 380px; height: 380px; display: grid; place-items: center; }
  .stage::before { content: ""; position: absolute; inset: -28%; border-radius: 50%;
          background: radial-gradient(circle, rgba(249,115,22,.42) 0%, rgba(249,115,22,.18) 38%, transparent 68%); }
  .stage img { position: relative; width: 340px; height: 340px; display: block; }
  .lockup { margin-top: -2px; font-family: Outfit, sans-serif; font-weight: 800; font-size: 44px; letter-spacing: -1px; line-height: 1; }
  .lockup b { color: #f97316; font-weight: 800; }
  .text { flex: 1; min-width: 0; }
  .kicker { font-family: Fraunces, serif; font-style: italic; font-size: 24px; color: #c8b8ad; }
  h1 { margin-top: 14px; font-family: Fraunces, serif; font-weight: 500; font-size: 50px; line-height: 1.08; letter-spacing: -0.5px; text-wrap: balance; }
  .byline { margin-top: 26px; font-size: 24px; color: #d9cfc7; }
  .url { margin-top: 10px; font-size: 24px; font-weight: 500; color: #f97316; }
</style></head><body>
  <div class="stage"><img src="${mark}" alt=""></div>
  <div class="text">
    <p class="kicker">A letter from the founder</p>
    <h1>${headline}</h1>
    <p class="byline">Pranay Reddy Aleti, Ondo Real Estate, Lehi, Utah</p>
    <p class="url">ondorealestate.com/founders-letter</p>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: "png" })
await browser.close()
const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out)
console.log(`founders-letter-og: ${info.width}x${info.height}, ${info.size} bytes -> public/founders-letter-og.jpg`)
