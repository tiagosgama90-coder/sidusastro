import { contentForLang } from '../i18n/langUtil.js'
import { MESES_BY_LANG, TIPO_ICO, IMPACTO_COR } from './constants.js'
import { obterMotorEphemeris } from './ephemeris.js'
import { eclipsesNoMes, enriquecerEclipses } from './eclipses.js'
import { calcularTransitosMes, eventosColectivosMes } from './transits.js'
import { interpretarTransito, textoAlertaEclipse } from './interpretation.js'
import { casaWholeSign } from './houses.js'

function impactoDe(transito) {
  const p = transito.planetaTransito
  if (p === 'Plutão' || p === 'Urano') return 'transformador'
  if (p === 'Saturno') return 'desafio'
  if (p === 'Marte') return 'intenso'
  if (p === 'Júpiter') return 'optimismo'
  if (transito.aspecto === 'quadratura' || transito.aspecto === 'oposicao') return 'atenção'
  return 'médio'
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
