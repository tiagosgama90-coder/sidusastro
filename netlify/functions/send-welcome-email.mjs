import { env } from './_shared/env.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SITE_ORIGIN = () => env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'

const COPY = {
  pt: {
    subject: 'O teu mapa está pronto - Sidusastro',
    heading: 'Bem-vindo/a ao Sidusastro',
    body: 'A tua conta foi criada. Confirma o e-mail que enviámos em separado e completa o teu mapa astral - Sol, Lua, Ascendente e relatório PDF personalizado.',
    cta: 'Ver o meu mapa',
  },
  en: {
    subject: 'Your chart is ready - Sidusastro',
    heading: 'Welcome to Sidusastro',
    body: 'Your account was created. Confirm the separate verification email and complete your birth chart - Sun, Moon, Ascendant and personalised PDF report.',
    cta: 'View my chart',
  },
  es: {
    subject: 'Tu carta está lista - Sidusastro',
    heading: 'Bienvenido/a a Sidusastro',
    body: 'Tu cuenta fue creada. Confirma el e-mail de verificación y completa tu carta natal - Sol, Luna, Ascendente e informe PDF personalizado.',
    cta: 'Ver mi carta',
  },
  it: {
    subject: 'Il tuo tema è pronto - Sidusastro',
    heading: 'Benvenuto/a su Sidusastro',
    body: 'Il tuo account è stato creato. Conferma l\'e-mail di verifica e completa il tema natale - Sole, Luna, Ascendente e report PDF.',
    cta: 'Vedi il mio tema',
  },
  de: {
    subject: 'Dein Horoskop ist bereit - Sidusastro',
    heading: 'Willkommen bei Sidusastro',
    body: 'Dein Konto wurde erstellt. Bestätige die Verifizierungs-E-Mail und vervollständige dein Geburtshoroskop - Sonne, Mond, Aszendent und PDF-Bericht.',
    cta: 'Mein Horoskop ansehen',
  },
  fr: {
    subject: 'Ton thème est prêt - Sidusastro',
    heading: 'Bienvenue sur Sidusastro',
    body: 'Ton compte a été créé. Confirme l\'e-mail de vérification et complète ton thème natal - Soleil, Lune, Ascendant et rapport PDF.',
    cta: 'Voir mon thème',
  },
}

function htmlEmail(copy, url) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#0B071E;color:#fff;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#1a0d3a;border:1px solid #DFB76C;border-radius:12px;padding:28px">
    <h1 style="color:#DFB76C;font-size:22px;margin:0 0 16px">${copy.heading}</h1>
    <p style="color:rgba(255,255,255,0.85);line-height:1.6;font-size:15px">${copy.body}</p>
    <p style="margin:24px 0"><a href="${url}/comecar" style="display:inline-block;background:#DFB76C;color:#0B071E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">${copy.cta}</a></p>
    <p style="font-size:12px;color:rgba(255,255,255,0.45)">Sidusastro · sidusastro.com</p>
  </div></body></html>`
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { email, lang = 'pt' } = await req.json()
    if (!email?.trim()) {
      return new Response(JSON.stringify({ error: 'email em falta' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resendKey = env('RESEND_API_KEY')
    const from = env('WELCOME_EMAIL_FROM') || 'Sidusastro <noreply@sidusastro.com>'
    const L = COPY[lang] || COPY.pt
    const origin = SITE_ORIGIN().replace(/\/$/, '')

    if (!resendKey) {
      console.info('[send-welcome-email] RESEND_API_KEY não configurada - e-mail ignorado')
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email.trim()],
        subject: L.subject,
        html: htmlEmail(L, origin),
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[send-welcome-email]', data)
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
    console.error('[send-welcome-email]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/send-welcome-email' }
