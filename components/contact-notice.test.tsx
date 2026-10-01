import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ContactNotice } from "./contact-notice"

describe("ContactNotice", () => {
  it("says how details are used and links Privacy and Terms", () => {
    render(<ContactNotice />)
    expect(screen.getByText(/will use your details to answer this request/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy/")
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms-of-service/")
  })
})
