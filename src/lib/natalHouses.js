/**
 * Ascendente, Descendente, MC e IC — Swiss Ephemeris (JPL) ou fórmula Meeus equivalente.
 * Longitude geográfica: positiva a Este (convénção Swiss Ephemeris / NASA JPL).
 */
import { MakeTime, SiderealTime } from 'astronomy-engine'
import { normalizarCusps, cuspsEqualHouse } from './casasPlacidus.js'

export function normalizarGrausEcliptica(lon) {
  return ((Number(lon) % 360) + 360) % 360
}

function obliquidadeEcliptica(dateUTC) {
  const T = (dateUTC.getTime() / 86400000 - 10957.5) / 36525
  return 23.439291111 - 0.013004167 * T - 0.000000164 * T * T
}

/**
 * Ascendente e MC — algoritmo padrão swe_houses / Jean Meeus (sem correcções ad-hoc).
 */
export function calcularAngulosCasasMeeus(dataUTC, latitude, longitude) {
  if (!dataUTC || latitude == null || longitude == null) return null
  const lat = Math.max(-89.9, Math.min(89.9, Number(latitude)))
  const lon = Number(longitude)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null

  const time = MakeTime(dataUTC)
  const gmstDeg = SiderealTime(time) * 15
  const ramc = normalizarGrausEcliptica(gmstDeg + lon)
  const ramcRad = (ramc * Math.PI) / 180
  const latRad = (lat * Math.PI) / 180
  const eps = (obliquidadeEcliptica(dataUTC) * Math.PI) / 180

  const mc = normalizarGrausEcliptica(
    Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) * (180 / Math.PI),
  )

  const asc = normalizarGrausEcliptica(
    Math.atan2(
      Math.cos(ramcRad),
      -(Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps)),
    ) * (180 / Math.PI),
  )

  const cusps = cuspsEqualHouse(asc)
  return {
    ascendant: asc,
    mc,
    descendente: normalizarGrausEcliptica(cusps[6]),
    ic: normalizarGrausEcliptica(cusps[3]),
    cusps,
    jd: null,
    sistema: 'Tropical · Placidus (Meeus)',
  }
}

/** Casas via swe_houses — efemérides JPL, precisão sub-arco-segundo. */
export function calcularAngulosCasasSwe(swe, dateUTC, latitude, longitude) {
  if (!swe || !dateUTC) return null
  const lat = Number(latitude)
  const lon = Number(longitude)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null

  const jd = swe.dateToJulianDay(dateUTC)
  const houses = swe.calculateHouses(jd, lat, lon, 'P')
  if (!houses || houses.ascendant == null || houses.mc == null) return null

  const asc = normalizarGrausEcliptica(houses.ascendant)
  const mc = normalizarGrausEcliptica(houses.mc)
  const cusps = normalizarCusps(houses) ?? cuspsEqualHouse(asc)

  return {
    ascendant: asc,
    mc,
    descendente: normalizarGrausEcliptica(cusps[6]),
    ic: normalizarGrausEcliptica(cusps[3]),
    cusps,
    jd,
    sistema: 'Tropical · Placidus',
  }
}

/** SWE prioritário; fallback Meeus se indisponível. */
export function calcularAngulosCasas(swe, dateUTC, latitude, longitude) {
  if (swe) {
    try {
      const r = calcularAngulosCasasSwe(swe, dateUTC, latitude, longitude)
      if (r) return r
    } catch (e) {
      console.warn('[Sidus] swe_houses falhou, fallback Meeus:', e?.message)
    }
  }
  try {
    return calcularAngulosCasasMeeus(dateUTC, latitude, longitude)
  } catch (e) {
    console.warn('[Sidus] Meeus houses falhou:', e?.message)
    return null
  }
}
