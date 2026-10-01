import { test, expect } from "@playwright/test"

type PermWindow = Window & { __permAsked?: number }

const ROUTES = ["/", "/calculators/cap-rate/", "/calculators/mortgage-payment/", "/notary/"]

for (const route of ROUTES) {
  test(`no unsolicited popup or permission prompt on ${route}`, async ({ page }) => {
    // Trap the native permission request before any app code runs.
    await page.addInitScript(() => {
      const w = window as PermWindow
      w.__permAsked = 0
      if (typeof Notification !== "undefined") {
        Notification.requestPermission = () => {
          w.__permAsked = (w.__permAsked ?? 0) + 1
          return Promise.resolve("default" as NotificationPermission)
        }
      }
    })
    await page.goto(route, { waitUntil: "domcontentloaded" })
    await page.locator("main, #main-content").first().waitFor({ state: "visible", timeout: 15_000 })

    // Well past the old 1.5s calculator modal and 3s push banner.
    await page.waitForTimeout(6000)

    const asked = await page.evaluate(() => (window as PermWindow).__permAsked ?? 0)
    expect(asked, "Notification.requestPermission must not fire without a gesture").toBe(0)

    const dialogs = page.locator('[role="dialog"]:visible, [role="alertdialog"]:visible')
    expect(await dialogs.count(), `an unsolicited dialog opened on ${route}`).toBe(0)

    const bars = await page.locator("[data-fixed-bottom-bar]:visible").count()
    expect(bars, `stacked fixed bottom bars on ${route}`).toBeLessThanOrEqual(1)
  })
}
