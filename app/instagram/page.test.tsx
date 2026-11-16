import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { InstagramFeedView } from "@/components/instagram/instagram-feed-view"
import type { InstagramFeed } from "@/lib/instagram-feed"
import { metadata } from "./page"

const feed: InstagramFeed = {
  fetchedAt: "2026-10-20T12:00:00.000Z",
  posts: [
    {
      id: "17890000000000001",
      permalink: "https://www.instagram.com/p/ABC123/",
      image: "/images/instagram/17890000000000001.webp",
      caption: "Just listed in Lehi #utahrealestate",
      mediaType: "IMAGE",
      timestamp: "2026-10-18T17:30:00+0000",
    },
    {
      id: "17890000000000002",
      permalink: "https://www.instagram.com/reel/DEF456/",
      image: "/images/instagram/17890000000000002.webp",
      caption: "",
      mediaType: "VIDEO",
      timestamp: "2026-10-10T17:30:00+0000",
    },
  ],
}

describe("/instagram page", () => {
  it("is noindex, follow with a self canonical", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.alternates?.canonical).toMatch(/\/instagram\/$/)
  })

  it("renders one h1 and a tile per post linking to the post on Instagram", () => {
    render(<InstagramFeedView feed={feed} />)
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    const items = within(screen.getByRole("list")).getAllByRole("listitem")
    expect(items).toHaveLength(2)
    const first = within(items[0]!).getByRole("link")
    expect(first).toHaveAttribute("href", feed.posts[0]!.permalink)
    expect(first).toHaveAttribute("target", "_blank")
    expect(first).toHaveAttribute("rel", "noopener noreferrer")
    expect(within(items[0]!).getByRole("img")).toHaveAttribute("alt", "Just listed in Lehi")
  })

  it("marks videos for screen readers and gives captionless posts alt text", () => {
    render(<InstagramFeedView feed={feed} />)
    const video = within(screen.getByRole("list")).getAllByRole("listitem")[1]!
    expect(video).toHaveTextContent("Video")
    expect(within(video).getByRole("img")).toHaveAttribute("alt", "Instagram post from Ondo Real Estate")
  })

  it("shows a follow card instead of an empty grid before the first fetch", () => {
    render(<InstagramFeedView feed={{ fetchedAt: null, posts: [] }} />)
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
    // One follow button, not a header button plus the card's.
    const follow = screen.getByRole("link", { name: /follow @OndoRealEstate/i })
    expect(follow).toHaveAttribute("href", expect.stringMatching(/^https:\/\/www\.instagram\.com\//))
    expect(follow).toHaveAttribute("data-analytics-event", "social_click")
  })
})
