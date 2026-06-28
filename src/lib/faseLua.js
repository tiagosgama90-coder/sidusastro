/**
 * Fase lunar actual - cálculo via elongação Sol–Lua (efemérides astronomy-engine).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'

const Position = (corpo, time) => GeoVector(corpo, time, true)

const FASES = [
  { max: 22.5,  nome: 'Lua Nova',        emoji: '🌑', desc: 'Renovação e semeadura de intenções. Momento de introspecção e novos começos silenciosos.' },
  { max: 67.5,  nome: 'Lua Crescente',   emoji: '🌒', desc: 'Energia de construção e acção inicial. Planta os primeiros passos com coragem.' },
  { max: 112.5, nome: 'Quarto Crescente', emoji: '🌓', desc: 'Ponto de decisão e superação de obstáculos. Ajusta o rumo com clareza.' },
  { max: 157.5, nome: 'Lua Gibosa Crescente', emoji: '🌔', desc: 'Refinamento e preparação. Ajusta detalhes antes da plenitude.' },
  { max: 202.5, nome: 'Lua Cheia',       emoji: '🌕', desc: 'Culminação emocional e revelação. O que foi semeado manifesta-se com intensidade.' },
  { max: 247.5, nome: 'Lua Gibosa Minguante', emoji: '🌖', desc: 'Partilha e gratidão. Integra o que aprendeste no ciclo.' },
  { max: 292.5, nome: 'Quarto Minguante', emoji: '🌗', desc: 'Libertação e desapego consciente. Soltar o que já cumpriu o seu ciclo.' },
  { max: 337.5, nome: 'Lua Minguante',   emoji: '🌘', desc: 'Recolhimento e purificação. Prepara o terreno para o próximo renascimento.' },
  { max: 360,   nome: 'Lua Nova',        emoji: '🌑', desc: 'Renovação e semeadura de intenções. Momento de introspecção e novos começos silenciosos.' },
]

export function calcularFaseLua(date = new Date(), lang = 'pt') {
  const time = MakeTime(date)
  const sunLon  = Ecliptic(Position(Body.Sun,  time)).elon
  const moonLon = Ecliptic(Position(Body.Moon, time)).elon
  const angulo  = ((moonLon - sunLon) % 360 + 360) % 360
  const iluminacao = Math.round((1 - Math.cos(angulo * Math.PI / 180)) / 2 * 100)

  const fase = FASES.find(f => angulo < f.max) || FASES[FASES.length - 1]

  const FASES_EN = [
    { max: 22.5,  nome: 'New Moon',        emoji: '🌑', desc: 'Renewal and planting intentions. A time for introspection and quiet new beginnings.' },
    { max: 67.5,  nome: 'Waxing Crescent', emoji: '🌒', desc: 'Energy of building and initial action. Plant the first steps with courage.' },
    { max: 112.5, nome: 'First Quarter',   emoji: '🌓', desc: 'Decision point and overcoming obstacles. Adjust course with clarity.' },
    { max: 157.5, nome: 'Waxing Gibbous',  emoji: '🌔', desc: 'Refinement and preparation. Adjust details before fullness.' },
    { max: 202.5, nome: 'Full Moon',       emoji: '🌕', desc: 'Emotional culmination and revelation. What was sown manifests intensely.' },
    { max: 247.5, nome: 'Waning Gibbous',  emoji: '🌖', desc: 'Sharing and gratitude. Integrate what you learned in the cycle.' },
    { max: 292.5, nome: 'Last Quarter',    emoji: '🌗', desc: 'Liberation and conscious detachment. Release what has completed its cycle.' },
    { max: 337.5, nome: 'Waning Crescent', emoji: '🌘', desc: 'Withdrawal and purification. Prepare the ground for the next rebirth.' },
    { max: 360,   nome: 'New Moon',        emoji: '🌑', desc: 'Renewal and planting intentions. A time for introspection and quiet new beginnings.' },
  ]

  const lista = lang === 'en' ? FASES_EN : FASES
  const faseFinal = lista.find(f => angulo < f.max) || lista[lista.length - 1]

  return {
    ...faseFinal,
    angulo: angulo.toFixed(1),
    iluminacao,
    longitudeLua: moonLon,
  }
}
