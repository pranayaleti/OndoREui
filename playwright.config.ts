import { defineConfig, devices } from "@playwright/test"

const a11yBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "http://127.0.0.1:3030"

/**
 * Playwright config for accessibility smoke tests.
 *
 * Starts a mock backend so generateStaticParams does not ECONNREFUSED when
 * OndoREBackend is offline. Uses `next dev` for fast iteration; webpack and
 * JSON-LD fixes in next.config / components suppress dev-server noise.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // Serial workers reduce concurrent route compilation that triggers Next.js 15
  // clientReferenceManifest races in dev.
  workers: 1,
  fullyParallel: false,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command: "node scripts/a11y-mock-backend.mjs",
      url: "http://127.0.0.1:3030/health",
      reuseExistingServer: true,
      timeout: 30_000,
      env: {
        A11Y_MOCK_BACKEND_PORT: "3030",
      },
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_BACKEND_BASE_URL: a11yBackendUrl,
        NEXT_PUBLIC_APP_PORTAL_URL:
          process.env.NEXT_PUBLIC_APP_PORTAL_URL ?? "http://localhost:3001",
      },
    },
  ],
})
