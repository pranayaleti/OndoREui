import { describe, expect, it } from "vitest"
import { isSystemAccountContact, listingAgents } from "./listing-presentation"

const company = { companyPhone: "(801) 555-0100", companyEmail: "info@example.com" }

describe("listingAgents", () => {
  it("falls back to the Ondo leasing team for a placeholder 'Admin User' manager", () => {
    const [agent, ...rest] = listingAgents({
      manager: { firstName: "Admin", lastName: "User", email: "admin@ondorealestate.com" },
      ...company,
    })
    expect(rest).toHaveLength(0)
    expect(agent).toMatchObject({ name: "Ondo Real Estate Leasing", title: "Leasing team", email: company.companyEmail })
  })

  it("ignores system-looking names for manager and owner", () => {
    for (const firstName of ["Admin", "Administrator", "Test", "System", "User"]) {
      const [agent] = listingAgents({
        manager: { firstName, lastName: "Account" },
        owner: { firstName, lastName: "Account" },
        ...company,
      })
      expect(agent?.name).toBe("Ondo Real Estate Leasing")
    }
  })

  it("ignores a real-looking name when the email is a system address", () => {
    for (const email of ["admin@x.com", "noreply@x.com", "test@x.com"]) {
      const [agent] = listingAgents({
        manager: { firstName: "Jordan", lastName: "Lee", email },
        ...company,
      })
      expect(agent?.name).toBe("Ondo Real Estate Leasing")
      expect(agent?.email).toBe(company.companyEmail)
    }
  })

  it("skips a system manager but still uses a real owner", () => {
    const [agent] = listingAgents({
      manager: { firstName: "Admin", lastName: "User" },
      owner: { firstName: "Jordan", lastName: "Lee" },
      ...company,
    })
    expect(agent?.name).toBe("Jordan Lee")
  })

  it("keeps a real named manager and does not over-match names that merely start with the same letters", () => {
    const [agent] = listingAgents({
      manager: { firstName: "Adminah", lastName: "Cole", email: "adminah@x.com" },
      ...company,
    })
    expect(agent?.name).toBe("Adminah Cole")
    expect(agent?.email).toBe("adminah@x.com")
  })
})

describe("isSystemAccountContact", () => {
  it("is false for empty or real contacts", () => {
    expect(isSystemAccountContact(null)).toBe(false)
    expect(isSystemAccountContact({ firstName: "Jordan", lastName: "Lee", email: "jordan@x.com" })).toBe(false)
  })
})
