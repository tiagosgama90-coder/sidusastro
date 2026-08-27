import { contentForLang } from '../i18n/langUtil.js'
import { MESES_BY_LANG, TIPO_ICO, IMPACTO_COR } from './constants.js'
import { obterMotorEphemeris } from './ephemeris.js'
import { eclipsesNoMes, enriquecerEclipses } from './eclipses.js'
import { calcularTransitosMes, eventosColectivosMes } from './transits.js'
import { interpretarTransito, textoAlertaEclipse } from './interpretation.js'
import { casaWholeSign } from './houses.js'
import { posicoesPlanetas } from './ephemeris.js'

function impactoDe(transito) {
  const p = transito.planetaTransito
  if (p === 'Plutão' || p === 'Urano') return 'transformador'
  if (p === 'Saturno') return 'desafio'
  if (p === 'Marte') return 'intenso'
  if (p === 'Júpiter') return 'optimismo'
  if (transito.aspecto === 'quadratura' || transito.aspecto === 'oposicao') return 'atenção'
  return 'médio'
}

const PLANETAS_RAPIDOS = new Set(['Lua', 'Mercúrio', 'Vénus', 'Marte'])

function resumoDiario(motor, mapaNatal, planetasNatal, lang) {
  const agora = new Date()
  const posicoes = posicoesPlanetas(motor, agora)
  const nomes = posicoes.map((p) => `${p.nome} em ${p.longitude.toFixed(1)}°`).join(', ')
  const retrogrados = posicoes.filter((p) => p.retrogrado).map((p) => p.nome)
  const lentos = posicoes.filter((p) => !PLANETAS_RAPIDOS.has(p.nome)).map((p) => p.nome)
  const transitos = mapaNatal
    ? calcularTransitosMes({ motor, ano: agora.getUTCFullYear(), mes: agora.getUTCMonth() + 1, mapaNatal, planetasNatal, lang })
      .filter((t) => t.diasActivos?.some((d) => d.dia === agora.getUTCDate()))
    : []
  const pt = lang === 'pt'
  return {
    data: agora.toISOString().slice(0, 10),
    posicoes,
    transitos,
    titulo: pt ? 'Leitura do céu de hoje' : 'Today\'s sky reading',
    texto: pt
      ? `O céu de hoje combina ${nomes}. As energias rápidas, de ${[...PLANETAS_RAPIDOS].join(', ')}, descrevem o ritmo do quotidiano; os ciclos lentos, com destaque para ${lentos.join(', ')}, assinalam tendências de fundo que pedem decisões conscientes.${retrogrados.length ? ` Em revisão: ${retrogrados.join(', ')}.` : ''}`
      : `Today's sky combines ${nomes}. Fast planets describe the daily rhythm, while slower cycles involving ${lentos.join(', ')} mark background themes that deserve conscious choices.${retrogrados.length ? ` Under review: ${retrogrados.join(', ')}.` : ''}`,
    carreira: pt ? 'Carreira: observa responsabilidades, prioridades e decisões que exigem estrutura. Evita prometer mais do que o ritmo real permite.' : 'Career: observe responsibilities, priorities and decisions that require structure. Avoid promising more than the real pace allows.',
    amor: pt ? 'Amor: dá atenção ao tom das conversas e às necessidades emocionais concretas. Clareza e presença valem mais do que interpretações apressadas.' : 'Love: pay attention to conversation tone and concrete emotional needs. Clarity and presence matter more than rushed interpretations.',
    corpo: pt ? 'Ritmo pessoal: os planetas rápidos favorecem atenção ao humor, comunicação, desejo e energia do dia. Faz pausas antes de reagir.' : 'Personal rhythm: fast planets highlight mood, communication, desire and daily energy. Pause before reacting.',
  }
}

