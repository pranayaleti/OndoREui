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

  it("rejects a file over 10 MB without uploading it", () => {
    vi.mocked(uploadRentalDocument).mockClear()
    const { input, onUploaded } = setup()
    const big = new File(["x"], "scan.pdf", { type: "application/pdf" })
    Object.defineProperty(big, "size", { value: 10 * 1024 * 1024 + 1 })
    fireEvent.change(input, { target: { files: [big] } })
    expect(screen.getByRole("alert")).toHaveTextContent(/10 MB or smaller/i)
    expect(uploadRentalDocument).not.toHaveBeenCalled()
    expect(onUploaded).not.toHaveBeenCalled()
  })

  it("accepts a file of exactly 10 MB", async () => {
    vi.mocked(uploadRentalDocument).mockClear()
    const { input, onUploaded } = setup()
    const edge = new File(["x"], "scan.pdf", { type: "application/pdf" })
    Object.defineProperty(edge, "size", { value: 10 * 1024 * 1024 })
    fireEvent.change(input, { target: { files: [edge] } })
    await waitFor(() => expect(onUploaded).toHaveBeenCalled())
  })

  it("does not upload an unsupported type", () => {
    vi.mocked(uploadRentalDocument).mockClear()
    const { input } = setup()
    fireEvent.change(input, { target: { files: [new File(["x"], "a.gif", { type: "image/gif" })] } })
    expect(uploadRentalDocument).not.toHaveBeenCalled()
  })

  it("shows the server's message and does not report success when the upload fails", async () => {
    vi.mocked(uploadRentalDocument).mockRejectedValueOnce(new Error("Upload was blocked"))
    const { input, onUploaded } = setup()
    fireEvent.change(input, { target: { files: [new File(["x"], "stub.pdf", { type: "application/pdf" })] } })
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload was blocked")
    expect(onUploaded).not.toHaveBeenCalled()
    expect(input).toBeEnabled()
  })
})
