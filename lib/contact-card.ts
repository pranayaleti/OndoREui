/**
 * vCard 3.0 (RFC 2426) text for the "Save contact" button on /links. Phones import it
 * as one contact, so a QR scan can end with Ondo saved in the visitor's address book.
 */
export type ContactCardInput = {
  givenName: string
  familyName: string
  organization: string
  title: string
  /** E.164, e.g. +14085380420. */
  phone: string
  email: string
  url: string
  address: { street: string; city: string; region: string; postalCode: string; country: string }
  note?: string
  /** Base64 JPEG. JPEG because contact apps do not reliably read WebP. */
  photoJpegBase64?: string
}

/** Text values escape backslash, comma, semicolon and newlines; unescaped they split fields on import. */
function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n")
}

/** Lines over 75 characters continue after CRLF and one space (RFC 2425 folding). */
function fold(line: string): string {
  if (line.length <= 75) return line
  const parts = [line.slice(0, 75)]
  for (let i = 75; i < line.length; i += 74) parts.push(` ${line.slice(i, i + 74)}`)
  return parts.join("\r\n")
}

export function buildContactCard(input: ContactCardInput): string {
  const { address } = input
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeText(input.familyName)};${escapeText(input.givenName)};;;`,
    `FN:${escapeText(`${input.givenName} ${input.familyName}`)}`,
    `ORG:${escapeText(input.organization)}`,
    `TITLE:${escapeText(input.title)}`,
    `TEL;TYPE=CELL,VOICE:${input.phone}`,
    `EMAIL;TYPE=INTERNET:${input.email}`,
    `URL:${input.url}`,
    `ADR;TYPE=WORK:;;${[address.street, address.city, address.region, address.postalCode, address.country]
      .map(escapeText)
      .join(";")}`,
    input.note ? `NOTE:${escapeText(input.note)}` : null,
    input.photoJpegBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${input.photoJpegBase64}` : null,
    "END:VCARD",
  ].filter((line): line is string => line !== null)
  return `${lines.map(fold).join("\r\n")}\r\n`
}
