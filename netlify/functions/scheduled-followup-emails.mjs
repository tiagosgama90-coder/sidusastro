import { getFirestore } from './_shared/firebase-admin.mjs'
import { env } from './_shared/env.mjs'

const SITE_ORIGIN = () => env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'

async function sendResendEmail({ to, subject, html }) {
  const resendKey = env('RESEND_API_KEY')
  const from = env('WELCOME_EMAIL_FROM') || 'Sidusastro <noreply@sidusastro.com>'
  if (!resendKey) return { ok: false, skipped: true }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

function day3Html(origin) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#0B071E;color:#fff;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#1a0d3a;border:1px solid #DFB76C;border-radius:12px;padding:28px">
    <h1 style="color:#DFB76C;font-size:22px;margin:0 0 16px">✦ Viste o teu mapa?</h1>
    <p style="color:rgba(255,255,255,0.85);line-height:1.6;font-size:15px">Há três dias cruzaste o portal Sidus. O teu Sol, Lua e Ascendente já estão no céu — mas a sinastria revela como a tua energia se cruza com outra pessoa. Descobre compatibilidade, química e missão de relação.</p>
    <p style="margin:24px 0"><a href="${origin}/sinastria" style="display:inline-block;background:#DFB76C;color:#0B071E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Explorar sinastria</a></p>
    <p style="font-size:12px;color:rgba(255,255,255,0.45)">Sidusastro · sidusastro.com</p>
  </div></body></html>`
}

function weeklyHtml(origin) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#0B071E;color:#fff;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#1a0d3a;border:1px solid #DFB76C;border-radius:12px;padding:28px">
    <h1 style="color:#DFB76C;font-size:22px;margin:0 0 16px">✦ Horóscopo da semana</h1>
    <p style="color:rgba(255,255,255,0.85);line-height:1.6;font-size:15px">O céu move-se — e o teu mapa natal traduz cada trânsito em linguagem pessoal. Entra no Sidus para ver a energia do dia, trânsitos activos e o horóscopo personalizado ao teu signo solar.</p>
    <p style="margin:24px 0"><a href="${origin}/login" style="display:inline-block;background:#DFB76C;color:#0B071E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Abrir o meu cosmos</a></p>
    <p style="font-size:11px;color:rgba(255,255,255,0.35)">Recebeste este e-mail porque subscreveste a newsletter Sidus. Para deixar de receber, responde com «cancelar».</p>
  </div></body></html>`
}

/** E-mails de seguimento: dia 3 pós-registo + newsletter semanal (segundas). */
export default async () => {
  const db = getFirestore()
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: 'no_firestore' }), { status: 500 })
  }

  const origin = SITE_ORIGIN().replace(/\/$/, '')
  const now = new Date()
  const isMonday = now.getUTCDay() === 1
  let day3Sent = 0
  let weeklySent = 0

  try {
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)

    const usersSnap = await db.collection('users')
      .where('day3EmailSent', '==', false)
      .limit(50)
      .get()

    for (const docSnap of usersSnap.docs) {
      const data = docSnap.data()
      const email = data.email?.trim()
      const created = data.accountCreatedAt?.toDate?.()
      if (!email || !created) continue
      if (created > threeDaysAgo || created < fourDaysAgo) continue

      const result = await sendResendEmail({
        to: email,
        subject: 'Viste o teu mapa? Descobre a sinastria — Sidusastro',
        html: day3Html(origin),
      })
      if (result.ok || result.skipped) {
        await docSnap.ref.set({ day3EmailSent: true }, { merge: true })
        day3Sent += 1
      }
    }

    if (isMonday) {
      const subsSnap = await db.collection('newsletter_subscribers')
        .where('active', '==', true)
        .limit(100)
        .get()

      for (const docSnap of subsSnap.docs) {
        const data = docSnap.data()
        const email = data.email?.trim()
        if (!email) continue
        const last = data.lastEmailAt?.toDate?.()
        if (last && (now - last) < 6 * 24 * 60 * 60 * 1000) continue

        const result = await sendResendEmail({
          to: email,
          subject: '✦ Horóscopo da semana — Sidusastro',
          html: weeklyHtml(origin),
        })
        if (result.ok || result.skipped) {
          await docSnap.ref.set({ lastEmailAt: new Date() }, { merge: true })
          weeklySent += 1
        }
      }
    }

    console.log('[scheduled-followup-emails]', { day3Sent, weeklySent, isMonday })
    return new Response(JSON.stringify({ ok: true, day3Sent, weeklySent }), { status: 200 })
  } catch (e) {
    console.error('[scheduled-followup-emails]', e?.message)
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 })
  }
}

export const config = {
  schedule: '0 9 * * *',
}
