/** Traduções astrológicas PT (interno) ↔ idiomas de exibição. */
import { prepInSign } from './langUtil.js'

export const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

export const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export const SIGNOS_ES = [
  'Aries', 'Tauro', 'Géminos', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
]

export const SIGNOS_IT = [
  'Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine',
  'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci',
]

export const SIGNOS_DE = [
  'Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
  'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische',
]

export const SIGNOS_FR = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons',
]

const SIGNOS_BY_LANG = {
  pt: SIGNOS_PT, en: SIGNOS_EN, es: SIGNOS_ES, it: SIGNOS_IT, de: SIGNOS_DE, fr: SIGNOS_FR,
}

export const SIGNO_PT_TO_EN = Object.fromEntries(SIGNOS_PT.map((s, i) => [s, SIGNOS_EN[i]]))
export const SIGNO_EN_TO_PT = Object.fromEntries(SIGNOS_EN.map((s, i) => [s, SIGNOS_PT[i]]))

export const PLANETAS_PT_TO_EN = {
  Sol: 'Sun', Lua: 'Moon', Mercúrio: 'Mercury', Vénus: 'Venus', Marte: 'Mars',
  Júpiter: 'Jupiter', Saturno: 'Saturn', Urano: 'Uranus', Neptuno: 'Neptune',
  Plutão: 'Pluto', 'Nodo Norte': 'North Node', Quíron: 'Chiron',
}

const PLANETAS_ES = {
  Sol: 'Sol', Lua: 'Luna', Mercúrio: 'Mercurio', Vénus: 'Venus', Marte: 'Marte',
  Júpiter: 'Júpiter', Saturno: 'Saturno', Urano: 'Urano', Neptuno: 'Neptuno',
  Plutão: 'Plutón', 'Nodo Norte': 'Nodo Norte', Quíron: 'Quirón',
}

const PLANETAS_IT = {
  Sol: 'Sole', Lua: 'Luna', Mercúrio: 'Mercurio', Vénus: 'Venere', Marte: 'Marte',
  Júpiter: 'Giove', Saturno: 'Saturno', Urano: 'Urano', Neptuno: 'Nettuno',
  Plutão: 'Plutone', 'Nodo Norte': 'Nodo Nord', Quíron: 'Chirone',
}

const PLANETAS_DE = {
  Sol: 'Sonne', Lua: 'Mond', Mercúrio: 'Merkur', Vénus: 'Venus', Marte: 'Mars',
  Júpiter: 'Jupiter', Saturno: 'Saturn', Urano: 'Uranus', Neptuno: 'Neptun',
  Plutão: 'Pluto', 'Nodo Norte': 'Mondknoten', Quíron: 'Chiron',
}

const PLANETAS_FR = {
  Sol: 'Soleil', Lua: 'Lune', Mercúrio: 'Mercure', Vénus: 'Vénus', Marte: 'Mars',
  Júpiter: 'Jupiter', Saturno: 'Saturne', Urano: 'Uranus', Neptuno: 'Neptune',
  Plutão: 'Pluton', 'Nodo Norte': 'Nœud Nord', Quíron: 'Chiron',
}

const PLANETAS_BY_LANG = {
  pt: null,
  en: PLANETAS_PT_TO_EN,
  es: PLANETAS_ES,
  it: PLANETAS_IT,
  de: PLANETAS_DE,
  fr: PLANETAS_FR,
}

const ELEMENTOS_BY_LANG = {
  pt: { Fogo: 'Fogo', Terra: 'Terra', Ar: 'Ar', Água: 'Água' },
  en: { Fogo: 'Fire', Terra: 'Earth', Ar: 'Air', Água: 'Water' },
  es: { Fogo: 'Fuego', Terra: 'Tierra', Ar: 'Aire', Água: 'Agua' },
  it: { Fogo: 'Fuoco', Terra: 'Terra', Ar: 'Aria', Água: 'Acqua' },
  de: { Fogo: 'Feuer', Terra: 'Erde', Ar: 'Luft', Água: 'Wasser' },
  fr: { Fogo: 'Feu', Terra: 'Terre', Ar: 'Air', Água: 'Eau' },
}

const MODALIDADES_BY_LANG = {
  pt: { Cardinal: 'Cardinal', Fixo: 'Fixo', Mutável: 'Mutável' },
  en: { Cardinal: 'Cardinal', Fixo: 'Fixed', Mutável: 'Mutable' },
  es: { Cardinal: 'Cardinal', Fixo: 'Fijo', Mutável: 'Mutable' },
  it: { Cardinal: 'Cardinale', Fixo: 'Fisso', Mutável: 'Mutevole' },
  de: { Cardinal: 'Kardinal', Fixo: 'Fix', Mutável: 'Veränderlich' },
  fr: { Cardinal: 'Cardinal', Fixo: 'Fixe', Mutável: 'Mutable' },
}

