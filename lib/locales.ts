export const SUPPORTED_LOCALES = ["en", "es", "fr", "it", "te", "hi", "ta", "kn"] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const SUPPORTED_LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English (United States)",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  te: "తెలుగు",
  hi: "हिन्दी",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
}
