import { describe, expect, it } from "vitest"
import type { ApiProperty } from "@/app/types/property"
import { mapApiProperties } from "./mapProperty"

const row = (publicId: string, listingKind: ApiProperty["listingKind"]) =>
  ({ publicId, title: publicId, listingKind, createdAt: "2026-01-01T00:00:00Z" }) as unknown as ApiProperty

describe("mapApiProperties", () => {
  it("skips sale rows because the site shows rentals only", () => {
    const mapped = mapApiProperties([row("a", "lease"), row("b", "sale"), row("c", null)])
    expect(mapped.map((p) => p.id)).toEqual(["a", "c"])
  })
})
