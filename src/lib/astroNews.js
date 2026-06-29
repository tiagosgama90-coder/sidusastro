/**
 * Notícias astrológicas do dia - geradas a partir do céu actual (sem API externa).
 */

import { calcularFaseLua } from './faseLua.js'
import { translatePlaneta, translateAspecto } from './i18n/astro.js'

const NOTICIAS_BASE_PT = [
  { tag: 'Lua', gerar: (ctx) => `Fase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energia', gerar: (ctx) => ctx.transito || 'Os trânsitos de hoje pedem presença consciente - consulta o teu mapa para ver como te afectam.' },
  { tag: 'Mapa', gerar: () => 'O teu mapa astral completo cruza Sol, Lua, Ascendente e casas - a base para todas as leituras Sidus.' },
  { tag: 'Tarot', gerar: () => 'A carta do dia e o Tarot online complementam a astrologia com símbolos que falam ao inconsciente.' },
]

const NOTICIAS_BASE_EN = [
  { tag: 'Moon', gerar: (ctx) => `${ctx.fase.nome} phase: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energy', gerar: (ctx) => ctx.transito || 'Today\'s transits ask for conscious presence - check your chart to see how they affect you.' },
  { tag: 'Chart', gerar: () => 'Your complete natal chart combines Sun, Moon, Ascendant and houses - the foundation for all Sidus readings.' },
  { tag: 'Tarot', gerar: () => 'The card of the day and online Tarot complement astrology with symbols that speak to the unconscious.' },
]

function transitoDestaque(aspetos, lang) {
  if (!aspetos?.length) return null
  const a = aspetos[0]
  const pA = translatePlaneta(a.planetaA, lang)
  const pB = translatePlaneta(a.planetaB, lang)
  const asp = translateAspecto(a.aspecto, lang)
  if (lang === 'en') {
    return `Active transit: ${pA} ${asp} ${pB} (orb ${a.orbe}) - energy in motion in the sky right now.`
  }
  return `Trânsito activo: ${pA} ${asp} ${pB} (orbe ${a.orbe}) - energia em movimento no céu neste momento.`
}

/** @returns {{ tag: string, texto: string, hora: string }[]} */
export function gerarNoticiasAstrologia({ aspetos = [], lang = 'pt', max = 4 } = {}) {
  const agora = new Date()
  const fase = calcularFaseLua(agora, lang)
  const hora = agora.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' })
  const transito = transitoDestaque(aspetos, lang)
  const ctx = { fase, transito, aspetos }

  const base = lang === 'en' ? NOTICIAS_BASE_EN : NOTICIAS_BASE_PT
  const seed = agora.getDate() + agora.getMonth()

  return base.slice(0, max).map((item, i) => ({
    tag: item.tag,
    texto: item.gerar(ctx),
    hora: i === 0 ? hora : null,
  }))
}
