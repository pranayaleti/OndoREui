import { readFileSync } from "fs"
import { join } from "path"
import { describe, it, expect } from "vitest"

const authPage = readFileSync(join(process.cwd(), "app/auth/page.tsx"), "utf8")
const rootProviders = readFileSync(join(process.cwd(), "components/root-providers.tsx"), "utf8")

describe("auth stripped from OndoREui", () => {
  it("app/auth/page.tsx does not import useAuth", () => {
    expect(authPage).not.toContain("useAuth")
  })
  it("app/auth/page.tsx uses redirect", () => {
    expect(authPage).toContain("redirect")
  })
  it("root-providers.tsx does not import AuthProvider", () => {
    expect(rootProviders).not.toContain("AuthProvider")
  })
})
