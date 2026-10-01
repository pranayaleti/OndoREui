import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import enCommon from "@/public/locales/en/common.json"

vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))
vi.mock("@/components/seo", () => ({ default: () => null }))
vi.mock("react-i18next", () => {
  function translate(key: string): string {
    let node: unknown = enCommon
    for (const segment of key.split(".")) {
      if (node && typeof node === "object" && segment in (node as object)) {
        node = (node as Record<string, unknown>)[segment]
      } else {
        return key
      }
    }
    return typeof node === "string" ? node : key
  }
  return { useTranslation: () => ({ t: translate, i18n: {} }) }
})

import { AffiliateContent } from "./affiliate-content"

const originalFetch = global.fetch

function fill(website: string) {
  fireEvent.change(screen.getByLabelText(/full name|^name/i), { target: { value: "Sam Lee" } })
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "sam@example.com" } })
  fireEvent.change(document.getElementById("aff-website") as HTMLInputElement, { target: { value: website } })
  fireEvent.change(document.getElementById("aff-why") as HTMLTextAreaElement, { target: { value: "I run a rental blog" } })
  fireEvent.click(screen.getByRole("button", { name: enCommon.affiliate.submitBtn }))
}

describe("AffiliateContent application form", () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({}) })) as unknown as typeof fetch
  })
  afterEach(() => {
    global.fetch = originalFetch
  })

  it("sends why as motivation and normalizes a bare domain", async () => {
    render(<AffiliateContent />)
    fill("instagram.com/myhandle")
    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    const [url, init] = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit]
    expect(url).toBe("http://backend.test/api/referrals/affiliate/apply")
    expect(JSON.parse(String(init.body))).toMatchObject({
      name: "Sam Lee",
      email: "sam@example.com",
      website: "https://instagram.com/myhandle",
      motivation: "I run a rental blog",
    })
    expect(JSON.parse(String(init.body))).not.toHaveProperty("why")
    expect(await screen.findByText(enCommon.affiliate.successTitle)).toBeInTheDocument()
  })

  it("shows the API's message, not the generic error, when the request fails", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      json: async () => ({ message: "Validation error" }),
    })) as unknown as typeof fetch
    render(<AffiliateContent />)
    fill("@sam")
    expect(await screen.findByRole("alert")).toHaveTextContent("Validation error")
  })

  it("links field errors to their inputs", async () => {
    render(<AffiliateContent />)
    fireEvent.click(screen.getByRole("button", { name: enCommon.affiliate.submitBtn }))
    const email = await waitFor(() => {
      const el = document.getElementById("aff-email") as HTMLInputElement
      expect(el).toHaveAttribute("aria-invalid", "true")
      return el
    })
    expect(email).toHaveAttribute("aria-describedby", "aff-email-error")
    expect(document.getElementById("aff-email-error")).toHaveAttribute("role", "alert")
  })
})
