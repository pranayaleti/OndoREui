import placements from "./qr-placements.json"

/**
 * Where Ondo prints or posts its /links QR codes and short links. Each placement gets
 * ondorealestate.com/go/<id>/, which redirects to /links tagged with its own UTM source,
 * so analytics shows whether business cards, signs or flyers bring the leads.
 * scripts/generate-qr-kit.mjs reads the same JSON to draw the codes in public/qr/.
 */
export type QrPlacement = {
  id: string
  label: string
  source: string
  medium: "qr" | "email"
}

export const QR_PLACEMENTS = placements as readonly QrPlacement[]

/** Hard-coded production origin: printed codes outlive any build and must never carry a dev host. */
export const QR_ORIGIN = "https://www.ondorealestate.com"

function placementFor(id: string): QrPlacement {
  const placement = QR_PLACEMENTS.find((candidate) => candidate.id === id)
  if (!placement) throw new Error(`Unknown QR placement "${id}"`)
  return placement
}

/** Where /go/<id>/ sends the visitor. */
export function qrRedirectTarget(id: string): string {
  const { source, medium } = placementFor(id)
  return `/links/?utm_source=${source}&utm_medium=${medium}&utm_campaign=links`
}

/** What gets printed or linked. Short and on the canonical host, so no redirect hops before the page. */
export function qrShortUrl(id: string): string {
  placementFor(id)
  return `${QR_ORIGIN}/go/${id}/`
}
