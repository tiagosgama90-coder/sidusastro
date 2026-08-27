import { ASPECTOS, ORBE_CUSPIDE, PLANETAS_TRANSITO } from './constants.js'
import { diferencaAngular, grausNoSigno, normalizarGraus } from './math.js'
import { casaWholeSign, construirPontosNatais } from './houses.js'
import { diasNoMes, posicoesPlanetas, dataUTC } from './ephemeris.js'
import { SIGNOS_PT, translateSigno } from '../i18n/astro.js'

function aspectoEntre(lon1, lon2, orbeExtra = 0) {
  const angle = diferencaAngular(lon1, lon2)
  let best = null
  for (const asp of ASPECTOS) {
    const orbe = asp.orbe + orbeExtra
    const dist = Math.abs(angle - asp.angulo)
    if (dist <= orbe && (!best || dist < best.dist)) {
      best = { ...asp, dist, orbe: dist }
    }
  }
  return best
}

function signoDeLongitude(lon, lang) {
  const ptNome = SIGNOS_PT[Math.min(11, Math.floor(normalizarGraus(lon) / 30))]
  return translateSigno(ptNome, lang)
}

function pesoTransito(planeta, aspecto, ponto) {
  let peso = planeta.peso || 3
  if (aspecto.key === 'quadratura' || aspecto.key === 'oposicao') peso += 1
  if (ponto.tipo === 'angulo') peso += 3
  if (ponto.nome === 'Sol' || ponto.nome === 'Lua') peso += 2
  if (ponto.tipo === 'cuspide') peso += 1
  return peso
}

function chaveTransito(planeta, aspecto, ponto) {
  return `${planeta.key}_${aspecto.key}_${ponto.tipo}_${ponto.nome}`
}

/** Trânsitos activos no mês: planetas em movimento vs graus natais e cúspides. */
export function calcularTransitosMes({
  motor,
  ano,
  mes,
  mapaNatal,
  planetasNatal,
  lang,
}) {
  const ascLon = mapaNatal?.ascendente?.longitude ?? mapaNatal?.ascendant?.longitude
  if (ascLon == null) return []

  const pontos = construirPontosNatais(mapaNatal, planetasNatal)
  if (!pontos.length) return []

  const dias = diasNoMes(ano, mes)
  const mapa = new Map()

  for (let d = 1; d <= dias; d++) {
    const date = dataUTC(ano, mes, d, 12)
    const posicoes = posicoesPlanetas(motor, date)

    for (const tr of posicoes) {
      for (const natal of pontos) {
        const orbeExtra = natal.tipo === 'cuspide' ? -(ASPECTOS[0].orbe - ORBE_CUSPIDE) : 0
        const asp = aspectoEntre(tr.longitude, natal.longitude, orbeExtra)
        if (!asp) continue

        const key = chaveTransito(tr, asp, natal)
        const existente = mapa.get(key)
        const diaInfo = { dia: d, orbe: asp.orbe, longitude: tr.longitude }

        if (!existente) {
          const casaTransit = casaWholeSign(tr.longitude, ascLon)
          const casaNatal = natal.casa ?? casaWholeSign(natal.longitude, ascLon)
          mapa.set(key, {
            id: key,
            planetaTransito: tr.nome,
            planetaKey: tr.key,
            simbolo: tr.simbolo,
            aspecto: asp.key,
            orbeMin: asp.orbe,
            pontoNatal: natal.nome,
            pontoTipo: natal.tipo,
            longitudeTransito: tr.longitude,
            longitudeNatal: natal.longitude,
            signoTransito: signoDeLongitude(tr.longitude, lang),
            grausTransito: grausNoSigno(tr.longitude),
            signoNatal: signoDeLongitude(natal.longitude, lang),
            grausNatal: grausNoSigno(natal.longitude),
            casaTransit,
            casaNatal,
            retrogrado: tr.retrogrado,
            diasActivos: [diaInfo],
            peso: pesoTransito(tr, asp, natal),
          })
        } else {
          existente.diasActivos.push(diaInfo)
          if (asp.orbe < existente.orbeMin) {
            existente.orbeMin = asp.orbe
            existente.longitudeTransito = tr.longitude
            existente.signoTransito = signoDeLongitude(tr.longitude, lang)
            existente.grausTransito = grausNoSigno(tr.longitude)
            existente.retrogrado = tr.retrogrado
          }
        }
      }
    }
  }

  return [...mapa.values()]
    .filter((transito, index, lista) => lista.findIndex((outro) => outro.id === transito.id) === index)
    .map((t) => {
      const diaExacto = t.diasActivos.reduce((best, cur) => (cur.orbe < best.orbe ? cur : best), t.diasActivos[0])
      return { ...t, diaExacto: diaExacto.dia, orbeMin: diaExacto.orbe }
    })
    .sort((a, b) => b.peso - a.peso || a.orbeMin - b.orbeMin)
    .slice(0, 12)
}

/** Eventos colectivos do mês (ingressos e retrógrados). */
export function eventosColectivosMes(motor, ano, mes, lang) {
  const eventos = []
  const retrogrados = new Map()
  const dias = diasNoMes(ano, mes)

  for (const pl of PLANETAS_TRANSITO) {
    if (pl.key === 'sol') continue
    const inicio = dataUTC(ano, mes, 1)
    const fim = dataUTC(ano, mes, dias)
    const lonIni = posicoesPlanetas(motor, inicio).find((p) => p.key === pl.key)
    const lonFim = posicoesPlanetas(motor, fim).find((p) => p.key === pl.key)
    if (!lonIni || !lonFim) continue

    const signoIni = signoDeLongitude(lonIni.longitude, lang)
    const signoFim = signoDeLongitude(lonFim.longitude, lang)
    if (signoIni !== signoFim) {
      eventos.push({
        tipo: 'ingresso',
        planeta: pl.nome,
        signo: signoFim,
        simbolo: pl.simbolo,
      })
    }
    for (let d = 1; d <= dias; d++) {
      const posicao = posicoesPlanetas(motor, dataUTC(ano, mes, d, 12)).find((p) => p.key === pl.key)
      if (posicao?.retrogrado) {
        retrogrados.set(pl.key, { planeta: pl.nome, signo: signoDeLongitude(posicao.longitude, lang) })
      }
    }
  }

  return eventos
    .concat(retrogrados.size ? [{
      tipo: 'retrogradosGrupo',
      planetas: [...retrogrados.values()].map((evento) => evento.planeta),
      signo: [...retrogrados.values()][0].signo,
    }] : [])
}
