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

export function translateSigno(nome, lang) {
  if (!nome || lang === 'pt') return nome
  return SIGNO_PT_TO_EN[nome] || nome
}

export function translatePlaneta(nome, lang) {
  if (!nome || lang === 'pt') return nome
  return PLANETAS_PT_TO_EN[nome] || nome
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
