import { getFirestore, verifyIdToken } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

async function requireUser(req) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null
  const user = await verifyIdToken(token)
  if (!user?.uid) return null
  return user
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: corsHeaders })
  }

  const user = await requireUser(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
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

  try {
    const snap = await db.collection('vip_promo_requests')
      .where('uid', '==', user.uid)
      .limit(10)
      .get()

    if (snap.empty) {
      return new Response(JSON.stringify({ status: 'none' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const docs = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const ta = a.createdAt?.toDate?.()?.getTime?.() || 0
        const tb = b.createdAt?.toDate?.()?.getTime?.() || 0
        return tb - ta
      })
    const data = docs[0]
    return new Response(JSON.stringify({
      status: data.status || 'pending',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
      reviewedAt: data.reviewedAt?.toDate?.()?.toISOString?.() || null,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[vip-promo-status]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/vip-promo-status' }
