import { FieldValue, getFirestore, verifyIdToken } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const PLATFORMS = new Set([
  'instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'linkedin', 'blog', 'outro',
])

function sanitizarTexto(val, max) {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, max)
}

function validarPayload(body) {
  const platform = sanitizarTexto(body?.platform, 32).toLowerCase()
  const handle = sanitizarTexto(body?.handle, 80)
  const postUrl = sanitizarTexto(body?.postUrl, 500)
  const message = sanitizarTexto(body?.message, 1200)
  const followersRaw = Number(body?.followers)

  if (!PLATFORMS.has(platform)) return { ok: false, error: 'platform_invalid' }
  if (handle.length < 2) return { ok: false, error: 'handle_invalid' }
  if (postUrl.length < 8 || !/^https?:\/\//i.test(postUrl)) return { ok: false, error: 'url_invalid' }
  if (message.length < 40) return { ok: false, error: 'message_too_short' }

  return {
    ok: true,
    platform,
    handle,
    postUrl,
    message,
    followers: Number.isFinite(followersRaw) && followersRaw >= 0
      ? Math.min(Math.floor(followersRaw), 50_000_000)
      : null,
  }
}

async function requireUser(req) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return null
  const user = await verifyIdToken(token)
  if (!user?.uid || !user?.email) return null
  return user
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
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
    const body = await req.json()
    const validated = validarPayload(body)
    if (!validated.ok) {
      return new Response(JSON.stringify({ error: validated.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userRef = db.collection('users').doc(user.uid)
    const userSnap = await userRef.get()
    const perfil = userSnap.data() || {}
    if (perfil.isPremium === true || perfil.mapaCompleto === true) {
      return new Response(JSON.stringify({ error: 'already_premium' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const pendingSnap = await db.collection('vip_promo_requests')
      .where('uid', '==', user.uid)
      .limit(10)
      .get()
    const hasPending = pendingSnap.docs.some((d) => d.data().status === 'pending')
    if (hasPending) {
      return new Response(JSON.stringify({ error: 'already_pending' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const since90d = Date.now() - 90 * 24 * 60 * 60 * 1000
    const recentCount = pendingSnap.docs.filter((d) => {
      const created = d.data().createdAt?.toDate?.()?.getTime?.() || 0
      return created > since90d
    }).length
    if (recentCount >= 2) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await db.collection('vip_promo_requests').add({
      uid: user.uid,
      email: user.email.trim().toLowerCase(),
      name: sanitizarTexto(body?.name, 80) || perfil.dados?.nome || user.email.split('@')[0],
      platform: validated.platform,
      handle: validated.handle,
      followers: validated.followers,
      postUrl: validated.postUrl,
      message: validated.message,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    })

    return new Response(JSON.stringify({ ok: true, pending: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[vip-promo-submit]', e?.message)
    return new Response(JSON.stringify({ error: 'internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/vip-promo-submit' }
