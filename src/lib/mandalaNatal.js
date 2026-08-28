/** Geometria da roda natal (SVG) - zodíaco tropical, ASC à esquerda, Placidus. */

export const SIGNOS_ZODIACO = [
  { simbolo: '♈', nome: 'Áries' },
  { simbolo: '♉', nome: 'Touro' },
  { simbolo: '♊', nome: 'Gémeos' },
  { simbolo: '♋', nome: 'Caranguejo' },
  { simbolo: '♌', nome: 'Leão' },
  { simbolo: '♍', nome: 'Virgem' },
  { simbolo: '♎', nome: 'Balança' },
  { simbolo: '♏', nome: 'Escorpião' },
  { simbolo: '♐', nome: 'Sagitário' },
  { simbolo: '♑', nome: 'Capricórnio' },
  { simbolo: '♒', nome: 'Aquário' },
  { simbolo: '♓', nome: 'Peixes' },
]

export const ROMANOS_CASA = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

const ASPECTOS_MAIORES = [
  { nome: 'Conjuncao', angulo: 0 },
  { nome: 'Sextil', angulo: 60 },
  { nome: 'Quadratura', angulo: 90 },
  { nome: 'Trigono', angulo: 120 },
  { nome: 'Oposicao', angulo: 180 },
]

export const SIMBOLO_ASPECTO = {
  Conjuncao: '☌',
  Sextil: '✶',
  Quadratura: '□',
  Trigono: '△',
  Oposicao: '☍',
}

const ELEMENTO_COR = {
  Fogo: 'rgba(251,146,60,0.14)',
  Terra: 'rgba(74,222,128,0.12)',
  Ar: 'rgba(147,197,253,0.12)',
  Água: 'rgba(129,140,248,0.14)',
}

const ELEMENTO_POR_SIGNO = [
  'Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água',
]

const SIGNO_INDICE = {
  Carneiro: 0, Touro: 1, Gémeos: 2, Caranguejo: 3, Leão: 4, Virgem: 5,
  Balança: 6, Escorpião: 7, Sagitário: 8, Capricórnio: 9, Aquário: 10, Peixes: 11,
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
  Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
}

const ORDEM_GRELHA = [
  'Sol', 'Lua', 'Mercúrio', 'Vénus', 'Marte', 'Júpiter', 'Saturno',
  'Urano', 'Neptuno', 'Plutão', 'Nodo Norte', 'Lilith', 'Quíron',
  'Ascendente', 'Meio do Céu', 'Descendente', 'Fundo do Céu',
]

export function longitudeDeSigno(nomeSigno, grausNoSigno) {
  if (!nomeSigno) return null
  const idx = SIGNO_INDICE[nomeSigno]
  if (idx == null) return null
  const g = parseFloat(grausNoSigno)
  if (!Number.isFinite(g)) return null
  return normalizarLongitude(idx * 30 + g)
}

export function longitudeDoPonto(ponto, cuspFallback = null) {
  if (ponto?.longitude != null && Number.isFinite(Number(ponto.longitude))) {
    return normalizarLongitude(ponto.longitude)
  }
  if (cuspFallback != null && Number.isFinite(Number(cuspFallback))) {
    return normalizarLongitude(cuspFallback)
  }
  return longitudeDeSigno(ponto?.nome, ponto?.graus ?? ponto?.signo?.graus)
}

/** Longitude eclíptica com precisão total (Swiss Ephemeris / double). */
export function garantirLongitudePrecisa(ponto) {
  if (!ponto) return null
  if (Number.isFinite(Number(ponto.longitude))) {
    return normalizarLongitude(Number(ponto.longitude))
  }
  if (Number.isFinite(Number(ponto.signo?.longitude))) {
    return normalizarLongitude(Number(ponto.signo.longitude))
  }
  const graus = ponto.graus ?? ponto.signo?.graus
  const lon = longitudeDeSigno(ponto.signo?.nome ?? ponto.nome, graus)
  return lon != null ? lon : null
}

