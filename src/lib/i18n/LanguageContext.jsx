import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import pt from './pt.js'
import en from './en.js'
import {
  translateSigno, translatePlaneta, translateElemento,
  translateModalidade, translateAspecto, localizeSignoObj,
} from './astro.js'

const STORAGE_KEY = 'sidus_lang'

const LOCALES = { pt, en }

const LanguageContext = createContext(null)

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
}

function interpolate(str, vars = {}) {
  if (!str || typeof str !== 'string') return str
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'pt'
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' ? 'en' : 'pt'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt'
  }, [lang])

  const setLang = useCallback((l) => setLangState(l === 'en' ? 'en' : 'pt'), [])

  const t = useCallback((key, vars) => {
    const val = getNested(LOCALES[lang], key) ?? getNested(LOCALES.pt, key) ?? key
    return interpolate(val, vars)
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    ts: (nome) => translateSigno(nome, lang),
    tp: (nome) => translatePlaneta(nome, lang),
    te: (nome) => translateElemento(nome, lang),
    tm: (nome) => translateModalidade(nome, lang),
    ta: (nome) => translateAspecto(nome, lang),
    localizeSigno: (signo) => localizeSignoObj(signo, lang),
  }), [lang, setLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
