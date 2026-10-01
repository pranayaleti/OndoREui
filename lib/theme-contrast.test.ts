// @vitest-environment node
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import tailwindConfig from "../tailwind.config"

const css = readFileSync(join(__dirname, "..", "src/styles/_design-tokens.css"), "utf8")

/** Body of the first rule whose selector is exactly `selector`. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`no ${selector} block`)
  return css.slice(start, css.indexOf("\n}", start))
}

function hslToken(body: string, name: string): [number, number, number] {
  const m = body.match(new RegExp(`--${name}:\\s*([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%`))
  if (!m) throw new Error(`token --${name} not found`)
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function toRgb([h, s, l]: [number, number, number]): [number, number, number] {
  const sat = s / 100
  const light = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0), f(8), f(4)]
}

function luminance(hsl: [number, number, number]): number {
  const [r, g, b] = toRgb(hsl).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe.each([
  ["light", block(":root")],
  ["dark", block(".dark")],
])("%s theme text contrast (WCAG 1.4.3)", (_theme, body) => {
  const surfaces = ["background", "card", "muted"] as const

  it.each(surfaces)("brand text (--primary-text) is at least 4.5:1 on --%s", (surface) => {
    expect(contrast(hslToken(body, "primary-text"), hslToken(body, surface))).toBeGreaterThanOrEqual(4.5)
  })

  it.each(surfaces)("--muted-foreground is at least 4.5:1 on --%s", (surface) => {
    expect(contrast(hslToken(body, "muted-foreground"), hslToken(body, surface))).toBeGreaterThanOrEqual(4.5)
  })

  it("black text on the brand fill (--primary-foreground on --primary) is at least 4.5:1", () => {
    expect(contrast(hslToken(body, "primary-foreground"), hslToken(body, "primary"))).toBeGreaterThanOrEqual(4.5)
  })
})

describe("light theme brand orange", () => {
  it("keeps the orange fill for backgrounds and rings; only text uses the darker token", () => {
    const light = block(":root")
    // The raw fill orange is the reason --primary-text exists: it is below 4.5:1 as text on the page.
    expect(contrast(hslToken(light, "primary"), hslToken(light, "background"))).toBeLessThan(4.5)
    expect(hslToken(light, "primary-text")).not.toEqual(hslToken(light, "primary"))
    expect(hslToken(block(".dark"), "primary-text")).toEqual(hslToken(block(".dark"), "primary"))
  })

  it("wires text-primary to --primary-text without recolouring bg-/border-/ring- utilities", () => {
    const colors = tailwindConfig.theme.extend.colors as unknown as { primary: { DEFAULT: string } }
    const textColor = tailwindConfig.theme.extend.textColor
    expect(colors.primary.DEFAULT).toBe("hsl(var(--primary))")
    expect(textColor.primary.DEFAULT).toBe("hsl(var(--primary-text))")
    // text-primary-foreground (black on the orange fill) must keep resolving.
    expect(textColor.primary.foreground).toBe("hsl(var(--primary-foreground))")
  })
})