export function enriquecerPlanetaLongitude(planeta) {
  if (!planeta) return null
  const lon = garantirLongitudePrecisa(planeta)
  if (lon == null) return null
  const key = String(planeta.key || '').toLowerCase()
  const nomeNormalizado = /^(lilith|lua negra|black moon|mean apogee)$/i.test(planeta.nome || '') || key === 'lilith'
    ? 'Lilith'
    : /^(nodo|north node|nodo norte)$/i.test(planeta.nome || '') || key === 'nodo'
      ? 'Nodo Norte'
      : /^(quiron|chiron)$/i.test(planeta.nome || '') || key === 'quiron'
        ? 'Quíron'
        : planeta.nome
  const simbolo = nomeNormalizado === 'Lilith' ? '⚸' : nomeNormalizado === 'Nodo Norte' ? '☊' : nomeNormalizado === 'Quíron' ? '⚷' : planeta.simbolo
  return { ...planeta, nome: nomeNormalizado, simbolo, longitude: lon }
}

/** Garante longitudes e cúspides em float completo (mapas em cache antigos). */
export function enriquecerMapaNatalLongitudes(mapa) {
  if (!mapa) return null
  const enrich = (p) => {
    if (!p) return p
    const lon = garantirLongitudePrecisa(p)
    return lon != null ? { ...p, longitude: lon } : p
  }
  const cusps = Array.isArray(mapa.cusps)
    ? mapa.cusps.map((c) => (Number.isFinite(Number(c)) ? normalizarLongitude(Number(c)) : c))
    : mapa.cusps
  return {
    ...mapa,
    solar: enrich(mapa.solar),
    lunar: enrich(mapa.lunar),
    ascendente: enrich(mapa.ascendente),
    descendente: enrich(mapa.descendente),
    mc: enrich(mapa.mc),
    ic: enrich(mapa.ic),
    cusps,
  }
}

