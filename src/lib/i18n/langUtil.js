/** Helpers para conteúdo por idioma (pt, en, es, it, de, fr). */

export const SUPPORTED_LANGS = ['pt', 'en', 'es', 'it', 'de', 'fr']

export function isPt(lang) {
  return lang === 'pt'
}

export function pickLang(lang, pt, other) {
  return lang === 'pt' ? pt : other
}

/** Escolhe valor do pacote { pt, en, es, it, de, fr } com fallback en → pt. */
export function contentForLang(lang, bundle) {
  if (!bundle) return null
  if (lang === 'pt' && bundle.pt != null) return bundle.pt
  if (bundle[lang] != null) return bundle[lang]
  if (bundle.en != null) return bundle.en
  return bundle.pt ?? null
}

export function localeTag(lang) {
  const map = {
    pt: 'pt-PT',
    en: 'en-GB',
    es: 'es-ES',
    it: 'it-IT',
    de: 'de-DE',
    fr: 'fr-FR',
  }
  return map[lang] || 'en-GB'
}

export function dateLocale(lang) {
  return localeTag(lang)
}

export function prepInSign(lang) {
  if (lang === 'pt') return 'em'
  if (lang === 'es' || lang === 'fr') return 'en'
  return 'in'
}

export const ORACLE_LANG_LABEL = {
  pt: 'Português de Portugal',
  en: 'English',
  es: 'Spanish',
  it: 'Italian',
  de: 'German',
  fr: 'French',
}

export function oracleRespondLanguage(lang) {
  return ORACLE_LANG_LABEL[lang] || ORACLE_LANG_LABEL.en
}

/** Instrução para IA: responder sempre no idioma seleccionado. */
export function aiOutputLanguageBlock(lang) {
  const label = oracleRespondLanguage(lang)
  if (lang === 'pt') {
    return `IDIOMA DE SAÍDA OBRIGATÓRIO: Português de Portugal. Toda a resposta deve estar em português de Portugal.`
  }
  return `MANDATORY OUTPUT LANGUAGE: ${label}. Write the ENTIRE response in ${label} only. Never use Portuguese unless the user wrote in Portuguese.`
}

/** Nomes de signos no idioma de saída (para prompts IA). */
export function zodiacNamesInstruction(lang) {
  if (lang === 'pt') {
    return 'Usa sempre nomes de signos em português (Carneiro, Touro, Gémeos, etc.).'
  }
  const label = oracleRespondLanguage(lang)
  return `Always use zodiac sign names in ${label} (translated from the chart data). Never mix Portuguese sign names.`
}
