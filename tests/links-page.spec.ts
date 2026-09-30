import { test, expect, type Request } from "@playwright/test"

/**
 * Guards for /links, the page every social bio and printed QR code opens. Runs against
 * the static export, like the a11y suite. Budgets come from the measured page after the
 * Sep 2026 fix that stopped Stripe and the rental flows loading on every page.
 */

/** Same-origin JavaScript as transferred: 344 KiB measured after the fix, which also removed ~890 KiB of Stripe from js.stripe.com. */
const SCRIPT_BUDGET_KB = 400

// Instagram and TikTok's in-app browsers leave roughly this much of a 390px-wide phone visible.
test.use({ viewport: { width: 390, height: 740 }, isMobile: true, hasTouch: true })

test.describe("Link-in-bio page", () => {
  test("loads no payment scripts and stays inside its script budget", async ({ page, baseURL }) => {
    const finished: Request[] = []
    page.on("requestfinished", (request) => finished.push(request))
    await page.goto("/links/", { waitUntil: "networkidle" })

    expect(finished.map((request) => request.url()).filter((url) => /stripe\.(com|network)/.test(url))).toEqual([])

    let scriptBytes = 0
    for (const request of finished) {
      if (request.resourceType() !== "script" || !request.url().startsWith(baseURL ?? "")) continue
      scriptBytes += (await request.sizes()).responseBodySize
    }
    expect(scriptBytes / 1024).toBeLessThan(SCRIPT_BUDGET_KB)
  })

  test("shows the contact actions and the booking button without scrolling", async ({ page }) => {
    await page.goto("/links/")
    for (const name of ["Call Ondo", "Text Ondo", "Email Ondo", "Save contact"]) {
      await expect(page.getByRole("link", { name })).toBeInViewport()
    }
    await expect(page.getByRole("link", { name: /book a free 30-minute call/i })).toBeInViewport()
  })

  test("a business-card scan lands on /links with its tracking tags", async ({ page }) => {
    await page.goto("/go/card/")
    await page.waitForURL(/\/links\/\?utm_source=business_card&utm_medium=qr&utm_campaign=links$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ondo Real Estate")
  })

  test("Save contact serves a contact card phones can import", async ({ request }) => {
    const response = await request.get("/ondo-real-estate.vcf")
    expect(response.status()).toBe(200)
    const card = await response.text()
    expect(card.startsWith("BEGIN:VCARD")).toBe(true)
    expect(card).toContain("FN:Pranay Reddy Aleti")
  })
})
