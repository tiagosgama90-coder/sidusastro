import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { verifyIdToken } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const ADMIN_EMAILS = [
  'tiagosgama90@gmail.com',
  'helenaccprieto@gmail.com',
]

async function requireAdmin(req) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null
  const user = await verifyIdToken(token)
  if (!user?.email) return null
  const email = user.email.trim().toLowerCase()
  if (!ADMIN_EMAILS.includes(email)) return null
  return user
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const admin = await requireAdmin(req)
  if (!admin) {
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
    if (req.method === 'GET') {
      const snap = await db.collection('reviews')
        .where('status', '==', 'pending')
        .orderBy('createdAt', 'desc')
        .limit(30)
        .get()

      const pending = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          name: data.name,
          text: data.text,
          rating: data.rating || 5,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
        }
      })

      return new Response(JSON.stringify({ pending }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      const { action, reviewId } = await req.json()
      if (!reviewId || !['approve', 'delete'].includes(action)) {
        return new Response(JSON.stringify({ error: 'invalid_action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const ref = db.collection('reviews').doc(reviewId)
      if (action === 'delete') {
        await ref.delete()
      } else {
        await ref.set({
          status: 'approved',
          approvedAt: FieldValue.serverTimestamp(),
          approvedBy: admin.email,
        }, { merge: true })
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  } catch (e) {
    console.error('[reviews-admin]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/reviews-admin' }
