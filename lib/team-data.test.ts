import { describe, it, expect } from "vitest"
import { teamMembers } from "./team-data"

describe("team-data licenses", () => {
  it("does not publish a placeholder NMLS number as a real license", () => {
    const blob = JSON.stringify(teamMembers)
    expect(blob).not.toMatch(/NMLS\s*#?\s*123456/i)
    for (const member of teamMembers) {
      if (member.licenseNumber) {
        expect(member.licenseNumber).not.toMatch(/\d{3,}/)
      }
    }
  })
})
