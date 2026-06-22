/**
 * Motor de sinastria — posições via Swiss Ephemeris (ou astronomy-engine)
 * e cruzamento de aspectos entre dois mapas natais.
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { longitudeParaSigno } from './astrologia.js'
import { criarDataUTCporLocal } from './datetime.js'
import { calcularAngulosCasas } from './natalHouses.js'

const ORBE = 6

const ASPECTOS = [
  { id: 'conjuncao', nome: 'Conjunção', angulo: 0 },
  { id: 'sextil', nome: 'Sextil', angulo: 60 },
  { id: 'quadratura', nome: 'Quadratura', angulo: 90 },
  { id: 'trigono', nome: 'Trígono', angulo: 120 },
  { id: 'oposicao', nome: 'Oposição', angulo: 180 },
]

const CORPOS = [
  { key: 'sol', nome: 'Sol', sweId: 0, corpo: Body.Sun },
  { key: 'lua', nome: 'Lua', sweId: 1, corpo: Body.Moon },
  { key: 'mercurio', nome: 'Mercúrio', sweId: 2, corpo: Body.Mercury },
  { key: 'venus', nome: 'Vénus', sweId: 3, corpo: Body.Venus },
  { key: 'marte', nome: 'Marte', sweId: 4, corpo: Body.Mars },
]

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
      try { await swe.loadEphemerisFiles(_EPHE_FILES) } catch { /* Moshier */ }
      return swe
    } catch {
      return null
    }
  })()
  return _swePromise
}

function diferencaAngular(a, b) {
  const diff = Math.abs(Number(a) - Number(b)) % 360
  return diff > 180 ? 360 - diff : diff
}

function lonAstronomy(corpo, dateUTC) {
  return Ecliptic(GeoVector(corpo, MakeTime(dateUTC), true)).elon
}

function posicaoCorpo(swe, corpo, dateUTC) {
  let longitude
  if (swe) {
    const jd = swe.dateToJulianDay(dateUTC)
    longitude = swe.calculatePosition(jd, corpo.sweId).longitude
  } else if (corpo.corpo) {
    longitude = lonAstronomy(corpo.corpo, dateUTC)
  } else {
    return null
  }
  const signo = longitudeParaSigno(longitude)
  return {
    key: corpo.key,
    nome: corpo.nome,
    longitude,
    signo: signo.nome,
    graus: signo.graus,
    simbolo: signo.simbolo,
    elemento: signo.elemento,
  }
}

/**
 * Posições natais (Sol, Lua, Mercúrio, Vénus, Marte, Ascendente).
 */
export async function calcularPosicoesNatal(dados) {
  if (!dados?.data || !dados?.hora || !dados?.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dateUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  if (!dateUTC) return null

  const swe = await obterSwe()
  const angulos = calcularAngulosCasas(swe, dateUTC, lat, lon)
  if (!angulos) return null

  const corpos = {}
  for (const c of CORPOS) {
    const p = posicaoCorpo(swe, c, dateUTC)
    if (p) corpos[c.key] = p
  }

  const ascSigno = longitudeParaSigno(angulos.ascendant)
  corpos.ascendente = {
    key: 'ascendente',
    nome: 'Ascendente',
    longitude: angulos.ascendant,
    signo: ascSigno.nome,
    graus: ascSigno.graus,
    simbolo: ascSigno.simbolo,
    elemento: ascSigno.elemento,
  }

  return {
    nome: dados.nome || '',
    instanteUTC: dateUTC.toISOString(),
    lat,
    lon,
    motor: swe ? 'Swiss Ephemeris' : 'astronomy-engine',
    corpos,
  }
}

function detectarAspecto(lonA, lonB) {
  const dist = diferencaAngular(lonA, lonB)
  let melhor = null
  for (const asp of ASPECTOS) {
    const orbe = Math.abs(dist - asp.angulo)
    if (orbe <= ORBE && (!melhor || orbe < melhor.orbe)) {
      melhor = { ...asp, orbe: Number(orbe.toFixed(2)), distancia: Number(dist.toFixed(2)) }
    }
  }
  return melhor
}

const PILAR_CORPOS = {
  quimica: new Set(['venus', 'marte']),
  comunicacao: new Set(['mercurio']),
  emocao: new Set(['sol', 'lua']),
  proposito: new Set(['ascendente']),
}

function pilarDoAspecto(keyA, keyB) {
  const pilares = []
  for (const [pilar, keys] of Object.entries(PILAR_CORPOS)) {
    if (keys.has(keyA) || keys.has(keyB)) pilares.push(pilar)
  }
  return pilares
}

function pesoAspecto(aspecto) {
  const proximidade = 1 - (aspecto.orbe / ORBE) * 0.45
  const base = {
    Trígono: 12,
    Sextil: 9,
    Conjunção: 7,
    Quadratura: -10,
    Oposição: -8,
  }
  return (base[aspecto.nome] ?? 0) * proximidade
}

function pontuarPilar(aspectosPilar) {
  if (!aspectosPilar.length) return 52
  let score = 50
  for (const a of aspectosPilar) {
    score += pesoAspecto(a)
  }
  return Math.round(Math.max(18, Math.min(97, score)))
}

/**
 * Cruza posições de A e B; devolve aspectos e pilares 0–100.
 */
export function calcularSinastria(posA, posB) {
  if (!posA?.corpos || !posB?.corpos) return null

  const chaves = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'ascendente']
  const aspectos = []
  const porPilar = { quimica: [], comunicacao: [], emocao: [], proposito: [] }

  for (const ka of chaves) {
    for (const kb of chaves) {
      const ca = posA.corpos[ka]
      const cb = posB.corpos[kb]
      if (ca?.longitude == null || cb?.longitude == null) continue

      const asp = detectarAspecto(ca.longitude, cb.longitude)
      if (!asp) continue

      const item = {
        ...asp,
        pessoaA: ca.nome,
        pessoaB: cb.nome,
        keyA: ka,
        keyB: kb,
        signoA: ca.signo,
        signoB: cb.signo,
      }
      aspectos.push(item)

      for (const pilar of pilarDoAspecto(ka, kb)) {
        porPilar[pilar].push(item)
      }
    }
  }

  const pilares = {
    quimica: pontuarPilar(porPilar.quimica),
    comunicacao: pontuarPilar(porPilar.comunicacao),
    emocao: pontuarPilar(porPilar.emocao),
    proposito: pontuarPilar(porPilar.proposito),
  }

  const pontuacao = Math.round(
    pilares.quimica * 0.28
    + pilares.emocao * 0.32
    + pilares.comunicacao * 0.2
    + pilares.proposito * 0.2,
  )

  return {
    pontuacao: Math.max(15, Math.min(98, pontuacao)),
    pilares,
    aspectos: aspectos.sort((a, b) => a.orbe - b.orbe),
    porPilar,
    posA,
    posB,
  }
}

/** Calcula sinastria completa a partir dos dados de nascimento de ambos. */
export async function calcularSinastriaCompleta(dadosA, dadosB) {
  const [posA, posB] = await Promise.all([
    calcularPosicoesNatal(dadosA),
    calcularPosicoesNatal(dadosB),
  ])
  if (!posA || !posB) return null
  return calcularSinastria(posA, posB)
}
