/** Helpers para conteúdo PT vs restantes idiomas (EN como base técnica). */

export function isPt(lang) {
  return lang === 'pt'
}

export function pickLang(lang, pt, other) {
  return lang === 'pt' ? pt : other
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

export function prepInSign(lang) {
  if (lang === 'pt') return 'em'
  if (lang === 'fr') return 'en'
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
