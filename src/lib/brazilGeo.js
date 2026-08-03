/** Fusos IANA comuns no Brasil. */
export const BRAZIL_TIMEZONES = new Set([
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Cuiaba',
  'America/Campo_Grande',
  'America/Porto_Velho',
  'America/Boa_Vista',
  'America/Rio_Branco',
  'America/Belem',
  'America/Fortaleza',
  'America/Recife',
  'America/Bahia',
  'America/Maceio',
  'America/Noronha',
  'America/Santarem',
  'America/Araguaina',
])

export function isBrazilLocale(locale) {
  return String(locale || '').toLowerCase().startsWith('pt-br')
}

export function isBrazilTimezone(timeZone) {
  return Boolean(timeZone && BRAZIL_TIMEZONES.has(timeZone))
}

/** Sinais locais quando a geo IP falha ou demora. */
export function detectBrazilHeuristic({ language, timeZone } = {}) {
  if (isBrazilLocale(language)) return true
  if (isBrazilTimezone(timeZone)) return true
  return false
}

export function readBrazilHeuristicFromNavigator() {
  if (typeof navigator === 'undefined') return false
  let timeZone = ''
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
  } catch {
    timeZone = ''
  }
  return detectBrazilHeuristic({ language: navigator.language, timeZone })
}

/** Geo IP tem prioridade; heurística cobre BR sem country=BR. */
export function resolveIsBrasil(country, heuristic = false) {
  if (String(country || '').trim().toUpperCase() === 'BR') return true
  return Boolean(heuristic)
}
