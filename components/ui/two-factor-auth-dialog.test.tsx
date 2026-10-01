import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { TwoFactorAuthDialog } from "./two-factor-auth-dialog"

const { toast, mfa } = vi.hoisted(() => ({
  toast: vi.fn(),
  mfa: {
    enroll: vi.fn(),
    unenroll: vi.fn(),
    listFactors: vi.fn(),
    challenge: vi.fn(),
    verify: vi.fn(),
  },
}))
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }))
vi.mock("@/lib/supabase", () => ({ supabase: { auth: { mfa } } }))

const QR_SVG = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'

beforeEach(() => {
  vi.clearAllMocks()
  mfa.enroll.mockResolvedValue({ data: { id: "f-pending", totp: { qr_code: QR_SVG } }, error: null })
  mfa.unenroll.mockResolvedValue({ data: {}, error: null })
  mfa.challenge.mockResolvedValue({ data: { id: "c1" }, error: null })
  mfa.verify.mockResolvedValue({ data: {}, error: null })
})

describe("TwoFactorAuthDialog disable path", () => {
  it("does not report 2FA as disabled when unenroll fails", async () => {
    mfa.listFactors.mockResolvedValue({
      data: { all: [{ id: "f1", status: "verified" }] },
      error: null,
    })
    mfa.unenroll.mockResolvedValue({ data: null, error: new Error("AAL2 required") })
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()

    render(<TwoFactorAuthDialog open currentValue onOpenChange={onOpenChange} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole("button", { name: "Disable 2FA" }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive", description: "AAL2 required" })
      )
    )
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("confirms once every verified factor is unenrolled", async () => {
    mfa.listFactors.mockResolvedValue({
      data: { all: [{ id: "f1", status: "verified" }, { id: "f2", status: "unverified" }] },
      error: null,
    })
    const onConfirm = vi.fn()

    render(<TwoFactorAuthDialog open currentValue onOpenChange={vi.fn()} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole("button", { name: "Disable 2FA" }))

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith(false))
    expect(mfa.unenroll).toHaveBeenCalledTimes(1)
    expect(mfa.unenroll).toHaveBeenCalledWith({ factorId: "f1" })
  })
})

describe("TwoFactorAuthDialog enroll path", () => {
  it("renders the QR as an image, not injected HTML", async () => {
    render(<TwoFactorAuthDialog open currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />)
    const img = await screen.findByAltText(/QR code/i)
    expect(img.getAttribute("src")).toBe(`data:image/svg+xml;utf-8,${encodeURIComponent(QR_SVG)}`)
    expect(document.querySelector("script")).toBeNull()
  })

  it("unenrolls the pending factor when the dialog is cancelled", async () => {
    const { rerender } = render(
      <TwoFactorAuthDialog open currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />
    )
    await screen.findByAltText(/QR code/i)
    expect(mfa.unenroll).not.toHaveBeenCalled()

    rerender(<TwoFactorAuthDialog open={false} currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />)
    await waitFor(() => expect(mfa.unenroll).toHaveBeenCalledWith({ factorId: "f-pending" }))
  })

  it("unenrolls the pending factor on unmount", async () => {
    const { unmount } = render(
      <TwoFactorAuthDialog open currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />
    )
    await screen.findByAltText(/QR code/i)
    unmount()
    await waitFor(() => expect(mfa.unenroll).toHaveBeenCalledWith({ factorId: "f-pending" }))
  })

  it("keeps the factor after a successful verification", async () => {
    const onConfirm = vi.fn()
    const { rerender } = render(
      <TwoFactorAuthDialog open currentValue={false} onOpenChange={vi.fn()} onConfirm={onConfirm} />
    )
    await screen.findByAltText(/QR code/i)
    fireEvent.change(screen.getByLabelText("Verification Code"), { target: { value: "123456" } })
    fireEvent.click(screen.getByRole("button", { name: "Enable 2FA" }))
    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith(true, "app", "123456"))

    rerender(<TwoFactorAuthDialog open={false} currentValue onOpenChange={vi.fn()} onConfirm={onConfirm} />)
    await new Promise((r) => setTimeout(r, 0))
    expect(mfa.unenroll).not.toHaveBeenCalled()
  })

  it("removes a factor that finished enrolling after the dialog closed", async () => {
    let resolveEnroll: (v: unknown) => void = () => {}
    mfa.enroll.mockReturnValue(new Promise((r) => (resolveEnroll = r)))
    const { rerender } = render(
      <TwoFactorAuthDialog open currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />
    )
    rerender(<TwoFactorAuthDialog open={false} currentValue={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} />)
    resolveEnroll({ data: { id: "late", totp: { qr_code: QR_SVG } }, error: null })
    await waitFor(() => expect(mfa.unenroll).toHaveBeenCalledWith({ factorId: "late" }))
  })
})