function diferencaAngular(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

export function aspectoEntreLongitudes(lonA, lonB, orbe = 6) {
  if (!Number.isFinite(lonA) || !Number.isFinite(lonB)) return null
  const angle = diferencaAngular(lonA, lonB)
  const nearest = ASPECTOS_MAIORES
    .map((x) => ({ ...x, orbe: Math.abs(angle - x.angulo) }))
    .sort((x, y) => x.orbe - y.orbe)[0]
  if (nearest.orbe <= orbe) {
    return { aspecto: nearest.nome, orbe: nearest.orbe, distancia: angle }
  }
  return null
}

export function calcularAspetosPontos(pontos, orbe = 6) {
  const lista = []
  for (let i = 0; i < pontos.length; i++) {
    for (let j = i + 1; j < pontos.length; j++) {
      const a = pontos[i]
      const b = pontos[j]
      const asp = aspectoEntreLongitudes(a.longitude, b.longitude, orbe)
      if (asp) {
        lista.push({
          planetaA: a.nome,
          planetaB: b.nome,
          keyA: a.key || a.nome,
          keyB: b.key || b.nome,
          aspecto: asp.aspecto,
          orbe: asp.orbe,
          distancia: asp.distancia,
        })
      }
    }
  }
  return lista.sort((x, y) => x.orbe - y.orbe)
}

function criarPontoAngular(key, nome, abrev, simbolo, longitude, signo, casa) {
  if (longitude == null) return null
  return {
    key,
    nome,
    abrev,
    simbolo,
    longitude,
    signo: signo || { nome: SIGNOS_ZODIACO[indiceSignoDeLongitude(longitude)].nome },
    casa,
    retrograde: false,
    isAngular: true,
  }
}

export function prepararDadosMandala(mapaNatal, planetas = []) {
  const mapa = enriquecerMapaNatalLongitudes(mapaNatal)
  const ascLon = longitudeDoPonto(mapa?.ascendente, mapa?.cusps?.[0])
  if (ascLon == null) return null

  let cusps = mapa?.cusps
  if (!Array.isArray(cusps) || cusps.length < 12) {
    cusps = Array.from({ length: 12 }, (_, i) => normalizarLongitude(ascLon + i * 30))
  } else {
    cusps = cusps.slice(0, 12).map((c) => normalizarLongitude(Number(c)))
  }

  const planetasNorm = planetas
    .map(enriquecerPlanetaLongitude)
    .filter((p) => p && Number.isFinite(p.longitude))

  if (!planetasNorm.length) return null

  const mcLon = longitudeDoPonto(mapa?.mc, cusps[9])
  const dcLon = longitudeDoPonto(mapa?.descendente, cusps[6])
  const icLon = longitudeDoPonto(mapa?.ic, cusps[3])

  const angulares = [
    criarPontoAngular('asc', 'Ascendente', 'ASC', 'As', ascLon, mapa?.ascendente, 1),
    criarPontoAngular('mc', 'Meio do Céu', 'MC', 'Mc', mcLon, mapa?.mc, 10),
    criarPontoAngular('dc', 'Descendente', 'DC', 'Dc', dcLon, mapa?.descendente, 7),
    criarPontoAngular('ic', 'Fundo do Céu', 'IC', 'Ic', icLon, mapa?.ic, 4),
  ].filter(Boolean)

  const todosPontos = [...planetasNorm, ...angulares]

  const pontosGrelha = ORDEM_GRELHA
    .map((nome) => {
      if (nome === 'Ascendente') return angulares.find((a) => a.key === 'asc')
      if (nome === 'Meio do Céu') return angulares.find((a) => a.key === 'mc')
      if (nome === 'Descendente') return angulares.find((a) => a.key === 'dc')
      if (nome === 'Fundo do Céu') return angulares.find((a) => a.key === 'ic')
      return planetasNorm.find((p) => p.nome === nome)
    })
    .filter(Boolean)

  const tabelaPontos = [
    ...planetasNorm,
    ...angulares,
  ]

  return {
    ascLon,
    cusps,
    mcLon,
    dcLon,
    icLon,
    planetas: planetasNorm,
    angulares,
    todosPontos,
    pontosGrelha,
    tabelaPontos,
    mapaEnriquecido: mapa,
    jd: mapa?.jd ?? null,
    motor: mapa?.motor ?? null,
    instanteUTC: mapa?.instanteUTC ?? null,
  }
}

export function construirMatrizAspectos(pontosGrelha, orbe = 6) {
  const n = pontosGrelha.length
  const matriz = []
  for (let row = 0; row < n; row++) {
    const linha = []
    for (let col = 0; col < n; col++) {
      if (col >= row) {
        linha.push(null)
      } else {
        const asp = aspectoEntreLongitudes(
          pontosGrelha[row].longitude,
          pontosGrelha[col].longitude,
          orbe,
        )
        linha.push(asp)
      }
    }
    matriz.push(linha)
  }
  return matriz
}

export function normalizarLongitude(lon) {
  return ((Number(lon) % 360) + 360) % 360
}

export function anguloCarta(longitude, ascendant) {
  return normalizarLongitude(longitude - ascendant + 180)
}

export function polarParaXY(deg, r, cx, cy) {
  const rad = (deg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  }
}

export function arcoSvg(cx, cy, r, lonInicio, lonFim, ascendant) {
  const a1 = anguloCarta(lonInicio, ascendant)
  const a2 = anguloCarta(lonFim, ascendant)
  let sweep = a2 - a1
  if (sweep < 0) sweep += 360
  const large = sweep > 180 ? 1 : 0
  const p1 = polarParaXY(a1, r, cx, cy)
  const p2 = polarParaXY(a1 + sweep, r, cx, cy)
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`
}

export function corElementoSigno(indiceSigno) {
  return ELEMENTO_COR[ELEMENTO_POR_SIGNO[indiceSigno]] || 'rgba(255,255,255,0.04)'
}

export function corAspecto(nome) {
  const n = (nome || '').toLowerCase()
  if (n.includes('conj')) return '#DFB76C'
  if (n.includes('trig')) return '#60A5FA'
  if (n.includes('sext')) return '#34D399'
  if (n.includes('quad')) return '#F87171'
  if (n.includes('opos')) return '#C084FC'
  return 'rgba(223,183,108,0.35)'
}

export function separarPlanetasSobrepostos(planetas, ascendant, minGrau = 5.5) {
  const comAngulo = planetas
    .filter((p) => Number.isFinite(p.longitude))
    .map((p) => ({ ...p, chartAngle: anguloCarta(p.longitude, ascendant) }))
    .sort((a, b) => a.chartAngle - b.chartAngle)

  const angulares = comAngulo.filter((p) => p.isAngular)
  const moveis = comAngulo.filter((p) => !p.isAngular)

  for (let i = 1; i < moveis.length; i++) {
    const diff = moveis[i].chartAngle - moveis[i - 1].chartAngle
    if (diff < minGrau) {
      moveis[i].chartAngle = moveis[i - 1].chartAngle + minGrau
    }
  }

  return [...moveis, ...angulares].sort((a, b) => a.chartAngle - b.chartAngle)
}

export function nomePlanetaDeAspeto(str) {
  if (!str) return ''
  return str.replace(/\s+[^\s]+\s*$/u, '').trim()
}

export function indiceSignoDeLongitude(longitude) {
  const lon = normalizarLongitude(longitude)
  return Math.min(11, Math.max(0, Math.floor(lon / 30)))
}

export function grausNoSigno(longitude) {
  const lon = normalizarLongitude(longitude)
  return lon % 30
}

export function simboloSignoDeLongitude(longitude) {
  return SIGNOS_ZODIACO[indiceSignoDeLongitude(longitude)].simbolo
}

export function formatarGrauSigno(longitude) {
  const g = grausNoSigno(longitude)
  const graus = Math.floor(g)
  const minutos = Math.round((g - graus) * 60)
  return minutos > 0 ? `${graus}°${String(minutos).padStart(2, '0')}'` : `${graus}°`
}

/** Formato profissional: graus.minutos (ex. 8.45 = 8°45') */
export function formatarGrauDecimal(longitude) {
  const g = grausNoSigno(longitude)
  const graus = Math.floor(g)
  const minutos = Math.round((g - graus) * 60)
  return `${graus}.${String(minutos).padStart(2, '0')}`
}

/** Graus, minutos e segundos de arco no signo (precisão ephemeris). */
export function formatarGrauDms(longitude) {
  const g = grausNoSigno(longitude)
  let graus = Math.floor(g)
  let totalMin = (g - graus) * 60
  let minutos = Math.floor(totalMin)
  let segundos = Math.round((totalMin - minutos) * 60)
  if (segundos >= 60) { segundos = 0; minutos++ }
  if (minutos >= 60) { minutos = 0; graus++ }
  return `${graus}°${String(minutos).padStart(2, '0')}'${String(segundos).padStart(2, '0')}"`
}

/** Longitude eclíptica absoluta (0-360°) com 6 casas decimais. */
export function formatarLongitudeEcliptica(longitude) {
  return `${normalizarLongitude(longitude).toFixed(6)}°`
}

export const COR_PLANETA = {
  Sol: '#FBBF24',
  Lua: '#E8E4F0',
  Mercúrio: '#93C5FD',
  Vénus: '#F472B6',
  Marte: '#F87171',
  Júpiter: '#34D399',
  Saturno: '#A78BFA',
  Urano: '#67E8F9',
  Neptuno: '#818CF8',
  Plutão: '#E879F9',
  Quíron: '#FB923C',
  'Nodo Norte': '#DFB76C',
  Lilith: '#9CA3AF',
  Ascendente: '#C4B5FD',
  'Meio do Céu': '#34D399',
  Descendente: '#F472B6',
  'Fundo do Céu': '#93C5FD',
}

export const ABREV_SIGNO = ['Ar', 'To', 'Gm', 'Cj', 'Le', 'Vg', 'Ba', 'Es', 'Sg', 'Cp', 'Aq', 'Px']

export function indiceSignoDePonto(ponto) {
  if (!ponto) return null
  if (ponto.longitude != null && Number.isFinite(Number(ponto.longitude))) {
    return indiceSignoDeLongitude(ponto.longitude)
  }
  if (ponto.nome && SIGNO_INDICE[ponto.nome] != null) return SIGNO_INDICE[ponto.nome]
  return null
}

export function corPonto(nome) {
  return COR_PLANETA[nome] || '#DFB76C'
}
