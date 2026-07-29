import {
  Body,
  EclipseKind,
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
} from 'astronomy-engine'
import { longitudeCorpo, dataUTC } from './ephemeris.js'
import { grausNoSigno, signoIndex } from './math.js'
import { casaWholeSign } from './houses.js'
import { SIGNOS_PT, translateSigno } from '../i18n/astro.js'
import { getTemaCasa } from '../casasPlacidus.js'

const ECLIPSE_KIND_LABEL = {
  pt: {
    Total: 'total',
    Partial: 'parcial',
    Penumbral: 'penumbral',
    Annular: 'anular',
  },
  en: {
    Total: 'total',
    Partial: 'partial',
    Penumbral: 'penumbral',
    Annular: 'annular',
  },
  es: {
    Total: 'total',
    Partial: 'parcial',
    Penumbral: 'penumbral',
    Annular: 'anular',
  },
  it: {
    Total: 'totale',
    Partial: 'parziale',
    Penumbral: 'penombrale',
    Annular: 'anulare',
  },
  de: {
    Total: 'total',
    Partial: 'partiell',
    Penumbral: 'halbschatten',
    Annular: 'ringförmig',
  },
  fr: {
    Total: 'totale',
    Partial: 'partielle',
    Penumbral: 'pénombrale',
    Annular: 'annulaire',
  },
}

function kindLabel(kind, lang) {
  const map = ECLIPSE_KIND_LABEL[lang] || ECLIPSE_KIND_LABEL.en
  return map[kind] || kind
}

function signoDeLongitude(lon, lang) {
  const ptNome = SIGNOS_PT[signoIndex(lon)]
  return translateSigno(ptNome, lang)
}

function eclipseSignificativo(kind, tipo) {
  if (tipo === 'solar') {
    return kind === EclipseKind.Total || kind === EclipseKind.Annular || kind === EclipseKind.Partial
  }
  return kind === EclipseKind.Total || kind === EclipseKind.Partial
}

function procurarEclipsesIntervalo(inicio, fim) {
  const lista = []
  const inicioMs = inicio.getTime()
  const fimMs = fim.getTime()

  let lunar = SearchLunarEclipse(new Date(inicioMs - 15 * 86400000))
  let guard = 0
  while (lunar?.peak?.date && lunar.peak.date.getTime() < fimMs + 86400000 && guard < 24) {
    guard++
    const peak = lunar.peak.date
    if (peak.getTime() >= inicioMs && peak.getTime() <= fimMs) {
      const lon = longitudeCorpo(Body.Moon, peak)
      lista.push({
        tipo: 'lunar',
        kind: lunar.kind,
        data: peak,
        longitude: lon,
        graus: grausNoSigno(lon),
      })
    }
    lunar = NextLunarEclipse(lunar.peak)
  }

  let solar = SearchGlobalSolarEclipse(new Date(inicioMs - 15 * 86400000))
  guard = 0
  while (solar?.peak?.date && solar.peak.date.getTime() < fimMs + 86400000 && guard < 24) {
    guard++
    const peak = solar.peak.date
    if (peak.getTime() >= inicioMs && peak.getTime() <= fimMs) {
      const lon = longitudeCorpo(Body.Sun, peak)
      lista.push({
        tipo: 'solar',
        kind: solar.kind,
        data: peak,
        longitude: lon,
        graus: grausNoSigno(lon),
      })
    }
    solar = NextGlobalSolarEclipse(solar.peak)
  }

  return lista.sort((a, b) => a.data - b.data)
}

/** Eclipses no mês consultado (ano dinâmico). */
export function eclipsesNoMes(ano, mes) {
  const inicio = dataUTC(ano, mes, 1, 0)
  const fim = dataUTC(ano, mes + 1 > 12 ? 1 : mes + 1, 1, 0)
  if (mes === 12) fim.setUTCFullYear(ano + 1)
  fim.setTime(fim.getTime() - 1)
  return procurarEclipsesIntervalo(inicio, fim).filter((e) => eclipseSignificativo(e.kind, e.tipo))
}

export function enriquecerEclipses(eclipses, mapaNatal, lang) {
  const ascLon = mapaNatal?.ascendente?.longitude ?? mapaNatal?.ascendant?.longitude
  return eclipses.map((e) => {
    const signo = signoDeLongitude(e.longitude, lang)
    const casa = ascLon != null ? casaWholeSign(e.longitude, ascLon) : null
    const tema = casa ? getTemaCasa(casa, lang) : null
    return {
      ...e,
      signo,
      casa,
      temaNome: tema?.nome || null,
      temaFoco: tema?.foco || null,
      kindLabel: kindLabel(e.kind, lang),
      prioridade: e.kind === EclipseKind.Total ? 10 : e.kind === EclipseKind.Annular ? 9 : 7,
    }
  })
}
