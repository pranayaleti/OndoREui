type JsonLdProps = {
  data?: object | object[] | null
  id?: string
}

const flattenData = (data?: object | object[] | null) => {
  if (!data) return []
  return Array.isArray(data) ? data.filter(Boolean) : [data]
}

/**
 * Server-safe JSON-LD. Uses a plain <script> tag — next/script pulls in client
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
