import { getFirestore } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const db = getFirestore()
    if (!db) {
      return new Response(JSON.stringify({ reviews: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const snap = await db.collection('reviews')
      .where('status', '==', 'approved')
      .orderBy('approvedAt', 'desc')
      .limit(12)
      .get()

    const reviews = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name || 'Anónimo',
        text: data.text || '',
        rating: data.rating || 5,
        createdAt: data.approvedAt?.toDate?.()?.toISOString?.() || data.createdAt?.toDate?.()?.toISOString?.() || null,
      }
    })

    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[reviews-list]', e?.message)
    return new Response(JSON.stringify({ reviews: [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/reviews-list' }
