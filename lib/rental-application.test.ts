import { beforeEach, describe, expect, it } from "vitest"
import {
  adultProgressFromListRow,
  addEmploymentRecord,
  addResidence,
  emptyEmploymentRecord,
  emptyPetAnimal,
  emptyResidence,
  forgetRentalApplication,
  readStoredApplications,
  rememberRentalApplication,
  STORED_APPLICATION_TTL_MS,
  employmentRecordsForEdit,
  hasNoChargeablePets,
  householdOccupantsForEdit,
  petAnimalsForEdit,
  removeEmploymentRecord,
  removeResidence,
  residencesForEdit,
  restoreChargeablePetRow,
  setNoChargeablePets,
  updateEmploymentRecord,
  updateResidence,
} from "./rental-application"

describe("adultProgressFromListRow", () => {
  it("uses completed/required counts when the list payload already has them", () => {
    expect(adultProgressFromListRow({ completedAdultApplicants: 1, requiredAdults: 2 })).toBe(
      "1 of 2 applicants completed",
    )
  })

  it("falls back to coApplicantSummary and returns null when missing", () => {
    expect(adultProgressFromListRow({ coApplicantSummary: "1 of 2 applicants completed" })).toBe(
      "1 of 2 applicants completed",
    )
    expect(adultProgressFromListRow({})).toBeNull()
  })
})

describe("household occupants", () => {
  it("keeps multiple extra occupants instead of a single row", () => {
    const occupants = [
      { fullName: "Ada Browser", relationship: "partner", isAdult: true },
      { fullName: "Charles Babbage", relationship: "roommate", isAdult: true },
    ]
    expect(householdOccupantsForEdit({ household: { occupants } })).toEqual(occupants)
  })
})

describe("pet animals", () => {
  it("keeps an explicit empty list for no pets and starts with one empty row otherwise", () => {
    expect(petAnimalsForEdit({ pets: { animals: [] } })).toEqual([])
    expect(petAnimalsForEdit({})).toEqual([emptyPetAnimal()])
  })

  it("keeps assistance animals when marking no pets", () => {
    const payload = {
      pets: {
        animals: [
          { name: "Miso", type: "cat", isAssistanceAnimal: false },
          { name: "Guide", type: "dog", isAssistanceAnimal: true },
        ],
      },
    }
    const none = setNoChargeablePets(payload)
    expect(hasNoChargeablePets(none)).toBe(true)
    expect(none.pets?.animals).toEqual([{ name: "Guide", type: "dog", isAssistanceAnimal: true }])
    expect(restoreChargeablePetRow(none).pets?.animals?.[1]).toEqual(emptyPetAnimal())
  })
})

describe("employment records", () => {
  it("starts with one empty job and keeps multiple saved jobs", () => {
    expect(employmentRecordsForEdit({})).toEqual([emptyEmploymentRecord()])
    const records = [
      { employer: "Acme", title: "Engineer", duration: "3 years", monthlyIncomeCents: 700000 },
      { employer: "Ada Consulting", title: "Owner", duration: "1 year", selfEmployed: true, monthlyIncomeCents: 200000 },
    ]
    expect(employmentRecordsForEdit({ employment: { records } })).toEqual(records)
  })

  it("adds, updates, and removes jobs without replacing the first", () => {
    const first = { employer: "Acme", title: "Engineer", duration: "3 years", monthlyIncomeCents: 700000 }
    const next = addEmploymentRecord({ employment: { records: [first] } })
    expect(next.employment?.records).toEqual([first, emptyEmploymentRecord()])
    const updated = updateEmploymentRecord(next, 1, { employer: "Ada Consulting", selfEmployed: true })
    expect(updated.employment?.records?.[0]?.employer).toBe("Acme")
    expect(updated.employment?.records?.[1]).toMatchObject({
      employer: "Ada Consulting",
      selfEmployed: true,
    })
    expect(removeEmploymentRecord(updated, 1).employment?.records).toEqual([first])
  })
})

describe("rental history residences", () => {
  it("starts with one empty tenancy and keeps multiple saved addresses", () => {
    expect(residencesForEdit({})).toEqual([emptyResidence()])
    const residences = [
      {
        address: "1 Main St",
        landlordName: "Prior LLC",
        landlordPhone: "8015550100",
        startDate: "2022-01-01",
        endDate: "2024-06-01",
      },
      {
        address: "2 Oak Ave",
        landlordName: "Oak Properties",
        landlordPhone: "8015550199",
        startDate: "2024-06-15",
        endDate: null,
      },
    ]
    expect(residencesForEdit({ rentalHistory: { residences } })).toEqual(residences)
  })

  it("adds, updates, and removes tenancies without replacing the first", () => {
    const first = { address: "1 Main St", landlordName: "Prior LLC", startDate: "2022-01-01" }
    const next = addResidence({ rentalHistory: { residences: [first] } })
    expect(next.rentalHistory?.residences).toEqual([first, emptyResidence()])
    const updated = updateResidence(next, 1, { address: "2 Oak Ave", landlordPhone: "8015550199" })
    expect(updated.rentalHistory?.residences?.[0]?.address).toBe("1 Main St")
    expect(updated.rentalHistory?.residences?.[1]).toMatchObject({
      address: "2 Oak Ave",
      landlordPhone: "8015550199",
    })
    expect(removeResidence(updated, 1).rentalHistory?.residences).toEqual([first])
  })
})

describe("stored resume tokens", () => {
  const entry = (id: string, updatedAt: string) => ({ id, resumeToken: `tok-${id}`, propertyId: "p1", updatedAt })

  beforeEach(() => {
    localStorage.clear()
  })

  it("keeps a recently saved application and returns it", () => {
    rememberRentalApplication(entry("a", new Date().toISOString()))
    expect(readStoredApplications().map((row) => row.id)).toEqual(["a"])
  })

  it("prunes applications older than the expiry, and rows with no usable date, from storage", () => {
    const now = Date.now()
    const stale = new Date(now - STORED_APPLICATION_TTL_MS - 1000).toISOString()
    localStorage.setItem(
      "ondo.rental.applications",
      JSON.stringify([entry("old", stale), entry("new", new Date(now).toISOString()), { id: "legacy", resumeToken: "t" }]),
    )
    expect(readStoredApplications(now).map((row) => row.id)).toEqual(["new"])
    const saved = JSON.parse(localStorage.getItem("ondo.rental.applications") ?? "[]") as { id: string }[]
    expect(saved.map((row) => row.id)).toEqual(["new"])
  })

  it("forgets one application on submit or withdrawal and removes the key when none are left", () => {
    rememberRentalApplication(entry("a", new Date().toISOString()))
    rememberRentalApplication(entry("b", new Date().toISOString()))
    forgetRentalApplication("a")
    expect(readStoredApplications().map((row) => row.id)).toEqual(["b"])
    forgetRentalApplication("b")
    expect(localStorage.getItem("ondo.rental.applications")).toBeNull()
  })
})
