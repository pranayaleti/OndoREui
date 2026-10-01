import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import Header from "./header"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    priority,
    loading,
    fetchPriority,
  }: {
    alt: string
    src: string
    priority?: boolean
    loading?: string
    fetchPriority?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={src}
      data-priority={priority ? "true" : undefined}
      data-loading={loading}
      data-fetchpriority={fetchPriority}
    />
  ),
}))
vi.mock("@/components/mode-toggle", () => ({ ModeToggle: () => <button type="button">Theme</button> }))
vi.mock("@/components/navigation", () => ({
  Navigation: ({ items, className }: { items: Array<{ href: string }>; className?: string }) => (
    <nav aria-label="Site links" className={className}>
      {items.slice(0, 1).map((i) => (
        <a key={i.href} href={i.href}>
          link
        </a>
      ))}
    </nav>
  ),
  allNavigationItems: [{ href: "/buy", labelKey: "nav.buy" }],
  overflowNavigationItems: [],
  primaryNavigationItems: [{ href: "/buy", labelKey: "nav.buy" }],
}))

beforeAll(() => {
  // cmdk scrolls the selected item into view.
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
  document.body.style.overflow = ""
})

const openMenu = async () => {
  render(<Header />)
  const toggle = screen.getByRole("button", { name: "Open navigation menu" })
  fireEvent.click(toggle)
  const menu = await screen.findByRole("navigation", { name: "Mobile navigation" })
  return { toggle: screen.getByRole("button", { name: "Close navigation menu" }), menu }
}

describe("Header mobile menu", () => {
  it("renders as a labelled nav landmark, with login links that are real links", async () => {
    const { menu } = await openMenu()
    expect(menu.tagName).toBe("NAV")
    expect(menu).not.toHaveAttribute("role")
    expect(menu.className).toContain("100dvh")
    expect(menu.className).not.toContain("100vh")
    expect(screen.getByRole("link", { name: "nav.ownerLogin" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "nav.tenantLogin" })).toBeInTheDocument()
    expect(menu.querySelector("a button")).toBeNull()
  })

  it("moves focus into the menu on open and locks page scroll until it closes", async () => {
    const { toggle } = await openMenu()
    expect(screen.getByRole("button", { name: "nav.search" })).toHaveFocus()
    expect(document.body.style.overflow).toBe("hidden")

    fireEvent.click(toggle)
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull())
    expect(document.body.style.overflow).toBe("")
  })

  it("returns focus to the toggle when Escape closes the menu", async () => {
    await openMenu()
    fireEvent.keyDown(document, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull())
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveFocus()
  })

  it("keeps Tab inside the open menu", async () => {
    const { toggle } = await openMenu()
    const links = screen.getAllByRole("link")
    const last = links[links.length - 1]!
    last.focus()
    fireEvent.keyDown(last, { key: "Tab" })
    expect(toggle).toHaveFocus()

    fireEvent.keyDown(toggle, { key: "Tab", shiftKey: true })
    expect(document.activeElement).toBe(last)
  })

  it("does not reopen the menu when the toggle itself is pressed to close it", async () => {
    const { toggle } = await openMenu()
    fireEvent.mouseDown(toggle)
    fireEvent.click(toggle)
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull())
  })
})

describe("Header search focus return", () => {
  it("returns focus to the toggle after searching from the mobile menu", async () => {
    await openMenu()
    fireEvent.click(screen.getByRole("button", { name: "nav.search" }))
    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveFocus())
  })

  it("returns focus to the Search button after closing the dialog", async () => {
    render(<Header />)
    const searchButton = screen.getByRole("button", { name: "Search" })
    fireEvent.click(searchButton)
    const dialog = await screen.findByRole("dialog")

    fireEvent.keyDown(dialog, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(searchButton).toHaveFocus())
  })

  it("leaves focus handling to Radix when opened with the keyboard shortcut", async () => {
    render(<Header />)
    await act(async () => {
      fireEvent.keyDown(window, { key: "k", ctrlKey: true })
    })
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })
})

describe("Header layout classes", () => {
  it("centres the primary nav with mx-auto, not justify-center, so Buy and Sell never clip behind the logo", () => {
    render(<Header />)
    const scroller = screen.getByRole("navigation", { name: "Primary navigation" })
    expect(scroller.className).toContain("overflow-x-auto")
    expect(scroller.className).not.toContain("justify-center")
    const list = screen.getByRole("navigation", { name: "Site links" })
    expect(list.className).toContain("w-max")
    expect(list.className).toContain("mx-auto")
    expect(list.className).not.toContain("justify-center")
  })

  it("right-aligns the controls and gives the hamburger a 44px target", () => {
    render(<Header />)
    const toggle = screen.getByRole("button", { name: "Open navigation menu" })
    expect(toggle.className).toContain("min-h-11")
    expect(toggle.className).toContain("min-w-11")
    expect(toggle.parentElement?.className).toContain("ml-auto")
  })
})

describe("Header logo", () => {
  it("uses the small WebP wordmarks, never the 77KB PNGs", () => {
    const { container } = render(<Header />)
    const srcs = Array.from(container.querySelectorAll("img")).map((img) => img.getAttribute("src"))
    expect(srcs).toEqual(["/logo-light-2x.webp", "/logo-dark-2x.webp"])
  })

  it("preloads only the default (dark) wordmark and loads the hidden light one at low priority", () => {
    const { container } = render(<Header />)
    const light = container.querySelector('img[src="/logo-light-2x.webp"]')!
    const dark = container.querySelector('img[src="/logo-dark-2x.webp"]')!
    expect(dark).toHaveAttribute("data-priority", "true")
    expect(light).not.toHaveAttribute("data-priority")
    expect(light).toHaveAttribute("data-loading", "eager")
    expect(light).toHaveAttribute("data-fetchpriority", "low")
  })
})
