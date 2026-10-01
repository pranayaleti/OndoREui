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
})
