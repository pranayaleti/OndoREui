import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { DocumentUploader } from "./document-uploader"

vi.mock("@/lib/api/rental", () => ({ uploadRentalDocument: vi.fn().mockResolvedValue({}) }))
import { uploadRentalDocument } from "@/lib/api/rental"

function setup() {
  const onUploaded = vi.fn()
  render(
    <DocumentUploader applicationId="a1" documentType="paystub" label="Pay stub" required onUploaded={onUploaded} />,
  )
  return { input: screen.getByLabelText("Pay stub") as HTMLInputElement, onUploaded }
}

describe("DocumentUploader", () => {
  it("does not force the camera, so phones can pick a PDF or an existing photo", () => {
    const { input } = setup()
    expect(input).not.toHaveAttribute("capture")
    expect(input.accept).toContain("application/pdf")
    expect(input.accept).not.toContain("image/*")
  })

  it("uploads a PDF", async () => {
    const { input, onUploaded } = setup()
    fireEvent.change(input, { target: { files: [new File(["x"], "stub.pdf", { type: "application/pdf" })] } })
    await waitFor(() => expect(onUploaded).toHaveBeenCalled())
    expect(uploadRentalDocument).toHaveBeenCalled()
  })

  it("rejects unsupported file types", () => {
    const { input } = setup()
    fireEvent.change(input, { target: { files: [new File(["x"], "a.gif", { type: "image/gif" })] } })
    expect(screen.getByText(/use a pdf or photo/i)).toBeInTheDocument()
  })
})
