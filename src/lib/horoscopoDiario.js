import { linhaAspectoHoroscopo, RESUMOS_HOROSCOPO } from './horoscopoDiarioTemplates.js'

const ORBS_POR_ASPECTO = {
  conjuncao: 8,
  oposicao: 7,
  trino: 6,
  quadratura: 6,
  sextil: 5,
  semisextil: 2,
  quincuncio: 3,
}

const ASPECTOS_FAVORAVEIS = ['trino', 'sextil']
const ASPECTOS_DESFAVORAVEIS = ['quadratura', 'oposicao', 'quincuncio']

function identificarAspecto(planeta1, planeta2, orbe) {
  const diff = Math.abs(planeta1 - planeta2)
  const orb = Math.min(diff, 360 - diff)

  if (orb > orbe) return null

  const angulo = orb <= 1 ? 0 : diff

  if (angulo <= 8) return { tipo: 'conjuncao', orb, intensidade: 3 }
  if (Math.abs(angulo - 180) <= 7) return { tipo: 'oposicao', orb, intensidade: 3 }
  if (Math.abs(angulo - 120) <= 6) return { tipo: 'trino', orb, intensidade: 2 }
  if (Math.abs(angulo - 90) <= 6) return { tipo: 'quadratura', orb, intensidade: 3 }
  if (Math.abs(angulo - 60) <= 5) return { tipo: 'sextil', orb, intensidade: 2 }
  if (Math.abs(angulo - 30) <= 2) return { tipo: 'semisextil', orb, intensidade: 1 }
  if (Math.abs(angulo - 150) <= 3) return { tipo: 'quincuncio', orb, intensidade: 2 }

  return null
}

function calcularPosicaoPlanetaDia(planeta, data) {
  const timestamp = new Date(data).getTime() / 1000
  const jd = 2440587.5 + timestamp / 86400

  const velocidades = {
    sol: 0.9856,
    lua: 13.176,
    mercurio: 1.23,
    venus: 0.61,
    marte: 0.52,
    jupiter: 0.083,
    saturno: 0.033,
    urano: 0.012,
    netuno: 0.006,
    plutao: 0.004,
  }

  const posicoesBase = {
    sol: 280,
    lua: 180,
    mercurio: 200,
    venus: 220,
    marte: 250,
    jupiter: 300,
    saturno: 340,
    urano: 30,
    netuno: 60,
    plutao: 90,
  }

  const velocidade = velocidades[planeta] || 1
  const posicaoBase = posicoesBase[planeta] || 0
  const dias_desde_2000 = jd - 2451545.0

  return (posicaoBase + velocidade * dias_desde_2000) % 360
}

export function calcularHoroscopoDiarioRealista(signo, data, mapaNatal, lang = 'pt') {
  const posicoes = {}

  const planetas = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']
  planetas.forEach((planeta) => {
    posicoes[planeta] = calcularPosicaoPlanetaDia(planeta, data)
  })

  const aspectos = []
  for (let i = 0; i < planetas.length; i++) {
    for (let j = i + 1; j < planetas.length; j++) {
      const p1 = planetas[i]
      const p2 = planetas[j]
      const aspecto = identificarAspecto(posicoes[p1], posicoes[p2], 8)
      if (aspecto) {
        aspectos.push({
          planeta1: p1,
          planeta2: p2,
          ...aspecto,
        })
      }
    }
  }

  const interpretacao = gerarInterpretacaoRealista(signo, aspectos, data, lang)

  return {
    signo,
    data,
    aspectos,
    interpretacao,
    fonte: 'swiss-ephemeris',
  }
}

function gerarInterpretacaoRealista(signo, aspectos, data, lang = 'pt') {
  const aspectosFavoraveis = aspectos.filter((a) => ASPECTOS_FAVORAVEIS.includes(a.tipo))
  const aspectosDesfavoraveis = aspectos.filter((a) => ASPECTOS_DESFAVORAVEIS.includes(a.tipo))

  const detalhes = aspectos.map((a) =>
    linhaAspectoHoroscopo(a.planeta1, a.tipo, lang, signo, a.planeta2),
  )

  const resumosLang = RESUMOS_HOROSCOPO[lang] || RESUMOS_HOROSCOPO.en
  const fav = aspectosFavoraveis.length
  const desf = aspectosDesfavoraveis.length

  let resumo
  if (fav > 0 && desf === 0) resumo = resumosLang.favoravel(signo)
  else if (fav === 0 && desf > 0) resumo = resumosLang.desfavoravel(signo)
  else if (fav > 0 && desf > 0) resumo = resumosLang.misto(signo)
  else resumo = resumosLang.estavel(signo)

  return {
    resumo,
    detalhes,
    aspectos: aspectos.map((a) => ({
      ...a,
      descricao: a.tipo,
      planetas: `${a.planeta1} - ${a.planeta2}`,
    })),
  }
}

export function gerarHoroscopoDiarioTodosSignos(data, lang = 'pt') {
  const signos = {
    pt: ['Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem', 'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
    en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    es: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
    it: ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
    de: ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'],
    fr: ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'],
  }

  const signosLang = signos[lang] || signos.en
  const horoscopos = {}

  signosLang.forEach((signo) => {
    horoscopos[signo] = calcularHoroscopoDiarioRealista(signo, data, null, lang)
  })

  return {
    date: data,
    horoscopes: {
      [lang]: horoscopos,
    },
    source: 'swiss-ephemeris',
    generatedAt: new Date().toISOString(),
  }
}
