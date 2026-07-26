import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { createApiKey } from './_shared/apiAuth.mjs'
import { jsonResponse, optionsResponse } from './_shared/apiCors.mjs'

export default async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse()
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405)
  }

  try {
    const { email, name, useCase, honeypot, plan = 'free' } = await req.json()
    if (honeypot) {
      return jsonResponse({ ok: true })
    }

    const addr = String(email || '').trim().toLowerCase()
    if (!addr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      return jsonResponse({ error: 'email_invalid', message: 'Email inválido.' }, 400)
    }

    const db = getFirestore()
    if (!db) {
      return jsonResponse({ error: 'service_unavailable' }, 503)
    }

    const existing = await db.collection('api_keys').where('email', '==', addr).where('active', '==', true).limit(1).get()
    if (!existing.empty) {
      return jsonResponse({
        ok: true,
        already: true,
        message: 'Já existe uma API key activa para este email. Verifica a caixa de entrada ou contacta suporte@sidusastro.com.',
      })
    }

    const { key, plan: issuedPlan } = await createApiKey({
      email: addr,
      name: String(name || '').trim(),
      plan: plan === 'starter' ? 'starter' : 'free',
      source: 'developers_signup',
    })

    await db.collection('api_signups').add({
      email: addr,
      name: String(name || '').trim(),
      useCase: String(useCase || '').trim().slice(0, 500),
      plan: issuedPlan,
      createdAt: FieldValue.serverTimestamp(),
    })

    return jsonResponse({
      ok: true,
      apiKey: key,
      plan: issuedPlan,
      limits: { daily: issuedPlan === 'starter' ? 500 : 100 },
      message: 'API key criada. Guarda-a em segurança — não voltará a ser mostrada.',
    })
  } catch (e) {
    console.error('[api-developers-signup]', e?.message)
    return jsonResponse({ error: 'internal_error' }, 500)
  }
}

export const config = { path: '/api/developers/signup' }
