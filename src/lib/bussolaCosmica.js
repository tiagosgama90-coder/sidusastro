/**
 * Bússola Cósmica 2026 - trânsitos calculados (astronomy-engine / JPL).
 * Isolado do mapa natal; não altera cálculos do mapa.
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'

const SIGNOS = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MESES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const PLANETAS = [
  { nome: 'Sol', nomeEn: 'Sun', corpo: Body.Sun, simbolo: '☉', peso: 1 },
  { nome: 'Mercúrio', nomeEn: 'Mercury', corpo: Body.Mercury, simbolo: '☿', peso: 2 },
  { nome: 'Vénus', nomeEn: 'Venus', corpo: Body.Venus, simbolo: '♀', peso: 2 },
  { nome: 'Marte', nomeEn: 'Mars', corpo: Body.Mars, simbolo: '♂', peso: 3 },
  { nome: 'Júpiter', nomeEn: 'Jupiter', corpo: Body.Jupiter, simbolo: '♃', peso: 4 },
  { nome: 'Saturno', nomeEn: 'Saturn', corpo: Body.Saturn, simbolo: '♄', peso: 5 },
]

const TIPO_ICO = {
  ingresso: '🚪', trânsito: '→', retrógrado: '℞', sazonalidade: '🌀',
  eclipse: '🌑', quadratura: '⊞', conjunção: '☌',
}

const IMPACTO_COR = {
  alto: '#34D399', médio: '#60A5FA', baixo: '#9CA3AF',
  atenção: '#FBBf24', intenso: '#F87171', transformador: '#DFB76C',
  desafio: '#FB923C', padrão: '#9CA3AF', optimismo: '#34D399',
}

function lonEcliptica(corpo, date) {
  return Ecliptic(GeoVector(corpo, MakeTime(date), true)).elon
}

function signoDeLongitude(lon, lang) {
  const lista = lang !== 'pt' ? SIGNOS_EN : SIGNOS
  const n = ((Number(lon) % 360) + 360) % 360
  return lista[Math.min(11, Math.floor(n / 30))]
}

function grausNoSigno(lon) {
  const n = ((Number(lon) % 360) + 360) % 360
  return (n % 30).toFixed(1)
}

function estaRetrogrado(corpo, date) {
  const t0 = lonEcliptica(corpo, date)
  const t1 = lonEcliptica(corpo, new Date(date.getTime() + 86400000))
  let diff = t1 - t0
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

function dataMesUTC(ano, mes) {
  return new Date(Date.UTC(ano, mes - 1, 15, 12, 0, 0))
}

function detectarIngresso(corpo, ano, mes) {
  const inicio = dataMesUTC(ano, mes)
  const fim = dataMesUTC(ano, mes === 12 ? 1 : mes + 1)
  if (mes === 12) fim.setUTCFullYear(ano + 1)
  const s0 = signoDeLongitude(lonEcliptica(corpo, inicio), 'pt')
  const s1 = signoDeLongitude(lonEcliptica(corpo, fim), 'pt')
  return s0 !== s1 ? s1 : null
}

function planetaDominante(posicoes, mes) {
  const candidatos = posicoes.filter((p) => p.peso >= 3)
  const retro = candidatos.filter((p) => p.retrogrado)
  if (retro.length) return retro.sort((a, b) => b.peso - a.peso)[0]
  const ingresso = candidatos.find((p) => p.ingresso)
  if (ingresso) return ingresso
  return candidatos.sort((a, b) => b.peso - a.peso)[0] || posicoes[0]
}

function impactoDe(transito) {
  if (transito.tipo === 'retrógrado') return 'atenção'
  if (transito.tipo === 'ingresso') return 'alto'
  if (transito.planeta === 'Saturno' || transito.planeta === 'Plutão') return 'desafio'
  if (transito.planeta === 'Júpiter') return 'optimismo'
  if (transito.planeta === 'Marte') return 'intenso'
  return 'médio'
}

function descricaoMes(transito, lang, posicoes) {
  const p = lang !== 'pt' ? transito.planetaEn : transito.planeta
  const s = transito.signo
  const graus = transito.graus
  const retro = transito.retrogrado
  const tipo = transito.tipo

  const outros = posicoes
    .filter((x) => x.nome !== transito.planeta && x.peso >= 2)
    .slice(0, 3)
    .map((x) => `${lang !== 'pt' ? x.nomeEn : x.nome} ${lang !== 'pt' ? 'in' : 'em'} ${x.signo} (${x.graus}°)`)
    .join(' · ')

  if (lang !== 'pt') {
    let base = `${p} in ${s} at ${graus}°`
    if (retro) base += ' ℞'
    if (tipo === 'ingresso') base = `${p} enters ${s} this month - a shift in collective tone and personal strategy.`
    else if (tipo === 'retrógrado') base = `${p} retrograde in ${s}: review, revise and deepen; avoid rushing new starts in this area.`
    else base += `. Monthly sky emphasis invites conscious alignment with this archetype.`
    if (outros) base += ` Also active: ${outros}.`
    base += ' Calculated with tropical zodiac · professional ephemerides.'
    return base
  }

  let base = `${p} em ${s} a ${graus}°`
  if (retro) base += ' ℞'
  if (tipo === 'ingresso') base = `${p} ingressa em ${s} este mês - mudança de tom colectivo e de estratégia pessoal.`
  else if (tipo === 'retrógrado') base = `${p} retrógrado em ${s}: rever, revisar e aprofundar; evita arrancadas precipitadas nesta área.`
  else base += `. O céu do mês pede alinhamento consciente com este arquétipo.`
  if (outros) base += ` Também activos: ${outros}.`
  base += ' Cálculo: zodíaco tropical · efemérides profissionais.'
  return base
}

function conceitos2026(lang) {
  if (lang !== 'pt') {
    return [
      {
        titulo: 'Saturn · Neptune conjunction (Feb 2026)',
        texto: 'A rare fusion of structure and dream. Boundaries dissolve where discipline meets imagination - ideal for spiritual maturity, not escapism.',
        icon: '☌',
      },
      {
        titulo: 'Jupiter in Cancer (from mid-2026)',
        texto: 'Expansion through roots, family and emotional security. Fertile time for home, ancestry healing and nurturing what truly feeds the soul.',
        icon: '♃',
      },
      {
        titulo: 'Mercury retrograde cycles',
        texto: 'Review communications and contracts. 2026 highlights: emotional processing (Water signs) and relationship agreements (Libra).',
        icon: '℞',
      },
      {
        titulo: 'Eclipse portals',
        texto: 'Solar and lunar eclipses mark accelerated chapters. Track which natal house they touch - events unfold over 6–18 months.',
        icon: '🌑',
      },
    ]
  }
  return [
    {
      titulo: 'Conjunção Saturno · Neptuno (Fev 2026)',
      texto: 'Fusão rara de estrutura e sonho. As fronteiras dissolvem-se onde a disciplina encontra a imaginação - ideal para maturidade espiritual, não fuga.',
      icon: '☌',
    },
    {
      titulo: 'Júpiter em Caranguejo (a partir de meados de 2026)',
      texto: 'Expansão através das raízes, família e segurança emocional. Tempo fértil para o lar, cura ancestral e nutrir o que alimenta a alma.',
      icon: '♃',
    },
    {
      titulo: 'Ciclos de Mercúrio retrógrado',
      texto: 'Rever comunicações e contratos. Em 2026 destaca-se processamento emocional (signos de Água) e acordos afectivos (Balança).',
      icon: '℞',
    },
    {
      titulo: 'Portais de eclipse',
      texto: 'Eclipses solares e lunares marcam capítulos acelerados. Observa que casa natal tocam - os acontecimentos desenrolam-se em 6–18 meses.',
      icon: '🌑',
    },
  ]
}

const AFINIDADE = {
  Carneiro: ['Marte', 'Saturno', 'Sol'],
  Touro: ['Vénus', 'Júpiter', 'Sol'],
  Gémeos: ['Mercúrio', 'Júpiter'],
  Caranguejo: ['Lua', 'Júpiter', 'Marte'],
  Leão: ['Sol', 'Vénus'],
  Virgem: ['Mercúrio', 'Saturno'],
  Balança: ['Vénus', 'Júpiter'],
  Escorpião: ['Marte', 'Saturno', 'Plutão'],
  Sagitário: ['Júpiter', 'Sol'],
  Capricórnio: ['Saturno', 'Marte'],
  Aquário: ['Saturno', 'Júpiter', 'Mercúrio'],
  Peixes: ['Júpiter', 'Vénus', 'Neptuno'],
}

export function calcularBussola2026(lang = 'pt') {
  const meses = lang !== 'pt' ? MESES_EN : MESES_PT
  const impactoMap = lang !== 'pt'
    ? { alto: 'high', médio: 'medium', baixo: 'low', atenção: 'caution', intenso: 'intense', transformador: 'transformative', desafio: 'challenge', padrão: 'standard', optimismo: 'optimism' }
    : { alto: 'alto', médio: 'médio', baixo: 'baixo', atenção: 'atenção', intenso: 'intenso', transformador: 'transformador', desafio: 'desafio', padrão: 'padrão', optimismo: 'optimismo' }

  const transitos = []

  for (let m = 1; m <= 12; m++) {
    const data = dataMesUTC(2026, m)
    const posicoes = PLANETAS.map((pl) => {
      const lon = lonEcliptica(pl.corpo, data)
      const ingresso = detectarIngresso(pl.corpo, 2026, m)
      return {
        nome: pl.nome,
        nomeEn: pl.nomeEn,
        simbolo: pl.simbolo,
        peso: pl.peso,
        longitude: lon,
        signo: signoDeLongitude(lon, lang),
        graus: grausNoSigno(lon),
        retrogrado: estaRetrogrado(pl.corpo, data),
        ingresso: ingresso ? signoDeLongitude(lon, lang) : null,
      }
    })

    const dom = planetaDominante(posicoes, m)
    let tipo = 'trânsito'
    if (dom.retrogrado) tipo = 'retrógrado'
    else if (dom.ingresso) tipo = 'ingresso'
    else if (dom.nome === 'Sol') tipo = 'sazonalidade'

    const impacto = impactoDe({ tipo, planeta: dom.nome })
    const transito = {
      mes: meses[m - 1],
      planeta: dom.nome,
      planetaEn: dom.nomeEn,
      signo: dom.signo,
      graus: dom.graus,
      tipo,
      retrogrado: dom.retrogrado,
      impacto,
      impactoLabel: impactoMap[impacto] || impacto,
      desc: descricaoMes({
        planeta: dom.nome,
        planetaEn: dom.nomeEn,
        signo: dom.signo,
        graus: dom.graus,
        retrogrado: dom.retrogrado,
        tipo,
      }, lang, posicoes),
      posicoes,
    }
    transitos.push(transito)
  }

  return {
    transitos,
    conceitos: conceitos2026(lang),
    motor: 'astronomy-engine · Tropical',
    geradoEm: new Date().toISOString(),
  }
}

function detectarIngressoSwe(swe, sweId, ano, mes, lang) {
  const inicio = dataMesUTC(ano, mes)
  const fim = dataMesUTC(ano, mes === 12 ? 1 : mes + 1)
  if (mes === 12) fim.setUTCFullYear(ano + 1)
  const s0 = signoDeLongitude(lonSwe(swe, sweId, inicio), lang)
  const s1 = signoDeLongitude(lonSwe(swe, sweId, fim), lang)
  return s0 !== s1 ? s1 : null
}

function normalizarSolar(nome) {
  if (!nome) return null
  if (nome === 'Áries' || nome === 'Aries') return 'Carneiro'
  return nome
}

export function relevanciaParaMapa(transito, mapaNatal) {
  const solar = normalizarSolar(mapaNatal?.solar?.nome)
  if (!solar || !transito?.planeta) return false
  const chaves = AFINIDADE[solar] || []
  return chaves.some((p) => transito.planeta.includes(p) || transito.planetaEn?.includes(p))
}

const SWE_PLANETAS = [
  { nome: 'Sol', nomeEn: 'Sun', sweId: 0, simbolo: '☉', peso: 1 },
  { nome: 'Mercúrio', nomeEn: 'Mercury', sweId: 2, simbolo: '☿', peso: 2 },
  { nome: 'Vénus', nomeEn: 'Venus', sweId: 3, simbolo: '♀', peso: 2 },
  { nome: 'Marte', nomeEn: 'Mars', sweId: 4, simbolo: '♂', peso: 3 },
  { nome: 'Júpiter', nomeEn: 'Jupiter', sweId: 5, simbolo: '♃', peso: 4 },
  { nome: 'Saturno', nomeEn: 'Saturn', sweId: 6, simbolo: '♄', peso: 5 },
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

function lonSwe(swe, corpoId, date) {
  const jd = swe.dateToJulianDay(date)
  return swe.calculatePosition(jd, corpoId).longitude
}

function montarBussola(lang, obterLon, motor) {
  const meses = lang !== 'pt' ? MESES_EN : MESES_PT
  const impactoMap = lang !== 'pt'
    ? { alto: 'high', médio: 'medium', baixo: 'low', atenção: 'caution', intenso: 'intense', transformador: 'transformative', desafio: 'challenge', padrão: 'standard', optimismo: 'optimism' }
    : { alto: 'alto', médio: 'médio', baixo: 'baixo', atenção: 'atenção', intenso: 'intenso', transformador: 'transformador', desafio: 'desafio', padrão: 'padrão', optimismo: 'optimismo' }

  const planetas = motor.startsWith('Swiss') ? SWE_PLANETAS : PLANETAS
  const transitos = []

  for (let m = 1; m <= 12; m++) {
    const data = dataMesUTC(2026, m)
    const posicoes = planetas.map((pl) => {
      const lon = motor.startsWith('Swiss')
        ? lonSwe(obterLon, pl.sweId, data)
        : lonEcliptica(pl.corpo, data)
      const ingresso = motor.startsWith('Swiss')
        ? detectarIngressoSwe(obterLon, pl.sweId, 2026, m, lang)
        : detectarIngresso(pl.corpo, 2026, m)
      return {
        nome: pl.nome,
        nomeEn: pl.nomeEn,
        simbolo: pl.simbolo,
        peso: pl.peso,
        longitude: lon,
        signo: signoDeLongitude(lon, lang),
        graus: grausNoSigno(lon),
        retrogrado: motor.startsWith('Swiss')
          ? lonSweRetro(obterLon, pl.sweId, data, motor)
          : estaRetrogrado(pl.corpo, data),
        ingresso: ingresso || null,
      }
    })

    const dom = planetaDominante(posicoes, m)
    let tipo = 'trânsito'
    if (dom.retrogrado) tipo = 'retrógrado'
    else if (dom.ingresso) tipo = 'ingresso'
    else if (dom.nome === 'Sol') tipo = 'sazonalidade'

    const impacto = impactoDe({ tipo, planeta: dom.nome })
    transitos.push({
      mes: meses[m - 1],
      planeta: dom.nome,
      planetaEn: dom.nomeEn,
      signo: dom.signo,
      graus: dom.graus,
      tipo,
      retrogrado: dom.retrogrado,
      impacto,
      impactoLabel: impactoMap[impacto] || impacto,
      desc: descricaoMes({
        planeta: dom.nome,
        planetaEn: dom.nomeEn,
        signo: dom.signo,
        graus: dom.graus,
        retrogrado: dom.retrogrado,
        tipo,
      }, lang, posicoes).replace('astronomy-engine', motor.includes('Swiss') ? 'Swiss Ephemeris' : 'astronomy-engine'),
      posicoes,
    })
  }

  return {
    transitos,
    conceitos: conceitos2026(lang),
    motor,
    geradoEm: new Date().toISOString(),
  }
}

function lonSweRetro(swe, id, date, motor) {
  if (!motor.startsWith('Swiss') || !swe) return false
  const t0 = lonSwe(swe, id, date)
  const t1 = lonSwe(swe, id, new Date(date.getTime() + 86400000))
  let diff = t1 - t0
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

export async function calcularBussola2026Async(lang = 'pt') {
  const swe = await obterSwe()
  if (swe) {
    return montarBussola(lang, swe, 'Swiss Ephemeris · Tropical')
  }
  return calcularBussola2026(lang)
}

export { TIPO_ICO, IMPACTO_COR }
