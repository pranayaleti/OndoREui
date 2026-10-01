import { test, expect } from "@playwright/test"

/**
 * The primary nav must never slide under the logo. Between 768px and ~1180px the pinned
 * items are wider than the space beside the logo, so the list scrolls; it has to start at
 * the left edge of its container (Buy and Sell reachable), not be clipped on both sides.
 * Runs against the static export, like the a11y suite.
 */
for (const width of [820, 1024, 1180]) {
  test(`first primary nav item clears the logo at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/", { waitUntil: "domcontentloaded" })

    const logoRight = await page
      .locator("header a[aria-label$='home']")
      .first()
      .evaluate((el) => el.getBoundingClientRect().right)
    const firstItem = page.locator("header nav[aria-label='Primary navigation'] nav > *").first()
    const firstLeft = await firstItem.evaluate((el) => el.getBoundingClientRect().left)

    expect(firstLeft).toBeGreaterThanOrEqual(logoRight)
  })
}
