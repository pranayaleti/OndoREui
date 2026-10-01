import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '@/public/locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en'],
    ns: ['common'],
    defaultNS: 'common',
    resources: {
      en: { common: enCommon },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
