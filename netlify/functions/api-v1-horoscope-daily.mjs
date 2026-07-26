import { ensureDailyContent } from './_shared/dailyContentStore.mjs'
import { validateApiKey, recordApiUsage } from './_shared/apiAuth.mjs'
import { jsonResponse, optionsResponse } from './_shared/apiCors.mjs'

const SIGN_MAP = {
  aries: { pt: 'Carneiro', en: 'Aries' },
  taurus: { pt: 'Touro', en: 'Taurus' },
  gemini: { pt: 'Gémeos', en: 'Gemini' },
  cancer: { pt: 'Caranguejo', en: 'Cancer' },
  leo: { pt: 'Leão', en: 'Leo' },
  virgo: { pt: 'Virgem', en: 'Virgo' },
  libra: { pt: 'Balança', en: 'Libra' },
  scorpio: { pt: 'Escorpião', en: 'Scorpio' },
  sagittarius: { pt: 'Sagitário', en: 'Sagittarius' },
  capricorn: { pt: 'Capricórnio', en: 'Capricorn' },
  aquarius: { pt: 'Aquário', en: 'Aquarius' },
  pisces: { pt: 'Peixes', en: 'Pisces' },
  // aliases PT
  carneiro: { pt: 'Carneiro', en: 'Aries' },
  touro: { pt: 'Touro', en: 'Taurus' },
  gemeos: { pt: 'Gémeos', en: 'Gemini' },
  gémeos: { pt: 'Gémeos', en: 'Gemini' },
  caranguejo: { pt: 'Caranguejo', en: 'Cancer' },
  leao: { pt: 'Leão', en: 'Leo' },
  leão: { pt: 'Leão', en: 'Leo' },
  virgem: { pt: 'Virgem', en: 'Virgo' },
  balanca: { pt: 'Balança', en: 'Libra' },
  balança: { pt: 'Balança', en: 'Libra' },
  escorpiao: { pt: 'Escorpião', en: 'Scorpio' },
  escorpião: { pt: 'Escorpião', en: 'Scorpio' },
  sagitario: { pt: 'Sagitário', en: 'Sagittarius' },
  sagitário: { pt: 'Sagitário', en: 'Sagittarius' },
  capricornio: { pt: 'Capricórnio', en: 'Capricorn' },
  capricórnio: { pt: 'Capricórnio', en: 'Capricorn' },
  aquario: { pt: 'Aquário', en: 'Aquarius' },
  aquário: { pt: 'Aquário', en: 'Aquarius' },
  peixes: { pt: 'Peixes', en: 'Pisces' },
}

function resolveSign(raw) {
  const key = String(raw || '').trim().toLowerCase()
  return SIGN_MAP[key] || null
}

export default async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed' }, 405)
  }

  const auth = await validateApiKey(req)
  if (!auth.ok) {
    return jsonResponse({ error: auth.error, message: auth.message }, auth.status)
  }

  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)
    const lang = (url.searchParams.get('lang') || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt'
    const signRaw = url.searchParams.get('sign')

    const pack = await ensureDailyContent({
      date,
      fasePt: url.searchParams.get('fasePt') || 'Lua em ciclo activo',
      faseEn: url.searchParams.get('faseEn') || 'Moon in active cycle',
      transitSummary: (url.searchParams.get('transit') || '').slice(0, 500),
    })

    await recordApiUsage(auth, 'v1/horoscope/daily')

    if (signRaw) {
      const sign = resolveSign(signRaw)
      if (!sign) {
        return jsonResponse({ error: 'invalid_sign', message: 'Signo inválido. Usa aries, taurus, gemini…' }, 400)
      }
      const signName = sign[lang]
      const text = pack?.horoscopes?.[lang]?.[signName] || pack?.horoscopes?.pt?.[sign.pt] || null
      return jsonResponse({
        ok: true,
        date,
        lang,
        sign: signName,
        horoscope: text,
        social: pack?.social?.[lang] || pack?.social?.pt || null,
        meta: { plan: auth.plan, requestsToday: (auth.usedToday || 0) + 1, limit: auth.limits.dailyLimit },
      }, 200, { 'Cache-Control': 'public, max-age=300' })
    }

    return jsonResponse({
      ok: true,
      date,
      lang,
      horoscopes: pack?.horoscopes?.[lang] || pack?.horoscopes?.pt,
      social: pack?.social?.[lang] || pack?.social?.pt || null,
      meta: { plan: auth.plan, requestsToday: (auth.usedToday || 0) + 1, limit: auth.limits.dailyLimit },
    }, 200, { 'Cache-Control': 'public, max-age=300' })
  } catch (e) {
    console.error('[api-v1-horoscope-daily]', e?.message)
    return jsonResponse({ error: 'internal_error' }, 500)
  }
}

export const config = { path: '/api/v1/horoscope/daily' }
