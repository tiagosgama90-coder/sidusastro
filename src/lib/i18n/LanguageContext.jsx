import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import pt from './pt.js'
import en from './en.js'
import es from './es.js'
import it from './it.js'
import de from './de.js'
import fr from './fr.js'
import {
  TAROT_TYPES_PT, TAROT_TYPES_EN, TAROT_TYPES_ES,
  TAROT_TYPES_IT, TAROT_TYPES_FR, TAROT_TYPES_DE,
} from './tarotTypesLocales.js'
import {
  translateSigno, translatePlaneta, translateElemento,
  translateModalidade, translateAspecto, localizeSignoObj,
  translatePontoNatal, translateHouseLabel,
} from './astro.js'
import { sanitizarTextoUi } from '../textoUtil.js'

const STORAGE_KEY = 'sidus_lang'

const LOCALES = { pt, en, es, it, de, fr }
const SUPPORTED_LANGS = new Set(['pt', 'en', 'es', 'it', 'de', 'fr'])

function mergeTarotTypes(locale, typesMap) {
  if (!locale.tarot) locale.tarot = {}
  locale.tarot.types = { ...(locale.tarot.types || {}), ...typesMap }
}

mergeTarotTypes(pt, TAROT_TYPES_PT)
mergeTarotTypes(en, TAROT_TYPES_EN)
mergeTarotTypes(es, TAROT_TYPES_ES)
mergeTarotTypes(it, TAROT_TYPES_IT)
mergeTarotTypes(fr, TAROT_TYPES_FR)
mergeTarotTypes(de, TAROT_TYPES_DE)

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
    return SUPPORTED_LANGS.has(saved) ? saved : 'pt'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = SUPPORTED_LANGS.has(lang) ? lang : 'pt'
  }, [lang])

  const setLang = useCallback((l) => setLangState(SUPPORTED_LANGS.has(l) ? l : 'pt'), [])

  const t = useCallback((key, vars) => {
    const val = getNested(LOCALES[lang], key)
      ?? getNested(LOCALES.en, key)
      ?? getNested(LOCALES.pt, key)
      ?? key
    const raw = interpolate(val, vars)
    return typeof raw === 'string' ? sanitizarTextoUi(raw, lang) : raw
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    ts: (nome) => translateSigno(nome, lang),
    tp: (nome) => translatePlaneta(nome, lang),
    tpo: (nome) => translatePontoNatal(nome, lang),
    th: (num) => translateHouseLabel(num, lang),
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
