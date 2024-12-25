import i18n from 'i18next'
// import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationEn from 'public/locales/en.json';
import translationRU from 'public/locales/ru.json';
import translationUK from 'public/locales/uk.json';

const resources = {
  en: {
    translation: translationEn
  },
  ru: {
    translation: translationRU
  },
  uk: {
    translation: translationUK
  },
};

i18n

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    resources: resources,
    fallbackLng: 'en',
    // saveMissing: true,
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  });

export default i18n;
