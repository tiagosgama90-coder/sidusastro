/**
 * Compositor profissional de interpretações — estilo Cafe Astrology.
 * Cruza planeta + signo + casa + aspetos sem graus, orbes ou templates robóticos.
 */
import { PLANET_SIGN_PT } from './dados/planetSign.pt.js'
import { PLANET_SIGN_EN } from './dados/planetSign.en.js'
import { PLANET_HOUSE_PT } from './dados/planetHouse.pt.js'
import { PLANET_HOUSE_EN } from './dados/planetHouse.en.js'
import { narrarAspectosPlaneta } from './aspectosNarrativa.js'
import { translatePlaneta } from '../i18n/astro.js'

const SIGNOS_NORM = {
  Áries: 'Carneiro', Aries: 'Carneiro', Cancer: 'Caranguejo', Scorpio: 'Escorpião',
}

function normalizarSigno(nome) {
  if (!nome) return null
  return SIGNOS_NORM[nome] || nome
}

function signoEnDePt(signoPt) {
  const map = {
    Carneiro: 'Aries', Touro: 'Taurus', Gémeos: 'Gemini', Caranguejo: 'Cancer',
    Leão: 'Leo', Virgem: 'Virgo', Balança: 'Libra', Escorpião: 'Scorpio',
    Sagitário: 'Sagittarius', Capricórnio: 'Capricorn', Aquário: 'Aquarius', Peixes: 'Pisces',
  }
  return map[signoPt] || signoPt
}

function planetaEn(nome) {
  return translatePlaneta(nome, 'en') || nome
}

function textoPlanetSign(planeta, signo, lang) {
  const chave = normalizarSigno(signo)
  if (lang === 'en') {
    const pEn = planetaEn(planeta)
    return PLANET_SIGN_EN[pEn]?.[signoEnDePt(chave)] || ''
  }
  return PLANET_SIGN_PT[planeta]?.[chave] || ''
}

function textoPlanetHouse(planeta, casa, lang) {
  if (!casa) return ''
  if (lang === 'en') {
    const pEn = planetaEn(planeta)
    return PLANET_HOUSE_EN[pEn]?.[casa] || ''
  }
  return PLANET_HOUSE_PT[planeta]?.[casa] || ''
}

/**
 * Interpretação completa de um planeta: signo + casa + aspetos.
 * @param {string} nomePlaneta - Nome PT (Sol, Mercúrio, ...)
 * @param {object} p - Posição { signo, casa, retrograde }
 * @param {Array} aspetos
 * @param {Array} planetas
 * @param {string} lang
 * @param {string} [textoSignoRico] - Texto premium pré-existente (Sol/Lua/Asc)
 */
export function comporInterpretacaoPlaneta(nomePlaneta, p, aspetos, planetas, lang = 'pt', textoSignoRico = '') {
  if (!p?.signo?.nome) {
    return lang === 'en'
      ? `${translatePlaneta(nomePlaneta, lang)} could not be calculated for this chart. Verify birth time and place.`
      : `${nomePlaneta} não foi possível calcular neste mapa. Verifica hora e local de nascimento.`
  }

  const signo = p.signo.nome
  const partes = []

  const nucleoSigno = textoSignoRico || textoPlanetSign(nomePlaneta, signo, lang)
  if (nucleoSigno) partes.push(nucleoSigno)

  const casaTxt = textoPlanetHouse(nomePlaneta, p.casa, lang)
  if (casaTxt) partes.push(casaTxt)

  const aspTxt = narrarAspectosPlaneta(nomePlaneta, aspetos, planetas, lang)
  if (aspTxt) partes.push(aspTxt.trim())

  if (p.retrograde) {
    partes.push(lang === 'en'
      ? `${translatePlaneta(nomePlaneta, lang)} retrograde: this energy turns inward — you review, rethink and refine this area before expressing it outwardly.`
      : `${nomePlaneta} retrógrado: esta energia volta para dentro — revisas, repensas e afinas esta área antes de a expressares no mundo.`)
  }

  return partes.join('\n\n')
}

export { textoPlanetSign, textoPlanetHouse }
