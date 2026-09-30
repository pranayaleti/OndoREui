import { describe, it, expect } from "vitest"
import { GET } from "./route"

describe("/ondo-real-estate.vcf", () => {
  it("serves a contact card built from the site's own phone, email and photo", async () => {
    const response = GET()
    expect(response.headers.get("content-type")).toContain("text/vcard")
    const card = (await response.text()).replace(/\r\n /g, "")
    expect(card).toContain("FN:Pranay Reddy Aleti")
    expect(card).toContain("TEL;TYPE=CELL,VOICE:+14085380420")
    expect(card).toContain("EMAIL;TYPE=INTERNET:info@ondorealestate.com")
    expect(card).toContain("URL:https://www.ondorealestate.com/links/")
    expect(card).toMatch(/PHOTO;ENCODING=b;TYPE=JPEG:\/9j\//)
  })
})
