import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { join } from "node:path"
import type { SocialLink } from "@/lib/site"
import { LINKS_PAGE_SECTIONS, linksPageSocials } from "@/lib/links-page"

const APP = join(__dirname, "..", "app")
const allLinks = LINKS_PAGE_SECTIONS.flatMap((section) => section.links)
const sitePaths = allLinks.filter((link) => link.href.startsWith("/"))
const offSite = allLinks.filter((link) => !link.href.startsWith("/"))

describe("/links config", () => {
  // Social bios point here, so a renamed route would 404 for every follower who taps it.
  it.each(sitePaths.map((link) => [link.id, link.href]))(
    "%s points at a route that exists (%s)",
    (_id, href) => {
      const route = href.split(/[?#]/)[0]!.replace(/^\/+|\/+$/g, "")
      expect(existsSync(join(APP, route, "page.tsx")), `app/${route}/page.tsx is missing`).toBe(true)
    },
  )

  // Without a scheme, "calendly.com/x" resolves relative to /links/ and 404s on our own domain.
  it.each(offSite.map((link) => [link.id, link.href]))(
    "%s leaves the site through an absolute http(s) URL (%s)",
    (_id, href) => {
      expect(() => new URL(href)).not.toThrow()
      expect(["https:", "http:"]).toContain(new URL(href).protocol)
    },
  )

  it("never reuses an analytics id, so per-link click counts stay separate", () => {
    const ids = allLinks.map((link) => link.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("linksPageSocials", () => {
  it("drops accounts that are not live yet", () => {
    const profiles: SocialLink[] = [
      { url: "https://www.instagram.com/OnDoRealEstate", live: true },
      { url: "https://www.facebook.com/OnDoRealEstate", live: false },
      { url: "https://www.youtube.com/@OnDoRealEstate", live: true },
    ]
    expect(linksPageSocials(profiles)).toEqual([
      "https://www.instagram.com/OnDoRealEstate",
      "https://www.youtube.com/@OnDoRealEstate",
    ])
  })

  it("drops Linktree even when live, since it now forwards to this page", () => {
    const profiles: SocialLink[] = [
      { url: "https://linktr.ee/ondorealestate", live: true },
      { url: "https://x.com/OnDoRealEstate", live: true },
    ]
    expect(linksPageSocials(profiles)).toEqual(["https://x.com/OnDoRealEstate"])
  })
})
