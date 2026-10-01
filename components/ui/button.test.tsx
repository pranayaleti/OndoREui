import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
  it("applies the default 16px icon size only to SVGs without their own sizing", () => {
    render(<Button>Go</Button>)
    const cls = screen.getByRole("button").className
    expect(cls).toContain("[&_svg:not([class*='size-']):not([class*='h-']):not([class*='w-'])]:size-4")
    expect(cls).not.toContain("[&_svg]:size-4")
  })

  // Each variant owns a distinct background/text pair, so swapping two variants fails a test.
  it.each([
    ["default", ["bg-primary", "text-primary-foreground"], ["bg-destructive", "bg-secondary", "border-input"]],
    ["destructive", ["bg-destructive", "text-destructive-foreground"], ["bg-primary", "bg-secondary"]],
    ["outline", ["border", "border-input", "bg-background"], ["bg-primary", "bg-destructive"]],
    ["secondary", ["bg-secondary", "text-secondary-foreground"], ["bg-primary", "bg-destructive"]],
    ["ghost", ["hover:bg-accent"], ["bg-primary", "bg-destructive", "bg-secondary", "border-input"]],
    ["link", ["text-primary", "underline-offset-4", "hover:underline"], ["bg-primary", "bg-secondary"]],
  ] as const)("renders the %s variant with its own classes", (variant, has, lacks) => {
    render(<Button variant={variant}>Go</Button>)
    const button = screen.getByRole("button")
    for (const cls of has) expect(button).toHaveClass(cls)
    for (const cls of lacks) expect(button).not.toHaveClass(cls)
  })

  it.each([
    ["default", ["h-10", "px-4", "py-2"]],
    ["sm", ["h-9", "px-3"]],
    ["lg", ["h-11", "px-8"]],
    ["icon", ["h-10", "w-10"]],
  ] as const)("renders the %s size with its own classes", (size, has) => {
    render(<Button size={size}>Go</Button>)
    const button = screen.getByRole("button")
    for (const cls of has) expect(button).toHaveClass(cls)
  })

  it("lets a caller class override a variant class", () => {
    render(<Button className="bg-red-500">Go</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-red-500")
    expect(screen.getByRole("button")).not.toHaveClass("bg-primary")
  })

  it("renders the child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/contact/">Contact</a>
      </Button>,
    )
    expect(screen.getByRole("link", { name: "Contact" })).toHaveClass("bg-primary")
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
