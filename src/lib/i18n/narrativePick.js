import { contentForLang, looksPortuguese, narrativeForLang } from './langUtil.js'

/** Escolhe string ou função narrativa de um objeto { pt, en, es, it, de, fr }. */
export function pickNarr(entry, lang, ...args) {
  if (!entry) return ''
  const raw = contentForLang(lang, entry)
  if (raw == null) return ''
  const enRaw = contentForLang('en', entry)
  if (typeof raw === 'function') {
    const result = raw(...args)
    if (lang !== 'pt' && looksPortuguese(result)) {
      const enFn = typeof enRaw === 'function' ? enRaw : null
      if (enFn) return enFn(...args)
      if (typeof enRaw === 'string') return enRaw
    }
    return result
  }
  return narrativeForLang(raw, lang, typeof enRaw === 'string' ? enRaw : null)
}

/** Escolhe pacote estático por idioma. */
export function pickPack(lang, packs) {
  return contentForLang(lang, packs) ?? packs.pt ?? packs.en
}
