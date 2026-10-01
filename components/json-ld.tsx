type JsonLdProps = {
  data?: object | object[] | null
  id?: string
}

/**
 * Serialize structured data for the inside of a <script type="application/ld+json">.
 * JSON.stringify leaves "<", ">" and "&" alone, so a field containing "</script>"
 * would end the block early. Escaping them (and the U+2028/2029 line separators)
 * keeps the output valid JSON that parses back to the same data.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

const flattenData = (data?: object | object[] | null) => {
  if (!data) return []
  return Array.isArray(data) ? data.filter(Boolean) : [data]
}

/**
 * Server-safe JSON-LD. Uses a plain <script> tag, next/script pulls in client
 * boundaries and can trigger clientReferenceManifest errors in dev/static export.
 */
export function JsonLd({ data, id = "seo-jsonld" }: JsonLdProps) {
  const entries = flattenData(data)
  if (!entries.length) return null

  const payload = entries.length === 1 ? entries[0] : entries

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  )
}
