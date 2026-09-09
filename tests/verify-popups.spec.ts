import { test, expect } from "@playwright/test"

const ROUTES = ["/", "/calculators/cap-rate/", "/calculators/mortgage-payment/", "/notary/"]

for (const route of ROUTES) {
  test(`no unsolicited popup or permission prompt on ${route}`, async ({ page }) => {
    // Trap the native permission request before any app code runs.
    await page.addInitScript(() => {
      ;(window as any).__permAsked = 0
      if (typeof Notification !== "undefined") {
        Notification.requestPermission = () => {
          ;(window as any).__permAsked++
          return Promise.resolve("default" as NotificationPermission)
        }
      }
    })
    await page.goto(route, { waitUntil: "domcontentloaded" })
    await page.locator("main, #main-content").first().waitFor({ state: "visible", timeout: 15_000 })

    // Well past the old 1.5s calculator modal and 3s push banner.
    await page.waitForTimeout(6000)

    const asked = await page.evaluate(() => (window as any).__permAsked)
    expect(asked, "Notification.requestPermission must not fire without a gesture").toBe(0)

    const dialogs = page.locator('[role="dialog"]:visible, [role="alertdialog"]:visible')
    expect(await dialogs.count(), `an unsolicited dialog opened on ${route}`).toBe(0)

    const bars = await page.locator('div.fixed.inset-x-0.bottom-0:visible').count()
    expect(bars, `stacked fixed bottom bars on ${route}`).toBeLessThanOrEqual(1)
  })
}
