import type { ComponentType } from "react"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

type IconProps = { className?: string }

export function EqualHousingIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="20"
      height="20"
      aria-hidden="true"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="31" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      {/* House */}
      <path d="M16 32 L32 20 L48 32" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="32" width="24" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Equal sign */}
      <rect x="24" y="36" width="16" height="2.5" fill="currentColor" opacity="0.85" />
      <rect x="24" y="41" width="16" height="2.5" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

export function YelpIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M10.7 2.1c-.7-.3-1.4.2-1.5.9l-.7 6.2c-.1.8.7 1.4 1.4 1.1l3.7-1.6c.7-.3.9-1.2.3-1.7l-3.2-4.9c-.1-.1-.2-.1-.3-.2zM21.5 10.3l-5.9-.9c-.8-.1-1.4.7-1.1 1.4l1.7 3.7c.3.7 1.2.9 1.7.3l4.7-3.3c.6-.4.4-1.3-.1-1.6zM7 11.9l-4.9 3.2c-.6.4-.6 1.3 0 1.7l5.1 3.6c.6.4 1.4 0 1.4-.7l-.2-6.1c0-.8-.9-1.2-1.4-.7zM12.8 14.6l-3.7 1.6c-.7.3-.9 1.2-.3 1.7l3.3 2.3c.6.4 1.4.1 1.6-.6l.6-3.9c.1-.8-.7-1.4-1.5-1.1z"/>
    </svg>
  )
}

export function GoogleBusinessIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3h-3l-.8-2h-2.4l-.8 2h-2.4l-.8-2H7.2L6.4 10H4V7zm0 5h16v5a2 2 0 0 1-2 2h-5v-3h3.2a3.6 3.6 0 1 0 0-3.2H13v-1.8H4V12zM8 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    </svg>
  )
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M14.5 3c.5 1.7 1.8 3.2 3.5 3.9.6.3 1.2.4 1.8.5V9c-1.6-.1-3.1-.7-4.3-1.6v6.1c0 3-2.4 5.5-5.5 5.5S4.5 16.5 4.5 13.5 6.9 8 10 8c.5 0 1 .1 1.5.2v2.5c-.5-.2-1-.3-1.5-.3-1.8 0-3.2 1.5-3.2 3.2s1.5 3.2 3.2 3.2 3.2-1.5 3.2-3.2V3h1.3z"/>
    </svg>
  )
}

export function LinktreeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  )
}

export function PinterestIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      <path fill="currentColor" d="M12 6c-3.314 0-6 2.686-6 6 0 2.25 1.5 4.25 3.5 5.25.25.125.5.25.75.25.5 0 1-.25 1.25-.75.25-.5.25-1 .25-1.5 0-1.25-.5-2.5-1.5-3.5-.5-.5-.75-1.25-.75-2 0-1.5 1-2.5 2.5-2.5.75 0 1.5.25 2 .75.5.5.75 1.25.75 2 0 .75-.25 1.5-.75 2-.5.5-1.25.75-2 .75-.5 0-1-.25-1.25-.75-.25-.5-.25-1-.25-1.5 0-1.25.5-2.5 1.5-3.5.5-.5.75-1.25.75-2 0-1.5-1-2.5-2.5-2.5z"/>
    </svg>
  )
}

export function XIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  )
}

export type SocialPlatform = {
  name: string
  Icon: ComponentType<IconProps>
  /** Brand-tinted hover used by the footer icon row. */
  hoverClass: string
}

/**
 * Matched on hostname (subdomains included), never by substring: "netflix.com"
 * and "dropbox.com" both contain "x.com".
 */
const PLATFORMS: ReadonlyArray<SocialPlatform & { hosts: readonly string[]; paths?: readonly string[] }> = [
  { hosts: ["facebook.com"], name: "Facebook", Icon: Facebook, hoverClass: "hover:text-primary" },
  { hosts: ["youtube.com", "youtu.be"], name: "YouTube", Icon: Youtube, hoverClass: "hover:text-destructive-emphasis" },
  { hosts: ["instagram.com"], name: "Instagram", Icon: Instagram, hoverClass: "hover:text-pink-500" },
  { hosts: ["tiktok.com"], name: "TikTok", Icon: TiktokIcon, hoverClass: "hover:text-fuchsia-500" },
  { hosts: ["linkedin.com"], name: "LinkedIn", Icon: Linkedin, hoverClass: "hover:text-primary" },
  { hosts: ["x.com", "twitter.com"], name: "X", Icon: XIcon, hoverClass: "hover:text-foreground" },
  { hosts: ["pinterest.com"], name: "Pinterest", Icon: PinterestIcon, hoverClass: "hover:text-red-500" },
  { hosts: ["yelp.com"], name: "Yelp", Icon: YelpIcon, hoverClass: "hover:text-red-500" },
  { hosts: ["linktr.ee"], name: "Linktree", Icon: LinktreeIcon, hoverClass: "hover:text-green-500" },
  { hosts: ["g.page"], name: "Google Business", Icon: GoogleBusinessIcon, hoverClass: "hover:text-green-500" },
  {
    hosts: ["google.com"],
    paths: ["/maps", "/business"],
    name: "Google Business",
    Icon: GoogleBusinessIcon,
    hoverClass: "hover:text-green-500",
  },
]

function onHost(hostname: string, host: string): boolean {
  return hostname === host || hostname.endsWith(`.${host}`)
}

export function socialPlatformFor(url: string): SocialPlatform | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const hostname = parsed.hostname.toLowerCase()
  const match = PLATFORMS.find(
    (platform) =>
      platform.hosts.some((host) => onHost(hostname, host)) &&
      (!platform.paths || platform.paths.some((path) => parsed.pathname.startsWith(path))),
  )
  if (!match) return null
  const { name, Icon, hoverClass } = match
  return { name, Icon, hoverClass }
}
