import { describe, expect, it, vi } from "vitest"
import i18n from "./i18n"

describe("i18n", () => {
  it("serves the bundled English strings without any network backend", async () => {
    await vi.waitFor(() => expect(i18n.isInitialized).toBe(true))
    expect(i18n.hasLoadedNamespace("common")).toBe(true)
    expect(i18n.t("nav.search")).not.toBe("nav.search")
    // No backend plugin is registered, so nothing can fetch /locales/*.json at runtime.
    expect((i18n.modules as { backend?: unknown }).backend).toBeUndefined()
  })
})
