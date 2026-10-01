// @vitest-environment node
import { describe, it, expect } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  countMainLandmarks,
  findLandmarkProblems,
  isClientRenderedShell,
  isRedirectStub,
} from "../scripts/check-main-landmark.mjs"

describe("countMainLandmarks", () => {
  it("counts <main> elements with or without attributes", () => {
    expect(countMainLandmarks("<body><main>a</main></body>")).toBe(1)
    expect(countMainLandmarks('<main class="x">a</main><main>b</main>')).toBe(2)
    expect(countMainLandmarks("<div>none</div>")).toBe(0)
  })

  it("ignores lookalike tags and comments", () => {
    expect(countMainLandmarks("<mainfoo></mainfoo><!-- <main> -->")).toBe(0)
  })
})

describe("findLandmarkProblems", () => {
  it("flags pages with zero or several mains and skips redirect stubs and client-rendered shells", () => {
    const out = mkdtempSync(join(tmpdir(), "main-landmark-"))
    const page = (dir: string, html: string) => {
      mkdirSync(join(out, dir), { recursive: true })
      writeFileSync(join(out, dir, "index.html"), html)
    }
    page("good", "<main>ok</main>")
    page("none", "<div>no landmark</div>")
    page("nested", "<main><main>twice</main></main>")
    page("old-url", '<meta http-equiv="refresh" content="0; url=/good/">')
    // Client-rendered shells get their <main> after hydration, but two mains are still wrong.
    page("csr-shell", '<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template>')
    page("csr-nested", '<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template><main><main>x</main></main>')
    expect(isRedirectStub('<meta http-equiv="refresh" content="0">')).toBe(true)
    expect(isClientRenderedShell('<template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING">')).toBe(true)
    expect(isClientRenderedShell("<main>ok</main>")).toBe(false)
    expect(findLandmarkProblems(out).sort((a, b) => a.file.localeCompare(b.file))).toEqual([
      { file: join("csr-nested", "index.html"), count: 2 },
      { file: join("nested", "index.html"), count: 2 },
      { file: join("none", "index.html"), count: 0 },
    ])
  })
})
