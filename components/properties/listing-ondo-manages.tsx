/**
 * Shown on every `/properties/{publicId}` detail because that route only
 * renders GET /api/properties/public inventory (Ondo platform listings:
 * approved, vacant rows). There is no MLS or third-party feed on this surface.
 * If a non-Ondo listing source is added, gate this module.
 */
export const LISTING_ONDO_MANAGES_HEADING = "Ondo manages this"

export const LISTING_ONDO_MANAGES_BODY =
  "Ondo Real Estate is the property manager for this listing. Leasing and maintenance are handled in one place, so tours, applications, and work orders go through Ondo rather than a separate manager."

export function ListingOndoManages() {
  return (
    <section
      className="mb-8 rounded-xl border border-border bg-card p-5"
      aria-labelledby="listing-ondo-manages-heading"
    >
      <h2 id="listing-ondo-manages-heading" className="text-xl font-semibold">
        {LISTING_ONDO_MANAGES_HEADING}
      </h2>
      <p className="mt-2 text-foreground/80">{LISTING_ONDO_MANAGES_BODY}</p>
      <a
        href="#listing-inquire"
        className="mt-3 inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Ask leasing
      </a>
    </section>
  )
}
