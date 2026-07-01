export const SUPPORTED_LOCALES = ['en'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/** Static-export default locale used for server-rendered <html lang>. */
export const DEFAULT_LOCALE: SupportedLocale = "en"

export const SUPPORTED_LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English (United States)",
}
