import { normalizarGraus, signoIndex } from './math.js'

/**
 * Casas whole sign a partir do Ascendente (método ptolomaico).
 * Casa 1 = signo inteiro do Ascendente; cada casa seguinte = signo seguinte.
 */
export function cuspsWholeSign(ascLongitude) {
  if (ascLongitude == null) return null
  const ascSign = signoIndex(ascLongitude)
  return Array.from({ length: 12 }, (_, i) => normalizarGraus((ascSign + i) * 30))
}

/** Casa 1-12 onde cai uma longitude pelo sistema whole sign. */
export function casaWholeSign(longitude, ascLongitude) {
  if (longitude == null || ascLongitude == null) return null
  const ascSign = signoIndex(ascLongitude)
  const lonSign = signoIndex(longitude)
  return ((lonSign - ascSign + 12) % 12) + 1
}

/** Pontos natais para activação por trânsito. */
export function construirPontosNatais(mapaNatal, planetasNatal) {
  const pontos = []
  const ascLon = mapaNatal?.ascendente?.longitude ?? mapaNatal?.ascendant?.longitude

  if (Array.isArray(planetasNatal)) {
    for (const p of planetasNatal) {
      if (p?.longitude == null) continue
      pontos.push({
        tipo: 'planeta',
        nome: p.nome,
        key: p.key,
        longitude: normalizarGraus(p.longitude),
        casa: ascLon != null ? casaWholeSign(p.longitude, ascLon) : p.casa,
      })
    }
  }

  const angulos = [
    { nome: 'Ascendente', lon: mapaNatal?.ascendente?.longitude ?? mapaNatal?.ascendant?.longitude },
    { nome: 'Meio-Céu', lon: mapaNatal?.mc?.longitude },
    { nome: 'Descendente', lon: mapaNatal?.descendente?.longitude },
    { nome: 'Fundo do Céu', lon: mapaNatal?.ic?.longitude },
  ]

  for (const a of angulos) {
    if (a.lon == null) continue
    pontos.push({
      tipo: 'angulo',
      nome: a.nome,
      longitude: normalizarGraus(a.lon),
      casa: ascLon != null ? casaWholeSign(a.lon, ascLon) : null,
    })
  }

  const cusps = cuspsWholeSign(ascLon)
  if (cusps) {
    for (let i = 0; i < 12; i++) {
      pontos.push({
        tipo: 'cuspide',
        nome: `Casa ${i + 1}`,
        casa: i + 1,
        longitude: cusps[i],
      })
    }
  }

  return pontos
}
