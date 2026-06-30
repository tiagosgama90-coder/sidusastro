/**
 * Fluxo Vital - biorritmo + astrologia profissional (efemérides reais).
 * Combina ciclos físico/emocional/intelectual com trânsitos do Sol e Lua,
 * fase lunar precisa e eixo natal (Sol · Lua · Ascendente).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { calcularFaseLua } from './faseLua.js'
import { SIGNOS_PT, SIGNO_EN_TO_PT, translateSigno, translateElemento, translatePlaneta } from './i18n/astro.js'
import { isPt } from './i18n/langUtil.js'

const ALIAS_SIGNO = {
  Áries: 'Carneiro', Aries: 'Carneiro',
  Câncer: 'Caranguejo', Cancer: 'Caranguejo',
  Gêmeos: 'Gémeos', Gemeos: 'Gémeos', Gemini: 'Gémeos',
  Escorpião: 'Escorpião', Escorpiao: 'Escorpião', Scorpio: 'Escorpião',
}

const Position = (corpo, time) => GeoVector(corpo, time, true)

const ELEMENTO = {
  Carneiro: 'Fogo', Touro: 'Terra', Gémeos: 'Ar', Caranguejo: 'Água',
  Leão: 'Fogo', Virgem: 'Terra', Balança: 'Ar', Escorpião: 'Água',
  Sagitário: 'Fogo', Capricórnio: 'Terra', Aquário: 'Ar', Peixes: 'Água',
}

function normalizarSigno(nome) {
  if (!nome) return nome
  if (ELEMENTO[nome]) return nome
  if (ALIAS_SIGNO[nome]) return ALIAS_SIGNO[nome]
  if (SIGNO_EN_TO_PT[nome]) return SIGNO_EN_TO_PT[nome]
  return nome
}

const MODALIDADE = {
  Carneiro: 'Cardinal', Touro: 'Fixo', Gémeos: 'Mutável', Caranguejo: 'Cardinal',
  Leão: 'Fixo', Virgem: 'Mutável', Balança: 'Cardinal', Escorpião: 'Fixo',
  Sagitário: 'Mutável', Capricórnio: 'Cardinal', Aquário: 'Fixo', Peixes: 'Mutável',
}

const PLANETA_REGENTE = {
  Carneiro: 'Marte', Touro: 'Vénus', Gémeos: 'Mercúrio', Caranguejo: 'Lua',
  Leão: 'Sol', Virgem: 'Mercúrio', Balança: 'Vénus', Escorpião: 'Marte',
  Sagitário: 'Júpiter', Capricórnio: 'Saturno', Aquário: 'Saturno', Peixes: 'Júpiter',
}

function longitudeParaSigno(longitude) {
  const lon = ((longitude % 360) + 360) % 360
  const idx = Math.floor(lon / 30)
  return SIGNOS_PT[idx]
}

function indiceSigno(nome) {
  const i = SIGNOS_PT.indexOf(nome)
  return i >= 0 ? i : 0
}

function diferencaAngular(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function aspectoPorAngulo(angle) {
  if (angle <= 8) return { tipo: 'conjunção', score: 88, natureza: 'fusão' }
  if (Math.abs(angle - 60) <= 6) return { tipo: 'sextil', score: 78, natureza: 'oportunidade' }
  if (Math.abs(angle - 90) <= 7) return { tipo: 'quadratura', score: 42, natureza: 'tensão' }
  if (Math.abs(angle - 120) <= 7) return { tipo: 'trígono', score: 92, natureza: 'fluidez' }
  if (Math.abs(angle - 180) <= 8) return { tipo: 'oposição', score: 38, natureza: 'polaridade' }
  return { tipo: 'neutro', score: 55, natureza: 'estável' }
}

function aspectoEntreLongitudes(lonA, lonB) {
  return aspectoPorAngulo(diferencaAngular(lonA, lonB))
}

function calcularCeuMomento(date = new Date()) {
  const time = MakeTime(date)
  const lonSol = Ecliptic(Position(Body.Sun, time)).elon
  const lonLua = Ecliptic(Position(Body.Moon, time)).elon
  return {
    sol: { longitude: lonSol, signo: longitudeParaSigno(lonSol) },
    lua: { longitude: lonLua, signo: longitudeParaSigno(lonLua) },
  }
}

function signoNatalLongitude(nomeSigno, mapaNatal) {
  if (!nomeSigno || !mapaNatal) return null
  if (mapaNatal.solar?.nome === nomeSigno) return ((mapaNatal.solar.graus ?? 0) + indiceSigno(nomeSigno) * 30) % 360
  if (mapaNatal.lunar?.nome === nomeSigno) return ((mapaNatal.lunar.graus ?? 0) + indiceSigno(nomeSigno) * 30) % 360
  return indiceSigno(nomeSigno) * 30 + 15
}

export function analisarFluxoVital({ fisico, emocional, intelectual, mapaNatal, lang = 'pt' }) {
  const pt = isPt(lang)
  const hoje = new Date()
  const ceu = calcularCeuMomento(hoje)
  const faseLua = calcularFaseLua(hoje, lang)

  const solar = normalizarSigno(mapaNatal?.solar?.nome)
  const lunar = normalizarSigno(mapaNatal?.lunar?.nome)
  const ascendente = normalizarSigno(mapaNatal?.ascendente?.nome)

  const ts = (s) => translateSigno(s, lang)
  const te = (e) => translateElemento(e, lang)
  const tp = (p) => translatePlaneta(p, lang)

  const cruzCritica = [fisico, emocional, intelectual].filter((v) => Math.abs(v) < 15).length >= 2
  const todosAltos = fisico > 50 && emocional > 50 && intelectual > 50
  const algumBaixo = fisico < -40 || emocional < -40 || intelectual < -40

  const lonSolNatal = solar ? signoNatalLongitude(solar, mapaNatal) : null
  const lonLuaNatal = lunar ? signoNatalLongitude(lunar, mapaNatal) : null

  const aspectoSol = lonSolNatal != null
    ? aspectoEntreLongitudes(ceu.sol.longitude, lonSolNatal)
    : aspectoEntreSignos(ceu.sol.signo, solar)

  const aspectoLua = lonLuaNatal != null
    ? aspectoEntreLongitudes(ceu.lua.longitude, lonLuaNatal)
    : aspectoEntreSignos(ceu.lua.signo, lunar)

  const faseTxt = pt
    ? `${faseLua.emoji} ${faseLua.nome} - ${faseLua.iluminacao}% iluminada. ${faseLua.desc}`
    : `${faseLua.emoji} ${faseLua.nome} - ${faseLua.iluminacao}% ${lang === 'es' ? 'iluminada' : lang === 'de' ? 'beleuchtet' : lang === 'fr' ? 'illuminée' : 'illuminated'}. ${faseLua.desc}`

  let ritmoElementar = ''
  if (solar && lunar) {
    const elSol = ELEMENTO[solar]
    const elLua = ELEMENTO[lunar]
    const modSol = MODALIDADE[solar]
    const regente = PLANETA_REGENTE[ceu.sol.signo]
    const solTr = ts(ceu.sol.signo)
    const elSolTr = te(elSol)
    const elLuaTr = te(elLua)
    const regTr = tp(regente)
    ritmoElementar = pt
      ? `Eixo natal ${elSol}/${elLua} (${modSol}). Hoje o Sol transita ${ceu.sol.signo} (${ELEMENTO[ceu.sol.signo]}), regido por ${regente}, em ${aspectoSol.tipo} com o teu Sol natal - ${aspectoSol.natureza} de energia. A Lua em ${ceu.lua.signo} modula o ritmo emocional do dia.`
      : `Natal axis ${elSolTr}/${elLuaTr} (${modSol}). Today the Sun transits ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), ruled by ${regTr}, ${aspectoSol.tipo} your natal Sun - ${aspectoSol.natureza} energy. The Moon in ${ts(ceu.lua.signo)} shapes today's emotional rhythm.`
  } else {
    ritmoElementar = pt
      ? `Sol em ${ceu.sol.signo}, Lua em ${ceu.lua.signo}. Observa como o elemento ${ELEMENTO[ceu.sol.signo]} colore a tua energia hoje.`
      : `Sun in ${ts(ceu.sol.signo)}, Moon in ${ts(ceu.lua.signo)}. Notice how ${te(ELEMENTO[ceu.sol.signo])} colours your energy today.`
  }

  let luaNatal = ''
  if (lunar && aspectoLua) {
    luaNatal = pt
      ? `Lua natal em ${lunar} (${ELEMENTO[lunar]}): trânsito lunar em ${aspectoLua.tipo} (${aspectoLua.score}% harmonia). ${aspectoLua.score >= 75 ? 'Emoções fluem com clareza - bom momento para diálogo íntimo.' : aspectoLua.score <= 45 ? 'Sensibilidade amplificada; protege o espaço emocional.' : 'Equilíbrio entre razão e sentimento nas decisões.'}`
      : `Natal Moon in ${ts(lunar)} (${te(ELEMENTO[lunar])}): lunar transit ${aspectoLua.tipo} (${aspectoLua.score}% harmony). ${aspectoLua.score >= 75 ? 'Emotions flow clearly - good for intimate dialogue.' : aspectoLua.score <= 45 ? 'Heightened sensitivity; protect emotional space.' : 'Balance reason and feeling in decisions.'}`
  }

  let ascendenteNota = ''
  if (ascendente) {
    ascendenteNota = pt
      ? `Ascendente em ${ascendente}: ciclo físico a ${Math.round(fisico)}% - ${fisico > 30 ? 'corpo pede expressão visível e movimento' : fisico < -30 ? 'privilegia descanso e rotinas suaves' : 'presença equilibrada no mundo exterior'}.`
      : `Ascendant in ${ts(ascendente)}: physical cycle at ${Math.round(fisico)}% - ${fisico > 30 ? 'body asks for visible expression and movement' : fisico < -30 ? 'favour rest and gentle routines' : 'balanced presence outward'}.`
  }

  let estrategia = ''
  if (cruzCritica) {
    estrategia = pt
      ? '⚠ Cruz crítica bio-rítmica: dois ou mais ciclos em transição. Evita decisões irreversíveis e competição intensa. Prioriza sono, hidratação e tarefas de baixo risco. A Lua aconselha recolhimento.'
      : '⚠ Biorhythm critical cross: two or more cycles in transition. Avoid irreversible decisions and intense competition. Prioritise sleep, hydration and low-risk tasks. The Moon advises withdrawal.'
  } else if (todosAltos) {
    estrategia = pt
      ? '✦ Janela de alto rendimento: físico, emocional e intelectual alinhados. O trânsito solar favorável sustenta negociações, apresentações e treino. Aproveita a fase lunar para materializar intenções.'
      : '✦ High-performance window: physical, emotional and intellectual cycles aligned. Favourable solar transit supports negotiations, presentations and training. Use the lunar phase to manifest intentions.'
  } else if (algumBaixo) {
    const foco = fisico <= emocional && fisico <= intelectual ? (pt ? 'corpo' : 'body')
      : emocional <= intelectual ? (pt ? 'emoções' : 'emotions') : (pt ? 'mente' : 'mind')
    estrategia = pt
      ? `✦ Recuperação no eixo ${foco}. Delega, reduz estímulos e foca numa prioridade. Astrologia: ${faseLua.iluminacao > 50 ? 'Lua gibosa/cheia pede integração antes de agir' : 'Lua minguante favorece libertação do que esgota'}.`
      : `✦ Recovery on the ${foco} axis. Delegate, reduce stimuli and focus on one priority. Astrology: ${faseLua.iluminacao > 50 ? 'gibbous/full Moon asks integration before action' : 'waning Moon favours releasing what drains you'}.`
  } else {
    estrategia = pt
      ? '✦ Dia misto: usa o pico intelectual para planear, o emocional para relações e o físico para rotinas leves. Sincroniza com o trânsito lunar actual.'
      : '✦ Mixed day: use intellectual peak to plan, emotional for relationships and physical for light routines. Sync with the current lunar transit.'
  }

  const picos = [
    { nome: pt ? 'Físico' : 'Physical', val: fisico, cor: '#FB923C' },
    { nome: pt ? 'Emocional' : 'Emotional', val: emocional, cor: '#F472B6' },
    { nome: pt ? 'Intelectual' : 'Intellectual', val: intelectual, cor: '#60A5FA' },
  ].sort((a, b) => b.val - a.val)

  return {
    faseLunar: faseTxt,
    ritmoElementar,
    luaNatal,
    ascendenteNota,
    estrategia,
    cruzCritica,
    picoDominante: picos[0],
    valeDominante: picos[2],
    signoTransito: ceu.sol.signo,
    signoLuaTransito: ceu.lua.signo,
    aspectoSol,
    aspectoLua,
  }
}

function aspectoEntreSignos(a, b) {
  if (!a || !b) return { tipo: 'neutro', score: 55, natureza: 'estável' }
  const diff = Math.abs(indiceSigno(a) - indiceSigno(b)) % 12
  const d = diff > 6 ? 12 - diff : diff
  const angulo = [0, 60, 90, 120, 180].find((x) => x === d * 30) ?? d * 30
  return aspectoPorAngulo(angulo === 0 && d === 0 ? 0 : d * 30)
}
