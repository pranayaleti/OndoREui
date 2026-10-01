import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"

const themeProps = vi.fn()
vi.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode }) => {
    themeProps(props)
    return <>{children}</>
  },
}))
vi.mock("@/components/theme-color-sync", () => ({ ThemeColorSync: () => null }))
vi.mock("@/components/ui/toaster", () => ({ Toaster: () => null }))
vi.mock("@/components/bfcache-provider", () => ({ BfcacheProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock("@/components/i18n-provider", () => ({ I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock("@/components/pwa/pwa-provider", () => ({ PwaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock("@/components/web-vitals-reporter", () => ({ WebVitalsReporter: () => null }))

import { RootProviders } from "./root-providers"

describe("RootProviders theme", () => {
  it("defaults to dark and honours the System option instead of forcing light", () => {
    render(<RootProviders>x</RootProviders>)
    expect(themeProps).toHaveBeenCalledWith(
      expect.objectContaining({ attribute: "class", defaultTheme: "dark", enableSystem: true }),
    )
  })
})
