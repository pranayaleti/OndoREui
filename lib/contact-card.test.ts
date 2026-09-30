import { describe, it, expect } from "vitest"
import { buildContactCard, type ContactCardInput } from "@/lib/contact-card"

const input: ContactCardInput = {
  givenName: "Pranay Reddy",
  familyName: "Aleti",
  organization: "Ondo Real Estate",
  title: "Founder",
  phone: "+14085380420",
  email: "info@ondorealestate.com",
  url: "https://www.ondorealestate.com/links/",
  address: { street: "2701 N Thanksgiving Way", city: "Lehi", region: "UT", postalCode: "84043", country: "US" },
  note: "Buy, sell, finance and manage property in Utah; call or text anytime.",
}

describe("buildContactCard", () => {
  it("writes a vCard 3.0 that phones import as one contact", () => {
    const lines = buildContactCard(input).split("\r\n")
    expect(lines[0]).toBe("BEGIN:VCARD")
    expect(lines[1]).toBe("VERSION:3.0")
    expect(lines).toContain("N:Aleti;Pranay Reddy;;;")
    expect(lines).toContain("FN:Pranay Reddy Aleti")
    expect(lines).toContain("ORG:Ondo Real Estate")
    expect(lines).toContain("TITLE:Founder")
    expect(lines).toContain("TEL;TYPE=CELL,VOICE:+14085380420")
    expect(lines).toContain("EMAIL;TYPE=INTERNET:info@ondorealestate.com")
    expect(lines).toContain("URL:https://www.ondorealestate.com/links/")
    expect(lines).toContain("ADR;TYPE=WORK:;;2701 N Thanksgiving Way;Lehi;UT;84043;US")
    expect(lines.at(-2)).toBe("END:VCARD")
    expect(lines.at(-1)).toBe("")
  })

  // Unescaped commas and semicolons split a value into the wrong fields on import.
  it("escapes commas and semicolons inside text values", () => {
    const unfolded = buildContactCard(input).replace(/\r\n /g, "")
    expect(unfolded).toContain("NOTE:Buy\\, sell\\, finance and manage property in Utah\\; call or text anytime.")
  })

  it("folds lines longer than 75 characters, as the format requires, so a photo survives import", () => {
    const card = buildContactCard({ ...input, photoJpegBase64: "A".repeat(300) })
    const lines = card.split("\r\n")
    expect(lines.every((line) => line.length <= 75)).toBe(true)
    const photoStart = lines.findIndex((line) => line.startsWith("PHOTO;ENCODING=b;TYPE=JPEG:"))
    expect(photoStart).toBeGreaterThan(-1)
    expect(lines[photoStart + 1]!.startsWith(" ")).toBe(true)
    const unfolded = card.replace(/\r\n /g, "")
    expect(unfolded).toContain(`PHOTO;ENCODING=b;TYPE=JPEG:${"A".repeat(300)}`)
  })
})
