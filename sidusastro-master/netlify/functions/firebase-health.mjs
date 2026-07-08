import { firebaseAdminStatus } from './_shared/firebase-admin.mjs'
import { env } from './_shared/env.mjs'

async function probeWebApiKey(apiKey) {
  if (!apiKey) return { ok: false, reason: 'missing' }
  const clean = String(apiKey).trim().replace(/^["']+|["']+$/g, '').replace(/,$/, '')
  if (clean !== String(apiKey).trim()) {
    return { ok: false, reason: 'quoted_or_trailing_comma', hint: 'Remove quotes/commas from API key in Netlify' }
  }
  try {
    const email = `health-${Date.now()}@example.com`
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${clean}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://sidusastro.com/login',
      },
      body: JSON.stringify({ email, password: 'healthcheck1', returnSecureToken: true }),
    })
    const data = await res.json().catch(() => ({}))
    const msg = data?.error?.message || ''
    if (res.ok || msg === 'EMAIL_EXISTS') return { ok: true, reason: 'valid' }
    if (/API_KEY_INVALID|INVALID_API_KEY/i.test(msg)) return { ok: false, reason: 'invalid_api_key' }
    return { ok: true, reason: msg || 'unknown_response' }
  } catch (e) {
    return { ok: false, reason: e?.message || 'probe_failed' }
  }
}

/** Diagnóstico rápido: GET /api/firebase-health (sem expor segredos). */
export default async () => {
  const status = firebaseAdminStatus()
  const webProject = env('VITE_FIREBASE_PROJECT_ID') || null
  const webApiKey = env('FIREBASE_WEB_API_KEY') || env('VITE_FIREBASE_API_KEY') || ''
  const keyProbe = await probeWebApiKey(webApiKey)
  const body = {
    firebaseAdmin: status.ok ? 'ok' : status.reason,
    projectId: status.projectId || null,
    webProjectId: webProject,
    projectMatch: status.projectId && webProject ? status.projectId === webProject : null,
    hasServiceAccountVar: !!env('FIREBASE_SERVICE_ACCOUNT'),
    hasWebApiKey: !!webApiKey,
    webApiKeyValid: keyProbe.ok,
    webApiKeyIssue: keyProbe.ok ? null : keyProbe.reason,
    hint: keyProbe.hint || status.hint || null,
    detail: status.detail || null,
  }
  return new Response(JSON.stringify(body), {
    status: status.ok ? 200 : 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/firebase-health' }
