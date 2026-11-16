/**
 * Renders the link-preview (Open Graph / Twitter) images in public/og/: one default card and one per
 * service, 1200x630 each. They replace the stock office tower that every page used to share.
 *
 * Rendered from an HTML template in headless Chromium so the cards use the site's real faces (Outfit,
 * Inter), the real mark and the Utah banner photos (docs/PHOTO-CREDITS.md). JPEG, not WebP: LinkedIn and
 * some messaging apps drop WebP previews. Local images are inlined as data URIs because a page made with
 * setContent() cannot load file:// URLs.
 *
 * Headlines and sublines repeat the H1 and banner subtitle of the page each card stands for. Change them
 * here when that page's wording changes, then rerun:
 *
 *   node scripts/generate-share-images.mjs
 *
 * The paths are listed in lib/share-images.ts.
 */
import { mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pub = (...p) => path.join(root, "public", ...p)

const dataUri = async (file, mime) => `data:${mime};base64,${(await readFile(file)).toString("base64")}`

const mark = await dataUri(pub("ondo-mark-512.webp"), "image/webp")
const photos = {
  timpanogos: await dataUri(pub("banners", "utah-mount-timpanogos.webp"), "image/webp"),
  lake: await dataUri(pub("banners", "utah-lake-wasatch.webp"), "image/webp"),
  clouds: await dataUri(pub("banners", "utah-mountain-clouds.webp"), "image/webp"),
}

/** One card per entry: file name, the page H1 it repeats, that page's subtitle, and a backdrop. */
const cards = [
  {
    file: "ondo-real-estate",
    headline: "Rent, buy, sell, finance or notarize.",
    sub: "One local team in Lehi for your home and your rental.",
    photo: "timpanogos",
  },
  {
    file: "rent",
    headline: "Homes for rent across the Wasatch Front",
    sub: "Match a pin to a listing, open details, or ask leasing to set up a showing.",
    photo: "lake",
  },
  {
    file: "buy",
    headline: "Buy a home in Utah",
    sub: "An agent on your side from the first tour to the keys.",
    photo: "lake",
  },
  {
    file: "sell",
    headline: "Sell your Utah home",
    sub: "A real pricing analysis, a listing plan and an agent through close.",
    photo: "clouds",
  },
  {
    file: "manage",
    headline: "Property management for Utah owners",
    sub: "Hand off the leasing, rent, repairs and paperwork. Keep full visibility.",
    photo: "timpanogos",
  },
  {
    file: "loans",
    headline: "Home loans in Utah",
    sub: "Find out which program fits your file before you fall for a house.",
    photo: "clouds",
  },
  {
    file: "notary",
    headline: "Online notary, any state",
    sub: "Sign on a video call with a commissioned Utah notary.",
    photo: "timpanogos",
  },
  {
    file: "guides",
    headline: "Utah real estate guides and calculators",
    sub: "Plain answers on renting, buying, selling, loans and managing a rental.",
    photo: "lake",
  },
]

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const template = ({ headline, sub, photo }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #100f0e; color: #fff;
         font-family: Inter, sans-serif; }
  .photo { position: absolute; inset: 0; background: url("${photos[photo]}") center 30% / cover no-repeat;
           filter: grayscale(1) contrast(1.05); }
  /* Dark on the left where the words sit, lighter on the right so the mountains still read. */
  .scrim { position: absolute; inset: 0;
           background: linear-gradient(90deg, rgba(16,15,14,.94) 0%, rgba(16,15,14,.84) 46%, rgba(16,15,14,.42) 100%),
                       linear-gradient(0deg, rgba(16,15,14,.7) 0%, rgba(16,15,14,0) 45%); }
  .frame { position: relative; height: 100%; padding: 60px 72px 56px; display: flex; flex-direction: column; }
  .lockup { display: flex; align-items: center; gap: 16px; }
  .lockup img { width: 76px; height: 76px; display: block; }
  .lockup span { font-family: Outfit, sans-serif; font-weight: 700; font-size: 36px; letter-spacing: -0.5px; }
  .body { margin-top: auto; max-width: 940px; }
  .rule { width: 72px; height: 6px; border-radius: 3px; background: #f97316; }
  h1 { margin-top: 26px; font-family: Outfit, sans-serif; font-weight: 700; font-size: 84px; line-height: 1;
       letter-spacing: -2px; text-wrap: balance; }
  .sub { margin-top: 22px; max-width: 820px; font-size: 30px; line-height: 1.35; color: #ddd8d3; text-wrap: balance; }
  .url { margin-top: 30px; font-size: 26px; font-weight: 600; color: #f97316; }
</style></head><body>
  <div class="photo"></div>
  <div class="scrim"></div>
  <div class="frame">
    <div class="lockup"><img src="${mark}" alt=""><span>Ondo Real Estate</span></div>
    <div class="body">
      <div class="rule"></div>
      <h1>${escapeHtml(headline)}</h1>
      <p class="sub">${escapeHtml(sub)}</p>
      <p class="url">ondorealestate.com</p>
    </div>
  </div>
</body></html>`

await mkdir(pub("og"), { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const card of cards) {
  await page.setContent(template(card), { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: "png" })
  const out = pub("og", `${card.file}.jpg`)
  const info = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
  console.log(`og/${card.file}.jpg: ${info.width}x${info.height}, ${info.size} bytes`)
}
await browser.close()
