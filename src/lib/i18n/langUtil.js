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

/** Detecta texto ainda em português (packs auto-gerados corruptos). */
export function looksPortuguese(str) {
  if (!str || typeof str !== 'string') return false
  if (/[ãõç]/i.test(str)) return true
  return /\b(não|nao|tens|estás|estas|estou|estamos|consigo|contigo|para ti|o teu|a tua|os teus|as tuas|no teu|na tua|alguém|alguem|partilhas|reflecte|reflete|expressão|expressao|os anjos pedem|sem ecrãs|sem ecras|pronto\/a|percebido\/a|que desejas|por dentro|através|atraves|consciência|consciencia|cármico|carmico|relacionamento|convida a|busca verdades|A Expressão|A Alma|A Personalidade|O teu|O mundo te|Dentro, desejas|Missão mestra|Missao mestra|Canal de intuição|Protejo a|sabedoria visível|humanitarismo|oferece escuta|reserva \d+ minuto|que verdade interior|padrão cármico|padrao carmico|com coragem para|assumir o|no quotidiano|sem me esquecer|faz algo concreto|organiza um espaço|espaço físico)\b/i.test(str)
}

/** Detecta texto em inglês quando o UI está noutro idioma. */
export function looksEnglish(str) {
  if (!str || typeof str !== 'string') return false
  if (/\b(the|your|you|and|with|this|that|where|what|how|when|spiritual|practice|reflection|expression|personality|soul|master number|life mission|inside|world sees|desire|mission|today|make one|honour|share something|does the|am i|do i|where am i|who does|your name vibrates|the world sees)\b/i.test(str)) return true
  return false
}

/** Se texto estiver em PT e lang≠pt, devolve fallbackEn (ou original em PT). */
export function narrativeForLang(text, lang, fallbackEn) {
  if (!text) return text
  if (lang === 'pt') return text
  if (typeof text === 'string' && looksPortuguese(text)) {
    return fallbackEn ?? text
  }
  return text
}

/** Pacote por idioma; se amostra estiver em PT e lang≠pt, usa fallbackEn. */
export function resolveLocalePack(lang, packs, sampleKey, fallbackEn) {
  if (lang === 'pt') return packs.pt ?? fallbackEn
  if (lang === 'en') return packs.en ?? fallbackEn
  const pack = packs[lang]
  if (!pack) return fallbackEn
  const sample = typeof sampleKey === 'function' ? sampleKey(pack) : pack?.[sampleKey]
  const probes = (Array.isArray(sample) ? sample : [sample]).map((s) => (
    typeof s === 'string' ? s : (s?.mensagem || s?.espiritual || s?.resumo || '')
  ))
  if (probes.some((p) => looksPortuguese(p))) return fallbackEn
  return pack
}

/** «Signo · Casa 10» com etiqueta de casa por idioma. */
export function formatCasaMeta(lang, signo, casa) {
  if (!signo) return '-'
  if (!casa) return signo
  const labels = {
    pt: (s, c) => `${s} · Casa ${c}`,
    en: (s, c) => `${s} · House ${c}`,
    es: (s, c) => `${s} · Casa ${c}`,
    it: (s, c) => `${s} · Casa ${c}`,
    de: (s, c) => `${s} · Haus ${c}`,
    fr: (s, c) => `${s} · Maison ${c}`,
  }
  const fn = labels[lang] || labels.en
  return fn(signo, casa)
}

/** Sufixo « (Maison 3) » para narrativas de aspectos. */
export function casaParentese(lang, casa) {
  if (!casa) return ''
  const word = { pt: 'Casa', en: 'House', es: 'Casa', it: 'Casa', de: 'Haus', fr: 'Maison' }[lang]
    || 'House'
  return ` (${word} ${casa})`
}

/** Sufixo «, Maison 3» após signo. */
export function casaVirgula(lang, casa) {
  if (!casa) return ''
  const word = { pt: 'Casa', en: 'House', es: 'Casa', it: 'Casa', de: 'Haus', fr: 'Maison' }[lang]
    || 'House'
  return `, ${word} ${casa}`
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
