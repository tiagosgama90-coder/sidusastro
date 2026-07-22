/** Normalização de texto para UI em português e regras tipográficas Sidus. */

const LEXICO_EN_PT = [
  [/\bcharisma\b/gi, 'carisma'],
  [/\bcharismatic\b/gi, 'carismático'],
  [/\bcharismatica\b/gi, 'carismática'],
  [/\bfocus\b/gi, 'foco'],
  [/\benergy\b/gi, 'energia'],
  [/\bchallenge\b/gi, 'desafio'],
  [/\bchallenges\b/gi, 'desafios'],
  [/\bbalance\b/gi, 'equilíbrio'],
  [/\bopportunity\b/gi, 'oportunidade'],
  [/\bopportunities\b/gi, 'oportunidades'],
  [/\brelationship\b/gi, 'relação'],
  [/\brelationships\b/gi, 'relações'],
  [/\btoday\b/gi, 'hoje'],
  [/\bheart\b/gi, 'coração'],
  [/\bspiritual\b/gi, 'espiritual'],
  [/\btransit\b/gi, 'trânsito'],
  [/\btransits\b/gi, 'trânsitos'],
]

export function normalizarTracos(text) {
  if (!text || typeof text !== 'string') return text
  return text.replace(/-/g, '-').replace(/-/g, '-')
}

export function corrigirLexicoPt(text) {
  if (!text || typeof text !== 'string') return text
  let out = text
  for (const [pattern, replacement] of LEXICO_EN_PT) {
    out = out.replace(pattern, replacement)
  }
  return out
}

export function sanitizarTextoUi(text, lang = 'pt') {
  const base = normalizarTracos(text)
  if (lang === 'pt') return corrigirLexicoPt(base)
  return base
}

export function sanitizarHoroscopo(text, lang = 'pt') {
  return sanitizarTextoUi(text, lang)
}

export function sanitizarMapaHoroscopos(horoscopes = {}, lang = 'pt') {
  const out = {}
  for (const [signo, texto] of Object.entries(horoscopes || {})) {
    out[signo] = sanitizarHoroscopo(texto, lang)
  }
  return out
}
