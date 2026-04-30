import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import type { Result } from "axe-core"

const routes = [
  "/",
  "/feedback",
  "/founders-letter",
  "/accessibility",
  "/contact",
  "/dashboard",
  // Primary marketing flows
  "/buy",
  "/sell",
  "/properties",
  "/loans",
  "/investments",
  // Auth and portals
  "/login",
  "/tenant",
  "/owner",
  "/platform",
]

test.describe("Accessibility smoke tests", () => {
  for (const route of routes) {
    test(`page ${route} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" })

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

