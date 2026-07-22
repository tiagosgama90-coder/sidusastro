/**
 * Motor de sinastria - Swiss Ephemeris (JPL/NASA) + aspectos cruzados.
 * Pilares: Química (Vénus/Marte), Emoção (Sol/Lua), Comunicação (Mercúrio), Futuro (Júpiter/Saturno).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { longitudeParaSigno } from './astrologia.js'
import { criarDataUTCporLocal } from './datetime.js'
import { calcularAngulosCasas } from './natalHouses.js'
import { contentForLang } from './i18n/langUtil.js'
import { translateSigno, translateElemento } from './i18n/astro.js'

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
  { key: 'jupiter', nome: 'Júpiter', sweId: 5, corpo: Body.Jupiter },
  { key: 'saturno', nome: 'Saturno', sweId: 6, corpo: Body.Saturn },
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

function posicaoNodoNorte(swe, dateUTC) {
  if (!swe) return null
  try {
    const jd = swe.dateToJulianDay(dateUTC)
    const pos = swe.calculatePosition(jd, 11)
    if (pos?.longitude == null) return null
    const signo = longitudeParaSigno(pos.longitude)
    return {
      key: 'nodo_norte',
      nome: 'Nodo Norte',
      longitude: pos.longitude,
      signo: signo.nome,
      graus: signo.graus,
      simbolo: signo.simbolo,
      elemento: signo.elemento,
    }
  } catch {
    return null
  }
}

/** Hora desconhecida → meio-dia solar local; Asc/MC omitidos. */
export function horaNatalEfectiva(dados) {
  if (dados?.horaDesconhecida || !String(dados?.hora || '').trim()) {
    return { hora: '12:00', horaDesconhecida: true }
  }
  return { hora: dados.hora, horaDesconhecida: false }
}

/**
 * Posições natais via Swiss Ephemeris (planetas + Asc/MC se hora conhecida).
 */
