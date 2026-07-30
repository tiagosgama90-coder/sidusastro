/**
 * Cálculo do mapa natal na landing — mesma cadeia que a app (SWE → Meeus).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { criarDataUTCporLocal } from './datetime.js'
import { calcularAngulosCasas } from './natalHouses.js'
import { longitudeParaSigno } from './astrologia.js'

const _EPHE_FILES = [
  { name: 'sepl_18.se1', url: '/ephe/sepl_18.se1' },
  { name: 'semo_18.se1', url: '/ephe/semo_18.se1' },
  { name: 'seas_18.se1', url: '/ephe/seas_18.se1' },
]

let _swePromise = null

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
      try {
        await swe.loadEphemerisFiles(_EPHE_FILES)
      } catch {
        /* Moshier fallback */
      }
      return swe
    } catch {
      return null
    }
  })()
  return _swePromise
}

const Position = (corpo, time) => GeoVector(corpo, time, true)

function calcularMapaMeeus(dados) {
  if (!dados?.data || !dados?.hora || !dados?.localizacao) return null
  if (dados.fuso == null || dados.fuso === '') return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  if (!dataUTC) return null
  const time = MakeTime(dataUTC)

  const lonSol = Ecliptic(Position(Body.Sun, time)).elon
  const lonLua = Ecliptic(Position(Body.Moon, time)).elon
  const angulos = calcularAngulosCasas(null, dataUTC, lat, lon)
  if (!angulos) return null

  return {
    solar: longitudeParaSigno(lonSol),
    lunar: longitudeParaSigno(lonLua),
    ascendente: longitudeParaSigno(angulos.ascendant),
    motor: 'astronomy-engine + Meeus',
  }
}

function calcularMapaSwe(swe, dados) {
  if (!swe || !dados?.data || !dados?.hora || !dados?.localizacao) return null
  if (dados.fuso == null || dados.fuso === '') return null

  try {
    const { lat } = dados.localizacao
    const lon = dados.localizacao.lon
    const fuso = dados.fuso ?? 0
    const dateUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
    if (!dateUTC) return null
    const angulos = calcularAngulosCasas(swe, dateUTC, lat, lon)
    if (!angulos) return null

    const jd = angulos.jd ?? swe.dateToJulianDay(dateUTC)
    const sunPos = swe.calculatePosition(jd, 0)
    const moonPos = swe.calculatePosition(jd, 1)

    return {
      solar: longitudeParaSigno(sunPos.longitude),
      lunar: longitudeParaSigno(moonPos.longitude),
      ascendente: longitudeParaSigno(angulos.ascendant),
      motor: 'Swiss Ephemeris · Tropical Placidus',
    }
  } catch {
    return null
  }
}

/** Mapa Sol/Lua/Asc — SWE prioritário, fallback Meeus (igual ao motor principal). */
export async function calcularMapaLanding(dados) {
  if (!dados?.data || !dados?.hora || !dados?.localizacao) return null
  if (dados.fuso == null || dados.fuso === '') return null

  const swe = await obterSwe()
  if (swe) {
    const mapaSwe = calcularMapaSwe(swe, dados)
    if (mapaSwe) return mapaSwe
  }
  return calcularMapaMeeus(dados)
}
