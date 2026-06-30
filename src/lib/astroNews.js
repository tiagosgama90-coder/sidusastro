/**
 * Notícias astrológicas do dia - geradas a partir do céu actual (sem API externa).
 */

import { calcularFaseLua } from './faseLua.js'
import { translatePlaneta, translateAspecto } from './i18n/astro.js'
import { localeTag, isPt } from './i18n/langUtil.js'

const NOTICIAS_BASE_PT = [
  { tag: 'Lua', gerar: (ctx) => `Fase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energia', gerar: (ctx) => ctx.transito || 'Os trânsitos de hoje pedem presença consciente - consulta o teu mapa para ver como te afectam.' },
  { tag: 'Mapa', gerar: () => 'O teu mapa astral completo cruza Sol, Lua, Ascendente e casas - a base para todas as leituras Sidus.' },
  { tag: 'Tarot', gerar: () => 'A carta do dia e o Tarot online complementam a astrologia com símbolos que falam ao inconsciente.' },
]

const NOTICIAS_BASE_EN = [
  { tag: 'Moon', gerar: (ctx) => `${ctx.fase.nome} phase: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energy', gerar: (ctx) => ctx.transito || "Today's transits ask for conscious presence - check your chart to see how they affect you." },
  { tag: 'Chart', gerar: () => 'Your complete natal chart combines Sun, Moon, Ascendant and houses - the foundation for all Sidus readings.' },
  { tag: 'Tarot', gerar: () => 'The card of the day and online Tarot complement astrology with symbols that speak to the unconscious.' },
]

const NOTICIAS_BASE_ES = [
  { tag: 'Luna', gerar: (ctx) => `Fase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energía', gerar: (ctx) => ctx.transito || 'Los tránsitos de hoy piden presencia consciente: consulta tu carta para ver cómo te afectan.' },
  { tag: 'Carta', gerar: () => 'Tu carta natal completa cruza Sol, Luna, Ascendente y casas: la base de todas las lecturas Sidus.' },
  { tag: 'Tarot', gerar: () => 'La carta del día y el Tarot online complementan la astrología con símbolos que hablan al inconsciente.' },
]

const NOTICIAS_BASE_IT = [
  { tag: 'Luna', gerar: (ctx) => `Fase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energia', gerar: (ctx) => ctx.transito || 'I transiti di oggi chiedono presenza consapevole: consulta la tua carta per vedere come ti influenzano.' },
  { tag: 'Carta', gerar: () => 'La tua carta natale completa unisce Sole, Luna, Ascendente e case: la base di tutte le letture Sidus.' },
  { tag: 'Tarot', gerar: () => 'La carta del giorno e il Tarot online completano l\'astrologia con simboli che parlano all\'inconscio.' },
]

const NOTICIAS_BASE_DE = [
  { tag: 'Mond', gerar: (ctx) => `Phase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Energie', gerar: (ctx) => ctx.transito || 'Die heutigen Transite verlangen bewusste Präsenz - prüfe dein Horoskop, um zu sehen, wie sie dich beeinflussen.' },
  { tag: 'Karte', gerar: () => 'Dein vollständiges Geburtshoroskop verbindet Sonne, Mond, Aszendent und Häuser - die Grundlage aller Sidus-Lesungen.' },
  { tag: 'Tarot', gerar: () => 'Die Tageskarte und Online-Tarot ergänzen die Astrologie mit Symbolen, die das Unbewusste ansprechen.' },
]

const NOTICIAS_BASE_FR = [
  { tag: 'Lune', gerar: (ctx) => `Phase ${ctx.fase.nome}: ${ctx.fase.desc?.slice(0, 120)}…` },
  { tag: 'Énergie', gerar: (ctx) => ctx.transito || "Les transits du jour demandent une présence consciente - consulte ta carte pour voir comment ils t'affectent." },
  { tag: 'Carte', gerar: () => 'Ta carte natale complète croise Soleil, Lune, Ascendant et maisons - la base de toutes les lectures Sidus.' },
  { tag: 'Tarot', gerar: () => 'La carte du jour et le Tarot en ligne complètent l\'astrologie avec des symboles qui parlent à l\'inconscient.' },
]

const NOTICIAS_BY_LANG = {
  pt: NOTICIAS_BASE_PT,
  en: NOTICIAS_BASE_EN,
  es: NOTICIAS_BASE_ES,
  it: NOTICIAS_BASE_IT,
  de: NOTICIAS_BASE_DE,
  fr: NOTICIAS_BASE_FR,
}

const TRANSITO_FALLBACK = {
  pt: 'Os trânsitos de hoje pedem presença consciente - consulta o teu mapa para ver como te afectam.',
  en: "Today's transits ask for conscious presence - check your chart to see how they affect you.",
  es: 'Los tránsitos de hoy piden presencia consciente: consulta tu carta para ver cómo te afectan.',
  it: 'I transiti di oggi chiedono presenza consapevole: consulta la tua carta per vedere come ti influenzano.',
  de: 'Die heutigen Transite verlangen bewusste Präsenz - prüfe dein Horoskop, um zu sehen, wie sie dich beeinflussen.',
  fr: "Les transits du jour demandent une présence consciente - consulte ta carte pour voir comment ils t'affectent.",
}

function transitoDestaque(aspetos, lang) {
  if (!aspetos?.length) return null
  const a = aspetos[0]
  const pA = translatePlaneta(a.planetaA, lang)
  const pB = translatePlaneta(a.planetaB, lang)
  const asp = translateAspecto(a.aspecto, lang)
  if (isPt(lang)) {
    return `Trânsito activo: ${pA} ${asp} ${pB} (orbe ${a.orbe}) - energia em movimento no céu neste momento.`
  }
  if (lang === 'es') {
    return `Tránsito activo: ${pA} ${asp} ${pB} (orbe ${a.orbe}) - energía en movimiento en el cielo ahora mismo.`
  }
  if (lang === 'it') {
    return `Transito attivo: ${pA} ${asp} ${pB} (orbe ${a.orbe}) - energia in movimento nel cielo in questo momento.`
  }
  if (lang === 'de') {
    return `Aktiver Transit: ${pA} ${asp} ${pB} (Orbis ${a.orbe}) - Energie in Bewegung am Himmel jetzt.`
  }
  if (lang === 'fr') {
    return `Transit actif : ${pA} ${asp} ${pB} (orbe ${a.orbe}) - énergie en mouvement dans le ciel en ce moment.`
  }
  return `Active transit: ${pA} ${asp} ${pB} (orb ${a.orbe}) - energy in motion in the sky right now.`
}

/** @returns {{ tag: string, texto: string, hora: string }[]} */
export function gerarNoticiasAstrologia({ aspetos = [], lang = 'pt', max = 4 } = {}) {
  const agora = new Date()
  const fase = calcularFaseLua(agora, lang)
  const hora = agora.toLocaleTimeString(localeTag(lang), { hour: '2-digit', minute: '2-digit' })
  const transito = transitoDestaque(aspetos, lang)
  const ctx = { fase, transito, aspetos }

  const base = NOTICIAS_BY_LANG[lang] || NOTICIAS_BASE_EN

  return base.slice(0, max).map((item, i) => ({
    tag: item.tag,
    texto: item.gerar(ctx) || TRANSITO_FALLBACK[lang] || TRANSITO_FALLBACK.en,
    hora: i === 0 ? hora : null,
  }))
}