export async function calcularPosicoesNatal(dados) {
  if (!dados?.data || !dados?.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const { hora, horaDesconhecida } = horaNatalEfectiva(dados)
  const dateUTC = criarDataUTCporLocal(dados.data, hora, fuso)
  if (!dateUTC) return null

  const swe = await obterSwe()
  const angulos = horaDesconhecida ? null : calcularAngulosCasas(swe, dateUTC, lat, lon)

  const corpos = {}
  for (const c of CORPOS) {
    const p = posicaoCorpo(swe, c, dateUTC)
    if (p) corpos[c.key] = p
  }

  const nodo = posicaoNodoNorte(swe, dateUTC)
  if (nodo) {
    corpos.nodo_norte = nodo
    const lonSul = (nodo.longitude + 180) % 360
    const signoSul = longitudeParaSigno(lonSul)
    corpos.nodo_sul = {
      key: 'nodo_sul',
      nome: 'Nodo Sul',
      longitude: lonSul,
      signo: signoSul.nome,
      graus: signoSul.graus,
      simbolo: signoSul.simbolo,
      elemento: signoSul.elemento,
    }
  }

  if (angulos) {
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
    const mcSigno = longitudeParaSigno(angulos.mc)
    corpos.mc = {
      key: 'mc',
      nome: 'Meio-Céu',
      longitude: angulos.mc,
      signo: mcSigno.nome,
      graus: mcSigno.graus,
      simbolo: mcSigno.simbolo,
      elemento: mcSigno.elemento,
    }
  }

  return {
    nome: dados.nome || '',
    instanteUTC: dateUTC.toISOString(),
    lat,
    lon,
    horaDesconhecida,
    motor: swe ? 'Swiss Ephemeris (JPL/NASA)' : 'astronomy-engine',
    sistemaCasas: angulos?.sistema || null,
    angulos,
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
  futuro: new Set(['jupiter', 'saturno']),
}

const CHAVES_SINASTRIA = [
  'sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'ascendente', 'mc', 'nodo_norte', 'nodo_sul',
]

/** Ponto médio eclíptico (arco curto) - base do Mapa Composto. */
export function pontoMedioEcliptico(lonA, lonB) {
  let a = ((Number(lonA) % 360) + 360) % 360
  let b = ((Number(lonB) % 360) + 360) % 360
  let diff = Math.abs(a - b)
  if (diff > 180) {
    if (a < b) a += 360
    else b += 360
  }
  return ((a + b) / 2) % 360
}

function corpoFromLongitude(key, nome, longitude) {
  const signo = longitudeParaSigno(longitude)
  return {
    key,
    nome,
    longitude,
    signo: signo.nome,
    graus: signo.graus,
    simbolo: signo.simbolo,
    elemento: signo.elemento,
  }
}

/** Mapa Composto - pontos médios entre posA e posB (método profissional). */
export function calcularMapaComposto(posA, posB) {
  if (!posA?.corpos || !posB?.corpos) return null
  const chaves = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']
  const corpos = {}
  const NOMES = { sol: 'Sol', lua: 'Lua', mercurio: 'Mercúrio', venus: 'Vénus', marte: 'Marte', jupiter: 'Júpiter', saturno: 'Saturno' }
  for (const k of chaves) {
    const a = posA.corpos[k]
    const b = posB.corpos[k]
    if (a?.longitude == null || b?.longitude == null) continue
    const lon = pontoMedioEcliptico(a.longitude, b.longitude)
    corpos[k] = corpoFromLongitude(k, NOMES[k], lon)
  }
  if (posA.corpos.ascendente && posB.corpos.ascendente) {
    const lon = pontoMedioEcliptico(posA.corpos.ascendente.longitude, posB.corpos.ascendente.longitude)
    corpos.ascendente = corpoFromLongitude('ascendente', 'Ascendente', lon)
  }
  const aspectosInternos = calcularAspectosInternosComposto(corpos)
  return { corpos, aspectosInternos, metodo: 'Pontos médios eclípticos' }
}

/** Aspectos internos do mapa composto - fluxo de energia do casal. */
export function calcularAspectosInternosComposto(corpos) {
  if (!corpos) return []
  const chaves = Object.keys(corpos).filter((k) => corpos[k]?.longitude != null)
  const aspectos = []
  for (let i = 0; i < chaves.length; i++) {
    for (let j = i + 1; j < chaves.length; j++) {
      const ca = corpos[chaves[i]]
      const cb = corpos[chaves[j]]
      const asp = detectarAspecto(ca.longitude, cb.longitude)
      if (!asp) continue
      aspectos.push({
        ...asp,
        corpoA: ca.nome,
        corpoB: cb.nome,
        keyA: chaves[i],
        keyB: chaves[j],
        signoA: ca.signo,
        signoB: cb.signo,
        harmonico: asp.nome === 'Trígono' || asp.nome === 'Sextil',
        tenso: asp.nome === 'Quadratura' || asp.nome === 'Oposição',
        intenso: asp.nome === 'Conjunção',
      })
    }
  }
  return aspectos.sort((a, b) => a.orbe - b.orbe)
}

/** Activações Nodo Norte (propósito) e Nodo Sul (cármico). */
export function calcularNodosSinastria(posA, posB, aspectos) {
  const activacoesNorte = []
  const activacoesSul = []

  const nodos = [
    { pos: posA, key: 'nodo_norte', tipo: 'norte' },
    { pos: posA, key: 'nodo_sul', tipo: 'sul' },
    { pos: posB, key: 'nodo_norte', tipo: 'norte' },
    { pos: posB, key: 'nodo_sul', tipo: 'sul' },
  ]

  const planetas = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']

  for (const n of nodos) {
    const nodo = n.pos?.corpos?.[n.key]
    if (!nodo) continue
    const outro = n.pos === posA ? posB : posA
    const donoNodo = n.pos.nome || (n.pos === posA ? 'A' : 'B')

    for (const pk of planetas) {
      const planetaOutro = outro?.corpos?.[pk]
      if (!planetaOutro?.longitude) continue
      const asp = detectarAspecto(planetaOutro.longitude, nodo.longitude)
      if (!asp) continue
      const item = {
        tipo: n.tipo,
        planeta: planetaOutro.nome,
        deQuem: outro.nome,
        donoNodo,
        signoNodo: nodo.signo,
        aspecto: asp.nome,
        orbe: asp.orbe,
      }
      if (n.tipo === 'norte') activacoesNorte.push(item)
      else activacoesSul.push(item)
    }
  }

  activacoesNorte.sort((a, b) => a.orbe - b.orbe)
  activacoesSul.sort((a, b) => a.orbe - b.orbe)

  return {
    activacoesNorte,
    activacoesSul,
    laçoCarmico: activacoesSul.length >= 3,
    activacaoProposito: activacoesNorte.length >= 1,
  }
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

function aspectosEmocionais(aspectos) {
  const chaves = new Set(['sol', 'lua', 'venus'])
  return aspectos.filter((a) => chaves.has(a.keyA) && chaves.has(a.keyB))
}

/** Missão / vocação individual a partir do Sol, MC e Nodo Norte. */
export function calcularMissaoPessoa(pos) {
  if (!pos?.corpos) return null
  const sol = pos.corpos.sol
  const mc = pos.corpos.mc
  const nn = pos.corpos.nodo_norte
  return {
    nome: pos.nome,
    horaDesconhecida: pos.horaDesconhecida,
    sol: sol ? { signo: sol.signo, elemento: sol.elemento } : null,
    mc: mc ? { signo: mc.signo, elemento: mc.elemento } : null,
    nodoNorte: nn ? { signo: nn.signo, elemento: nn.elemento } : null,
  }
}

/** Dinâmica emocional cruzada - aspectos Sol/Lua/Vénus entre mapas. */
export function calcularDinamicaEmocional(aspectos, posA, posB) {
  const emocionais = aspectosEmocionais(aspectos)
  const luaLua = aspectos.find((a) => a.keyA === 'lua' && a.keyB === 'lua')
  const solLua = aspectos.filter(
    (a) => (a.keyA === 'sol' && a.keyB === 'lua') || (a.keyA === 'lua' && a.keyB === 'sol'),
  )
  const venusLua = aspectos.filter(
    (a) => (a.keyA === 'venus' && a.keyB === 'lua') || (a.keyA === 'lua' && a.keyB === 'venus'),
  )

  let tom = 'neutro'
  let score = 50
  for (const a of emocionais) {
    score += pesoAspecto(a) * 0.6
  }
  score = Math.round(Math.max(15, Math.min(98, score)))
  if (score >= 72) tom = 'harmonia'
  else if (score <= 42) tom = 'tensao'

  return {
    score,
    tom,
    luaLua,
    solLua,
    venusLua,
    aspectos: emocionais.slice(0, 8),
    luaA: posA?.corpos?.lua?.signo,
    luaB: posB?.corpos?.lua?.signo,
    solA: posA?.corpos?.sol?.signo,
    solB: posB?.corpos?.sol?.signo,
  }
}

/**
 * Cruza posições de A e B; devolve aspectos, pilares 0-100, missão e dinâmica emocional.
 */
export function calcularSinastria(posA, posB) {
  if (!posA?.corpos || !posB?.corpos) return null

  const chavesA = CHAVES_SINASTRIA.filter((k) => posA.corpos[k]?.longitude != null)
  const chavesB = CHAVES_SINASTRIA.filter((k) => posB.corpos[k]?.longitude != null)

  const aspectos = []
  const porPilar = { quimica: [], comunicacao: [], emocao: [], futuro: [] }

  for (const ka of chavesA) {
    for (const kb of chavesB) {
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
    futuro: pontuarPilar(porPilar.futuro),
  }

  const pontuacao = Math.round(
    pilares.quimica * 0.25
    + pilares.emocao * 0.30
    + pilares.comunicacao * 0.20
    + pilares.futuro * 0.25,
  )

  const sorted = aspectos.sort((a, b) => a.orbe - b.orbe)

  const mapaComposto = calcularMapaComposto(posA, posB)
  const nodosSinastria = calcularNodosSinastria(posA, posB, sorted)

  return {
    pontuacao: Math.max(15, Math.min(98, pontuacao)),
    pilares,
    aspectos: sorted,
    porPilar,
    missaoA: calcularMissaoPessoa(posA),
    missaoB: calcularMissaoPessoa(posB),
    dinamicaEmocional: calcularDinamicaEmocional(sorted, posA, posB),
    mapaComposto,
    nodosSinastria,
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

/** Compatibilidade generalizada (signos Sol) - camada grátis. */
export function compatibilidadeSolarGratis(solA, solB, lang = 'pt') {
  if (!solA || !solB) return { nivel: 'medio', texto: '' }

  const ELEMENTOS = {
    Fogo: ['Carneiro', 'Leão', 'Sagitário', 'Aries', 'Leo', 'Sagittarius'],
    Terra: ['Touro', 'Virgem', 'Capricórnio', 'Taurus', 'Virgo', 'Capricorn'],
    Ar: ['Gémeos', 'Balança', 'Libra', 'Aquário', 'Gemini', 'Aquarius'],
    Água: ['Caranguejo', 'Escorpião', 'Peixes', 'Cancer', 'Scorpio', 'Pisces'],
  }

  const elem = (signo) => {
    for (const [el, signs] of Object.entries(ELEMENTOS)) {
      if (signs.includes(signo)) return el
    }
    return null
  }

  const eA = elem(solA)
  const eB = elem(solB)
  const compat = {
    'Fogo-Fogo': 78, 'Terra-Terra': 76, 'Ar-Ar': 74, 'Água-Água': 77,
    'Fogo-Ar': 72, 'Ar-Fogo': 72, 'Terra-Água': 73, 'Água-Terra': 73,
    'Fogo-Água': 48, 'Água-Fogo': 48, 'Terra-Ar': 50, 'Ar-Terra': 50,
    'Fogo-Terra': 55, 'Terra-Fogo': 55, 'Ar-Água': 58, 'Água-Ar': 58,
  }
  const chave = eA && eB ? `${eA}-${eB}` : null
  const score = chave ? (compat[chave] ?? 62) : 62
  const nivel = score >= 72 ? 'alto' : score >= 55 ? 'medio' : 'desafio'
  const sA = translateSigno(solA, lang)
  const sB = translateSigno(solB, lang)
  const elA = eA ? translateElemento(eA, lang) : ''
  const elB = eB ? translateElemento(eB, lang) : ''

  const textos = {
    alto: {
      pt: `Os Sols em ${sA} e ${sB} partilham uma linguagem elemental compatível (${elA} · ${elB}). Há base natural para reconhecimento mútuo - aprofundar requer o mapa completo.`,
      en: `Suns in ${sA} and ${sB} share compatible elemental language (${elA} · ${elB}). There is a natural basis for mutual recognition - depth requires the full chart.`,
      es: `Los Soles en ${sA} y ${sB} comparten un lenguaje elemental compatible (${elA} · ${elB}). Hay una base natural de reconocimiento mutuo; profundizar requiere la carta completa.`,
      it: `I Soli in ${sA} e ${sB} condividono un linguaggio elementale compatibile (${elA} · ${elB}). C'è una base naturale di riconoscimento reciproco; approfondire richiede il tema completo.`,
      de: `Sonne in ${sA} und ${sB} teilen eine verträgliche Elementarsprache (${elA} · ${elB}). Es gibt eine natürliche Basis gegenseitiger Anerkennung - Tiefe erfordert das volle Horoskop.`,
      fr: `Les Soleils en ${sA} et ${sB} partagent un langage élémentaire compatible (${elA} · ${elB}). Il y a une base naturelle de reconnaissance mutuelle ; approfondir exige le thème complet.`,
    },
    medio: {
      pt: `Entre ${sA} e ${sB} há complementaridade moderada (${elA} · ${elB}). A relação cresce com consciência dos ritmos diferentes de cada um.`,
      en: `Between ${sA} and ${sB} there is moderate complementarity (${elA} · ${elB}). The bond grows through awareness of each other's different rhythms.`,
      es: `Entre ${sA} y ${sB} hay complementariedad moderada (${elA} · ${elB}). El vínculo crece con conciencia de los ritmos distintos de cada uno.`,
      it: `Tra ${sA} e ${sB} c'è complementarità moderata (${elA} · ${elB}). Il legame cresce con consapevolezza dei ritmi diversi di ciascuno.`,
      de: `Zwischen ${sA} und ${sB} besteht moderate Ergänzung (${elA} · ${elB}). Die Beziehung wächst durch Bewusstsein für unterschiedliche Rhythmen.`,
      fr: `Entre ${sA} et ${sB}, complémentarité modérée (${elA} · ${elB}). Le lien grandit en prenant conscience des rythmes différents de chacun.`,
    },
    desafio: {
      pt: `Os Sols em ${sA} e ${sB} activam elementos distintos (${elA} · ${elB}). O atrito pode ser motor de crescimento se houver diálogo honesto.`,
      en: `Suns in ${sA} and ${sB} activate different elements (${elA} · ${elB}). Friction can fuel growth with honest dialogue.`,
      es: `Los Soles en ${sA} y ${sB} activan elementos distintos (${elA} · ${elB}). La fricción puede impulsar el crecimiento con diálogo honesto.`,
      it: `I Soli in ${sA} e ${sB} attivano elementi distinti (${elA} · ${elB}). L'attrito può alimentare la crescita con dialogo onesto.`,
      de: `Sonne in ${sA} und ${sB} aktivieren verschiedene Elemente (${elA} · ${elB}). Reibung kann Wachstum mit ehrlichem Dialog befeuern.`,
      fr: `Les Soleils en ${sA} et ${sB} activent des éléments distincts (${elA} · ${elB}). La friction peut nourrir la croissance avec un dialogue honnête.`,
    },
  }

  return {
    nivel,
    score,
    elementoA: eA,
    elementoB: eB,
    texto: contentForLang(lang, textos[nivel]) || textos[nivel].en,
  }
}
