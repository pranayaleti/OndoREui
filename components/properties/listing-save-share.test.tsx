import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ListingSaveShare } from "./listing-save-share"

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock("@/lib/api/properties", () => ({
  getFavoritePropertyIds: vi.fn(),
  toggleFavoriteProperty: vi.fn(),
}))

import { getFavoritePropertyIds, toggleFavoriteProperty } from "@/lib/api/properties"

const getFavorites = vi.mocked(getFavoritePropertyIds)
const toggleFavorite = vi.mocked(toggleFavoriteProperty)

describe("ListingSaveShare", () => {
  afterEach(() => {
    getFavorites.mockReset()
    toggleFavorite.mockReset()
  })

  it("saves a listing to the existing favorites list", async () => {
    getFavorites.mockResolvedValue([])
    toggleFavorite.mockResolvedValue(["pub-1"])
    render(<ListingSaveShare publicId="pub-1" title="Cedar Hollow" />)

    const save = await screen.findByRole("button", { name: /^save$/i })
    fireEvent.click(save)

    await waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith("pub-1")
    })
    expect(await screen.findByRole("button", { name: /^saved$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("copies the listing link when native share is unavailable", async () => {
    getFavorites.mockResolvedValue([])
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    // @ts-expect-error — jsdom may already define share
    navigator.share = undefined

    render(<ListingSaveShare publicId="pub-1" title="Cedar Hollow" />)
    fireEvent.click(await screen.findByRole("button", { name: /share/i }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled()
    })
  })
})
