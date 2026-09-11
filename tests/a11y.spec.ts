import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import type { Result } from "axe-core"

/**
 * Public routes that should never produce serious/critical axe violations.
 *
 * Authenticated portal routes (/dashboard, /tenant, /owner, /platform) are
 * not included here because they redirect to login when unauthenticated, so
 * an unconfigured Playwright run only ever sees the login form. Add an
 * authenticated suite when E2E credentials are wired into CI.
 */
const routes = [
  "/",
  "/feedback",
  "/founders-letter",
  "/accessibility",
  "/contact",
  // Primary marketing flows
  "/buy",
  "/sell",
  "/properties",
  "/loans",
  "/investments",
  // New public/marketing routes added in Phase 0
  "/locations",
  "/privacy-policy",
  // Calculators were entirely untested here, which is how 146 inputs without an
  // associated <label> went unnoticed. Cover the index plus two tools: the most
  // complex form and a small one.
  "/calculators/",
  "/calculators/mortgage-payment/",
  "/calculators/cap-rate/",
  // Glossary: index carries the search/filter UI, the term page the article layout.
  "/glossary/",
  "/glossary/escrow-account/",
  // Dynamic-but-public routes (placeholder slugs covered by generateStaticParams)
  "/properties/_placeholder/",
  // Representative generated dynamic pages with real static params
  "/compare/draper-vs-lehi/",
  "/neighborhoods/draper/suncrest/",
]

/**
 * Wait for a live region that actually carries text.
 *
 * Several `role="alert"` nodes exist on these pages permanently and empty, so
 * simply waiting for one to be visible proves nothing about whether the form
 * errored. Returns the text, or "" if none appeared.
 */
async function firstNonEmptyAlert(page: import("@playwright/test").Page, timeout = 15_000): Promise<string> {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const texts = await page.locator('[role="alert"]').allTextContents()
    const filled = texts.map((t) => t.trim()).find((t) => t.length > 0)
    if (filled) return filled
    await page.waitForTimeout(250)
  }
  return ""
}

/** Freeze motion, then scan. Shared by the static and interactive suites. */
async function scanForViolations(page: import("@playwright/test").Page): Promise<Result[]> {
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  })
  await page.waitForTimeout(100)
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .options({ resultTypes: ["violations"] })
    .analyze()
  return results.violations.filter((v: Result) => v.impact === "serious" || v.impact === "critical")
}

function reportViolations(route: string, violations: Result[]): void {
  if (violations.length === 0) return
  console.warn(
    `\nAccessibility violations on ${route}:\n` +
      violations
        .map((v: Result) => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`)
        .join("\n"),
  )
}

/**
 * Error states were never scanned.
 *
 * Every route above is checked in its resting state, so a validation message or a
 * failed-submit banner — exactly the copy a struggling user most needs to read —
 * was outside the gate entirely. That is how `text-destructive` sat at 1.79:1 in
 * dark mode and 3.61:1 in light without anything catching it.
 *
 * These drive real forms into their error state and scan that.
 */
test.describe("Accessibility — error states", () => {
  test("contact form reports a missing required choice accessibly", async ({ page }) => {
    await page.goto("/contact/", { waitUntil: "domcontentloaded" })
    await page.locator("main, #main-content, [role='main']").first().waitFor({ state: "visible", timeout: 15_000 })

    // The name/email inputs are `required`, so a bare submit is stopped by native
    // validation and the component's own handler never runs. Fill them, leave the
    // audience radios untouched, and the inquiry error is what fails.
    // Field ids come from useId, so select by label rather than by id.
    const form = page.locator("form").filter({ has: page.locator('button[type="submit"]') }).first()
    await form.getByLabel(/^name/i).fill("Ada Lovelace")
    await form.getByLabel(/^email/i).fill("ada@example.com")
    await form.locator('button[type="submit"]').click()

    // Assert the error state was actually reached. Without this the scan below
    // would happily pass on a form that never errored — a test that proves nothing.
    const alertText = await firstNonEmptyAlert(page)
    expect(alertText, "expected the contact form to surface a validation error").toBeTruthy()

    const violations = await scanForViolations(page)
    reportViolations("/contact/ (error state)", violations)
    expect.soft(violations, "Serious/critical a11y violations on /contact/ in its error state").toEqual([])
  })

  test("demo form reports a failed submission accessibly", async ({ page }) => {
    await page.goto("/demo/", { waitUntil: "domcontentloaded" })
    await page.locator("main, #main-content, [role='main']").first().waitFor({ state: "visible", timeout: 15_000 })

    // There is no backend behind the static export, so a valid submit fails and
    // renders the error banner — which is the state we want to scan.
    await page.fill("#firstName", "Ada")
    await page.fill("#lastName", "Lovelace")
    await page.fill("#email", "ada@example.com")
    await page.locator('form button[type="submit"]').first().click()

    const alertText = await firstNonEmptyAlert(page)
    expect(alertText, "expected the demo form to surface a submission failure").toBeTruthy()

    const violations = await scanForViolations(page)
    reportViolations("/demo/ (error state)", violations)
    expect.soft(violations, "Serious/critical a11y violations on /demo/ in its error state").toEqual([])
  })
})

test.describe("Accessibility smoke tests", () => {
  for (const route of routes) {
    test(`page ${route} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" })
      // Wait for a stable landmark before axe so Fast Refresh flakes less
      // or client hydration triggers a secondary navigation.
      await page.locator("main, #main-content, [role='main']").first().waitFor({ state: "visible", timeout: 15_000 })
      if (route === "/properties") {
        await page
          .waitForResponse((response) => response.url().includes("/api/properties/public"), {
            timeout: 15_000,
          })
          .catch(() => undefined)
        await page
          .locator('[aria-label="Loading properties"]')
          .waitFor({ state: "detached", timeout: 15_000 })
          .catch(() => undefined)
      }
      await page.waitForTimeout(300)

      // Freeze transitions/animations before sampling. axe reads *computed* colours,
      // and Tailwind's `transition-colors` on freshly rendered listing cards was still
      // interpolating when the scan ran — yielding mid-transition values (#a85115 on one
      // run, #af5415 on the next) and colour-contrast failures that disappeared once the
      // transition finished. Freezing first makes the scan measure the steady state that
      // WCAG actually applies to, and makes the result deterministic.
      await page.addStyleTag({
        content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
      })
      await page.waitForTimeout(100)

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .options({ resultTypes: ["violations"] })
        .analyze()

      const seriousViolations = results.violations.filter(
        (v: Result) => v.impact === "serious" || v.impact === "critical",
      )

      if (seriousViolations.length > 0) {
        // Log a concise summary to help debugging in CI
        // without overwhelming the output.
        console.warn(
          `\nAccessibility violations on ${route}:\n` +
            seriousViolations
              .map(
                (v: Result) =>
                  `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`,
              )
              .join("\n"),
        )
      }

      expect.soft(seriousViolations, `Serious/critical a11y violations on ${route}`).toEqual([])
    })
  }
})


