import { FieldValue, getFirestore } from './_shared/firebase-admin.mjs'
import { verifyIdToken } from './_shared/firebase-admin.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { idToken } = await req.json()
    const user = await verifyIdToken(idToken)
    if (!user?.uid) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const db = getFirestore()
    if (!db) {
      return new Response(JSON.stringify({ error: 'Serviço indisponível' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userRef = db.collection('users').doc(user.uid)
    const snap = await userRef.get()
    if (!snap.exists) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: 'no_profile' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = snap.data()
    const referrerUid = data.referredByUid
    if (!referrerUid || data.referralRewardClaimed === true) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (referrerUid === user.uid) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: 'self' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const referrerRef = db.collection('users').doc(referrerUid)
    let rewarded = false

    await db.runTransaction(async (tx) => {
      const fresh = await tx.get(userRef)
      if (!fresh.exists || fresh.data()?.referralRewardClaimed === true) return

      const referrerSnap = await tx.get(referrerRef)
      if (!referrerSnap.exists) {
        tx.set(userRef, { referralRewardClaimed: true, referralRewardSkipped: 'referrer_missing' }, { merge: true })
        return
      }

      tx.update(referrerRef, { tarotBonusLeituras: FieldValue.increment(1) })
      tx.set(userRef, {
        referralRewardClaimed: true,
        referralRewardAt: FieldValue.serverTimestamp(),
      }, { merge: true })
      rewarded = true
    })

    return new Response(JSON.stringify({ ok: true, rewarded }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[referral-reward]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/referral-reward' }
