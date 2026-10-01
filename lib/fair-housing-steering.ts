/**
 * Fair Housing steering phrases, in one place.
 *
 * Rule for all listing and location copy: describe the property, never the occupant. Naming who
 * should live somewhere (familial status, age, religion, national origin, source of income) is
 * steering under the Fair Housing Act and Utah Code 57-21.
 *
 * Counsel should review this list; it is a screen, not a legal opinion.
 */

/**
 * Occupant, class and crime-adjacent phrases that must not appear in city and neighborhood copy.
 * city-content, city-owner-ops and the location copy tests all use this one pattern.
 */
export const STEERING_COPY_RE =
  /family-oriented|family-first|family-friendly|family-centric|family-focused|family-paced|family-lifestyle|young professionals?|empty nesters?|immigrant families|byu families|great for families|best for families|who is .+ best for|safe neighborhood|crime-free|quiet community|ideal for couples|working-class character|working-class value|blue-collar workers|ethnically diverse|tenant quality|young families|military families|family tenants|family housing|quality tenants|high-quality tenants/i

const OCCUPANT =
  "(?:students?|families|family|couples?|singles?|professionals?|retirees|seniors|kids|children|empty nesters?|bachelors?|newlyweds|executives|workers)"

/**
 * Phrases that steer in a listing description: the base list above plus the ways landlords
 * describe a preferred occupant ("perfect for young families", "no Section 8", "quiet tenants",
 * "walking distance to church"). Whole-word-ish patterns so ordinary property copy such as
 * "single-family home" or "ideal for entertaining" does not match.
 */
export const LISTING_STEERING_RE = new RegExp(
  [
    STEERING_COPY_RE.source,
    `\\b(?:perfect|ideal|great|best|suited|suitable|designed) for (?:a |an |the )?(?:young |small |growing |single |working |first-time |retired )*${OCCUPANT}\\b`,
    "\\bfamilies with (?:kids|children)\\b",
    "\\b(?:safe|secure) (?:neighborhood|neighbourhood|area|community|street|part of town)\\b",
    "\\b(?:quiet|peaceful) (?:neighborhood|neighbourhood|community|area|tenants?|residents?|people|family|couple|professionals?)\\b",
    "\\bexclusive (?:neighborhood|neighbourhood|community|area|enclave)\\b",
    "\\bno (?:kids|children|section 8|vouchers?|hud|housing vouchers?|rental assistance)\\b",
    "\\bsection 8 (?:is )?(?:not|isn't) (?:accepted|welcome)\\b",
    "\\b(?:not|don't|do not|doesn't|does not) accept(?:ing|s)? (?:section 8|housing vouchers?|vouchers?)\\b",
    "\\badults?[- ]only\\b",
    "\\bsingles only\\b",
    "\\bmature (?:tenants?|adults?|residents?|couples?)\\b",
    "\\bchurch(?:es)?\\b|\\bsynagogue\\b|\\bmosque\\b|\\bchristian\\b|\\bmormon\\b|\\blds ward\\b|\\bward boundar",
    "\\benglish[- ]speaking (?:only|tenants?)\\b",
  ].join("|"),
  "i",
)

/** Every distinct steering phrase found in `text`, lower-cased. Empty when the text is clean. */
export function findSteeringPhrases(text: string | null | undefined, re: RegExp = LISTING_STEERING_RE): string[] {
  if (!text) return []
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`
  const found = new Set<string>()
  for (const match of text.matchAll(new RegExp(re.source, flags))) {
    found.add(match[0].toLowerCase())
  }
  return [...found]
}

const warnedDescriptions = new Set<string>()

/**
 * Render-time guard for a listing description. Returns the trimmed description when it is clean,
 * and null when it contains steering language, so the caller shows nothing instead of a
 * description that names the desired occupant. It never rewrites the text. The listing itself must
 * be fixed at the source (the dashboard or database) and flagged phrases are logged for that.
 */
export function screenListingDescription(description: string | null | undefined): string | null {
  const text = description?.trim()
  if (!text) return null
  const flagged = findSteeringPhrases(text)
  if (flagged.length > 0) {
    // Once per distinct description: components re-render and call this more than once.
    if (!warnedDescriptions.has(text)) {
      warnedDescriptions.add(text)
      console.warn(`[fair-housing] listing description hidden: steering phrase(s) "${flagged.join('", "')}". Edit the listing at the source.`)
    }
    return null
  }
  return text
}
