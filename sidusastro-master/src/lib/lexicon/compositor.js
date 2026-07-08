/**
 * Compositor profissional de interpretações - estilo Cafe Astrology.
 */
import { PLANET_SIGN_PT } from './dados/planetSign.pt.js'
import { PLANET_SIGN_EN } from './dados/planetSign.en.js'
import { PLANET_SIGN_ES } from './dados/planetSign.es.js'
import { PLANET_SIGN_IT } from './dados/planetSign.it.js'
import { PLANET_SIGN_DE } from './dados/planetSign.de.js'
import { PLANET_SIGN_FR } from './dados/planetSign.fr.js'
import { PLANET_HOUSE_PT } from './dados/planetHouse.pt.js'
import { PLANET_HOUSE_EN } from './dados/planetHouse.en.js'
import { PLANET_HOUSE_ES } from './dados/planetHouse.es.js'
import { PLANET_HOUSE_IT } from './dados/planetHouse.it.js'
import { PLANET_HOUSE_DE } from './dados/planetHouse.de.js'
import { PLANET_HOUSE_FR } from './dados/planetHouse.fr.js'
import { narrarAspectosPlaneta } from './aspectosNarrativa.js'
import { translatePlaneta, translateSigno } from '../i18n/astro.js'
import { contentForLang } from '../i18n/langUtil.js'

const SIGNOS_NORM = {
  Áries: 'Carneiro', Aries: 'Carneiro', Cancer: 'Caranguejo', Scorpio: 'Escorpião',
}

const SIGN_PACKS = {
  pt: PLANET_SIGN_PT, en: PLANET_SIGN_EN, es: PLANET_SIGN_ES,
  it: PLANET_SIGN_IT, de: PLANET_SIGN_DE, fr: PLANET_SIGN_FR,
}

const HOUSE_PACKS = {
  pt: PLANET_HOUSE_PT, en: PLANET_HOUSE_EN, es: PLANET_HOUSE_ES,
  it: PLANET_HOUSE_IT, de: PLANET_HOUSE_DE, fr: PLANET_HOUSE_FR,
}

function normalizarSigno(nome) {
  if (!nome) return null
  return SIGNOS_NORM[nome] || nome
}

function textoPlanetSign(planeta, signo, lang) {
  const chave = normalizarSigno(signo)
  const pack = contentForLang(lang, SIGN_PACKS) || SIGN_PACKS.en
  const pKey = lang === 'pt' ? planeta : translatePlaneta(planeta, lang)
  const sKey = lang === 'pt' ? chave : translateSigno(chave, lang)
  return pack[pKey]?.[sKey] || pack[planeta]?.[chave] || ''
}

function textoPlanetHouse(planeta, casa, lang) {
  if (!casa) return ''
  const pack = contentForLang(lang, HOUSE_PACKS) || HOUSE_PACKS.en
  const pKey = lang === 'pt' ? planeta : translatePlaneta(planeta, lang)
  return pack[pKey]?.[casa] || pack[planeta]?.[casa] || ''
}

const RETRO_MSG = {
  pt: (p) => `${p} retrógrado: esta energia volta para dentro - revisas, repensas e afinas esta área antes de a expressares no mundo.`,
  en: (p) => `${p} retrograde: this energy turns inward - you review, rethink and refine this area before expressing it outwardly.`,
  es: (p) => `${p} retrógrado: esta energía vuelve hacia dentro - revisas, repiensas y afinas esta área antes de expresarla al mundo.`,
  it: (p) => `${p} retrogrado: questa energia torna verso l'interno - rivedi, ripensi e affini quest'area prima di esprimerla nel mondo.`,
  de: (p) => `${p} rückläufig: diese Energie wendet sich nach innen - du überprüfst, denkst neu und verfeinerst diesen Bereich, bevor du ihn nach außen ausdrückst.`,
  fr: (p) => `${p} rétrograde : cette énergie se tourne vers l'intérieur - tu révises, repenses et affines ce domaine avant de l'exprimer au monde.`,
}

const MISSING_PLANET = {
  pt: (p) => `${p} não foi possível calcular neste mapa. Verifica hora e local de nascimento.`,
  en: (p) => `${p} could not be calculated for this chart. Verify birth time and place.`,
  es: (p) => `${p} no pudo calcularse en esta carta. Verifica hora y lugar de nacimiento.`,
  it: (p) => `${p} non è stato possibile calcolarlo in questa carta. Verifica ora e luogo di nascita.`,
  de: (p) => `${p} konnte in dieser Karte nicht berechnet werden. Überprüfe Geburtszeit und -ort.`,
  fr: (p) => `${p} n'a pas pu être calculé dans cette carte. Vérifie l'heure et le lieu de naissance.`,
}

export function comporInterpretacaoPlaneta(nomePlaneta, p, aspetos, planetas, lang = 'pt', textoSignoRico = '') {
  if (!p?.signo?.nome) {
    const pNome = translatePlaneta(nomePlaneta, lang) || nomePlaneta
    const fn = MISSING_PLANET[lang] || MISSING_PLANET.en
    return fn(pNome)
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
    const pNome = translatePlaneta(nomePlaneta, lang) || nomePlaneta
    const fn = RETRO_MSG[lang] || RETRO_MSG.en
    partes.push(fn(pNome))
  }

  return partes.join('\n\n')
}

export { textoPlanetSign, textoPlanetHouse }
