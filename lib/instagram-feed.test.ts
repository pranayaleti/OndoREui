import { describe, expect, it } from "vitest"
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  formatInstagramDate,
  instagramAltText,
  instagramCaptionPreview,
  instagramFeed,
  sourceImageUrl,
  toFeedPost,
  type GraphMedia,
  type InstagramPost,
} from "./instagram-feed"

const media: GraphMedia = {
  id: "17890000000000001",
  caption: "Just listed in Lehi 🏡 #utahrealestate",
  media_type: "IMAGE",
  media_url: "https://scontent.cdninstagram.com/image.jpg",
  permalink: "https://www.instagram.com/p/ABC123/",
  timestamp: "2026-10-18T17:30:00+0000",
}

function post(overrides: Partial<InstagramPost> = {}): InstagramPost {
  return { ...toFeedPost(media)!, ...overrides }
}

describe("sourceImageUrl", () => {
  it("uses the image itself for a photo", () => {
    expect(sourceImageUrl(media)).toBe(media.media_url)
  })

  it("uses the cover frame for a video, never the video file", () => {
    expect(
      sourceImageUrl({ ...media, media_type: "VIDEO", media_url: "https://x/video.mp4", thumbnail_url: "https://x/cover.jpg" }),
    ).toBe("https://x/cover.jpg")
  })

  it("uses the first slide of a carousel, and its cover frame when that slide is a video", () => {
    const carousel: GraphMedia = {
      ...media,
      media_type: "CAROUSEL_ALBUM",
      children: { data: [{ id: "1", media_type: "VIDEO", media_url: "https://x/v.mp4", thumbnail_url: "https://x/slide1.jpg" }] },
    }
    expect(sourceImageUrl(carousel)).toBe("https://x/slide1.jpg")
  })

  it("returns undefined when Instagram withholds the media", () => {
    expect(sourceImageUrl({ ...media, media_type: "VIDEO", media_url: undefined, thumbnail_url: undefined })).toBeUndefined()
  })
})

describe("toFeedPost", () => {
  it("points the image at the self-hosted copy", () => {
    expect(toFeedPost(media)).toEqual({
      id: media.id,
      permalink: media.permalink,
      image: `/images/instagram/${media.id}.webp`,
      caption: media.caption,
      mediaType: "IMAGE",
      timestamp: media.timestamp,
    })
  })

  // The id becomes a file name and the permalink an href.
  it("rejects ids that are not numeric and permalinks that are not instagram.com", () => {
    expect(toFeedPost({ ...media, id: "../../etc/passwd" })).toBeNull()
    expect(toFeedPost({ ...media, permalink: "javascript:alert(1)" })).toBeNull()
    expect(toFeedPost({ ...media, permalink: "https://instagram.com.evil.example/p/1/" })).toBeNull()
    expect(toFeedPost({ ...media, timestamp: "not a date" })).toBeNull()
  })
})

describe("caption helpers", () => {
  it("strips hashtags and mentions from alt text", () => {
    expect(instagramAltText(post({ caption: "Closing day with @thejones family! #sold #lehi" }))).toBe(
      "Closing day with family!",
    )
  })

  it("falls back to a generic description when there is no caption", () => {
    expect(instagramAltText(post({ caption: "#justlisted" }))).toBe("Instagram post from Ondo Real Estate")
  })

  it("truncates long captions at a word boundary", () => {
    const preview = instagramCaptionPreview(post({ caption: "word ".repeat(60) }), 40)
    expect(preview.length).toBeLessThanOrEqual(40)
    expect(preview).toMatch(/word…$/)
  })
})

describe("formatInstagramDate", () => {
  // 03:00 UTC on Oct 19 is still the evening of Oct 18 in Utah.
  it("formats in Utah time", () => {
    expect(formatInstagramDate("2026-10-19T03:00:00+0000")).toBe("Oct 18, 2026")
  })
})

describe("profile and snapshot", () => {
  it("derives the profile from the site's social links", () => {
    expect(INSTAGRAM_PROFILE_URL).toMatch(/^https:\/\/www\.instagram\.com\//)
    expect(INSTAGRAM_HANDLE).toBe("@OndoRealEstate")
  })

  it("only commits posts that pass the same checks the fetch script applies", () => {
    for (const p of instagramFeed.posts) {
      expect(p.permalink).toMatch(/^https:\/\/www\.instagram\.com\//)
      expect(p.image).toBe(`/images/instagram/${p.id}.webp`)
    }
  })
})
