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
  // Dynamic-but-public routes (placeholder slugs covered by generateStaticParams)
  "/properties/_placeholder/",
  // Representative generated dynamic pages with real static params
  "/compare/draper-vs-lehi/",
  "/neighborhoods/draper/suncrest/",
]

test.describe("Accessibility smoke tests", () => {
  for (const route of routes) {
    test(`page ${route} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" })
      // Wait for a stable landmark before axe — avoids flakes when dev Fast Refresh
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

