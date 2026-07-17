import { FieldValue, getFirestore, verifyIdToken, activarPremium } from './_shared/firebase-admin.mjs'
import { ADMIN_EMAILS } from '../../src/lib/adminEmails.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

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
      const snap = await db.collection('vip_promo_requests')
        .where('status', '==', 'pending')
        .limit(40)
        .get()

      const pending = snap.docs
        .map((d) => {
          const data = d.data()
          return {
            id: d.id,
            uid: data.uid,
            email: data.email,
            name: data.name,
            platform: data.platform,
            handle: data.handle,
            followers: data.followers ?? null,
            postUrl: data.postUrl,
            message: data.message,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
            _sort: data.createdAt?.toDate?.()?.getTime?.() || 0,
          }
        })
        .sort((a, b) => b._sort - a._sort)
        .map(({ _sort, ...rest }) => rest)

      return new Response(JSON.stringify({ pending }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      const { action, requestId } = await req.json()
      if (!requestId || !['approve', 'reject'].includes(action)) {
        return new Response(JSON.stringify({ error: 'invalid_action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const ref = db.collection('vip_promo_requests').doc(requestId)
      const snap = await ref.get()
      if (!snap.exists) {
        return new Response(JSON.stringify({ error: 'not_found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const data = snap.data()
      if (data.status !== 'pending') {
        return new Response(JSON.stringify({ error: 'already_reviewed' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (action === 'reject') {
        await ref.set({
          status: 'rejected',
          reviewedAt: FieldValue.serverTimestamp(),
          reviewedBy: admin.email,
        }, { merge: true })
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const activado = await activarPremium(data.uid, { premiumSource: 'promo' })
      if (!activado) {
        return new Response(JSON.stringify({ error: 'activation_failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      await ref.set({
        status: 'approved',
        reviewedAt: FieldValue.serverTimestamp(),
        reviewedBy: admin.email,
        premiumGrantedAt: FieldValue.serverTimestamp(),
      }, { merge: true })

      return new Response(JSON.stringify({ ok: true, activated: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: corsHeaders })
  } catch (e) {
    console.error('[vip-promo-admin]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/vip-promo-admin' }
