/**
 * Asserts that every slug linked from the blog index page resolves to a valid route.
 * Prevents 404s: all BLOG_INDEX_SLUGS must exist in ALL_VALID_BLOG_SLUGS (dynamic POSTS or static dir).
 */
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ALL_VALID_BLOG_SLUGS, BLOG_INDEX_SLUGS } from "./blog-slugs";
import { getAllContentNodes } from "./content";

describe("blog slugs", () => {
  it("every slug linked from the blog index has a valid route (no 404s)", () => {
    const missing = BLOG_INDEX_SLUGS.filter((slug) => !ALL_VALID_BLOG_SLUGS.has(slug));
    expect(
      missing,
      `Blog index links to slugs that do not resolve. Add them to [slug] POSTS or create app/blog/<slug>/page.tsx: ${missing.join(", ")}`
    ).toEqual([]);
  });

  it("registers every /blog/* node in the content graph as a valid slug", () => {
    const graphBlogSlugs = getAllContentNodes()
      .filter((node) => node.path.startsWith("/blog/"))
      .map((node) => node.path.replace(/^\/blog\//, ""));
    const missing = graphBlogSlugs.filter((slug) => !ALL_VALID_BLOG_SLUGS.has(slug));
    expect(missing, `Content graph blog paths missing from blog-slugs: ${missing.join(", ")}`).toEqual([]);
  });

  it("registers every app/blog/<slug>/page.tsx directory", () => {
    const blogDir = join(__dirname, "..", "app", "blog");
    const onDisk = readdirSync(blogDir).filter(
      (name) => !name.startsWith("[") && existsSync(join(blogDir, name, "page.tsx"))
    );
    const missingFromRegistry = onDisk.filter((slug) => !ALL_VALID_BLOG_SLUGS.has(slug));
    const missingFromDisk = [...ALL_VALID_BLOG_SLUGS].filter((slug) => !onDisk.includes(slug));
    expect(missingFromRegistry, `Add these slugs to STATIC_ROUTE_SLUGS: ${missingFromRegistry.join(", ")}`).toEqual([]);
    expect(missingFromDisk, `Remove these slugs or add page.tsx: ${missingFromDisk.join(", ")}`).toEqual([]);
  });
});
