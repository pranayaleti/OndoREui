import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import enCommon from '@/public/locales/en/common.json';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'it', 'te', 'hi', 'ta', 'kn'] as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LOCALES],
    ns: ['common'],
    defaultNS: 'common',
    /** Ship English in the bundle so nav labels resolve before HTTP; other locales still load from `/locales/`. */
    partialBundledLanguages: true,
    resources: {
      en: {
        common: enCommon,
      },
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ondo_locale',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
