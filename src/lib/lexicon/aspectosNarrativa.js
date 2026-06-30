/**
 * Narrativas de aspetos planetários — estilo interpretativo profissional.
 * Sem orbes, graus ou jargão matemático.
 */
import { translatePlaneta, translateSigno, translateAspecto } from '../i18n/astro.js'
import { planetaPorNome } from '../casasPlacidus.js'

const ASPETO_NUCLEO_PT = {
  Conjunção: 'duas forças fundem-se num só canal — intensificam-se mutuamente, para bem ou para tensão concentrada',
  Conjuncao: 'duas forças fundem-se num só canal — intensificam-se mutuamente, para bem ou para tensão concentrada',
  Oposição: 'polos opostos pedem integração consciente — o outro revela o que negas em ti',
  Oposicao: 'polos opostos pedem integração consciente — o outro revela o que negas em ti',
  Trígono: 'fluxo natural e talento espontâneo — o dom precisa de ser usado, não apenas possuído',
  Trigono: 'fluxo natural e talento espontâneo — o dom precisa de ser usado, não apenas possuído',
  Quadratura: 'fricção criativa que obriga à acção — o desconforto é motor de crescimento quando não fujas',
  Sextil: 'oportunidade gentil que requer iniciativa — a porta abre-se para quem bate',
}

const ASPETO_NUCLEO_EN = {
  Conjunction: 'two forces merge into one channel — they intensify each other, for better or concentrated tension',
  Conjuncao: 'two forces merge into one channel — they intensify each other, for better or concentrated tension',
  Opposition: 'opposite poles ask conscious integration — the other reveals what you deny in yourself',
  Oposicao: 'opposite poles ask conscious integration — the other reveals what you deny in yourself',
  Trine: 'natural flow and spontaneous talent — the gift must be used, not merely possessed',
  Trigono: 'natural flow and spontaneous talent — the gift must be used, not merely possessed',
  Square: 'creative friction that demands action — discomfort drives growth when you do not flee',
  Quadratura: 'creative friction that demands action — discomfort drives growth when you do not flee',
  Sextile: 'gentle opportunity requiring initiative — the door opens for those who knock',
  Sextil: 'gentle opportunity requiring initiative — the door opens for those who knock',
}

const PAR_DINAMICA_PT = {
  'Sol-Lua': 'O eixo identidade–emoção: o que queres ser e o que precisas de sentir para estar inteiro/a.',
  'Sol-Saturno': 'O encontro entre vontade e limite: autoridade interior versus medo de falhar.',
  'Sol-Júpiter': 'Expansão da identidade: fé em ti mesmo/a e excesso de promessas.',
  'Lua-Saturno': 'Emoção contida: necessidade de segurança versus medo de vulnerabilidade.',
  'Lua-Vénus': 'Afeto e prazer: como amas e como precisas de ser amado/a.',
  'Mercúrio-Marte': 'Pensamento e acção: palavras como espada ou como ponte.',
  'Vénus-Marte': 'Desejo e atração: magnetismo relacional e tensão criativa.',
  'Marte-Saturno': 'Impulso versus disciplina: onde a raiva encontra o muro ou o mestre.',
  'Júpiter-Saturno': 'Expansão e contracção: saber quando crescer e quando consolidar.',
}

const PAR_DINAMICA_EN = {
  'Sun-Moon': 'The identity–emotion axis: who you want to be and what you need to feel whole.',
  'Sun-Saturn': 'Will meets limit: inner authority versus fear of failure.',
  'Sun-Jupiter': 'Identity expansion: faith in yourself and excess of promises.',
  'Moon-Saturn': 'Contained emotion: need for security versus fear of vulnerability.',
  'Moon-Venus': 'Affection and pleasure: how you love and need to be loved.',
  'Mercury-Mars': 'Thought and action: words as sword or bridge.',
  'Venus-Mars': 'Desire and attraction: relational magnetism and creative tension.',
  'Mars-Saturn': 'Impulse versus discipline: where anger meets wall or teacher.',
  'Jupiter-Saturn': 'Expansion and contraction: knowing when to grow and when to consolidate.',
}

function nomePlaneta(str) {
  return (str || '').split(' ')[0]
}

function chavePar(a, b) {
  const par = [a, b].sort().join('-')
  return par
}

function sn(signo, lang) {
  return translateSigno(signo, lang) || signo || ''
}

function tp(nome, lang) {
  return translatePlaneta(nome, lang) || nome
}

