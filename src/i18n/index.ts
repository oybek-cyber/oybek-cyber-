import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources, defaultNS, fallbackLng } from './config'

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  fallbackLng,
  lng: localStorage.getItem('language') || fallbackLng,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
