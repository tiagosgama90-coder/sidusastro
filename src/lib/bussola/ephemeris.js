import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { PLANETAS_TRANSITO } from './constants.js'
import { normalizarGraus } from './math.js'

const _EPHE_FILES = [
  { name: 'sepl_18.se1', url: '/ephe/sepl_18.se1' },
  { name: 'semo_18.se1', url: '/ephe/semo_18.se1' },
  { name: 'seas_18.se1', url: '/ephe/seas_18.se1' },
]

let _swePromise = null

export async function obterMotorEphemeris() {
  const swe = await obterSwe()
  if (swe) return { tipo: 'swe', instancia: swe, rotulo: 'Swiss Ephemeris · Tropical' }
  return { tipo: 'ae', instancia: null, rotulo: 'astronomy-engine · Tropical' }
}

async function obterSwe() {
  if (_swePromise) return _swePromise
  _swePromise = (async () => {
    try {
      const mod = await import('@swisseph/browser')
      const SweClass = mod.default || mod.SwissEphemeris
      if (typeof SweClass !== 'function') return null
      const swe = new SweClass()
      await Promise.race([
        swe.init(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 12000)),
      ])
      try { await swe.loadEphemerisFiles(_EPHE_FILES) } catch { /* Moshier fallback */ }
      return swe
    } catch {
      return null
    }
  })()
  return _swePromise
}

export function longitudePlaneta(motor, planeta, date) {
  if (motor.tipo === 'swe' && motor.instancia) {
    const jd = motor.instancia.dateToJulianDay(date)
    return normalizarGraus(motor.instancia.calculatePosition(jd, planeta.sweId).longitude)
  }
  return normalizarGraus(Ecliptic(GeoVector(planeta.corpo, MakeTime(date), true)).elon)
}

export function longitudeCorpo(corpo, date) {
  return normalizarGraus(Ecliptic(GeoVector(corpo, MakeTime(date), true)).elon)
}

export function posicoesPlanetas(motor, date) {
  return PLANETAS_TRANSITO.map((pl) => {
    const lon = longitudePlaneta(motor, pl, date)
    const lonAmanha = longitudePlaneta(motor, pl, new Date(date.getTime() + 86400000))
    let diff = lonAmanha - lon
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    return {
      ...pl,
      longitude: lon,
      retrogrado: diff < 0,
    }
  })
}

export function diasNoMes(ano, mes) {
  return new Date(ano, mes, 0).getDate()
}

export function dataUTC(ano, mes, dia, hora = 12) {
  return new Date(Date.UTC(ano, mes - 1, dia, hora, 0, 0))
}
