/** Traduções astrológicas PT (interno) ↔ EN (exibição). */

export const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

export const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export const SIGNO_PT_TO_EN = Object.fromEntries(SIGNOS_PT.map((s, i) => [s, SIGNOS_EN[i]]))
export const SIGNO_EN_TO_PT = Object.fromEntries(SIGNOS_EN.map((s, i) => [s, SIGNOS_PT[i]]))

export const PLANETAS_PT_TO_EN = {
  Sol: 'Sun', Lua: 'Moon', Mercúrio: 'Mercury', Vénus: 'Venus', Marte: 'Mars',
  Júpiter: 'Jupiter', Saturno: 'Saturn', Urano: 'Uranus', Neptuno: 'Neptune',
  Plutão: 'Pluto', 'Nodo Norte': 'North Node', Quíron: 'Chiron',
}

export const ELEMENTOS_PT_TO_EN = {
  Fogo: 'Fire', Terra: 'Earth', Ar: 'Air', Água: 'Water',
}

export const MODALIDADES_PT_TO_EN = {
  Cardinal: 'Cardinal', Fixo: 'Fixed', Mutável: 'Mutable',
}

export const ASPECTOS_PT_TO_EN = {
  Conjunção: 'Conjunction', Conjuncao: 'Conjunction',
  Trígono: 'Trine', Trigono: 'Trine',
  Sextil: 'Sextile',
  Quadratura: 'Square',
  Oposição: 'Opposition', Oposicao: 'Opposition',
}

function normAstro(str) {
  return String(str || '').normalize('NFC').trim()
}

export function normalizeSignoNome(str) {
  const s = normAstro(str)
  if (!s) return ''
  if (SIGNO_EN_TO_PT[s]) return SIGNO_EN_TO_PT[s]
  return s
}

export function translateSigno(nome, lang) {
  const base = normalizeSignoNome(nome)
  if (!base || lang === 'pt') return base || nome
  return SIGNO_PT_TO_EN[base] || base
}

/** Nome PT interno a partir de "Sol", "Sol ☉", "Nodo Norte ☊", etc. */
export function normalizePlanetaNome(str) {
  const s = normAstro(str)
  if (!s) return ''
  if (s.startsWith('Nodo Norte') || s.startsWith('North Node')) return 'Nodo Norte'
  const first = s.split(/\s+/)[0]
  const enToPt = Object.fromEntries(Object.entries(PLANETAS_PT_TO_EN).map(([pt, en]) => [en, pt]))
  return PLANETAS_PT_TO_EN[first] ? first : (enToPt[first] || first)
}

export const PLANETA_SIMBOLO = {
  Sol: '☉', Lua: '☽', Mercúrio: '☿', Vénus: '♀', Marte: '♂',
  Júpiter: '♃', Saturno: '♄', Urano: '♅', Neptuno: '♆', Plutão: '♇',
  'Nodo Norte': '☊', Quíron: '⚷',
}

export function simboloPlaneta(nome) {
  return PLANETA_SIMBOLO[normalizePlanetaNome(nome)] || ''
}

export function translatePlaneta(nome, lang) {
  const base = normalizePlanetaNome(nome)
  if (!base || lang === 'pt') return base || nome
  return PLANETAS_PT_TO_EN[base] || base
}

export function translateElemento(nome, lang) {
  if (!nome || lang === 'pt') return nome
  return ELEMENTOS_PT_TO_EN[nome] || nome
}

export function translateModalidade(nome, lang) {
  if (!nome || lang === 'pt') return nome
  return MODALIDADES_PT_TO_EN[nome] || nome
}

export function translateAspecto(nome, lang) {
  if (!nome || lang === 'pt') return nome
  return ASPECTOS_PT_TO_EN[nome] || nome
}

export function localizeSignoObj(signo, lang) {
  if (!signo || lang === 'pt') return signo
  return {
    ...signo,
    nome: translateSigno(signo.nome, lang),
    elemento: translateElemento(signo.elemento, lang),
  }
}

/** Linha do céu ao vivo: ☉ Sun in Cancer ♋ (8.22°) */
export function formatSkyPosition(p, lang = 'pt') {
  if (!p) return ''
  const planet = translatePlaneta(p.nome, lang)
  const sign = translateSigno(p.signo?.nome, lang)
  const prep = lang === 'pt' ? 'em' : 'in'
  const retro = p.retrograde ? ' ℞' : ''
  const graus = p.signo?.graus ?? ''
  const symSign = p.signo?.simbolo || ''
  return `${p.simbolo || ''} ${planet} ${prep} ${sign} ${symSign} (${graus}°)${retro}`.replace(/\s+/g, ' ').trim()
}

/** Aspeto activo: Sun ☉ · Opposition · Moon ☽ */
export function formatAspectoCurto(a, lang = 'pt') {
  if (!a) return { esquerda: '', aspecto: '', direita: '' }
  const pA = translatePlaneta(a.planetaA, lang)
  const pB = translatePlaneta(a.planetaB, lang)
  const asp = translateAspecto(a.aspecto, lang)
  const sA = a.simboloA || simboloPlaneta(a.planetaA)
  const sB = a.simboloB || simboloPlaneta(a.planetaB)
  return {
    esquerda: `${pA} ${sA}`.trim(),
    aspecto: asp,
    direita: `${pB} ${sB}`.trim(),
  }
}
