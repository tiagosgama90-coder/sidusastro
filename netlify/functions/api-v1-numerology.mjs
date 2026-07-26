import { calcularMapaNumerologia } from '../../src/lib/numerologia.js'
import { validateApiKey, recordApiUsage } from './_shared/apiAuth.mjs'
import { jsonResponse, optionsResponse } from './_shared/apiCors.mjs'

const LANGS = new Set(['pt', 'en', 'es', 'it', 'de', 'fr'])

export default async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405)
  }

  const auth = await validateApiKey(req)
  if (!auth.ok) {
    return jsonResponse({ error: auth.error, message: auth.message }, auth.status)
  }

  try {
    const body = await req.json()
    const name = String(body.name || body.nome || '').trim()
    const birthDate = String(body.birthDate || body.dataNascimento || '').trim()
    const lang = LANGS.has(body.lang) ? body.lang : 'pt'

    if (!name || name.length < 2) {
      return jsonResponse({ error: 'invalid_name', message: 'Nome obrigatório (mín. 2 caracteres).' }, 400)
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return jsonResponse({ error: 'invalid_birth_date', message: 'Data de nascimento em formato YYYY-MM-DD.' }, 400)
    }

    const result = calcularMapaNumerologia(name, birthDate, lang, body.mapaNatal || null)
    await recordApiUsage(auth, 'v1/numerology')

    return jsonResponse({
      ok: true,
      lang,
      name,
      birthDate,
      numerology: result,
      meta: { plan: auth.plan, requestsToday: (auth.usedToday || 0) + 1, limit: auth.limits.dailyLimit },
    })
  } catch (e) {
    console.error('[api-v1-numerology]', e?.message)
    return jsonResponse({ error: 'internal_error' }, 500)
  }
}

export const config = { path: '/api/v1/numerology' }
