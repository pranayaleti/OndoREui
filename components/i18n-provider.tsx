"use client"

import { useEffect, useState } from 'react'
import i18n from '@/lib/i18n'
import { I18nextProvider } from 'react-i18next'

/** True only when i18n is initialized AND the default namespace is in memory. */
function translationsReady(): boolean {
  return i18n.isInitialized && i18n.hasLoadedNamespace('common')
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(translationsReady)

  useEffect(() => {
    if (translationsReady()) {
      setIsReady(true)
      return
    }
    const check = () => { if (translationsReady()) setIsReady(true) }
    i18n.on('initialized', check)
    i18n.on('loaded', check)
    return () => {
      i18n.off('initialized', check)
      i18n.off('loaded', check)
    }
  }, [])

  useEffect(() => {
    const updateHtmlLang = (lng: string) => { document.documentElement.lang = lng }
    i18n.on('languageChanged', updateHtmlLang)
    if (i18n.language) updateHtmlLang(i18n.language)
    return () => { i18n.off('languageChanged', updateHtmlLang) }
  }, [])

  if (!isReady) return null

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