/**
 * Desktop mega-menu.
 *
 * The primary nav's panels are hover-first, which is exactly the pattern that
 * ships broken for everyone who isn't holding a mouse. They are also portalled
 * to <body> to escape the nav's overflow-x-auto scroll container, so the panel
 * is nowhere near its trigger in DOM order — the wiring that makes it reachable
 * (aria-controls, roving focus, Escape) is the only thing holding it together
 * and needs a gate.
 */
test.describe("Accessibility — primary nav mega-menu", () => {
  const activeHref = (page: import("@playwright/test").Page) =>
    page.evaluate(() => (document.activeElement as HTMLAnchorElement)?.getAttribute("href") ?? "(none)")

  const trigger = (page: import("@playwright/test").Page, name: RegExp) =>
    page.locator('nav[aria-label="Primary navigation"]').getByRole("button", { name })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test("opens by keyboard, roams by arrows, closes on Escape", async ({ page }) => {
    await page.goto("/")
    const owners = trigger(page, /^Owners/)
    await owners.focus()
    await expect(owners).toHaveAttribute("aria-expanded", "false")

    await page.keyboard.press("Enter")
    await expect(owners).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator(`#${await owners.getAttribute("aria-controls")}`)).toBeVisible()

    await page.keyboard.press("ArrowDown")
    await expect.poll(() => activeHref(page)).toBe("/property-management/")
    await page.keyboard.press("ArrowDown")
    await expect.poll(() => activeHref(page)).toBe("/pricing/")
    // Wraps to the last item rather than escaping the panel.
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect.poll(() => activeHref(page)).toBe("/compare-utah-property-managers/")

    await page.keyboard.press("Escape")
    await expect(owners).toHaveAttribute("aria-expanded", "false")
    await expect(owners, "Escape must return focus to the trigger, not drop it on <body>").toBeFocused()
  })

  test("closed panels are not in the tab order", async ({ page }) => {
    await page.goto("/")
    const links = page.locator('[role="menu"] [role="menuitem"]')
    await expect(links.first()).not.toBeVisible()
    // visibility:hidden, not display:none — the links stay crawlable but must
    // not be focus stops while the panel is shut.
    const focusable = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"]')).filter(
          (el) => (el as HTMLElement).offsetParent !== null,
        ).length,
    )
    expect(focusable).toBe(0)
  })

  test("an open panel introduces no serious violations", async ({ page }) => {
    await page.goto("/")
    const resources = trigger(page, /^Resources/)
    await resources.hover()
    await expect(page.locator(`#${await resources.getAttribute("aria-controls")}`)).toBeVisible()

    const violations = await scanForViolations(page)
    reportViolations("/ with the Resources mega-menu open", violations)
    expect.soft(violations, "Serious/critical a11y violations with a mega-menu open").toEqual([])
  })

  test("panels stay inside the viewport down to the md breakpoint", async ({ page }) => {
    // The 600px Resources panel measured out at x=-185 when it was anchored
    // inside the scrolling nav; it is now clamped against the viewport.
    for (const width of [768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/")
      const resources = trigger(page, /^Resources/)
      await resources.hover()
      const panel = page.locator(`#${await resources.getAttribute("aria-controls")}`)
      await expect(panel).toBeVisible()
      const box = (await panel.boundingBox())!
      expect.soft(box.x, `Resources panel off the left edge at ${width}px`).toBeGreaterThanOrEqual(0)
      expect.soft(box.x + box.width, `Resources panel off the right edge at ${width}px`).toBeLessThanOrEqual(width)
    }
  })
})
