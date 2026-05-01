import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright config for accessibility smoke tests.
 *
 * The tests use relative routes (e.g. page.goto("/contact")), so baseURL must
 * be defined. The webServer starts Next in dev mode for local/CI runs and
 * reuses an existing server when one is already available.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://localhost:3030",
      NEXT_PUBLIC_APP_PORTAL_URL: process.env.NEXT_PUBLIC_APP_PORTAL_URL ?? "http://localhost:3001",
    },
  },
})