const IMPACTO_BY_LANG = {
  pt: { alto: 'alto', médio: 'médio', baixo: 'baixo', atenção: 'atenção', intenso: 'intenso', transformador: 'transformador', desafio: 'desafio', padrão: 'padrão', optimismo: 'optimismo' },
  en: { alto: 'high', médio: 'medium', baixo: 'low', atenção: 'caution', intenso: 'intense', transformador: 'transformative', desafio: 'challenge', padrão: 'standard', optimismo: 'optimism' },
  es: { alto: 'alto', médio: 'medio', baixo: 'bajo', atenção: 'atención', intenso: 'intenso', transformador: 'transformador', desafio: 'desafío', padrão: 'estándar', optimismo: 'optimismo' },
  it: { alto: 'alto', médio: 'medio', baixo: 'basso', atenção: 'attenzione', intenso: 'intenso', transformador: 'trasformativo', desafio: 'sfida', padrão: 'standard', optimismo: 'ottimismo' },
  de: { alto: 'hoch', médio: 'mittel', baixo: 'niedrig', atenção: 'Vorsicht', intenso: 'intensiv', transformador: 'transformativ', desafio: 'Herausforderung', padrão: 'Standard', optimismo: 'Optimismus' },
  fr: { alto: 'élevé', médio: 'moyen', baixo: 'faible', atenção: 'attention', intenso: 'intense', transformador: 'transformateur', desafio: 'défi', padrão: 'standard', optimismo: 'optimisme' },
}

function montarMes({
  motor,
  ano,
  mes,
  lang,
  mapaNatal,
  planetasNatal,
}) {
  const meses = contentForLang(lang, MESES_BY_LANG) || MESES_BY_LANG.en
  const impactoMap = contentForLang(lang, IMPACTO_BY_LANG) || IMPACTO_BY_LANG.en
  const mesLabel = meses[mes - 1]

  const eclipsesRaw = eclipsesNoMes(ano, mes)
  const eclipses = enriquecerEclipses(eclipsesRaw, mapaNatal, lang, planetasNatal).map((e) => ({
    ...e,
    texto: textoAlertaEclipse(e, lang),
    icone: e.tipo === 'solar' ? TIPO_ICO.eclipseSolar : TIPO_ICO.eclipseLunar,
  }))

  const transitosRaw = mapaNatal
    ? calcularTransitosMes({ motor, ano, mes, mapaNatal, planetasNatal, lang })
    : []

  const transitos = transitosRaw.map((tr) => {
    const interp = interpretarTransito(tr, lang)
    const impacto = impactoDe(tr)
    return {
      ...tr,
      ...interp,
      impacto,
      impactoLabel: impactoMap[impacto] || impacto,
      icone: TIPO_ICO[tr.aspecto] || TIPO_ICO.trânsito,
    }
  })

  const eventos = eventosColectivosMes(motor, ano, mes, lang)

  return {
    mes: mesLabel,
    mesNum: mes,
    ano,
    eclipses,
    transitos,
    eventos,
    destaque: transitos[0] || null,
  }
}

/**
 * Calcula relatório mensal ou anual da Bússola Cósmica.
 * @param {object} opts
 * @param {string} opts.lang
 * @param {number} [opts.year]
 * @param {number} [opts.month] - se omitido, devolve 12 meses
 * @param {object} [opts.mapaNatal]
 * @param {Array} [opts.planetasNatal]
 */
export async function calcularBussolaAsync({
  lang = 'pt',
  year,
  month,
  mapaNatal,
  planetasNatal,
} = {}) {
  const agora = new Date()
  const ano = year ?? agora.getUTCFullYear()
  const motor = await obterMotorEphemeris()
  const diario = resumoDiario(motor, mapaNatal, planetasNatal, lang)

  const ascLon = mapaNatal?.ascendente?.longitude ?? mapaNatal?.ascendant?.longitude

  if (month != null) {
    const relatorio = montarMes({
      motor,
      ano,
      mes: month,
      lang,
      mapaNatal,
      planetasNatal,
    })
    return {
      ano,
      mes: month,
      relatorio,
      meses: [relatorio],
      sistemaCasas: 'Whole Sign (Ptolomeu)',
      ascCasa: ascLon != null ? casaWholeSign(ascLon, ascLon) : 1,
      motor: motor.rotulo,
      geradoEm: new Date().toISOString(),
      diario,
    }
  }

  const meses = []
  for (let m = 1; m <= 12; m++) {
    meses.push(montarMes({
      motor,
      ano,
      mes: m,
      lang,
      mapaNatal,
      planetasNatal,
    }))
  }

  return {
    ano,
    meses,
    sistemaCasas: 'Whole Sign (Ptolomeu)',
    motor: motor.rotulo,
    geradoEm: new Date().toISOString(),
    diario,
  }
}

/** Compatibilidade com código antigo. */
export async function calcularBussola2026Async(lang, mapaNatal, planetasNatal) {
  return calcularBussolaAsync({ lang, mapaNatal, planetasNatal })
}

export function relevanciaParaMapa() {
  return true
}

export { TIPO_ICO, IMPACTO_COR }
