import { contentForLang } from './langUtil.js'

/** Escolhe string ou função narrativa de um objeto { pt, en, es, it, de, fr }. */
export function pickNarr(entry, lang, ...args) {
  if (!entry) return ''
  const raw = contentForLang(lang, entry)
  if (raw == null) return ''
  return typeof raw === 'function' ? raw(...args) : raw
}

/** Escolhe pacote estático por idioma. */
export function pickPack(lang, packs) {
  return contentForLang(lang, packs) ?? packs.pt ?? packs.en
}
