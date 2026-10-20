import type { ReactNode } from "react"
import { Fraunces } from "next/font/google"

/**
 * The founder's letter is the one route set in a serif. Declaring the font in this segment
 * layout keeps the files route-scoped (next/font only loads it where this layout applies) and
 * keeps page.tsx importable by the unit tests, which never import layouts.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fl-serif",
})

export default function FoundersLetterLayout({ children }: { children: ReactNode }) {
  return <div className={fraunces.variable}>{children}</div>
}
