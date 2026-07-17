import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { hashValue } from './_shared/reviewModeration.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { email, honeypot, source = 'landing' } = await req.json()
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const addr = String(email || '').trim().toLowerCase()
    if (!addr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      return new Response(JSON.stringify({ error: 'email_invalid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const db = getFirestore()
    if (!db) {
      return new Response(JSON.stringify({ error: 'service_unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const emailHash = hashValue(addr)
    const ref = db.collection('newsletter_subscribers').doc(emailHash)
    const existing = await ref.get()
    if (existing.exists && existing.data()?.active !== false) {
      return new Response(JSON.stringify({ ok: true, already: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await ref.set({
      email: addr,
      emailHash,
      source,
      active: true,
      subscribedAt: FieldValue.serverTimestamp(),
      lastEmailAt: null,
    }, { merge: true })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[newsletter-subscribe]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/newsletter-subscribe' }