const ASPECTOS_BY_LANG = {
  pt: {
    Conjunção: 'Conjunção', Conjuncao: 'Conjunção',
    Trígono: 'Trígono', Trigono: 'Trígono',
    Sextil: 'Sextil', Quadratura: 'Quadratura',
    Oposição: 'Oposição', Oposicao: 'Oposição',
  },
  en: {
    Conjunção: 'Conjunction', Conjuncao: 'Conjunction',
    Trígono: 'Trine', Trigono: 'Trine',
    Sextil: 'Sextile', Quadratura: 'Square',
    Oposição: 'Opposition', Oposicao: 'Opposition',
  },
  es: {
    Conjunção: 'Conjunción', Conjuncao: 'Conjunción',
    Trígono: 'Trígono', Trigono: 'Trígono',
    Sextil: 'Sextil', Quadratura: 'Cuadratura',
    Oposição: 'Oposición', Oposicao: 'Oposición',
  },
  it: {
    Conjunção: 'Congiunzione', Conjuncao: 'Congiunzione',
    Trígono: 'Trigono', Trigono: 'Trigono',
    Sextil: 'Sestile', Quadratura: 'Quadratura',
    Oposição: 'Opposizione', Oposicao: 'Opposizione',
  },
  de: {
    Conjunção: 'Konjunktion', Conjuncao: 'Konjunktion',
    Trígono: 'Trigon', Trigono: 'Trigon',
    Sextil: 'Sextil', Quadratura: 'Quadrat',
    Oposição: 'Opposition', Oposicao: 'Opposition',
  },
  fr: {
    Conjunção: 'Conjonction', Conjuncao: 'Conjonction',
    Trígono: 'Trigone', Trigono: 'Trigone',
    Sextil: 'Sextile', Quadratura: 'Carré',
    Oposição: 'Opposition', Oposicao: 'Opposition',
  },
}

function normAstro(str) {
  return String(str || '').normalize('NFC').trim()
}

export function normalizeSignoNome(str) {
  const s = normAstro(str)
  if (!s) return ''
  if (SIGNO_EN_TO_PT[s]) return SIGNO_EN_TO_PT[s]
  for (const list of Object.values(SIGNOS_BY_LANG)) {
    const idx = list.indexOf(s)
    if (idx >= 0) return SIGNOS_PT[idx]
  }
  return s
}

export function translateSigno(nome, lang) {
  const base = normalizeSignoNome(nome)
  if (!base || lang === 'pt') return base || nome
  const idx = SIGNOS_PT.indexOf(base)
  if (idx < 0) return SIGNO_PT_TO_EN[base] || base
  const list = SIGNOS_BY_LANG[lang] || SIGNOS_EN
  return list[idx] || SIGNO_PT_TO_EN[base] || base
}

export function normalizePlanetaNome(str) {
  const s = normAstro(str)
  if (!s) return ''
  if (s.startsWith('Nodo Norte') || s.startsWith('North Node') || s.startsWith('Nœud Nord') || s.startsWith('Nodo Nord') || s.startsWith('Mondknoten')) return 'Nodo Norte'
  const first = s.split(/\s+/)[0]
  const enToPt = Object.fromEntries(Object.entries(PLANETAS_PT_TO_EN).map(([pt, en]) => [en, pt]))
  for (const map of Object.values(PLANETAS_BY_LANG)) {
    if (!map) continue
    for (const [pt, translated] of Object.entries(map)) {
      if (translated === first) return pt
    }
  }
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
  const map = PLANETAS_BY_LANG[lang] || PLANETAS_PT_TO_EN
  return map[base] || PLANETAS_PT_TO_EN[base] || base
}

export function translateElemento(nome, lang) {
  if (!nome || lang === 'pt') return nome
  const map = ELEMENTOS_BY_LANG[lang] || ELEMENTOS_BY_LANG.en
  return map[nome] || nome
}

export function translateModalidade(nome, lang) {
  if (!nome || lang === 'pt') return nome
  const map = MODALIDADES_BY_LANG[lang] || MODALIDADES_BY_LANG.en
  return map[nome] || nome
}

export function translateAspecto(nome, lang) {
  if (!nome) return nome
  const map = ASPECTOS_BY_LANG[lang] || ASPECTOS_BY_LANG.en
  return map[nome] || (lang === 'pt' ? nome : (ASPECTOS_BY_LANG.en[nome] || nome))
}

export function localizeSignoObj(signo, lang) {
  if (!signo || lang === 'pt') return signo
  return {
    ...signo,
    nome: translateSigno(signo.nome, lang),
    elemento: translateElemento(signo.elemento, lang),
  }
}

export function formatSkyPosition(p, lang = 'pt') {
  if (!p) return ''
  const planet = translatePlaneta(p.nome, lang)
  const sign = translateSigno(p.signo?.nome ?? p.signo, lang)
  const prep = prepInSign(lang)
  const retro = p.retrograde ? ' ℞' : ''
  const graus = p.signo?.graus ?? ''
  const symSign = p.signo?.simbolo || ''
  return `${p.simbolo || ''} ${planet} ${prep} ${sign} ${symSign} (${graus}°)${retro}`.replace(/\s+/g, ' ').trim()
}

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
