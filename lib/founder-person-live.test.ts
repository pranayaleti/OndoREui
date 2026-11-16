import { describe, it, expect, vi } from "vitest"

vi.mock("./site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./site")>()),
  SITE_RE_LICENSE_NUMBER: "RE-1234567",
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import { founderPersonJsonLd } from "./seo"

describe("founderPersonJsonLd once licensing is live", () => {
  it("adds the license titles, both credentials and both sponsors", () => {
    const person = founderPersonJsonLd(true)
    expect(person.jobTitle).toEqual(["Founder", "Real Estate Agent", "Loan Officer", "Mortgage Loan Originator"])
    expect(person.hasCredential).toEqual([
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Utah real estate sales agent license",
        identifier: "RE-1234567",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Utah Division of Real Estate",
          url: "https://realestate.utah.gov/",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Mortgage loan originator license",
        identifier: "NMLS 2699085",
        recognizedBy: {
          "@type": "Organization",
          name: "Nationwide Multistate Licensing System (NMLS)",
          url: "https://www.nmlsconsumeraccess.org/",
        },
      },
    ])
    expect(person.affiliation).toEqual([
      { "@type": "Organization", name: "Test Realty" },
      { "@type": "Organization", name: "Test Lending", identifier: "NMLS 123456" },
    ])
    // The public NMLS record is the one off-site page that ties the name to the NMLS ID.
    expect(person.sameAs).toEqual(["https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/2699085"])
  })
})
