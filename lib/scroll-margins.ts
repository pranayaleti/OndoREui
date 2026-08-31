/**
 * Sticky chrome on public pages: utility strip (desktop) + 4rem nav.
 * Hash targets need more than Tailwind scroll-mt-24 (6rem) on md+ or the
 * heading sits under the header.
 */
export const STICKY_HEADER_SCROLL_MARGIN_CLASS =
  "scroll-mt-[5.5rem] md:scroll-mt-[8.5rem]"
