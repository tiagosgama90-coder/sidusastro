import { env } from './_shared/env.mjs'
import { verifyIdToken } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SITE_ORIGIN = () => env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'

async function sendViaFirebaseOob(idToken, continueUrl, apiKey) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'VERIFY_EMAIL',
        idToken,
        continueUrl,
      }),
    },
  )
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data?.error?.message || 'Falha ao enviar e-mail de verificação' }
  }
  return { ok: true, email: data.email }
}

/** Verificação de e-mail - apenas Firebase (sem Resend). */
export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return new Response(JSON.stringify({ error: 'idToken em falta' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const decoded = await verifyIdToken(idToken)
    const email = decoded?.email
    if (!email) {
      return new Response(JSON.stringify({ error: 'Sessão inválida ou expirada' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const continueUrl = `${SITE_ORIGIN().replace(/\/$/, '')}/login?emailVerified=1`

    const apiKey = env('FIREBASE_WEB_API_KEY') || env('VITE_FIREBASE_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Firebase API key não configurada no servidor' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const oob = await sendViaFirebaseOob(idToken, continueUrl, apiKey)
    if (!oob.ok) {
      console.error('[send-verification-email]', oob.error)
      return new Response(JSON.stringify({ error: oob.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, email: oob.email || email, via: 'firebase' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[send-verification-email]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/send-verification-email' }
