import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { hashValue, validateReviewPayload } from './_shared/reviewModeration.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function clientIp(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('client-ip')
    || 'unknown'
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const validated = validateReviewPayload(body)
    if (!validated.ok) {
      return new Response(JSON.stringify({ error: validated.error }), {
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

    const emailHash = hashValue(validated.addr)
    const ipHash = hashValue(clientIp(req))
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const byEmail = await db.collection('reviews')
      .where('emailHash', '==', emailHash)
      .where('createdAt', '>', since30d)
      .limit(1)
      .get()
    if (!byEmail.empty) {
      return new Response(JSON.stringify({ error: 'already_submitted' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const byIp = await db.collection('reviews')
      .where('ipHash', '==', ipHash)
      .where('createdAt', '>', since24h)
      .get()
    if (byIp.size >= 3) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await db.collection('reviews').add({
      name: validated.nome,
      text: validated.corpo,
      emailHash,
      ipHash,
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    })

    return new Response(JSON.stringify({ ok: true, pending: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[reviews-submit]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/reviews-submit' }
