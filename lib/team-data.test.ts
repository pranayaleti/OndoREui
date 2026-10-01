import { describe, it, expect } from "vitest"
import { teamMembers, getTeam, findTeamMemberBySlug } from "./team-data"

describe("team-data", () => {
  it("lists only the founder", () => {
    expect(teamMembers.map((m) => m.name)).toEqual(["Pranay Reddy Aleti"])
    expect(getTeam()).toBe(teamMembers)
  })

  it("does not carry titles, credentials or contact details that cannot be verified", () => {
    const blob = JSON.stringify(teamMembers)
    expect(blob).not.toMatch(/NMLS|license|certif|CPA|years? (of )?experience/i)
    expect(blob).not.toMatch(/mortgage advisor|loan officer/i)
    for (const member of teamMembers) {
      expect(member.title).toBe("Founder")
      // No stock photos and no personal mailbox that is not in SITE_EMAILS.
      expect(member).not.toHaveProperty("image")
      expect(member).not.toHaveProperty("email")
    }
  })

  it("finds a member by slug and returns undefined for the removed fictional staff", () => {
    expect(findTeamMemberBySlug("pranay-reddy-aleti")?.name).toBe("Pranay Reddy Aleti")
    for (const slug of ["marcus-thompson", "sarah-kim", "jennifer-nakamura", "david-patel"]) {
      expect(findTeamMemberBySlug(slug)).toBeUndefined()
    }
  })
})
