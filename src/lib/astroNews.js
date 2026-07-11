/** Notícias astrológicas reais via RSS — cache diário. */

import { translatePlaneta, translateAspecto } from './i18n/astro.js'
import { localeTag, isPt } from './i18n/langUtil.js'
import { calcularFaseLua } from './faseLua.js'

function limparTextoNoticia(str) {
  if (!str) return ''
  return String(str)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizarItem(item) {
  return {
    ...item,
    texto: limparTextoNoticia(item.texto),
    resumo: limparTextoNoticia(item.resumo),
  }
}

const RSS_QUERIES = {
  pt: 'astrologia',
  en: 'astrology',
  es: 'astrología',
  it: 'astrologia',
  de: 'Astrologie',
  fr: 'astrologie',
}

const RSS_HL = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR',
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
    return `Trânsito activo: ${pA} ${asp} ${pB} - energia em movimento no céu neste momento.`
  }
  if (lang === 'es') {
    return `Tránsito activo: ${pA} ${asp} ${pB} - energía en movimiento en el cielo ahora mismo.`
  }
  if (lang === 'it') {
    return `Transito attivo: ${pA} ${asp} ${pB} - energia in movimento nel cielo in questo momento.`
  }
  if (lang === 'de') {
    return `Aktiver Transit: ${pA} ${asp} ${pB} - Energie in Bewegung am Himmel jetzt.`
  }
  if (lang === 'fr') {
    return `Transit actif : ${pA} ${asp} ${pB} - énergie en mouvement dans le ciel en ce moment.`
  }
  return `Active transit: ${pA} ${asp} ${pB} - energy in motion in the sky right now.`
}

function noticiasLocais({ aspetos, lang, max }) {
  const agora = new Date()
  const fase = calcularFaseLua(agora, lang)
  const hora = agora.toLocaleTimeString(localeTag(lang), { hour: '2-digit', minute: '2-digit' })
  const transito = transitoDestaque(aspetos, lang)
  const tag = { pt: 'Céu', en: 'Sky', es: 'Cielo', it: 'Cielo', de: 'Himmel', fr: 'Ciel' }[lang] || 'Sky'
  return [
    { tag, texto: transito || TRANSITO_FALLBACK[lang] || TRANSITO_FALLBACK.en, hora, imagem: null, url: null },
    { tag: { pt: 'Lua', en: 'Moon', es: 'Luna', it: 'Luna', de: 'Mond', fr: 'Lune' }[lang] || 'Moon', texto: `${fase.nome}: ${(fase.desc || '').slice(0, 140)}`, hora: null, imagem: null, url: null },
  ].slice(0, max)
}

let cacheNoticias = { date: null, lang: null, items: null }

/** @returns {Promise<{ tag: string, texto: string, hora: string|null, imagem: string|null, url: string|null }[]>} */
export async function gerarNoticiasAstrologia({ aspetos = [], lang = 'pt', max = 4, forceRefresh = false } = {}) {
  const hoje = new Date().toISOString().slice(0, 10)
  if (!forceRefresh && cacheNoticias.date === hoje && cacheNoticias.lang === lang && cacheNoticias.items?.length) {
    return cacheNoticias.items.slice(0, max)
  }

  try {
    const res = await fetch(`/.netlify/functions/astro-news?lang=${encodeURIComponent(lang)}&max=${max}`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.items) && data.items.length) {
        const limpos = data.items.map(sanitizarItem)
        cacheNoticias = { date: hoje, lang, items: limpos }
        return limpos.slice(0, max)
      }
    }
  } catch { /* fallback local */ }

  const local = noticiasLocais({ aspetos, lang, max })
  cacheNoticias = { date: hoje, lang, items: local }
  return local
}

/** Versão síncrona para compatibilidade (fallback imediato). */
export function gerarNoticiasAstrologiaSync({ aspetos = [], lang = 'pt', max = 4 } = {}) {
  return noticiasLocais({ aspetos, lang, max })
}
