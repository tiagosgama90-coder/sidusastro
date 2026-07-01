import { env } from './_shared/env.mjs'
import { verifyIdToken, getAdminAuth } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SITE_ORIGIN = () => env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'

const COPY = {
  pt: {
    subject: 'Confirma o teu e-mail — Sidusastro',
    heading: 'Confirma o teu e-mail',
    body: 'Clica no botão abaixo para activar a tua conta Sidusastro. Se não criaste esta conta, ignora este e-mail.',
    cta: 'Confirmar e-mail',
  },
  en: {
    subject: 'Confirm your email — Sidusastro',
    heading: 'Confirm your email',
    body: 'Click the button below to activate your Sidusastro account. If you did not create this account, ignore this email.',
    cta: 'Confirm email',
  },
  es: {
    subject: 'Confirma tu e-mail — Sidusastro',
    heading: 'Confirma tu e-mail',
    body: 'Haz clic en el botón para activar tu cuenta Sidusastro. Si no creaste esta cuenta, ignora este e-mail.',
    cta: 'Confirmar e-mail',
  },
  it: {
    subject: 'Conferma la tua e-mail — Sidusastro',
    heading: 'Conferma la tua e-mail',
    body: 'Clicca il pulsante per attivare il tuo account Sidusastro. Se non hai creato questo account, ignora questa e-mail.',
    cta: 'Conferma e-mail',
  },
  de: {
    subject: 'Bestätige deine E-Mail — Sidusastro',
    heading: 'Bestätige deine E-Mail',
    body: 'Klicke auf die Schaltfläche, um dein Sidusastro-Konto zu aktivieren. Wenn du kein Konto erstellt hast, ignoriere diese E-Mail.',
    cta: 'E-Mail bestätigen',
  },
  fr: {
    subject: 'Confirme ton e-mail — Sidusastro',
    heading: 'Confirme ton e-mail',
    body: 'Clique sur le bouton pour activer ton compte Sidusastro. Si tu n\'as pas créé ce compte, ignore cet e-mail.',
    cta: 'Confirmer l\'e-mail',
  },
}

function htmlEmail(copy, link) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#0B071E;color:#fff;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#1a0d3a;border:1px solid #DFB76C;border-radius:12px;padding:28px">
    <h1 style="color:#DFB76C;font-size:22px;margin:0 0 16px">${copy.heading}</h1>
    <p style="color:rgba(255,255,255,0.85);line-height:1.6;font-size:15px">${copy.body}</p>
    <p style="margin:24px 0"><a href="${link}" style="display:inline-block;background:#DFB76C;color:#0B071E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">${copy.cta}</a></p>
    <p style="font-size:12px;color:rgba(255,255,255,0.45)">Sidusastro · sidusastro.com</p>
  </div></body></html>`
}

async function sendViaResend(email, link, lang) {
  const resendKey = env('RESEND_API_KEY')
  const from = env('WELCOME_EMAIL_FROM') || 'Sidusastro <noreply@sidusastro.com>'
  if (!resendKey) return { ok: false, reason: 'no-resend' }

  const L = COPY[lang] || COPY.pt
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: L.subject,
      html: htmlEmail(L, link),
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error('[send-verification-email] Resend:', data)
    return { ok: false, reason: data?.message || 'resend-failed' }
  }
  return { ok: true, id: data.id }
}

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

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { idToken, lang = 'pt' } = await req.json()
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

    const continueUrl = `${SITE_ORIGIN().replace(/\/$/, '')}/home`
    const adminAuth = getAdminAuth()

    if (adminAuth && env('RESEND_API_KEY')) {
      try {
        const link = await adminAuth.generateEmailVerificationLink(email, {
          url: continueUrl,
          handleCodeInApp: true,
        })
        const sent = await sendViaResend(email, link, lang)
        if (sent.ok) {
          return new Response(JSON.stringify({ ok: true, email, via: 'resend' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        console.warn('[send-verification-email] Resend falhou, a tentar Firebase OOB:', sent.reason)
      } catch (e) {
        console.warn('[send-verification-email] Admin link falhou, a tentar Firebase OOB:', e?.message)
      }
    }

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
