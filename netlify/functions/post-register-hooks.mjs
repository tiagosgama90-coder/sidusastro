import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { env } from './_shared/env.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SITE_ORIGIN = () => env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { email, lang = 'pt', uid } = await req.json()
    const addr = String(email || '').trim().toLowerCase()
    if (!addr) {
      return new Response(JSON.stringify({ error: 'email em falta' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const db = getFirestore()
    if (db && uid) {
      await db.collection('users').doc(uid).set({
        accountCreatedAt: FieldValue.serverTimestamp(),
        welcomeEmailSent: true,
        day3EmailSent: false,
        email: addr,
      }, { merge: true })
    }

    const resendKey = env('RESEND_API_KEY')
    const from = env('WELCOME_EMAIL_FROM') || 'Sidusastro <noreply@sidusastro.com>'
    const origin = SITE_ORIGIN().replace(/\/$/, '')

    if (!resendKey) {
      console.info('[post-register-hooks] RESEND_API_KEY não configurada')
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const subject = 'O teu mapa está quase pronto - Sidusastro'
    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#0B071E;color:#fff;padding:24px">
    <div style="max-width:520px;margin:0 auto;background:#1a0d3a;border:1px solid #DFB76C;border-radius:12px;padding:28px">
      <h1 style="color:#DFB76C;font-size:22px;margin:0 0 16px">Bem-vindo/a ao Sidusastro</h1>
      <p style="color:rgba(255,255,255,0.85);line-height:1.6;font-size:15px">A tua conta foi criada. Confirma o e-mail de verificação e completa o teu mapa astral - Sol, Lua, Ascendente e relatório PDF personalizado.</p>
      <p style="margin:24px 0"><a href="${origin}/comecar" style="display:inline-block;background:#DFB76C;color:#0B071E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Ver o meu mapa</a></p>
      <p style="font-size:12px;color:rgba(255,255,255,0.45)">Sidusastro · sidusastro.com</p>
    </div></body></html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [addr], subject, html }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[post-register-hooks]', data)
      return new Response(JSON.stringify({ error: data?.message || 'Falha ao enviar' }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[post-register-hooks]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/post-register-hooks' }
