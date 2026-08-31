import { existsSync } from "node:fs"
import { defineConfig, devices } from "@playwright/test"

const STATIC_EXPORT_DIR = "out"

/**
 * Playwright config for accessibility smoke tests.
 *
 * Runs against the built static export — the artifact that actually ships.
 *
 * This previously served `next dev`, which tested a build no user ever sees and
 * was wrong in both directions: it missed a production-only colour-contrast
 * failure on /properties, and it invented a failure on /properties/_placeholder/
 * (a build-time stub that only exists in the export, so dev threw
 * "missing param in generateStaticParams()" instead of rendering a page).
 *
 * A mock backend still runs on :3030 because the exported listing pages fetch
 * /api/properties/public client-side; `.env` points NEXT_PUBLIC_BACKEND_BASE_URL
 * at that port, so the bundle calls the mock rather than a real API.
 */
if (!existsSync(STATIC_EXPORT_DIR)) {
  throw new Error(
    `Accessibility tests run against the static export, but ./${STATIC_EXPORT_DIR} is missing. ` +
      "Run `npm run build` first (CI builds before this step).",
  )
}
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
      command: `npx --yes serve@14 ${STATIC_EXPORT_DIR} -l 3000 --no-clipboard`,
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
