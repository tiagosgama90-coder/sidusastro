import { MakeTime, SiderealTime } from 'astronomy-engine'

/**
 * Ascendente e MC via Meeus "Astronomical Algorithms" cap. 13–14.
 * ASC = atan2(cos(RAMC), -(sin(RAMC)·cos(ε) + tan(φ)·sin(ε)))
 * MC  = atan2(sin(RAMC),  cos(RAMC)·cos(ε) - tan(φ)·sin(ε))
 */
export function calcularAscendenteEMc(dataUTC, latitude, longitude) {
  if (!dataUTC || latitude == null || longitude == null) return { asc: 0, mc: 0 }
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return { asc: 0, mc: 0 }

  const lat = Math.max(-89, Math.min(89, latitude))
  const time = MakeTime(dataUTC)
  const ramc = ((SiderealTime(time) * 15 + longitude) % 360 + 360) % 360

  const T = (dataUTC.getTime() / 86400000 - 10957.5) / 36525
  const eDeg = 23.439291111 - 0.013004167 * T - 0.000000164 * T * T
  const e = (eDeg * Math.PI) / 180
  const ramcRad = (ramc * Math.PI) / 180
  const latRad = (lat * Math.PI) / 180

  const asc = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e)),
  ) * (180 / Math.PI)

  const mc = Math.atan2(
    Math.sin(ramcRad),
    Math.cos(ramcRad) * Math.cos(e) - Math.tan(latRad) * Math.sin(e),
  ) * (180 / Math.PI)

  return {
    asc: ((asc % 360) + 360) % 360,
    mc: ((mc % 360) + 360) % 360,
  }
}
