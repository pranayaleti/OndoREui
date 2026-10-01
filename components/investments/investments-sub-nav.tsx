"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/investments", label: "Overview" },
  { href: "/investments/commercial-real-estate", label: "Commercial" },
  { href: "/investments/fractional", label: "Fractional" },
  { href: "/investments/opportunities", label: "Sample deals" },
  { href: "/investments/opportunity-zones", label: "Opportunity Zones" },
]

/** trailingSlash is on, so usePathname() returns "/investments/"; compare without it. */
function stripTrailingSlash(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path
}

export function isInvestmentsLinkActive(href: string, pathname: string) {
  const current = stripTrailingSlash(pathname)
  return href === "/investments" ? current === href : current === href || current.startsWith(`${href}/`)
}

export function InvestmentsSubNav() {
  const pathname = usePathname() ?? ""

  return (
    <nav
      aria-label="Investment section navigation"
      className="border-b border-border/50 bg-background"
    >
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap gap-1 py-3">
          {links.map((link) => {
            const isActive = isInvestmentsLinkActive(link.href, pathname)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-block px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
