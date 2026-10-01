/**
 * Build-independent view of an exported page, for IndexNow change detection.
 *
 * Every `next build` stamps the output with a fresh build id (an HTML comment,
 * the `"b"` field of the flight payload, `/_next/static/<id>/` paths) and
 * content-hashed chunk, CSS and font names. Hashing the raw bytes therefore
 * flags every page as changed on every deploy. Strip those, and what is left
 * only moves when the page itself moves.
 */

const BUILD_ID = '[A-Za-z0-9_-]{16,}'

/** @param {string} html exported page HTML @returns {string} */
export function normalizeExportedHtml(html) {
  return (
    html
      // <!--buildId--> marker Next writes into the document body.
      .replace(new RegExp(`<!--${BUILD_ID}-->`, 'g'), '<!--BUILD_ID-->')
      // Flight payload: self.__next_f.push([1,"0:{\"P\":null,\"b\":\"<id>\",...
      .replace(new RegExp(`(\\\\?"b\\\\?":\\\\?")${BUILD_ID}(\\\\?")`, 'g'), '$1BUILD_ID$2')
      // /_next/static/<buildId>/_buildManifest.js (anything that is not chunks/css/media).
      .replace(/\/_next\/static\/(?!chunks\/|css\/|media\/)[A-Za-z0-9_-]+\//g, '/_next/static/BUILD_ID/')
      // Content hashes in chunk, css and font file names (16 hex chars).
      .replace(
        /(?<=[-/])[0-9a-f]{16}(?=(?:-s(?:\.p)?)?\.(?:js|css|woff2?|png|jpe?g|webp|avif|svg)\b)/g,
        'HASH',
      )
  )
}

/**
 * @param {Buffer} buf file bytes
 * @param {string} file path, used only to decide whether the file is HTML
 * @returns {string | Buffer} value to hash
 */
export function contentToHash(buf, file) {
  return /\.html?$/i.test(file) ? normalizeExportedHtml(buf.toString('utf8')) : buf
}
