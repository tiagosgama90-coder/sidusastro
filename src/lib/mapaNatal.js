import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { longitudeParaSigno } from './astrologia.js'
import { calcularAscendenteEMc } from './ascendente.js'
import { cuspsEqualHouse, normalizarCusps } from './casasPlacidus.js'
import { criarDataUTCporLocal } from './datetime.js'

/** Fallback Meeus + astronomy-engine quando Swiss Ephemeris indisponível. */
export function calcularMapaNatalMeeus(dados) {
  if (!dados?.data || !dados?.hora || !dados?.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  if (!dataUTC) return null

  const time = MakeTime(dataUTC)
  const lonSol = Ecliptic(GeoVector(Body.Sun, time, true)).elon
  const lonLua = Ecliptic(GeoVector(Body.Moon, time, true)).elon
  const { asc: lonAsc, mc: lonMc } = calcularAscendenteEMc(dataUTC, lat, lon)

  return {
    solar: longitudeParaSigno(lonSol),
    lunar: longitudeParaSigno(lonLua),
    ascendente: longitudeParaSigno(lonAsc),
    mc: longitudeParaSigno(lonMc),
    cusps: cuspsEqualHouse(lonAsc),
    sistema: 'Tropical · Placidus (fallback casas iguais)',
    instanteUTC: dataUTC.toISOString(),
    lat,
    lon,
    fuso,
    motor: 'astronomy-engine + Meeus',
  }
}

/** Mapa natal com Swiss Ephemeris (swe_calc_ut + swe_houses Placidus). */
export function calcularMapaNatalSwe(swe, dados, { ephemerisPronta = false, motorStatus = 'swisseph-full' } = {}) {
  if (!swe || !dados?.data || !dados?.hora || !dados?.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dateUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  if (!dateUTC) return null

  const jd = swe.dateToJulianDay(dateUTC)
  const sunPos = swe.calculatePosition(jd, 0)
  const moonPos = swe.calculatePosition(jd, 1)
  const houses = swe.calculateHouses(jd, lat, lon, 'P')
  const cusps = normalizarCusps(houses) ?? cuspsEqualHouse(houses.ascendant)

  const motorLabel = ephemerisPronta
    ? 'Swiss Ephemeris · Tropical Placidus'
    : motorStatus === 'swisseph-moshier'
      ? 'Swiss Ephemeris Moshier · Tropical Placidus'
      : 'Swiss Ephemeris · Tropical Placidus'

  console.info(
    `[Sidus] JD=${jd.toFixed(6)} · UTC=${dateUTC.toISOString()} · lat=${lat.toFixed(4)} lon=${lon.toFixed(4)}` +
    ` · Sol=${sunPos.longitude.toFixed(3)}° Lua=${moonPos.longitude.toFixed(3)}° Asc=${houses.ascendant.toFixed(3)}°`,
  )

  return {
    solar: longitudeParaSigno(sunPos.longitude),
    lunar: longitudeParaSigno(moonPos.longitude),
    ascendente: longitudeParaSigno(houses.ascendant),
    mc: longitudeParaSigno(houses.mc),
    cusps,
    sistema: 'Tropical · Placidus',
    instanteUTC: dateUTC.toISOString(),
    lat,
    lon,
    fuso,
    motor: motorLabel,
    jd,
  }
}