function nucleoAspeto(tipo, lang) {
  const map = lang === 'en' ? ASPETO_NUCLEO_EN : ASPETO_NUCLEO_PT
  return map[tipo] || map[translateAspecto(tipo, lang)] || ''
}

export function narrarAspecto(aspecto, planetas, lang = 'pt') {
  const pa = nomePlaneta(aspecto.planetaA)
  const pb = nomePlaneta(aspecto.planetaB)
  const pA = planetaPorNome(planetas, pa)
  const pB = planetaPorNome(planetas, pb)
  const aspLabel = translateAspecto(
    aspecto.aspecto === 'Conjuncao' ? 'Conjunção' : aspecto.aspecto,
    lang,
  )
  const parKey = chavePar(pa, pb)
  const parKeyEn = chavePar(tp(pa, 'en'), tp(pb, 'en'))
  const dinamica = lang === 'en'
    ? (PAR_DINAMICA_EN[parKeyEn] || PAR_DINAMICA_EN[parKey] || '')
    : (PAR_DINAMICA_PT[parKey] || '')

  const signoA = sn(pA?.signo?.nome, lang)
  const signoB = sn(pB?.signo?.nome, lang)
  const nucleo = nucleoAspeto(aspecto.aspecto, lang)

  if (lang === 'en') {
  const a = tp(pa, lang)
  const b = tp(pb, lang)
    return [
      `${a} ${aspLabel.toLowerCase()} ${b}: ${nucleo}.`,
      dinamica ? `${dinamica} ` : '',
      `With ${a} in ${signoA}${pA?.casa ? ` (House ${pA.casa})` : ''} and ${b} in ${signoB}${pB?.casa ? ` (House ${pB.casa})` : ''}, this dialogue shapes how you experience both functions in daily life.`,
      `Shadow: repeating this aspect unconsciously creates fixed stories about yourself. Light: conscious dialogue between ${a} and ${b} becomes one of your greatest relational and creative competences.`,
    ].filter(Boolean).join(' ')
  }

  return [
    `${pa} em ${aspLabel.toLowerCase()} com ${pb}: ${nucleo}.`,
    dinamica ? `${dinamica} ` : '',
    `Com ${pa} em ${signoA}${pA?.casa ? ` (Casa ${pA.casa})` : ''} e ${pb} em ${signoB}${pB?.casa ? ` (Casa ${pB.casa})` : ''}, este diálogo molda a forma como vives ambas as funções no quotidiano.`,
    `Sombra: repetir este aspeto inconscientemente cria narrativas fixas sobre quem és. Luz: o diálogo consciente entre ${pa} e ${pb} torna-se uma das tuas maiores competências relacionais e criativas.`,
  ].filter(Boolean).join(' ')
}

const ASPETOS_PRIORITARIOS = ['Conjunção', 'Conjuncao', 'Oposição', 'Oposicao', 'Quadratura', 'Trigono', 'Trígono', 'Sextil']

export function interpretarAspectosNatais(aspetos, planetas, lang = 'pt') {
  const lista = (aspetos || [])
    .filter((a) => ASPETOS_PRIORITARIOS.includes(a.aspecto))
    .sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))
    .slice(0, 12)

  if (!lista.length) {
    return lang === 'en'
      ? 'No major tight aspects dominate this chart — your story unfolds through sign and house emphasis rather than planetary dialogue. This grants flexibility but asks you to choose consciously rather than being propelled by inner tension.'
      : 'Nenhum aspeto maior apertado domina este mapa — a tua história desenrola-se sobretudo através da ênfase de signos e casas, e não por diálogo planetário. Isto concede flexibilidade, mas pede escolha consciente em vez de impulso por tensão interior.'
  }

  return lista.map((a) => narrarAspecto(a, planetas, lang)).join('\n\n')
}

export function narrarAspectosPlaneta(planeta, aspetos, planetas, lang = 'pt') {
  const lista = (aspetos || [])
    .filter((a) => {
      const pa = nomePlaneta(a.planetaA)
      const pb = nomePlaneta(a.planetaB)
      return pa === planeta || pb === planeta
    })
    .filter((a) => ASPETOS_PRIORITARIOS.includes(a.aspecto))
    .sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))
    .slice(0, 3)

  if (!lista.length) return ''
  const textos = lista.map((a) => narrarAspecto(a, planetas, lang))
  if (lang === 'en') {
    return ` Planetary dialogues: ${textos.join(' ')}`
  }
  return ` Diálogos planetários: ${textos.join(' ')}`
}
